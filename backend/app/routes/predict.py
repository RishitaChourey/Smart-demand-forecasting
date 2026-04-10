from fastapi import APIRouter, Request, HTTPException
from app.services.predict_service import update_test_input, run_prediction
from app.db import get_connection
import xgboost as xgb
import traceback
from datetime import datetime

router = APIRouter(prefix="/predict")

model = xgb.Booster()
model.load_model("app/models/xgb_model.json")


@router.post("/predict_baseline")
async def predict_baseline(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    product_id = data.get("product_id")

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")

    conn = get_connection()
    try:
        update_test_input(conn, store_id, product_id)
        run_prediction(conn, model, store_id,
                       product_id=product_id,
                       run_type="baseline",
                       run_id=run_id)
    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()
    return {
        "status": f"Baseline predictions stored for store_id={store_id}, product_id={product_id or 'all'}",
        "run_id": run_id,
        "run_type": "baseline"
    }


@router.post("/predict_simulation")
async def predict_simulation(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    product_id = data.get("product_id")
    overrides = data.get("overrides", {})

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")

    run_id = datetime.now().strftime("%Y%m%d_%H%M%S")

    conn = get_connection()
    try:
        update_test_input(conn, store_id, product_id)
        run_prediction(conn, model, store_id,
                       product_id=product_id,
                       run_type="simulation",
                       run_id=run_id,
                       simulation_overrides=overrides)
    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()
    return {
        "status": f"Simulation predictions stored for store_id={store_id}, product_id={product_id or 'all'}",
        "run_id": run_id,
        "run_type": "simulation"
    }