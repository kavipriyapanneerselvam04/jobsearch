import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "../ui/sidebar.css";

function UserSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -70, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / Title */}
      <div className="sidebar-header">
        <div className="avatar">👤</div>
        <h3>User Panel</h3>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        <button
          className={location.pathname === "/user" ? "active" : ""}
          onClick={() => navigate("/user")}
        >
          💼 <span>Jobs</span>
        </button>

        <button
          className={location.pathname === "/profile" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          👤 <span>Profile</span>
        </button>

        <button
          className={location.pathname === "/settings" ? "active" : ""}
          onClick={() => navigate("/settings")}
        >
          ⚙ <span>Settings</span>
        </button>
      </div>

      {/* Logout */}
      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>
    </motion.aside>
  );
}

export default UserSidebar;
