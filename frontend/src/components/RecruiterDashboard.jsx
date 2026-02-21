import { useEffect, useState } from "react";
import api from "../services/api";
import "../ui/dashboard.css";
import "../ui/common.css";

function RecruiterDashboard() {
  const recruiterId = localStorage.getItem("userId");

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [reasonById, setReasonById] = useState({});

  const fetchApplications = async () => {
    if (!recruiterId) return;

    setLoadingApplications(true);
    try {
      const res = await api.get(`/api/jobs/applications/recruiter/${recruiterId}`);
      setApplications(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load applications");
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [recruiterId]);

  const postJob = async () => {
    if (!title.trim() || !skills.trim() || !description.trim()) {
      alert("Please fill all job fields");
      return;
    }

    try {
      await api.post("/api/jobs/add", {
        recruiter_id: recruiterId,
        title: title.trim(),
        skills: skills.trim(),
        description: description.trim(),
      });

      alert("Job posted successfully");
      setTitle("");
      setSkills("");
      setDescription("");
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to post job");
    }
  };

  const updateApplication = async (applicationId, status) => {
    const reason = (reasonById[applicationId] || "").trim();

    if (status === "DECLINED" && !reason) {
      alert("Please enter reason before declining.");
      return;
    }

    try {
      setProcessingId(applicationId);

      const res = await api.put(`/api/jobs/applications/${applicationId}/status`, {
        recruiter_id: Number(recruiterId),
        status,
        status_reason: status === "DECLINED" ? reason : "",
      });

      alert(res.data?.message || "Application status updated");
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update application");
    } finally {
      setProcessingId(null);
    }
  };

  const onReasonChange = (applicationId, value) => {
    setReasonById((prev) => ({ ...prev, [applicationId]: value }));
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard recruiter-page">
      <h2>Recruiter Dashboard</h2>

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
        <button onClick={fetchApplications}>Refresh Applications</button>
        <button className="danger" onClick={logout}>Logout</button>
      </div>

      <h3>Received Applications</h3>

      {loadingApplications && <p className="info">Loading applications...</p>}

      {!loadingApplications && applications.length === 0 && (
        <div className="empty-state">
          <p>No applications received yet</p>
          <small>Applications will appear here once candidates apply.</small>
        </div>
      )}

      <div className="application-grid">
        {applications.map((app) => {
          const statusClass =
            app.status === "ACCEPTED"
              ? "status-accepted"
              : app.status === "DECLINED"
              ? "status-declined"
              : "status-pending";

          return (
            <div className="application-card" key={app.id}>
              <div className="application-top">
                <h4>{app.name}</h4>
                <span className={`status-pill ${statusClass}`}>{app.status}</span>
              </div>

              <p><b>Job:</b> {app.job_title}</p>
              <p><b>Email:</b> {app.email}</p>
              <p><b>Phone:</b> {app.phone}</p>
              <p><b>Location:</b> {app.location}</p>
              <p><b>Experience:</b> {app.experience_years} year(s)</p>
              <p><b>Work Mode:</b> {app.work_mode || "-"}</p>
              <p><b>Notice Period:</b> {app.notice_period || "-"}</p>
              <p><b>Expected Salary:</b> {app.expected_salary || "-"}</p>
              {app.cover_letter ? <p><b>Cover Letter:</b> {app.cover_letter}</p> : null}
              {app.status_reason ? <p><b>Reason:</b> {app.status_reason}</p> : null}

              {app.status === "PENDING" && (
                <>
                  <textarea
                    className="decision-note"
                    rows={2}
                    placeholder="Reason (required only for decline)"
                    value={reasonById[app.id] || ""}
                    onChange={(e) => onReasonChange(app.id, e.target.value)}
                  />

                  <div className="decision-actions">
                    <button
                      className="accept-btn"
                      disabled={processingId === app.id}
                      onClick={() => updateApplication(app.id, "ACCEPTED")}
                    >
                      {processingId === app.id ? "Please wait..." : "Accept"}
                    </button>

                    <button
                      className="decline-btn"
                      disabled={processingId === app.id}
                      onClick={() => updateApplication(app.id, "DECLINED")}
                    >
                      {processingId === app.id ? "Please wait..." : "Decline"}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
