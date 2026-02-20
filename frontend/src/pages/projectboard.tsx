import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "../services/api";

export default function ProjectBoard({ onSelect }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  


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

  async function handleCreateProject() {
    if (!title.trim()) return;

    try {
      await createProject(title);
      setTitle("");
      loadProjects(); // refresh list
    } catch (err) {
      alert("Failed to create project");
    }
  }

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>Project Board</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: 10,
            marginRight: 10,
            width: 250,
          }}
        />


        <button onClick={handleCreateProject}>
          Create Project
        </button>
      </div>

      <div>
        {projects.length === 0 && <p>No projects yet</p>}

        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 10,
              marginBottom: 10,
              background: "#1e1e1e",
              cursor: "pointer",
            }}
            onClick={() => onSelect(p)}
          >
            {p.title}
          </div>
        ))}
      </div>
    </div>
  );
}

