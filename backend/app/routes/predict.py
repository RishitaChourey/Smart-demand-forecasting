from fastapi import APIRouter, Request, HTTPException
from app.services.predict_service import update_test_input, run_prediction
from app.db import get_connection
import xgboost as xgb
import traceback

router = APIRouter(prefix="/predict")

model = xgb.Booster()
model.load_model("app/models/xgb_model.json")


@router.post("/predict_baseline")
async def predict_baseline(request: Request):
    data = await request.json()
    store_id = data.get("store_id")

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")

    conn = get_connection()
    try:
        update_test_input(conn, store_id)
        run_prediction(conn, model, store_id)
    except Exception as e:
        conn.close()
        # This prints the FULL traceback to your terminal
        traceback.print_exc()
        # This returns the error detail in the HTTP response so you can see it in Postman/frontend too
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()
    return {"status": "Baseline predictions stored in demand_forecast", "store_id": store_id}


@router.post("/predict_simulation")
async def predict_simulation(request: Request):
    data = await request.json()
    store_id = data.get("store_id")
    overrides = data.get("overrides", {})

    if store_id is None:
        raise HTTPException(status_code=400, detail="store_id is required")

    conn = get_connection()
    try:
        update_test_input(conn, store_id)
        run_prediction(conn, model, store_id, simulation_overrides=overrides)
    except Exception as e:
        conn.close()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

    conn.close()
    return {"status": "Simulation predictions stored in demand_forecast", "store_id": store_id}