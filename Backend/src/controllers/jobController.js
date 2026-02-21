// const db = require("../models/db");

// exports.matchJobs = (req, res) => {
//   const { userId } = req.params;

//   db.query(
//     "SELECT skills FROM resumes WHERE user_id = ?",
//     [userId],
//     (err, result) => {
//       if (err || result.length === 0) {
//         return res.status(404).json({ message: "Resume not found" });
//       }

//       const skills = result[0].skills
//         .split(",")
//         .map(s => s.trim().toLowerCase());

//       const conditions = skills.map(() => "LOWER(skills) LIKE ?").join(" OR ");
//       const values = skills.map(s => `%${s}%`);

//       const sql = `SELECT * FROM jobs WHERE ${conditions}`;

//       db.query(sql, values, (err, jobs) => {
//         if (err) return res.status(500).json(err);
//         res.json(jobs);
//       });
//     }
//   );
// };
const db = require("../models/db");

exports.addJob = (req, res) => {
  const { recruiter_id, title, skills, description } = req.body;

  if (!title || !skills || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO jobs (recruiter_id, title, skills, description)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [recruiter_id || null, title, skills, description],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Job added successfully" });
    }
  );
};

exports.getAllJobs = (req, res) => {
  db.query(
    "SELECT id, recruiter_id, title, skills, description FROM jobs ORDER BY id DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.matchJobs = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT skills FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1",
    [userId],
    (err, resumeResult) => {
      if (err) return res.status(500).json(err);

      if (!resumeResult || resumeResult.length === 0) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const resumeSkills = resumeResult[0].skills
        .toLowerCase()
        .split(/[,\s]+/)
        .filter(Boolean);

      if (resumeSkills.length === 0) {
        return res.json([]);
      }

      const conditions = resumeSkills
        .map(() => "LOWER(skills) LIKE ?")
        .join(" OR ");
      const values = resumeSkills.map((s) => `%${s}%`);

      const sql = `
        SELECT id, title, skills, description
        FROM jobs
        WHERE ${conditions}
      `;

      db.query(sql, values, (jobErr, jobs) => {
        if (jobErr) return res.status(500).json(jobErr);
        res.json(jobs);
      });
    }
  );
};
