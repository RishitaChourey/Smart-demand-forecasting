from fastapi import APIRouter
from app.db import get_connection
from app.schema.category_sales_schema import CategorySalesResponse

router = APIRouter()

@router.get("/category-sales", response_model=CategorySalesResponse)
def get_category_sales():
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            p.category,
            COALESCE(SUM(s.units_sold), 0) AS total_units_sold,

            COALESCE(SUM(
                CASE 
                    WHEN EXTRACT(YEAR FROM s.date) = EXTRACT(YEAR FROM CURRENT_DATE)
                    THEN s.units_sold ELSE 0 
                END
            ), 0) AS units_this_year,

            COALESCE(SUM(
                CASE 
                    WHEN EXTRACT(YEAR FROM s.date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                    THEN s.units_sold ELSE 0 
                END
            ), 0) AS units_last_year

        FROM public.sales_history s
        JOIN public.products p 
            ON s.product_id = p.product_id
        GROUP BY p.category
        ORDER BY p.category;
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    result = []
    for row in rows:
        total = row[1]
        this_year = row[2]
        last_year = row[3]

        change = this_year - last_year

        if last_year == 0:
            pct_change = 0
        else:
            pct_change = (change / last_year) * 100

        result.append({
            "category": row[0],
            "total_units_sold": int(total),
            "units_this_year": int(this_year),
            "units_last_year": int(last_year),
            "change_in_units": int(change),
            "pct_change": float(pct_change),
            "profit_or_loss": True if change >= 0 else False
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }