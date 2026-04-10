from pydantic import BaseModel
from typing import List

class CategorySalesData(BaseModel):
    category: str
    total_units_sold: int
    units_this_year: int
    units_last_year: int
    change_in_units: int
    pct_change: float
    profit_or_loss: bool

class CategorySalesResponse(BaseModel):
    status: str
    data: List[CategorySalesData]