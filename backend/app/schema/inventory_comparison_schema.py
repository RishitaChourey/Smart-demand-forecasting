from pydantic import BaseModel
from typing import List

class InventoryComparisonData(BaseModel):
    date: str
    store: str
    product: str
    baseline_inventory: float
    predicted_inventory: float
    recommended_inventory: float

class InventoryComparisonResponse(BaseModel):
    status: str
    data: List[InventoryComparisonData]