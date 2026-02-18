const db = require("../models/db");

// ---------- REGISTER ----------
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, password, role], err => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Register failed" });
    }

    res.json({ message: "Registered successfully" });
  });
};

// ---------- LOGIN ----------
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, name, email, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ user: results[0] });
  });
};

// ---------- GET ALL USERS ----------
exports.getAllUsers = (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM users",
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching users" });
      }
      res.json(result);
    }
  );
};

// ---------- DELETE USER ----------
exports.deleteUser = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    err => {
      if (err) {
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "User deleted successfully" });
    }
  );
};
