from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    status: str = "todo"
    project_id: int

from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str
