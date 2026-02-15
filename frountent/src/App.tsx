import { useEffect, useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

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

  return <Dashboard />;
}
