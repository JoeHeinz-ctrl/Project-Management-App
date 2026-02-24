from pydantic import BaseModel, EmailStr
from typing import List

# -------- PROJECT --------
class ProjectCreate(BaseModel):
    title: str

# -------- TASK --------
class TaskCreate(BaseModel):
    title: str
    status: str = "todo"
    project_id: int

class TaskReorder(BaseModel):
    task_ids: List[int]

# -------- USER --------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str