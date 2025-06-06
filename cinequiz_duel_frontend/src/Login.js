import React, { useState } from "react";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * Login component for CineQuiz Duel (username-only, no backend).
 * Accepts an `onLogin` callback from the parent to set authenticated state.
 * Styled to match the project's theme variables and color palette.
 * @param {{onLogin: function}} props 
 */
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  /** Handles form submission and notifies the parent when authentication passes. */
  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    setError("");
    // Simulate login: simply pass username to parent handler.
    onLogin({ username: username.trim() });
  }

  // Theme variables
  const COLORS = {
    primary: "#dffc03",
    secondary: "#fdf7f8",
    accent: "#0f3460",
    text: "#222"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.secondary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 6px 30px #0f34602c",
          maxWidth: 350,
          width: "100%"
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.accent,
            textAlign: "center",
            letterSpacing: 1
          }}
        >
          CineQuiz Duel
        </div>
        <div
          className="subtitle"
          style={{
            color: COLORS.primary,
            textAlign: "center",
            marginBottom: 16,
            fontWeight: 500
          }}
        >
          Movie Quiz Login
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <input
            className="input"
            placeholder="Username"
            style={{
              padding: "12px",
              border: `1px solid ${COLORS.primary}`,
              borderRadius: 6,
              fontSize: 16
            }}
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
          />
          <button
            type="submit"
            className="btn btn-large"
            style={{
              background: COLORS.primary,
              color: COLORS.text,
              marginTop: 8,
              fontWeight: 600,
              fontSize: 17
            }}
          >
            Log In
          </button>
          {error && <div style={{ color: "crimson", fontSize: 13 }}>{error}</div>}
        </form>
      </div>
      <footer style={{ marginTop: 40, fontSize: 13, color: "#666" }}>
        Demo app, no password needed.
      </footer>
    </div>
  );
}

export default Login;
