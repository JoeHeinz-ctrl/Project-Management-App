from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.schema import TaskCreate
from app.services.task_service import TaskService

from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.task import Task
from app.models.project import Project

router = APIRouter(prefix="/tasks", tags=["Tasks"])


# ✅ CREATE TASK (User Protected)
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(Project.id == task.project_id, Project.owner_id == current_user.id)
        .first()
    )

    if not project:
        return {"error": "Project not found or not authorized"}

    return TaskService.create_task(
        db=db,
        title=task.title,
        project_id=task.project_id,
        status=task.status,
    )


# ✅ GET TASKS (User Isolated)
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .filter(Project.owner_id == current_user.id)
        .all()
    )


# ✅ MOVE TASK (Ownership Protected)
@router.put("/{task_id}/move")
def move_task(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .filter(Task.id == task_id, Project.owner_id == current_user.id)
        .first()
    )

    if not task:
        return {"error": "Task not found or not authorized"}

    task.status = status
    db.commit()
    db.refresh(task)

    return task


# ✅ DELETE TASK (Ownership Protected)
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = (
        db.query(Task)
        .join(Project, Task.project_id == Project.id)
        .filter(Task.id == task_id, Project.owner_id == current_user.id)
        .first()
    )

    if not task:
        return {"error": "Task not found or not authorized"}

    db.delete(task)
    db.commit()

    return {"success": True}
