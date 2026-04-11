from fastapi import APIRouter, Query
from app.db import get_connection
from app.schema.inventory_comparison_schema import InventoryComparisonResponse

router = APIRouter()

@router.get("/inventory-comparison", response_model=InventoryComparisonResponse)
def get_inventory_comparison(
    start_date: str = Query(...),
    end_date: str = Query(...),
    store: str = Query(None),
    product: str = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            sh.date,
            s.store_name,
            p.product_name,
            COALESCE(SUM(sh.inventory_on_hand), 0) AS baseline_inventory,
            COALESCE(SUM(df.predicted_units_sold), 0) AS predicted_inventory,
            COALESCE(SUM(df.recommended_inventory_level), 0) AS recommended_inventory
        FROM sales_history sh
        JOIN stores s ON sh.store_id = s.store_id
        JOIN products p ON sh.product_id = p.product_id
        LEFT JOIN demand_forecast df
            ON df.date = sh.date 
            AND df.store_id = sh.store_id 
            AND df.product_id = sh.product_id
        WHERE sh.date BETWEEN %s AND %s
    """

    params = [start_date, end_date]

    if store:
        query += " AND s.store_name = %s"
        params.append(store)

    if product:
        query += " AND p.product_name = %s"
        params.append(product)

    query += """
        GROUP BY 
            sh.date,
            s.store_name,
            p.product_name
        ORDER BY 
            sh.date;
    """

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "date": row[0].strftime("%Y-%m-%d"),
            "store": row[1],
            "product": row[2],
            "baseline_inventory": float(row[3]),
            "predicted_inventory": float(row[4]),
            "recommended_inventory": float(row[5])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }