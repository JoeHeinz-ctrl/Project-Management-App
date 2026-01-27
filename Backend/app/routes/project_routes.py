from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

@router.get("/")
def get_projects(db: Session = Depends(get_db)):
    return {"projects": []}
