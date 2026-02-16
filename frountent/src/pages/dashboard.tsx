import { useEffect, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask } from "../services/api";

const styles: any = {
  container: {
    padding: "40px",
    background: "#1a1a1a",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  header: {
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "12px",
    letterSpacing: "-0.5px",
    color: "#ffffff",
  },

  subheader: {
    fontSize: "15px",
    color: "#b3b3b3",
    marginBottom: "40px",
  },

  createBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
  },

  input: {
    flex: 1,
    padding: "16px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#242424",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
    boxShadow:
      "inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(60, 60, 60, 0.1)",
    transition: "all 0.3s ease",
  },

  button: {
    padding: "16px 32px",
    borderRadius: "12px",
    border: "none",
    background: "#0b7de0",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow:
      "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)",
  },

  board: {
    display: "flex",
    gap: "24px",
    marginBottom: "40px",
  },

  column: {
    flex: 1,
    background: "#242424",
    padding: "24px",
    borderRadius: "20px",
    minHeight: "500px",
    transition: "all 0.3s ease",
    boxShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.05)",
  },

  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  columnTitle: {
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#b3b3b3",
    textTransform: "uppercase",
  },

  columnCount: {
    background: "#2a2a2a",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#0b7de0",
    boxShadow:
      "inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(60, 60, 60, 0.1)",
  },

  card: {
    background: "#2a2a2a",
    padding: "16px 18px",
    borderRadius: "14px",
    marginBottom: "12px",
    cursor: "grab",
    transition: "all 0.2s ease",
    color: "#ffffff",
    fontSize: "14px",
    userSelect: "none",
    boxShadow:
      "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)",
    position: "relative",
  },

  cardDragging: {
    transform: "scale(1.05) rotate(2deg)",
    boxShadow:
      "8px 8px 20px rgba(0, 0, 0, 0.6), -4px -4px 12px rgba(60, 60, 60, 0.1)",
    background: "#2f2f2f",
  },

  trashZone: {
    height: "100px",
    borderRadius: "16px",
    border: "2px dashed rgba(255, 68, 68, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#ff6b6b",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    background: "#242424",
    boxShadow:
      "inset 4px 4px 8px rgba(0, 0, 0, 0.3), inset -4px -4px 8px rgba(60, 60, 60, 0.05)",
  },

  trashActive: {
    background: "rgba(255, 68, 68, 0.08)",
    border: "2px dashed rgba(255, 68, 68, 0.6)",
    transform: "scale(1.02)",
    boxShadow:
      "inset 6px 6px 12px rgba(255, 68, 68, 0.1), 0 0 30px rgba(255, 68, 68, 0.15)",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#666666",
    fontSize: "14px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
    opacity: 0.3,
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
    setTasks((prev) => [...prev, created]);
    setNewTask("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateTask();
    }
  };

  const onDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
    setTrashActive(false);
  };

  const onDropColumn = async (status: string) => {
    if (!draggedTask) return;

    const updated = await moveTask(draggedTask.id, status);

    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const onDropTrash = async () => {
    if (!draggedTask) return;

    await deleteTask(draggedTask.id);

    setTasks((prev) => prev.filter((t) => t.id !== draggedTask.id));

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

  const getColumnConfig = (status: string) => {
    const configs: any = {
      todo: { emoji: "📋", color: "#0b7de0" },
      doing: { emoji: "⚡", color: "#f59e0b" },
      done: { emoji: "✓", color: "#10b981" },
    };
    return configs[status] || configs.todo;
  };

  const renderTasks = (status: string) => {
    const columnTasks = tasks.filter((t) => normalizeStatus(t.status) === status);

    if (columnTasks.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>{getColumnConfig(status).emoji}</div>
          <div>No tasks yet</div>
        </div>
      );
    }

    return columnTasks.map((t) => (
      <div
        key={t.id}
        style={{
          ...styles.card,
          ...(draggedTask?.id === t.id ? styles.cardDragging : {}),
        }}
        draggable
        onDragStart={() => onDragStart(t)}
        onDragEnd={onDragEnd}
      >
        {t.title}
      </div>
    ));
  };

  const columnStyle = (name: string) => ({
    ...styles.column,
    boxShadow:
      dragOverColumn === name
        ? `inset 0 0 0 2px ${getColumnConfig(name).color}, 8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.05)`
        : "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.05)",
    transform: dragOverColumn === name ? "scale(1.01)" : "scale(1)",
  });

  const getTaskCount = (status: string) =>
    tasks.filter((t) => normalizeStatus(t.status) === status).length;

  return (
    <div style={styles.container}>
      <div>
        <div style={styles.header}>Project Board</div>
        <div style={styles.subheader}>{tasks.length} total tasks</div>
      </div>

      <div style={styles.createBar}>
        <input
          style={styles.input}
          placeholder="Create a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={(e) => {
            e.target.style.boxShadow =
              "inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(60, 60, 60, 0.1), 0 0 0 2px #0b7de0";
          }}
          onBlur={(e) => {
            e.target.style.boxShadow =
              "inset 6px 6px 12px rgba(0, 0, 0, 0.4), inset -6px -6px 12px rgba(60, 60, 60, 0.1)";
          }}
        />

        <button
          style={styles.button}
          onClick={handleCreateTask}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "8px 10px 16px rgba(0, 0, 0, 0.5), -6px -6px 12px rgba(60, 60, 60, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 4px 4px 8px rgba(0, 0, 0, 0.4), inset -4px -4px 8px rgba(60, 60, 60, 0.05)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow =
              "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)";
          }}
        >
          Add Task
        </button>
      </div>

      <div style={styles.board}>
        {["todo", "doing", "done"].map((col) => (
          <div
            key={col}
            style={columnStyle(col)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setDragOverColumn(col)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={() => onDropColumn(col)}
          >
            <div style={styles.columnHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>
                  {getColumnConfig(col).emoji}
                </span>
                <div style={styles.columnTitle}>{col}</div>
              </div>
              <div style={styles.columnCount}>{getTaskCount(col)}</div>
            </div>
            {renderTasks(col)}
          </div>
        ))}
      </div>

      <div
        style={{
          ...styles.trashZone,
          ...(trashActive ? styles.trashActive : {}),
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setTrashActive(true);
        }}
        onDragLeave={() => setTrashActive(false)}
        onDrop={onDropTrash}
      >
        <span style={{ fontSize: "24px" }}>🗑️</span>
        <span>Drop here to delete task</span>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input::placeholder {
            color: #666666;
          }
        `}
      </style>
    </div>
  );
}