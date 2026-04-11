from fastapi import APIRouter, Query
from app.db import get_connection
from app.schema.inventory_stockout_schema import InventoryStockoutResponse

router = APIRouter()

@router.get("/inventory-stockout", response_model=InventoryStockoutResponse)
def get_inventory_stockout(
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
            COALESCE(SUM(sh.inventory_on_hand), 0) AS total_inventory,
            COALESCE(SUM(sh.units_sold), 0) AS units_sold,
            BOOL_OR(sh.stockout_flag) AS stockout
        FROM sales_history sh
        JOIN stores s ON sh.store_id = s.store_id
        JOIN products p ON sh.product_id = p.product_id
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
            "total_inventory": float(row[3]),
            "units_sold": float(row[4]),
            "stockout": bool(row[5])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }