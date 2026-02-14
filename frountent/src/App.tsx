import { useEffect, useState } from "react";
import { fetchTasks, createTask } from "./services/api";

const styles: any = {
  container: {
    padding: "40px",
    color: "white",
  },

  createBar: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2a2f3a",
    background: "#111827",
    color: "white",
    outline: "none",
  },

  button: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  board: {
    display: "flex",
    gap: "20px",
    width: "100%",
    marginTop: "20px",
  },

  column: {
    flex: 1,
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    minHeight: "400px",
  },

  title: {
    marginBottom: "15px",
    fontWeight: "bold",
  },

  card: {
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks()
      .then(data => {
        console.log("TASKS FROM API:", data);
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("API ERROR:", err));
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;

    try {
      const created = await createTask(newTask);

      // Instant UI update (no reload needed)
      setTasks(prev => [...prev, created]);
      setNewTask("");
    } catch (err) {
      console.error("CREATE TASK ERROR:", err);
    }
  };

  const normalizeStatus = (s: string) => {
    if (!s) return "todo";

    s = s.toLowerCase().trim();

    if (s.includes("todo")) return "todo";
    if (s.includes("doing")) return "doing";
    if (s.includes("done")) return "done";

    return "todo";
  };

  const renderTasks = (status: string) =>
    tasks
      .filter(t => normalizeStatus(t.status) === status)
      .map(t => (
        <div key={t.id} style={styles.card}>
          {t.title}
        </div>
      ));

  return (
    <div style={styles.container}>
      <h1>Project Board({tasks.length})</h1>

      {/* ✅ Create Task Bar */}
      <div style={styles.createBar}>
        <input
          style={styles.input}
          placeholder="Enter task title..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <button style={styles.button} onClick={handleCreateTask}>
          Add Task
        </button>
      </div>

      <div style={styles.board}>
        <div style={styles.column}>
          <div style={styles.title}>TODO</div>
          {renderTasks("todo")}
        </div>

        <div style={styles.column}>
          <div style={styles.title}>DOING</div>
          {renderTasks("doing")}
        </div>

        <div style={styles.column}>
          <div style={styles.title}>DONE</div>
          {renderTasks("done")}
        </div>
      </div>
    </div>
  );
}
