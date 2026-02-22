import { useEffect, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask, renameTask } from "../services/api";


const styles: any = {
  container: {
    padding: "40px",
    background: "#1a1a1a",
    height: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#242424",
    color: "#b3b3b3",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "all 0.2s ease",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
  },

  header: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
    color: "#ffffff",
  },

  subheader: {
    fontSize: "13px",
    color: "#b3b3b3",
    marginBottom: "16px",
  },

  addBtn: {
    background: "transparent",
    border: "none",
    color: "#b3b3b3",
    fontSize: "16px",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },

  taskDeleteBtn: {
    background: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  taskEditBtn: {
    background: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    display: "flex",
    gap: "16px",
    flex: 1,
    overflow: "hidden",
    marginBottom: "12px",
  },

  column: {
    flex: 1,
    background: "#242424",
    padding: "20px 10px 10px 10px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    boxShadow:
      "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.05)",
    overflow: "hidden",
  },

  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px",
    padding: "0 10px 16px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    flexShrink: 0,
  },

  taskList: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    display: "flex",
    flexDirection: "column",
    padding: "10px 10px 20px 10px",
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
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "8px",
    cursor: "grab",
    transition: "all 0.2s ease",
    color: "#ffffff",
    fontSize: "13px",
    userSelect: "none",
    boxShadow:
      "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)",
    position: "relative",
    flexShrink: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardDragging: {
    transform: "scale(1.05)",
    boxShadow:
      "8px 8px 20px rgba(0, 0, 0, 0.6), -4px -4px 12px rgba(60, 60, 60, 0.1)",
    background: "#2f2f2f",
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

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease",
  },
  modalContent: {
    background: "#242424",
    padding: "32px",
    borderRadius: "20px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 1px 1px 0px rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#fff",
    margin: 0,
  },
  modalText: {
    fontSize: "15px",
    color: "#b3b3b3",
    margin: 0,
    lineHeight: "1.5",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  modalInput: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#1a1a1a",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(60,60,60,0.05)",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "#0b7de0",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
    transition: "all 0.2s ease",
  },
  btnDanger: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "#ff4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
    transition: "all 0.2s ease",
  },
  btnSecondary: {
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#b3b3b3",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
};

export default function Dashboard({ project, backToProjects }: any) {

  const [tasks, setTasks] = useState<any[]>([]);
  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Custom Modal States
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createPromptCol, setCreatePromptCol] = useState<string | null>(null);
  const [createTaskTitle, setCreateTaskTitle] = useState("");
  const [editTaskData, setEditTaskData] = useState<{ id: number, title: string } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!project) {
      setTasks([]);
      return;
    }
    fetchTasks(project.id)
      .then(setTasks)
      .catch(() => setTasks([]));
  }, [project]);

  const promptCreateTask = (status: string) => {
    setCreatePromptCol(status);
    setCreateTaskTitle("");
  };

  const confirmCreateTask = async () => {
    if (!createPromptCol) return;
    const title = createTaskTitle.trim();
    if (!title) {
      setCreatePromptCol(null);
      return;
    }
    if (!project) {
      setAlertMessage("Select a project first");
      setCreatePromptCol(null);
      return;
    }
    try {
      const created = await createTask(title, project.id, createPromptCol.toLowerCase());
      setTasks((prev) => [...prev, created]);
    } catch (err: any) {
      setAlertMessage("Failed to create task");
    } finally {
      setCreatePromptCol(null);
    }
  };

  const onClickDeleteTask = (e: React.MouseEvent, taskId: number) => {
    e.stopPropagation();
    setDeleteConfirmId(taskId);
  };

  const confirmDeleteTask = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteTask(deleteConfirmId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    } catch (err: any) {
      setAlertMessage("Failed to delete task");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const promptEditTask = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    setEditTaskData({ id: task.id, title: task.title });
  };

  const confirmEditTask = async () => {
    if (!editTaskData) return;
    const title = editTaskData.title.trim();
    if (!title) {
      setEditTaskData(null);
      return;
    }
    try {
      const updated = await renameTask(editTaskData.id, title);
      setTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updated : t)));
    } catch (err: any) {
      setAlertMessage("Failed to edit task");
    } finally {
      setEditTaskData(null);
    }
  };

  const onDragStart = (task: any) => {
    setDraggedTask(task);
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const onDropColumn = async (status: string) => {
    if (!draggedTask) return;
    const updated = await moveTask(draggedTask.id, status);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setDraggedTask(null);
    setDragOverColumn(null);
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
        <span style={{ flex: 1, paddingRight: "8px" }}>{t.title}</span>
        <div style={{ display: "flex", gap: "2px" }}>
          <button
            style={styles.taskEditBtn}
            title="Edit task"
            onClick={(e) => promptEditTask(e, t)}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0b7de0"; e.currentTarget.style.background = "rgba(11, 125, 224, 0.1)"; e.currentTarget.style.borderRadius = "6px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
          >
            ✏️
          </button>
          <button
            style={styles.taskDeleteBtn}
            title="Delete task"
            onClick={(e) => onClickDeleteTask(e, t.id)}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6b6b"; e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"; e.currentTarget.style.borderRadius = "6px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
          >
            🗑️
          </button>
        </div>
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
      {/* hide native scrollbars but keep scrollable */}
      <style>{`
        /* Chrome, Safari, Edge */
        *::-webkit-scrollbar { display: none; }
        /* Firefox */
        * { scrollbar-width: none; }
      `}</style>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Delete Task</h3>
            <p style={styles.modalText}>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button
                style={styles.btnSecondary}
                onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >Cancel</button>
              <button
                style={styles.btnDanger}
                onClick={confirmDeleteTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTaskData !== null && (
        <div style={styles.modalOverlay} onClick={() => setEditTaskData(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Task</h3>
            <input
              style={styles.modalInput}
              autoFocus
              placeholder="What needs to be done?"
              value={editTaskData.title}
              onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") confirmEditTask(); if (e.key === "Escape") setEditTaskData(null); }}
            />
            <div style={styles.modalButtons}>
              <button
                style={styles.btnSecondary}
                onClick={() => setEditTaskData(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >Cancel</button>
              <button
                style={styles.btnPrimary}
                onClick={confirmEditTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createPromptCol !== null && (
        <div style={styles.modalOverlay} onClick={() => setCreatePromptCol(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>New Task ({createPromptCol})</h3>
            <input
              style={styles.modalInput}
              autoFocus
              placeholder="What needs to be done?"
              value={createTaskTitle}
              onChange={(e) => setCreateTaskTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmCreateTask(); if (e.key === "Escape") setCreatePromptCol(null); }}
            />
            <div style={styles.modalButtons}>
              <button
                style={styles.btnSecondary}
                onClick={() => setCreatePromptCol(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >Cancel</button>
              <button
                style={styles.btnPrimary}
                onClick={confirmCreateTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Error Modal */}
      {alertMessage !== null && (
        <div style={styles.modalOverlay} onClick={() => setAlertMessage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Notice</h3>
            <p style={styles.modalText}>{alertMessage}</p>
            <div style={styles.modalButtons}>
              <button
                style={styles.btnPrimary}
                onClick={() => setAlertMessage(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
              >OK</button>
            </div>
          </div>
        </div>
      )}

      <button
        style={styles.backBtn}
        onClick={backToProjects}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#2c2c2c"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "#242424"; }}
      >← Back to Projects</button>

      <div>
        <div style={styles.header}>{project ? project.title : "Project Board"}</div>
        <div style={styles.subheader}>{tasks.length} total tasks</div>
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={styles.columnCount}>{getTaskCount(col)}</div>
                <button
                  style={styles.addBtn}
                  title={`Add to ${col.toUpperCase()}`}
                  onClick={() => promptCreateTask(col.toUpperCase())}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#3a3a3a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "transparent"; }}
                >
                  +
                </button>
              </div>
            </div>
            <div style={styles.taskList}>
              {renderTasks(col)}
            </div>
          </div>
        ))}
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