from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)

    status = Column(String, default="TODO")

    project_id = Column(Integer, ForeignKey("projects.id"))

    # ✅ THIS LINE WAS MISSING / WRONG
    project = relationship("Project", back_populates="tasks")
