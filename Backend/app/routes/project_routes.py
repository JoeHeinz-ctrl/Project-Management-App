from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.project import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(title: str, db: Session = Depends(get_db)):
    project = Project(title=title, owner_id=1)  # temporary user
    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()
