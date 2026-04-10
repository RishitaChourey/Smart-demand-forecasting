from pydantic import BaseModel
from typing import List

class StoreSalesData(BaseModel):
    store_name: str
    total_units_sold: int
    units_this_year: int
    units_last_year: int
    change_in_units: int
    pct_change: float
    profit_or_loss: bool

class StoreSalesResponse(BaseModel):
    status: str
    data: List[StoreSalesData]