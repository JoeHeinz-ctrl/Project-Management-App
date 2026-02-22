import { useEffect, useState, useRef } from "react";
import { fetchProjects, createProject, renameProject, deleteProject } from "../services/api";

export default function ProjectBoard({ onSelect }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // inline-rename state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // hover state per card
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // custom modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  async function loadProjects() {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // focus the rename input when it appears
  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  async function handleCreateProject() {
    if (!title.trim()) return;
    try {
      await createProject(title);
      setTitle("");
      loadProjects();
    } catch (err: any) {
      console.error(err);
      setAlertMessage(err.message || "Failed to create project");
    }
  }

  function startEdit(e: React.MouseEvent, p: any) {
    e.stopPropagation(); // don't navigate into the project
    setEditingId(p.id);
    setEditingTitle(p.title);
  }

  async function commitRename(id: number) {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const updated = await renameProject(id, editingTitle.trim());
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to rename project");
    } finally {
      setEditingId(null);
    }
  }

  function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation(); // don't navigate into the project
    setDeleteConfirmId(id);
  }

  async function confirmDeleteProject() {
    if (deleteConfirmId === null) return;
    try {
      await deleteProject(deleteConfirmId);
      setProjects((prev) => prev.filter((p) => p.id !== deleteConfirmId));
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to delete project");
    } finally {
      setDeleteConfirmId(null);
    }
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📁 My Projects</h2>

      {/* Create bar */}
      <div style={styles.createBar}>
        <input
          style={styles.input}
          placeholder="New project title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
        />
        <button
          style={styles.createBtn}
          onClick={handleCreateProject}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1a8cf0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0b7de0")}
        >
          + New Project
        </button>
      </div>

      {/* Project list */}
      <div style={styles.list}>
        {projects.length === 0 && (
          <p style={{ color: "#666", marginTop: 20 }}>No projects yet. Create one above!</p>
        )}

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.card,
              background: hoveredId === p.id && editingId !== p.id ? "#2c2c2c" : "#242424",
              boxShadow:
                hoveredId === p.id && editingId !== p.id
                  ? "8px 8px 20px rgba(0,0,0,0.6), -4px -4px 12px rgba(60,60,60,0.08), inset 0 0 0 1px rgba(11,125,224,0.25)"
                  : "6px 6px 14px rgba(0,0,0,0.5), -4px -4px 10px rgba(60,60,60,0.05)",
              cursor: editingId === p.id ? "default" : "pointer",
            }}
            onClick={() => editingId !== p.id && onSelect(p)}
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Project name / rename input */}
            <div style={styles.cardLeft}>
              <span style={styles.projectEmoji}>📂</span>

              {editingId === p.id ? (
                <input
                  ref={editInputRef}
                  style={styles.renameInput}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(p.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onBlur={() => commitRename(p.id)}
                />
              ) : (
                <span style={styles.projectTitle}>{p.title}</span>
              )}
            </div>

            {/* Action buttons — always visible on hover or editing */}
            <div
              style={{
                ...styles.actions,
                opacity: hoveredId === p.id || editingId === p.id ? 1 : 0,
              }}
            >
              {/* Edit / confirm icon */}
              <button
                title={editingId === p.id ? "Confirm rename" : "Rename project"}
                style={{
                  ...styles.iconBtn,
                  background: editingId === p.id ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)",
                  color: editingId === p.id ? "#10b981" : "#0b7de0",
                }}
                onClick={(e) =>
                  editingId === p.id ? commitRename(p.id) : startEdit(e, p)
                }
                onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  editingId === p.id ? "rgba(16,185,129,0.28)" : "rgba(11,125,224,0.25)")
                }
                onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  editingId === p.id ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)")
                }
              >
                {editingId === p.id ? "✓" : "✏️"}
              </button>

              {/* Delete icon */}
              <button
                title="Delete project"
                style={{
                  ...styles.iconBtn,
                  background: "rgba(255,68,68,0.1)",
                  color: "#ff6b6b",
                }}
                onClick={(e) => handleDelete(e, p.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,68,68,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,68,68,0.1)")
                }
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        input::placeholder { color: #555; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Delete Project</h3>
            <p style={styles.modalText}>Are you sure you want to delete this project and all its tasks? This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button
                style={styles.btnSecondary}
                onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >Cancel</button>
              <button
                style={styles.btnDanger}
                onClick={confirmDeleteProject}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Delete</button>
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

    </div>
  );
}

const styles: any = {
  page: {
    padding: "40px",
    height: "100vh",
    background: "#1a1a1a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "28px",
    letterSpacing: "-0.5px",
    flexShrink: 0,
  },
  createBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#242424",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxShadow: "inset 5px 5px 10px rgba(0,0,0,0.4), inset -5px -5px 10px rgba(60,60,60,0.08)",
  },
  createBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    background: "#0b7de0",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.2s",
    boxShadow: "6px 6px 12px rgba(0,0,0,0.4)",
    flexShrink: 0,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
    overflowY: "auto",
    paddingRight: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderRadius: "16px",
    transition: "background 0.2s, box-shadow 0.2s",
    userSelect: "none",
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  projectEmoji: {
    fontSize: "20px",
    flexShrink: 0,
  },
  projectTitle: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#f0f0f0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  renameInput: {
    flex: 1,
    background: "#1a1a1a",
    border: "1px solid #0b7de0",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "500",
    padding: "6px 10px",
    outline: "none",
    boxShadow: "0 0 0 3px rgba(11,125,224,0.15)",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexShrink: 0,
    marginLeft: "16px",
    transition: "opacity 0.15s ease",
  },
  iconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    fontWeight: "700",
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
