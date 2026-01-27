from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.project_service import ProjectService

router = APIRouter()

@router.post("/")
def create_project(name: str, owner_id: int, db: Session = Depends(get_db)):
    return ProjectService.create_project(db, name, owner_id)

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    return ProjectService.get_projects(db)
