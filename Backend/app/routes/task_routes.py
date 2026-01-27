from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.task_service import TaskService

router = APIRouter()

@router.post("/")
def create_task(title: str, project_id: int, db: Session = Depends(get_db)):
    return TaskService.create_task(db, title, project_id)

@router.get("/project/{project_id}")
def get_tasks(project_id: int, db: Session = Depends(get_db)):
    return TaskService.get_tasks_by_project(db, project_id)
