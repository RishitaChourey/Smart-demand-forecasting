from fastapi import APIRouter, Request, HTTPException
from app.services.predict_service import (
    update_test_input,
    run_prediction,
    compute_shap,
    generate_explanation
)
from app.db import get_connection
import xgboost as xgb
import traceback
from datetime import datetime

router = APIRouter(prefix="/predict")

model = xgb.Booster()
model.load_model("app/models/xgb_model.json")

VALID_HORIZONS = [7, 90, 365]


# =========================
# BASELINE
# =========================
@router.post("/predict_baseline")
async def predict_baseline(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    horizon = data.get("horizon", 7)

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")
    if horizon not in VALID_HORIZONS:
        raise HTTPException(status_code=400, detail=f"horizon must be one of {VALID_HORIZONS}")

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    conn = get_connection()

    try:
        # Run prediction
        update_test_input(conn, store_id, product_id=None, horizon=horizon)
        run_prediction(
            conn,
            model,
            store_id,
            product_id=None,
            run_type="baseline",
            run_id=run_id
        )

        # 🔥 Generate explanation (only for one product to keep it fast)
        sample_product_id = 1

        try:
            explanation_data = generate_explanation(
                conn, model, store_id, sample_product_id, run_type="baseline"
            )
            explanation_text = explanation_data.get("llm_explanation", "")
        except Exception as e:
            print(f"[EXPLANATION ERROR] {e}")
            explanation_text = "Explanation unavailable."

    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()

    return {
        "status": f"Baseline predictions stored for store_id={store_id}, all products, {horizon} days",
        "run_id": run_id,
        "run_type": "baseline",
        "horizon": horizon,
        "explanation": explanation_text
    }


# =========================
# SIMULATION
# =========================
@router.post("/predict_simulation")
async def predict_simulation(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    product_id = data.get("product_id")
    overrides = data.get("overrides", {})
    horizon = data.get("horizon", 7)

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")
    if horizon not in VALID_HORIZONS:
        raise HTTPException(status_code=400, detail=f"horizon must be one of {VALID_HORIZONS}")

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    conn = get_connection()

    try:
        # Run prediction
        update_test_input(conn, store_id, product_id=product_id, horizon=horizon)
        run_prediction(
            conn,
            model,
            store_id,
            product_id=product_id,
            run_type="simulation",
            run_id=run_id,
            simulation_overrides=overrides
        )

        # 🔥 Explanation for selected product (or fallback to 1)
        sample_product_id = product_id if product_id else 1

        try:
            explanation_data = generate_explanation(
                conn, model, store_id, sample_product_id, run_type="simulation"
            )
            explanation_text = explanation_data.get("llm_explanation", "")
        except Exception as e:
            print(f"[EXPLANATION ERROR] {e}")
            explanation_text = "Explanation unavailable."

    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()

    return {
        "status": f"Simulation predictions stored for store_id={store_id}, {horizon} days",
        "run_id": run_id,
        "run_type": "simulation",
        "horizon": horizon,
        "explanation": explanation_text
    }


# =========================
# OPTIONAL: SHAP (KEEP FOR DEBUG/UI)
# =========================
@router.post("/shap")
async def get_shap(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    product_id = data.get("product_id")
    run_type = data.get("run_type", "baseline")

    if not store_id or not product_id:
        raise HTTPException(status_code=400, detail="store_id and product_id are required")

    conn = get_connection()
    try:
        result = compute_shap(conn, model, store_id, product_id, run_type)
    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()
    return result
