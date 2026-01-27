from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.auth_service import AuthService


router = APIRouter()


@router.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
 return AuthService.register(db, username, password)


@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    token = AuthService.login(db, username, password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token}