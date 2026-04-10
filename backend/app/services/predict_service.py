import pandas as pd
import numpy as np
import xgboost as xgb
from datetime import timedelta, datetime
from app.db import get_connection


def preprocess_features(df):
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day_of_week"] = df["date"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    df["promo_type"] = pd.to_numeric(df["promo_type"], errors="coerce").fillna(0)
    df["discount_pct"] = pd.to_numeric(df["discount_pct"], errors="coerce").fillna(0)
    df["promo_intensity"] = df["discount_pct"] * (df["promo_type"] != 0).astype(int)
    df["promo_intensity"] = df["promo_intensity"].astype(float)

    for lag in [1, 7, 364]:
        df[f"lag_{lag}"] = df.groupby(["store_id", "product_id"])["units_sold"].shift(lag)

    df["rolling_mean_7"] = df.groupby(["store_id", "product_id"])["units_sold"].transform(
        lambda x: x.shift(1).rolling(7).mean()
    )
    df["rolling_std_7"] = df.groupby(["store_id", "product_id"])["units_sold"].transform(
        lambda x: x.shift(1).rolling(7).std()
    )

    num_cols = df.select_dtypes(include=["number"]).columns
    df[num_cols] = df[num_cols].fillna(0)

    cat_cols = ["store_id", "product_id", "promo_type", "event_type", "impact_level"]
    for col in cat_cols:
        if col in df.columns:
            df[col] = df[col].astype("category").cat.codes

    return df


def update_test_input(conn, store_id):
    cur = conn.cursor()

    # Always wipe and rebuild test_input for this store
    cur.execute("DELETE FROM test_input WHERE store_id = %s", (store_id,))

    cur.execute("SELECT MAX(date) FROM merged_features WHERE store_id = %s", (store_id,))
    last_date = cur.fetchone()[0]
    if last_date is None:
        raise ValueError(f"No data found for store_id={store_id}")

    cur.execute("SELECT DISTINCT product_id FROM merged_features WHERE store_id = %s", (store_id,))
    products = cur.fetchall()

    rows_to_insert = []
    for i in range(1, 8):
        forecast_date = last_date + timedelta(days=i)
        for (product_id,) in products:
            rows_to_insert.append((forecast_date, store_id, product_id))

    cur.executemany("""
        INSERT INTO test_input (date, store_id, product_id)
        VALUES (%s, %s, %s)
    """, rows_to_insert)

    conn.commit()
    print(f"[TEST INPUT] {len(rows_to_insert)} rows inserted for store_id={store_id}")


def run_prediction(conn, model, store_id, simulation_overrides=None):
    cur = conn.cursor()

    # Wipe old forecasts for this store before inserting fresh ones
    cur.execute("DELETE FROM demand_forecast WHERE store_id = %s", (store_id,))
    conn.commit()

    cur.execute("SELECT date, store_id, product_id FROM test_input WHERE store_id = %s ORDER BY date", (store_id,))
    test_rows = cur.fetchall()

    if not test_rows:
        raise ValueError(f"No test input rows found for store_id={store_id}. Check update_test_input.")

    feature_cols = [
        "store_id", "product_id", "year", "month", "day_of_week", "is_weekend",
        "sell_price", "inventory_on_hand", "promo_intensity", "impact_level",
        "lag_1", "lag_7", "lag_364", "rolling_mean_7", "rolling_std_7"
    ]

    results = []

    for date, store_id_val, product_id in test_rows:
        cur.execute("""
            SELECT * FROM merged_features
            WHERE store_id = %s AND product_id = %s
            ORDER BY date DESC LIMIT 365
        """, (store_id_val, product_id))

        rows = cur.fetchall()
        if not rows:
            print(f"[SKIP] No history for store={store_id_val}, product={product_id}")
            continue

        col_names = [desc[0] for desc in cur.description]
        history = pd.DataFrame(rows, columns=col_names)
        history["date"] = pd.to_datetime(history["date"])

        df = preprocess_features(history)

        missing = [c for c in feature_cols if c not in df.columns]
        if missing:
            raise ValueError(f"Missing columns after preprocessing for product={product_id}: {missing}")

        X = df.iloc[-1:][feature_cols].copy()

        bad_cols = [c for c in X.columns if X[c].dtype == object]
        if bad_cols:
            raise ValueError(
                f"Object dtype columns for product={product_id}: {bad_cols} "
                f"— values: { {c: X[c].values[0] for c in bad_cols} }"
            )

        if simulation_overrides:
            for key, val in simulation_overrides.items():
                if key in X.columns:
                    X[key] = val

        dmatrix = xgb.DMatrix(X, enable_categorical=True)
        pred_log = model.predict(dmatrix)[0]
        pred_units = float(np.expm1(pred_log))
        rec_inventory = pred_units * 1.2

        results.append((
            date, datetime.now(), store_id_val, product_id,
            pred_units, rec_inventory, 1
        ))

    if not results:
        raise ValueError(f"No predictions generated for store_id={store_id}. Check merged_features data.")

    cur.executemany("""
        INSERT INTO demand_forecast (
            date, predicted_time, store_id, product_id,
            predicted_units_sold, recommended_inventory_level, model_id
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, results)

    conn.commit()
    print(f"[DONE] {len(results)} predictions stored for store_id={store_id}")