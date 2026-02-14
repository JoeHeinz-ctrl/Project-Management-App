from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes
from app.db.database import Base, engine

# ⭐ CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Project Management App")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow Vite dev server
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
