import { useEffect, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask } from "../services/api";


const styles: any = {
  container: {
    padding: "40px",
    color: "white",
    background: "linear-gradient(135deg, #283451, #0f0e0a)",
    minHeight: "100vh",
  },

  header: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    letterSpacing: "1px",
  },

  createBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #1f2933",
    background: "#020617",
    color: "white",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    padding: "14px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },

  board: {
    display: "flex",
    gap: "20px",
  },

  column: {
    flex: 1,
    background: "rgba(30, 41, 59, 0.6)",
    padding: "20px",
    borderRadius: "14px",
    minHeight: "420px",
    backdropFilter: "blur(10px)",
    transition: "0.25s",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  columnTitle: {
    marginBottom: "15px",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#94a3b8",
  },

  card: {
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "grab",
    transition: "0.18s ease",
    border: "1px solid rgba(255,255,255,0.05)",
    userSelect: "none",
  },

  trashZone: {
    marginTop: "30px",
    height: "80px",
    borderRadius: "14px",
    border: "2px dashed rgba(239,68,68,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: "18px",
    transition: "0.25s ease",
  },
};

export default function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [trashActive, setTrashActive] = useState(false);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;

    const created = await createTask(newTask);
    setTasks(prev => [...prev, created]);
    setNewTask("");
  };

  const onDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const onDropColumn = async (status: string) => {
    if (!draggedTask) return;

    const updated = await moveTask(draggedTask.id, status);

    setTasks(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    );

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const onDropTrash = async () => {
    if (!draggedTask) return;

    await deleteTask(draggedTask.id);

    setTasks(prev => prev.filter(t => t.id !== draggedTask.id));

    setDraggedTask(null);
    setTrashActive(false);
  };

  const normalizeStatus = (s: string) => {
    if (!s) return "todo";
    s = s.toLowerCase();
    if (s.includes("doing")) return "doing";
    if (s.includes("done")) return "done";
    return "todo";
  };

  const renderTasks = (status: string) =>
    tasks
      .filter(t => normalizeStatus(t.status) === status)
      .map(t => (
        <div
          key={t.id}
          style={{
            ...styles.card,
            transform:
              draggedTask?.id === t.id
                ? "scale(1.08) rotate(1deg)"
                : "scale(1)",
            boxShadow:
              draggedTask?.id === t.id
                ? "0 10px 25px rgba(0,0,0,0.4)"
                : "none",
          }}
          draggable
          onDragStart={() => onDragStart(t)}
        >
          {t.title}
        </div>
      ));

  const columnStyle = (name: string) => ({
    ...styles.column,
    boxShadow:
      dragOverColumn === name
        ? "0 0 0 1px rgba(59,130,246,0.4), 0 10px 30px rgba(59,130,246,0.15)"
        : "none",
    transform: dragOverColumn === name ? "scale(1.02)" : "scale(1)",
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>PROJECT BOARD ({tasks.length})</div>

      <div style={styles.createBar}>
        <input
          style={styles.input}
          placeholder="Create a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />

        <button style={styles.button} onClick={handleCreateTask}>
          Add Task
        </button>
      </div>

      <div style={styles.board}>
        {["todo", "doing", "done"].map(col => (
          <div
            key={col}
            style={columnStyle(col)}
            onDragOver={e => e.preventDefault()}
            onDragEnter={() => setDragOverColumn(col)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={() => onDropColumn(col)}
          >
            <div style={styles.columnTitle}>{col.toUpperCase()}</div>
            {renderTasks(col)}
          </div>
        ))}
      </div>

      {/* 🗑️ Trash Zone */}
      <div
        style={{
          ...styles.trashZone,
          background: trashActive ? "rgba(239,68,68,0.12)" : "transparent",
          transform: trashActive ? "scale(1.03)" : "scale(1)",
          boxShadow: trashActive
            ? "0 0 25px rgba(239,68,68,0.25)"
            : "none",
        }}
        onDragOver={e => {
          e.preventDefault();
          setTrashActive(true);
        }}
        onDragLeave={() => setTrashActive(false)}
        onDrop={onDropTrash}
      >
        🗑️ DROP HERE TO DELETE TASK
      </div>
    </div>
  );
}

