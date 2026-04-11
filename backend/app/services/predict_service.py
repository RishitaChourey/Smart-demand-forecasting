import pandas as pd
import numpy as np
import xgboost as xgb
from datetime import timedelta, datetime
from app.db import get_connection
import shap

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


def apply_weather_rules(overrides):
    """Enforce contradiction guards and clamp ranges before passing to model."""
    cond = overrides.get("weather_condition", "")
    rain = overrides.get("rainfall_mm")
    temp = overrides.get("avg_temp")

    if cond == "Stormy":
        if rain is not None and rain < 80:
            overrides["rainfall_mm"] = 80
        if temp is not None and temp > 15:
            overrides["avg_temp"] = 15

    if cond == "Sunny":
        if rain is not None and rain > 20:
            overrides["rainfall_mm"] = 20

    # Clamp ranges
    if rain is not None:
        overrides["rainfall_mm"] = max(0, min(200, overrides["rainfall_mm"]))
    if temp is not None:
        overrides["avg_temp"] = max(-5, min(50, overrides["avg_temp"]))
    if "humidity" in overrides:
        overrides["humidity"] = max(0, min(100, overrides["humidity"]))

    return overrides


def apply_promo_rules(overrides):
    """Enforce promo discount rules."""
    discount = overrides.get("discount_pct", 0)

    # discount_pct comes in as a fraction (e.g. 0.35 = 35%)
    if discount < 0.20:
        # Below 20% — no uplift, strip promo keys entirely
        overrides.pop("promo_type", None)
        overrides.pop("discount_pct", None)
    else:
        # Cap at 50%
        overrides["discount_pct"] = min(discount, 0.50)

    return overrides


def apply_signal_multiplier(pred_units, overrides):
    """Post-model spike multiplier for realtime signals."""
    strength = overrides.get("signal_strength", 0)
    if strength > 0 and overrides.get("signal_type"):
        multiplier = 1 + (strength * 2)   # 0→1x, 0.5→2x, 1.0→3x
        return pred_units * multiplier
    return pred_units


def update_test_input(conn, store_id, product_id=None, horizon=7):
    cur = conn.cursor()

    if product_id is not None:
        cur.execute(
            "DELETE FROM test_input WHERE store_id = %s AND product_id = %s",
            (store_id, product_id)
        )
    else:
        cur.execute("DELETE FROM test_input WHERE store_id = %s", (store_id,))

    cur.execute("SELECT MAX(date) FROM merged_features WHERE store_id = %s", (store_id,))
    last_date = cur.fetchone()[0]
    if last_date is None:
        raise ValueError(f"No data found for store_id={store_id}")

    if product_id is not None:
        cur.execute(
            "SELECT DISTINCT product_id FROM merged_features WHERE store_id = %s AND product_id = %s",
            (store_id, product_id)
        )
    else:
        cur.execute(
            "SELECT DISTINCT product_id FROM merged_features WHERE store_id = %s",
            (store_id,)
        )
    products = cur.fetchall()

    if not products:
        raise ValueError(f"No products found for store_id={store_id}, product_id={product_id}")

    rows_to_insert = []
    for i in range(1, horizon + 1):   # horizon replaces hardcoded 7
        forecast_date = last_date + timedelta(days=i)
        for (pid,) in products:
            rows_to_insert.append((forecast_date, store_id, pid))

    cur.executemany(
        "INSERT INTO test_input (date, store_id, product_id) VALUES (%s, %s, %s)",
        rows_to_insert
    )
    conn.commit()
    print(f"[TEST INPUT] {len(rows_to_insert)} rows inserted — store={store_id}, product={product_id or 'all'}, horizon={horizon}d")

def run_prediction(conn, model, store_id, product_id=None,
                   run_type="baseline", run_id=None,
                   simulation_overrides=None):
    cur = conn.cursor()

    if product_id is not None:
        cur.execute(
            "DELETE FROM demand_forecast WHERE store_id = %s AND product_id = %s AND run_type = %s",
            (store_id, product_id, run_type)
        )
    else:
        cur.execute(
            "DELETE FROM demand_forecast WHERE store_id = %s AND run_type = %s",
            (store_id, run_type)
        )
    conn.commit()

    if product_id is not None:
        cur.execute(
            "SELECT date, store_id, product_id FROM test_input WHERE store_id = %s AND product_id = %s ORDER BY date",
            (store_id, product_id)
        )
    else:
        cur.execute(
            "SELECT date, store_id, product_id FROM test_input WHERE store_id = %s ORDER BY date",
            (store_id,)
        )
    test_rows = cur.fetchall()

    if not test_rows:
        raise ValueError(f"No test input rows for store_id={store_id}, product_id={product_id}.")

    overrides = dict(simulation_overrides or {})
    if overrides:
        overrides = apply_weather_rules(overrides)
        overrides = apply_promo_rules(overrides)

    feature_cols = [
        "store_id", "product_id", "year", "month", "day_of_week", "is_weekend",
        "sell_price", "inventory_on_hand", "promo_intensity", "impact_level",
        "lag_1", "lag_7", "lag_364", "rolling_mean_7", "rolling_std_7"
    ]

    # Group test rows by product so we do a rolling loop per product
    from itertools import groupby
    from operator import itemgetter

    # Sort by product then date to group correctly
    test_rows_sorted = sorted(test_rows, key=lambda r: (r[2], r[0]))

    results = []

    for pid, group in groupby(test_rows_sorted, key=lambda r: r[2]):
        forecast_dates = [r[0] for r in group]
        store_id_val = store_id

        # Fetch 365 days of history for this product
        cur.execute("""
            SELECT * FROM merged_features
            WHERE store_id = %s AND product_id = %s
            ORDER BY date ASC
        """, (store_id_val, pid))

        rows = cur.fetchall()
        if not rows:
            print(f"[SKIP] No history: store={store_id_val}, product={pid}")
            continue

        col_names = [desc[0] for desc in cur.description]
        history = pd.DataFrame(rows, columns=col_names)
        history["date"] = pd.to_datetime(history["date"])
        history = history.sort_values("date").reset_index(drop=True)

        # Keep a working copy of history — we append predictions into it
        # so lag/rolling features update each day
        working = history.copy()

        for forecast_date in sorted(forecast_dates):
            forecast_date_dt = pd.Timestamp(forecast_date)

            # Build a synthetic row for the forecast date
            # Carry forward the last known row's static features
            last_row = working.iloc[-1].copy()
            new_row = last_row.copy()
            new_row["date"] = forecast_date_dt
            new_row["year"] = forecast_date_dt.year
            new_row["month"] = forecast_date_dt.month
            new_row["day_of_week"] = forecast_date_dt.dayofweek
            new_row["is_weekend"] = int(forecast_date_dt.dayofweek >= 5)

            # units_sold unknown for forecast row — set 0 as placeholder
            # lag features will be computed from working history below
            new_row["units_sold"] = 0

            # Append new row to working df
            working = pd.concat([working, pd.DataFrame([new_row])], ignore_index=True)
            working["date"] = pd.to_datetime(working["date"])

            # Recompute lag and rolling features on the full working df
            for lag in [1, 7, 364]:
                working[f"lag_{lag}"] = working.groupby(["store_id", "product_id"])["units_sold"].shift(lag)

            working["rolling_mean_7"] = working.groupby(["store_id", "product_id"])["units_sold"].transform(
                lambda x: x.shift(1).rolling(7, min_periods=1).mean()
            )
            working["rolling_std_7"] = working.groupby(["store_id", "product_id"])["units_sold"].transform(
                lambda x: x.shift(1).rolling(7, min_periods=1).std().fillna(0)
            )

            # Preprocess the full working df to encode categoricals etc.
            df_processed = preprocess_features(working.copy())

            # Take the last row — that's our forecast day
            X = df_processed.iloc[-1:][feature_cols].copy()

            # Fill any NAs from lag lookback gaps
            X = X.fillna(0)

            # Apply weather overrides
            weather_map = {"rainfall_mm": "rainfall_mm", "avg_temp": "avg_temp", "humidity": "humidity"}
            for override_key, col_name in weather_map.items():
                if override_key in overrides and col_name in X.columns:
                    X[col_name] = overrides[override_key]

            # Apply promo overrides
            if "promo_type" in overrides and "promo_type" in X.columns:
                X["promo_type"] = overrides["promo_type"]
            if "discount_pct" in overrides and "discount_pct" in X.columns:
                X["discount_pct"] = overrides["discount_pct"]
                X["promo_intensity"] = X["discount_pct"] * (X["promo_type"] != 0).astype(int)

            bad_cols = [c for c in X.columns if X[c].dtype == object]
            if bad_cols:
                raise ValueError(
                    f"Object dtype columns for product={pid}: {bad_cols} "
                    f"— values: { {c: X[c].values[0] for c in bad_cols} }"
                )

            dmatrix = xgb.DMatrix(X, enable_categorical=True)
            pred_log = model.predict(dmatrix)[0]
            pred_units = float(np.expm1(pred_log))
            pred_units = apply_signal_multiplier(pred_units, overrides)
            rec_inventory = pred_units * 1.2

            # CRITICAL — write prediction back into working history as units_sold
            # so the next day's lag_1 picks it up correctly
            working.at[working.index[-1], "units_sold"] = int(round(pred_units))
            working["units_sold"] = working["units_sold"].astype(float)

            results.append((
                forecast_date, datetime.now(), store_id_val, pid,
                pred_units, rec_inventory, 1,
                run_type, run_id
            ))

    if not results:
        raise ValueError(f"No predictions generated for store_id={store_id}, product_id={product_id}.")

    cur.executemany("""
        INSERT INTO demand_forecast (
            date, predicted_time, store_id, product_id,
            predicted_units_sold, recommended_inventory_level, model_id,
            run_type, run_id
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, results)
    conn.commit()
    print(f"[DONE] {len(results)} {run_type} predictions stored — run_id={run_id}")

  

def compute_shap(conn, model, store_id, product_id, run_type="baseline"):
    cur = conn.cursor()

    # Fetch the latest forecast rows for this store+product+run_type
    cur.execute("""
        SELECT date, predicted_units_sold FROM demand_forecast
        WHERE store_id = %s AND product_id = %s AND run_type = %s
        ORDER BY date ASC
    """, (store_id, product_id, run_type))
    forecast_rows = cur.fetchall()
    if not forecast_rows:
        raise ValueError(f"No forecast data found for store={store_id}, product={product_id}, run_type={run_type}")

    # Rebuild the feature matrix the same way run_prediction does
    cur.execute("""
        SELECT * FROM merged_features
        WHERE store_id = %s AND product_id = %s
        ORDER BY date ASC
    """, (store_id, product_id))
    rows = cur.fetchall()
    col_names = [desc[0] for desc in cur.description]
    history = pd.DataFrame(rows, columns=col_names)
    history["date"] = pd.to_datetime(history["date"])
    history["units_sold"] = history["units_sold"].astype(float)

    working = history.copy()

    feature_cols = [
        "store_id", "product_id", "year", "month", "day_of_week", "is_weekend",
        "sell_price", "inventory_on_hand", "promo_intensity", "impact_level",
        "lag_1", "lag_7", "lag_364", "rolling_mean_7", "rolling_std_7"
    ]

    X_all = []
    dates = []

    for forecast_date, pred_units in forecast_rows:
        forecast_date_dt = pd.Timestamp(forecast_date)
        last_row = working.iloc[-1].copy()
        new_row = last_row.copy()
        new_row["date"] = forecast_date_dt
        new_row["year"] = forecast_date_dt.year
        new_row["month"] = forecast_date_dt.month
        new_row["day_of_week"] = forecast_date_dt.dayofweek
        new_row["is_weekend"] = int(forecast_date_dt.dayofweek >= 5)
        new_row["units_sold"] = 0

        working = pd.concat([working, pd.DataFrame([new_row])], ignore_index=True)
        working["date"] = pd.to_datetime(working["date"])

        for lag in [1, 7, 364]:
            working[f"lag_{lag}"] = working.groupby(["store_id", "product_id"])["units_sold"].shift(lag)

        working["rolling_mean_7"] = working.groupby(["store_id", "product_id"])["units_sold"].transform(
            lambda x: x.shift(1).rolling(7, min_periods=1).mean()
        )
        working["rolling_std_7"] = working.groupby(["store_id", "product_id"])["units_sold"].transform(
            lambda x: x.shift(1).rolling(7, min_periods=1).std().fillna(0)
        )

        df_processed = preprocess_features(working.copy())
        X = df_processed.iloc[-1:][feature_cols].copy().fillna(0)
        X_all.append(X)
        dates.append(str(forecast_date))

        working.at[working.index[-1], "units_sold"] = float(pred_units)

    X_combined = pd.concat(X_all, ignore_index=True)

    # Compute SHAP values
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_combined)

    # Build JSON response — one entry per forecast day
    result = []
    for i, date in enumerate(dates):
        day_shap = {
            "date": date,
            "shap_values": {
                col: round(float(shap_values[i][j]), 4)
                for j, col in enumerate(feature_cols)
            },
            "feature_values": {
                col: round(float(X_combined.iloc[i][col]), 4)
                for col in feature_cols
            }
        }
        result.append(day_shap)

    return {
        "store_id": store_id,
        "product_id": product_id,
        "run_type": run_type,
        "base_value": round(float(explainer.expected_value), 4),
        "days": result
    }
from app.services.llm_service import generate_llm_explanation

def generate_explanation(conn, model, store_id, product_id, run_type="baseline"):
    shap_data = compute_shap(conn, model, store_id, product_id, run_type)

    feature_cols = list(shap_data["days"][0]["shap_values"].keys())

    # Mean SHAP
    mean_shap = {
        col: round(float(np.mean([d["shap_values"][col] for d in shap_data["days"]])), 4)
        for col in feature_cols
    }

    sorted_features = sorted(mean_shap.items(), key=lambda x: abs(x[1]), reverse=True)
    top_features = sorted_features[:5]

    # Fetch stats
    cur = conn.cursor()
    cur.execute("""
        SELECT AVG(predicted_units_sold), MIN(predicted_units_sold), MAX(predicted_units_sold)
        FROM demand_forecast
        WHERE store_id = %s AND product_id = %s AND run_type = %s
    """, (store_id, product_id, run_type))

    avg_units, min_units, max_units = cur.fetchone()

    # ✅ Build structured payload
    explanation_payload = {
        "store_id": store_id,
        "product_id": product_id,
        "run_type": run_type,
        "forecast_summary": {
            "average_units": round(avg_units, 2),
            "min_units": round(min_units, 2),
            "max_units": round(max_units, 2)
        },
        "top_drivers": [
            {"feature": f, "impact": float(v)}
            for f, v in top_features
        ]
    }

    # ✅ Add baseline comparison if simulation
    if run_type == "simulation":
        cur.execute("""
            SELECT AVG(predicted_units_sold)
            FROM demand_forecast
            WHERE store_id = %s AND product_id = %s AND run_type = 'baseline'
        """, (store_id, product_id))

        row = cur.fetchone()
        if row and row[0]:
            baseline_avg = float(row[0])
            simulation_avg = float(avg_units)

            explanation_payload["comparison"] = {
                "baseline_avg": round(baseline_avg, 2),
                "simulation_avg": round(simulation_avg, 2),
                "delta": round(simulation_avg - baseline_avg, 2),
                "delta_percent": round(((simulation_avg - baseline_avg) / baseline_avg) * 100, 2)
            }

    # 🔥 LLM CALL
    llm_text = generate_llm_explanation(explanation_payload)

    return {
        "store_id": store_id,
        "product_id": product_id,
        "run_type": run_type,
        "llm_explanation": llm_text,
        "structured_data": explanation_payload   # optional (debug/UI)
    }