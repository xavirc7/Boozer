from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Boozer")

# Permitir frontend en desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:6000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}