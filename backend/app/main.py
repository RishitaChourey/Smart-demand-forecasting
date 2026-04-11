from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import revenue
from app.routes import category_sales
from app.routes import store_sales
from app.routes import product_store_sales
from app.routes import predict
from app.routes import inventory_simulation
from app.routes import inventory_comparison
from app.routes import inventory_stockout

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(revenue.router, prefix="/api")
app.include_router(category_sales.router, prefix="/api") 
app.include_router(store_sales.router, prefix="/api") 
app.include_router(product_store_sales.router, prefix="/api")  
app.include_router(predict.router, prefix="/api")
app.include_router(inventory_simulation.router, prefix="/api")
app.include_router(inventory_comparison.router, prefix="/api")
app.include_router(inventory_stockout.router, prefix="/api")
