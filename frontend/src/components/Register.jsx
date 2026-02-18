import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../ui/auth.css";
import "../ui/common.css";

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
    <div className="auth-container">
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="USER">User</option>
        <option value="RECRUITER">Recruiter</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
