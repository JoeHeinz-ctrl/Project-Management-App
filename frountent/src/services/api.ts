
const API_BASE = "http://127.0.0.1:8000";

export const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks/`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};
