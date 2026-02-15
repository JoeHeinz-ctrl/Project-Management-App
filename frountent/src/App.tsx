import { useEffect, useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";

export default function App() {
  const [screen, setScreen] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setScreen("dashboard");
  }, []);

  if (screen === "login") {
    return (
      <Login
        onLogin={() => setScreen("dashboard")}
        onShowRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return (
      <Register
        onBackToLogin={() => setScreen("login")}
        onRegisterSuccess={() => setScreen("dashboard")}
      />
    );
  }

  return <Dashboard />;
}
