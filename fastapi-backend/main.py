from fastapi import FastAPI
from routes import plan
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(plan.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 또는 ["http://localhost:3000", "http://localhost:3002"] 이런 식으로도 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
