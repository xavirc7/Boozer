from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes_payment import router as payment_router
from app.api.routes_hardware import router as hardware_router

app = FastAPI(title="Boozer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:6000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment_router)
app.include_router(hardware_router)