from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    status: str = "todo"
    project_id: int
