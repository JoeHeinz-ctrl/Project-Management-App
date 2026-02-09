import api from "./api";

export interface Project {
  id: string;
  name: string;
  description?: string;
}

// Get all projects
export const getProjects = () => {
  return api.get("/projects");
};

// Create a new project
export const createProject = (data: { name: string; description?: string }) => {
  return api.post("/projects", data);
};

// Get single project by id (optional)
export const getProjectById = (projectId: string) => {
  return api.get(`/projects/${projectId}`);
};

// Update project (optional)
export const updateProject = (
  projectId: string,
  data: { name?: string; description?: string }
) => {
  return api.put(`/projects/${projectId}`, data);
};

// Delete project (optional)
export const deleteProject = (projectId: string) => {
  return api.delete(`/projects/${projectId}`);
};

