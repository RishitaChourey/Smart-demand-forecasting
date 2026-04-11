from fastapi import APIRouter, Query
from typing import List
from app.db import get_connection
from app.schema.inventory_simulation_schema import InventorySimulationResponse

router = APIRouter()

@router.get("/inventory-simulation", response_model=InventorySimulationResponse)
def get_inventory_simulation(
    start_date: str = Query(...),
    end_date: str = Query(...),
    stores: List[int] = Query(None),
    products: List[int] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            df.date,
            df.store_id,
            df.product_id,
            df.run_type,
            COALESCE(SUM(df.recommended_inventory_level), 0) AS inventory_units
        FROM demand_forecast df
        WHERE df.date BETWEEN %s AND %s
    """

    params = [start_date, end_date]

    if stores:
        query += " AND df.store_id = ANY(%s)"
        params.append(stores)

    if products:
        query += " AND df.product_id = ANY(%s)"
        params.append(products)

    query += """
        GROUP BY 
            df.date,
            df.store_id,
            df.product_id,
            df.run_type
        ORDER BY 
            df.date;
    """

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "date": row[0].strftime("%Y-%m-%d"),
            "store_id": row[1],
            "product_id": row[2],
            "run_type": row[3],
            "inventory_units": float(row[4])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }