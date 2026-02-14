const API_URL = "http://127.0.0.1:8000";

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks/`);

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export async function createTask(title: string) {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      project_id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}

export async function moveTask(taskId: number, status: string) {
  const res = await fetch(
    `${API_URL}/tasks/${taskId}/move?status=${status}`,
    {
      method: "PUT",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to move task");
  }

  return res.json();
}
