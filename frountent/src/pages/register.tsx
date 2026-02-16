import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register({ onBack }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    try {
      await registerUser(name, email, password);
      onBack(); // return to login
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div style={{ color: "white", padding: 40 }}>
      <h2>Create Account</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p
        style={{ cursor: "pointer", marginTop: 20 }}
        onClick={onBack}
      >
        ← Back to Login
      </p>
    </div>
  );
}
