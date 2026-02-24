import { useEffect, useState } from "react";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import ProjectBoard from "./pages/projectboard";
import Dashboard from "./pages/dashboard";

type Screen = "landing" | "login" | "register" | "board";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setScreen("board");
    }
  }, []);

  // ── already logged in ───────────────────────────────────────────────────
  if (isAuthenticated) {
    if (!selectedProject) {
      return <ProjectBoard onSelect={setSelectedProject} />;
    }
    return (
      <Dashboard
        project={selectedProject}
        backToProjects={() => setSelectedProject(null)}
      />
    );
  }

  // ── not logged in ───────────────────────────────────────────────────────
  if (screen === "landing") {
    return <Landing onGetStarted={() => setScreen("login")} />;
  }

  if (screen === "register") {
    return <Register onBack={() => setScreen("login")} />;
  }

  // login screen
  return (
    <Login
      onLogin={() => {
        setIsAuthenticated(true);
        setScreen("board");
      }}
      onShowRegister={() => setScreen("register")}
    />
  );
}