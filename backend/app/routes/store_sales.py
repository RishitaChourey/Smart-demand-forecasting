from fastapi import APIRouter
from app.db import get_connection
from app.schema.store_sales_schema import StoreSalesResponse

router = APIRouter()

@router.get("/store-sales", response_model=StoreSalesResponse)
def get_store_sales():
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            st.store_name,
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
        JOIN public.stores st 
            ON s.store_id = st.store_id
        GROUP BY st.store_name
        ORDER BY st.store_name;
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
            "store_name": row[0],
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