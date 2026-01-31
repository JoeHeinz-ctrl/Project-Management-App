import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getProjects } from "../services/projectService";

interface Project {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />

        <main style={{ padding: "20px", flex: 1 }}>
          <h2>Dashboard</h2>

          {loading && <p>Loading projects...</p>}

          {!loading && projects.length === 0 && <p>No projects found.</p>}

          {projects.map((project) => (
            <div key={project.id} style={styles.card}>
              <Link to={`/projects/${project.id}`}>
                <strong>{project.name}</strong>
              </Link>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    background: "#ffffff",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
};

