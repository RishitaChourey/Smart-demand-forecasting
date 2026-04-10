from fastapi import APIRouter
from app.db import get_connection
from app.schema.revenue_schema import RevenueResponse

router = APIRouter()

@router.get("/monthly-revenue", response_model=RevenueResponse)
def get_monthly_revenue():
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            DATE_TRUNC('month', date) AS month_year,
            COALESCE(SUM(units_sold * sell_price), 0) AS total_revenue
        FROM public.sales_history
        GROUP BY month_year
        ORDER BY month_year;
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "month_year": row[0].strftime("%Y-%m"),  # preserves year + month
            "revenue": float(row[1])
        })

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "data": result
    }