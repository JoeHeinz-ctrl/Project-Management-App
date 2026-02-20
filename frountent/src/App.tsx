import { useEffect, useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import ProjectBoard from "./pages/projectboard";
import Dashboard from "./pages/dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  // NOT LOGGED IN
  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onBack={() => setShowRegister(false)} />;
    }

    return (
      <Login
        onLogin={() => setIsAuthenticated(true)}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  // LOGGED IN BUT NO PROJECT SELECTED
  if (!selectedProject) {
    return (
      <ProjectBoard
        setSelectedProject={setSelectedProject}
      />
    );
  }

  // PROJECT SELECTED → DASHBOARD
  return (
    <Dashboard
      project={selectedProject}
      backToProjects={() => setSelectedProject(null)}
    />
  );
}