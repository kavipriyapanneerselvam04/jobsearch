const db = require("../models/db");

exports.matchJobs = (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT skills FROM resumes WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(404).json({ message: "Resume not found" });
      }

      const skills = result[0].skills
        .split(",")
        .map(s => s.trim().toLowerCase());

      const conditions = skills.map(() => "LOWER(skills) LIKE ?").join(" OR ");
      const values = skills.map(s => `%${s}%`);

      const sql = `SELECT * FROM jobs WHERE ${conditions}`;

      db.query(sql, values, (err, jobs) => {
        if (err) return res.status(500).json(err);
        res.json(jobs);
      });
    }
  );
};
