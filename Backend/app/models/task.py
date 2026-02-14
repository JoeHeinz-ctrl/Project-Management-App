from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, default="")

    status = Column(String, default="todo")  # ⭐ Kanban logic

    project_id = Column(Integer, ForeignKey("projects.id"))

