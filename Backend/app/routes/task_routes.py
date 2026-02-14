from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.task import Task

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/")
def create_task(title: str, project_id: int, db: Session = Depends(get_db)):
    task = Task(title=title, project_id=project_id)
    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@router.put("/{task_id}/move")
def move_task(task_id: int, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = status
    db.commit()
    db.refresh(task)

    return task
