from fastapi import APIRouter
from app.db import get_connection
from app.schema.product_store_sales_schema import ProductStoreSalesResponse

router = APIRouter()

@router.get("/product-store-sales", response_model=ProductStoreSalesResponse)
def get_product_store_sales():
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            p.product_name,
            st.store_name,
            COALESCE(SUM(s.units_sold), 0) AS units_sold
        FROM public.sales_history s
        JOIN public.products p 
            ON s.product_id = p.product_id
        JOIN public.stores st 
            ON s.store_id = st.store_id
        GROUP BY p.product_name, st.store_name
        ORDER BY p.product_name, st.store_name;
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "product_name": row[0],
            "store_name": row[1],
            "units_sold": int(row[2])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }