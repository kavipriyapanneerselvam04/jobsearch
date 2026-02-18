const db = require("../models/db");
const multer = require("multer");
const path = require("path");

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.endsWith(".pdf")) {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
}).single("resume");

// ---------- UPLOAD OR UPDATE RESUME ----------
exports.uploadResume = (req, res) => {
  upload(req, res, err => {
    if (err) return res.status(400).json({ message: err.message });

    const { user_id, skills, experience } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Resume file missing" });
    }

    const sql = `
      INSERT INTO resumes (user_id, skills, experience, resume_file)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        skills = VALUES(skills),
        experience = VALUES(experience),
        resume_file = VALUES(resume_file)
    `;

    db.query(
      sql,
      [user_id, skills, experience, req.file.filename],
      err => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Resume uploaded / updated successfully" });
      }
    );
  });
};


// ---------- GET USER RESUME ----------
// exports.getResumeByUser = (req, res) => {
//   const { userId } = req.params;

//   db.query(
//     "SELECT * FROM resumes WHERE user_id = ? LIMIT 1",
//     [userId],
//     (err, results) => {
//       if (err) return res.status(500).json(err);
//       res.json(results[0] || null);
//     }
//   );
// };
exports.getResumeByUser = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results[0] || null);
    }
  );
};
