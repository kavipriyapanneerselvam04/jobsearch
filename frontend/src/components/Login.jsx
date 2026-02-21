import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../ui/auth.css";
import GoogleSignInButton from "./GoogleSignInButton";
import logo from "../logo.svg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await api.post("/api/users/login", {
        email,
        password,
      });

      const { id, name, email: userEmail, role } = res.data.user;

      localStorage.setItem("userId", id);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("role", role);

      if (role === "ADMIN") navigate("/admin");
      else if (role === "RECRUITER") navigate("/recruiter");
      else navigate("/user");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop-shape auth-backdrop-shape--one" />
      <div className="auth-backdrop-shape auth-backdrop-shape--two" />

      <header className="auth-hero">
        <div className="auth-logo-ring">
          <img src={logo} alt="JobSphere Logo" className="auth-logo-img" />
        </div>
        <h1>JobSphere</h1>
        <p>Smart Resume and Job Matching Platform</p>
      </header>

      <div className="auth-container">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back. Continue your job journey.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <div className="auth-divider"><span>or</span></div>
        <GoogleSignInButton role="USER" />

        <p>
          New user? <a href="/register">Register here</a>
        </p>
      </div>

      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} JobSphere</span>
        <span>Built for students and recruiters</span>
      </footer>
    </div>
  );
}

export default Login;

