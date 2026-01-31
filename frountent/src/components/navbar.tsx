import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav style={{ padding: 10, background: "#222", color: "#fff" }}>
      <Link to="/dashboard" style={{ color: "#fff", marginRight: 10 }}>
        Dashboard
      </Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

