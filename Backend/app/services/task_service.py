from sqlalchemy.orm import Session
from app.models.task import Task

class TaskService:

    @staticmethod
    def create_task(db: Session, title: str, project_id: int, status: str):
        task = Task(title=title, project_id=project_id, status=status)
        db.add(task)
        db.commit()
        db.refresh(task)
        return task