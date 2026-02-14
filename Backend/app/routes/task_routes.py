from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.task import Task
from app.schemas.schema import TaskCreate
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ✅ CREATE TASK (single correct endpoint)
@router.post("/")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    return TaskService.create_task(
        db=db,
        title=task.title,
        project_id=task.project_id,
        status=task.status,
    )


# ✅ GET ALL TASKS
@router.get("/")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


# ✅ MOVE TASK BETWEEN COLUMNS
@router.put("/{task_id}/move")
def move_task(task_id: int, status: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    task.status = status
    db.commit()
    db.refresh(task)

    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {"success": True}
