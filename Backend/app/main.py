from fastapi import FastAPI
from app.routes import auth_routes, project_routes, task_routes
from app.db.database import Base, engine


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Project Management API")


app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(project_routes.router, prefix="/projects", tags=["Projects"])
app.include_router(task_routes.router, prefix="/tasks", tags=["Tasks"])