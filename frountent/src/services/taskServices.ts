import api from "./api";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done";
  project_id: string;
}

// Get all tasks for a project
export const getTasks = (projectId: string) => {
  return api.get(`/projects/${projectId}/tasks`);
};

// Create a new task in a project
export const createTask = (
  projectId: string,
  data: { title: string; description?: string }
) => {
  return api.post(`/projects/${projectId}/tasks`, data);
};

// Update task (status/title/description)
export const updateTask = (
  taskId: string,
  data: { title?: string; description?: string; status?: Task["status"] }
) => {
  return api.put(`/tasks/${taskId}`, data);
};

// Delete task
export const deleteTask = (taskId: string) => {
  return api.delete(`/tasks/${taskId}`);
};

