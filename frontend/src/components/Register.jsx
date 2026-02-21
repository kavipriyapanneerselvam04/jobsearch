import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../ui/auth.css";
import "../ui/common.css";
import GoogleSignInButton from "./GoogleSignInButton";
import logo from "../logo.svg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/api/users/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Email already registered");
      } else {
        alert("Registration failed");
      }
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
        <p>Create your account and start applying today</p>
      </header>

      <div className="auth-container">
        <h2>Register</h2>
        <p className="auth-subtitle">Join as user or recruiter</p>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="RECRUITER">Recruiter</option>
        </select>

        <div className="auth-btn-group">
          <button onClick={handleRegister}>Register</button>
          <button className="secondary-auth-btn" onClick={() => navigate("/")}>
            Back to Login
          </button>
        </div>

        <div className="auth-divider"><span>or</span></div>
        <GoogleSignInButton role={role} />
      </div>

      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} JobSphere</span>
        <span>Secure sign-in and smart hiring</span>
      </footer>
    </div>
  );
}

export default Register;
