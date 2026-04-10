from pydantic import BaseModel
from typing import List

class RevenueData(BaseModel):
    month_year: str   # "2024-01"
    revenue: float

class RevenueResponse(BaseModel):
    status: str
    data: List[RevenueData]