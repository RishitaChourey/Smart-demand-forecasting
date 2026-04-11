from pydantic import BaseModel
from typing import List

class InventorySimulationData(BaseModel):
    date: str
    store_id: int
    product_id: int
    run_type: str   # baseline / simulation
    inventory_units: float

class InventorySimulationResponse(BaseModel):
    status: str
    data: List[InventorySimulationData]