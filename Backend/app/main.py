from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes

app = FastAPI(title="Project Management App")

app.include_router(auth_routes.router)
app.include_router(project_routes.router)
app.include_router(task_routes.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
