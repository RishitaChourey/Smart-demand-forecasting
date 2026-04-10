from pydantic import BaseModel
from typing import List

class ProductStoreSalesData(BaseModel):
    product_name: str
    store_name: str
    units_sold: int

class ProductStoreSalesResponse(BaseModel):
    status: str
    data: List[ProductStoreSalesData]