from fastapi import APIRouter, Query
from typing import List
from app.db import get_connection
from app.schema.revenue_by_store_category_schema import RevenueByStoreCategoryResponse

router = APIRouter()

@router.get("/revenue-by-store-category", response_model=RevenueByStoreCategoryResponse)
def get_revenue_by_store_category(
    start_date: str = Query(...),
    end_date: str = Query(...),
    stores: List[str] = Query(None),
    cities: List[str] = Query(None),
    states: List[str] = Query(None),
    products: List[str] = Query(None),
    categories: List[str] = Query(None),
    subcategories: List[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            TO_CHAR(sh.date, 'Mon') AS month,
            s.store_name AS store,
            s.city AS location,
            s.state AS state,
            p.product_name AS product,
            p.category AS category,
            p.subcategory AS subcategory,
            SUM(sh.units_sold * sh.sell_price) AS actual
        FROM sales_history sh
        JOIN stores s ON sh.store_id = s.store_id
        JOIN products p ON sh.product_id = p.product_id
        WHERE sh.date BETWEEN %s AND %s
    """

    params = [start_date, end_date]

    if stores:
        query += " AND s.store_name = ANY(%s)"
        params.append(stores)

    if cities:
        query += " AND s.city = ANY(%s)"
        params.append(cities)

    if states:
        query += " AND s.state = ANY(%s)"
        params.append(states)

    if products:
        query += " AND p.product_name = ANY(%s)"
        params.append(products)

    if categories:
        query += " AND p.category = ANY(%s)"
        params.append(categories)

    if subcategories:
        query += " AND p.subcategory = ANY(%s)"
        params.append(subcategories)

    query += """
        GROUP BY 
            TO_CHAR(sh.date, 'Mon'),
            EXTRACT(MONTH FROM sh.date),
            s.store_name,
            s.city,
            s.state,
            p.product_name,
            p.category,
            p.subcategory
        ORDER BY 
            EXTRACT(MONTH FROM sh.date),
            s.store_name;
    """

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "month": row[0],
            "store": row[1],
            "location": row[2],
            "state": row[3],
            "product": row[4],
            "category": row[5],
            "subcategory": row[6],
            "actual": float(row[7])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }