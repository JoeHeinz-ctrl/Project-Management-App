const API_URL = "http://127.0.0.1:8000";

/* ---------------- HELPER ---------------- */

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,   // ✅ REQUIRED
  };
}

async function handleResponse(res: Response) {
  const data = await res.json();        // ✅ read once

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

/* ---------------- AUTH ---------------- */

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
}

export async function googleLogin(code: string) {
  const res = await fetch(`${API_URL}/auth/google`, {   // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Google login failed");
  }

  localStorage.setItem("token", data.access_token);

  return data;
}



export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  // ✅ CRITICAL — STORE TOKEN
  localStorage.setItem("token", data.access_token);

  return data;
}

/* ---------------- TASKS ---------------- */

export async function fetchTasks(projectId: number) {
  const res = await fetch(`${API_URL}/tasks/`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);

  // client-side filter (safe even if backend already filters)
  return data.filter((t: any) => t.project_id === projectId);
}

export async function createTask(title: string, projectId: number) {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      status: "TODO",
      project_id: projectId,   // ✅ dynamic
    }),
  });

  return handleResponse(res);
}

export async function moveTask(taskId: number, status: string) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/move?status=${status}`, {
    method: "PUT",
    headers: getAuthHeaders(),          // ✅ AUTH ADDED
  });

  return handleResponse(res);
}

export async function deleteTask(taskId: number) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),          // ✅ AUTH ADDED
  });

  return handleResponse(res);
}

export async function createProject(title: string) {
  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:8000/projects/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,   // ⭐ REQUIRED
    },
    body: JSON.stringify({ title }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to create project");
  }

  return data;
}


export async function fetchProjects() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:8000/projects/", {
    headers: {
      Authorization: `Bearer ${token}`,   // ⭐ REQUIRED
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch projects");
  }

  return data;
}


