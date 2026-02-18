import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../ui/auth.css";

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

      // ✅ STORE USER DETAILS
      localStorage.setItem("userId", id);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("role", role);

      // ✅ REDIRECT BASED ON ROLE
      if (role === "ADMIN") navigate("/admin");
      else if (role === "RECRUITER") navigate("/recruiter");
      else navigate("/user");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

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

      <p>
        New user? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
