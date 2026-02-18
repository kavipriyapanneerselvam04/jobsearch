import { useState } from "react";
import api from "../services/api";
import "../ui/dashboard.css";
import "../ui/common.css";

function RecruiterDashboard() {
  const recruiterId = localStorage.getItem("userId");

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const postJob = async () => {
    try {
      await api.post("/api/jobs/add", {
        recruiter_id: recruiterId,
        title,
        skills,
        description
      });

      alert("Job posted successfully ✅");

      // Reset fields
      setTitle("");
      setSkills("");
      setDescription("");
      setCandidates([]);
      setSearched(false);

    } catch {
      alert("Failed to post job");
    }
  };

  const viewMatches = async () => {
    setLoading(true);
    setSearched(true);

    try {
      const res = await api.get(`/api/jobs/match/${recruiterId}`);
      setCandidates(res.data);
    } catch {
      alert("Failed to fetch matched candidates");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <h2>Recruiter Dashboard</h2>

      {/* Add Job Section */}
      <div className="form-grid">
        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Required Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="btn-group">
        <button onClick={postJob}>Post Job</button>
        <button onClick={viewMatches}>View Matched Candidates</button>
        <button className="danger" onClick={logout}>Logout</button>
      </div>

      {/* Matched Candidates Section */}
      <h3>Matched Candidates</h3>

      {loading && <p className="info">🔍 Searching matching candidates...</p>}

      {!loading && searched && candidates.length === 0 && (
        <div className="empty-state">
          <p>❌ No candidates matched yet</p>
          <small>Wait for users to upload resumes or adjust job skills</small>
        </div>
      )}

      <div className="job-grid">
        {candidates.map((user) => (
          <div className="job-card" key={user.id}>
            <h4>{user.name}</h4>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Skills:</b> {user.skills}</p>
            <p><b>Experience:</b> {user.experience} years</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
