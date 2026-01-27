from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.get("/health")
def auth_health(db: Session = Depends(get_db)):
    return {"status": "Auth service OK"}
