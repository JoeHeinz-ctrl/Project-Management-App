from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes
from app.db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
# ⭐ CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Management App")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # ✅ your frontend
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
