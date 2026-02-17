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

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks/`, {
    headers: getAuthHeaders(),          // ✅ AUTH ADDED
  });

  return handleResponse(res);
}

export async function createTask(title: string) {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),          // ✅ AUTH ADDED
    body: JSON.stringify({
      title,
      status: "TODO",
      project_id: 1,
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
