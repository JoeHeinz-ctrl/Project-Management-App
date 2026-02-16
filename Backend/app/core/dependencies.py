from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.config import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise credentials_exception

    return user
