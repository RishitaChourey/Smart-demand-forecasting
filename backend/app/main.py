from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import revenue

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