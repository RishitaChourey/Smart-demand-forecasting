from pydantic import BaseModel
from typing import List

class InventoryStockoutData(BaseModel):
    date: str
    store: str
    product: str
    total_inventory: float
    units_sold: float
    stockout: bool

class InventoryStockoutResponse(BaseModel):
    status: str
    data: List[InventoryStockoutData]