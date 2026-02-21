const db = require("../models/db");
const { sendEmail } = require("../utils/emailService");
const crypto = require("crypto");

let OAuth2Client = null;
try {
  ({ OAuth2Client } = require("google-auth-library"));
} catch (err) {
  OAuth2Client = null;
}

const googleClient = OAuth2Client
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID || undefined)
  : null;

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

    sendEmail({
      to: email,
      subject: "Welcome to JobSphere - Registration Successful",
      text: `Hi ${name}, welcome to JobSphere. Your registration is successful.`,
    }).catch(() => {});

    res.json({ message: "Registered successfully" });
  });
};

// ---------- GOOGLE AUTH ----------
exports.googleAuth = async (req, res) => {
  const { credential, role } = req.body;

  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }

  if (!googleClient) {
    return res.status(500).json({ message: "google-auth-library not installed in backend" });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured in backend" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || "Google User";

    if (!email) {
      return res.status(400).json({ message: "Unable to read email from Google account" });
    }

    const findSql = "SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1";

    db.query(findSql, [email], (findErr, existingRows) => {
      if (findErr) return res.status(500).json(findErr);

      if (existingRows.length > 0) {
        return res.json({ user: existingRows[0], message: "Logged in with Google" });
      }

      const finalRole = role === "RECRUITER" ? "RECRUITER" : "USER";
      const generatedPassword = `GOOGLE_${crypto.randomBytes(8).toString("hex")}`;
      const insertSql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(insertSql, [name, email, generatedPassword, finalRole], (insertErr, result) => {
        if (insertErr) {
          if (insertErr.code === "ER_DUP_ENTRY") {
            db.query(findSql, [email], (refetchErr, rows) => {
              if (refetchErr) return res.status(500).json(refetchErr);
              return res.json({ user: rows[0], message: "Logged in with Google" });
            });
            return;
          }

          return res.status(500).json(insertErr);
        }

        const user = {
          id: result.insertId,
          name,
          email,
          role: finalRole,
        };

        sendEmail({
          to: email,
          subject: "Welcome to JobSphere - Registration Successful",
          text: `Hi ${name}, welcome to JobSphere. Your registration is successful.`,
        }).catch(() => {});

        return res.json({ user, message: "Registered and logged in with Google" });
      });
    });
  } catch (err) {
    return res.status(401).json({ message: "Google sign-in verification failed" });
  }
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
  const userId = Number(req.params.id);

  const cleanupQueries = [
    "DELETE FROM applications WHERE user_id = ?",
    "DELETE FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE recruiter_id = ?)",
    "DELETE FROM resumes WHERE user_id = ?",
    "DELETE FROM jobs WHERE recruiter_id = ?",
    "DELETE FROM users WHERE id = ?",
  ];

  let index = 0;

  const runNext = () => {
    if (index >= cleanupQueries.length) {
      return res.json({ message: "Account deleted permanently" });
    }

    db.query(cleanupQueries[index], [userId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Delete failed", error: err.message });
      }

      index += 1;
      runNext();
    });
  };

  runNext();
};

const multer = require("multer");
const path = require("path");

// PROFILE PHOTO STORAGE
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/profile"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("photo");

// UPLOAD PROFILE PHOTO
exports.uploadProfilePhoto = (req, res) => {
  upload(req, res, err => {
    if (err) return res.status(400).json(err);

    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file" });

    db.query(
      "UPDATE users SET profile_photo=? WHERE id=?",
      [req.file.filename, userId],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ filename: req.file.filename });
      }
    );
  });
};
exports.getUserProfile = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      id, name, email, role,
      profile_photo, dob, father_name, phone, address
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};
exports.updateProfile = (req, res) => {
  const { id } = req.params;
  const { dob, father_name, phone, address } = req.body;

  // MySQL DATE must be YYYY-MM-DD or NULL (empty string causes 500)
  const normalizedDob =
    dob && /^\d{4}-\d{2}-\d{2}$/.test(dob) ? dob : null;

  const sql = `
    UPDATE users
    SET dob=?, father_name=?, phone=?, address=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      normalizedDob,
      father_name || null,
      phone || null,
      address || null,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json({ message: "Profile update failed", error: err.message });
      res.json({ message: "Profile updated" });
    }
  );
};
