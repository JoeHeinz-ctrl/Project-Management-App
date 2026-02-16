const API_URL = "http://127.0.0.1:8000";

async function handleResponse(res: Response) {
  const data = await res.json();              // ✅ read ONCE

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);                 // ✅ never parse twice
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(res);
}
