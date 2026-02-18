import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import UserSidebar from "./UserSidebar";
import "../ui/dashboard.css";

function UserDashboard() {
  // ✅ FIX: get userId safely
  const userId = Number(localStorage.getItem("userId"));

  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState(0);
  const [file, setFile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);

  // ---------- UPLOAD RESUME ----------
  const uploadResume = async () => {
    if (!userId) return alert("User not logged in");
    if (!file) return alert("Select resume file");

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("skills", skills);
    formData.append("experience", Number(experience));
    formData.append("resume", file);

    try {
      await api.post("/api/resume/upload", formData);
      alert("Resume uploaded / updated successfully");
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    }
  };

  // ---------- MATCH JOBS ----------
  const matchJobs = async () => {
    if (!userId) return alert("User not logged in");

    try {
      const res = await api.get(`/api/jobs/match/${userId}`);
      setMatchedJobs(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Resume not found. Upload resume first.");
    }
  };

  return (
    <div className="dashboard-layout">
      <UserSidebar />

      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>User Dashboard</h2>

        {/* ---------- RESUME FORM ---------- */}
        <div className="form-card">
          <input
            placeholder="Skills (java, react, mysql)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <select
            value={experience}
            onChange={(e) => setExperience(Number(e.target.value))}
          >
            <option value="0">Fresher</option>
            <option value="1">1 Year</option>
            <option value="2">2+ Years</option>
          </select>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="btn-row">
            {/* <button onClick={uploadResume}>Upload Resume</button> */}
            <button onClick={uploadResume}>
  {file ? "Update Resume" : "Upload Resume"}
</button>

            <button onClick={matchJobs}>Match Jobs</button>
          </div>
        </div>

        {/* ---------- MATCHED JOBS ---------- */}
        <h2>Recommended Jobs</h2>

        {matchedJobs.length === 0 && <p>No jobs matched yet</p>}

        <div className="jobs-grid">
          {matchedJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p><b>Skills:</b> {job.skills}</p>
              <p><b>Experience:</b> {job.experience}+ year(s)</p>
              <p><b>Company:</b> {job.company}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;
