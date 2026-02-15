import { useState } from "react";
import { registerUser, loginUser } from "../services/api";

export default function Register({ onBackToLogin, onRegisterSuccess }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      // 1️⃣ Create user
      await registerUser(email, password);

      // 2️⃣ Auto login (important)
      const data = await loginUser(email, password);

      // 3️⃣ Store token
      localStorage.setItem("token", data.access_token);

      // 4️⃣ Go to dashboard
      onRegisterSuccess();

    } catch (err: any) {
      setError("Registration failed or user already exists");
    }
  };

  return (
    <div
      style={{
        color: "white",
        padding: 40,
        maxWidth: 400,
        margin: "100px auto",
        background: "rgba(30, 41, 59, 0.6)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2 style={{ marginBottom: 10 }}>Create Account</h2>

      <input
        style={{
          padding: 12,
          borderRadius: 8,
          border: "1px solid #1f2933",
          background: "#020617",
          color: "white",
        }}
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        style={{
          padding: 12,
          borderRadius: 8,
          border: "1px solid #1f2933",
          background: "#020617",
          color: "white",
        }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        style={{
          padding: 12,
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg, #3b82f6, #2563eb)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={handleRegister}
      >
        Register
      </button>

      {error && (
        <p style={{ color: "#ef4444", fontSize: 14 }}>
          {error}
        </p>
      )}

      <p
        style={{
          cursor: "pointer",
          marginTop: 10,
          color: "#94a3b8",
          fontSize: 14,
        }}
        onClick={onBackToLogin}
      >
        ← Continue with Login
      </p>
    </div>
  );
}
