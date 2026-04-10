from pydantic import BaseModel
from typing import List

class RevenueByStoreCategoryData(BaseModel):
    month: str
    store: str
    location: str
    state: str
    product: str
    category: str
    subcategory: str
    actual: float

class RevenueByStoreCategoryResponse(BaseModel):
    status: str
    data: List[RevenueByStoreCategoryData]