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

  const Header = () => (
    <div className="app-header">
      
      <span>Synq</span>
    </div>
  );

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <>
          <Header />
          <Register onBack={() => setShowRegister(false)} />
        </>
      );
    }

    return (
      <>
        <Header />
        <Login
          onLogin={() => setIsAuthenticated(true)}
          onShowRegister={() => setShowRegister(true)}
        />
      </>
    );
  }

  if (!selectedProject) {
    return (
      <>
        <Header />
        <ProjectBoard onSelect={setSelectedProject} />
      </>
    );
  }

  return (
    <>
      <Header />
      <Dashboard
        project={selectedProject}
        backToProjects={() => setSelectedProject(null)}
      />
    </>
  );
}