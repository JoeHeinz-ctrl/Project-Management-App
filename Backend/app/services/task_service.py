from sqlalchemy.orm import Session
from app.models.task import Task

class TaskService:

    @staticmethod
    def create_task(db: Session, title: str, project_id: int):
        task = Task(title=title, project_id=project_id)
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_tasks_by_project(db: Session, project_id: int):
        return db.query(Task).filter(Task.project_id == project_id).all()
