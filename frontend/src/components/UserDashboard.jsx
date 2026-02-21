// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";
// import UserSidebar from "./UserSidebar";
// import "../ui/dashboard.css";

// function UserDashboard() {
//   const userId = Number(localStorage.getItem("userId"));
//   const navigate = useNavigate();

//   const [skills, setSkills] = useState("");
//   const [experience, setExperience] = useState(0);
//   const [file, setFile] = useState(null);
//   const [matchedJobs, setMatchedJobs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ---------------- UPLOAD / UPDATE RESUME ----------------
//   const uploadResume = async () => {
//     if (!file) {
//       alert("Please select a resume file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("skills", skills);
//     formData.append("experience", experience);
//     formData.append("resume", file);

//     try {
//       await api.post("/api/resume/upload", formData);
//       alert("✅ Resume uploaded / updated successfully");
//     } catch (err) {
//       alert("❌ Resume upload failed");
//     }
//   };

//   // ---------------- MATCH JOBS (ONLY ON BUTTON CLICK) ----------------
//   const matchJobs = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/jobs/match/${userId}`);
//       setMatchedJobs(res.data || []);
//     } catch (err) {
//       setMatchedJobs([]);
//       alert("Please upload resume first");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="dashboard-layout">
//       <UserSidebar />

//       <motion.div
//         className="dashboard-content"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {/* UPLOAD CARD */}
//         <div className="form-card">
//           <h2>Resume & Job Matching</h2>

//           <input
//             type="text"
//             placeholder="Skills (Java, React, MySQL)"
//             value={skills}
//             onChange={(e) => setSkills(e.target.value)}
//           />

//           <select
//             value={experience}
//             onChange={(e) => setExperience(Number(e.target.value))}
//           >
//             <option value="0">Fresher</option>
//             <option value="1">1 Year</option>
//             <option value="2">2+ Years</option>
//             <option value="3">3+ Years</option>
//           </select>

//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={(e) => setFile(e.target.files[0])}
//           />

//           <div className="btn-row">
//             <button onClick={uploadResume}>Update Resume</button>
//             <button onClick={matchJobs}>Match Jobs</button>
//           </div>
//         </div>

//         {/* JOBS */}
//         <h2 className="section-title">Recommended Jobs</h2>

//         {loading && <p>Loading jobs...</p>}

//         {!loading && matchedJobs.length === 0 && (
//           <p>No jobs matched yet</p>
//         )}

//         <div className="job-grid">
//           {matchedJobs.map((job) => (
//             <motion.div
//               key={job.id}
//               className="job-card"
//               whileHover={{ scale: 1.03 }}
//             >
//               <h3>{job.title}</h3>

//               <p><b>Skills:</b> {job.skills}</p>
//               <p><b>Experience:</b> {job.experience}+ year(s)</p>
//               <p><b>Company:</b> {job.company || "—"}</p>

//               <button
//                 className="apply-btn"
//                 onClick={() => navigate(`/apply/${job.id}`)}
//               >
//                 Apply Now
//               </button>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// export default UserDashboard;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import UserSidebar from "./UserSidebar";
import "../ui/dashboard.css";

function UserDashboard() {
  const userId = Number(localStorage.getItem("userId"));
  const navigate = useNavigate();

  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState(0);
  const [file, setFile] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  // 🔹 Upload Resume
  const uploadResume = async () => {
  if (!skills || skills.trim() === "") {
    alert("Please enter skills");
    return;
  }

  if (!userId) {
    alert("User not found. Please login again.");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("skills", skills.trim());
  formData.append("experience", experience || 0);

  if (file) {
    formData.append("resume", file);
  }

  try {
    const res = await api.post(
      "/api/resume/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert(res.data.message || "Resume uploaded successfully");

    // Enable Match Jobs button
    setResumeUploaded(true);

  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.message ||
      "Resume upload failed"
    );
  }
};
// const uploadResume = async () => {
//   if (!skills) {
//     alert("Please enter skills");
//     return;
//   }

//   try {
//     await api.post("/api/resume/upload", {
//       user_id: userId,
//       skills,
//       experience
//     });

//     alert("Resume uploaded successfully");
//     setResumeUploaded(true);
//   } catch (err) {
//     console.error(err);
//     alert("Resume upload failed");
//   }
// };
  // 🔹 Match Jobs
  const matchJobs = async () => {
    if (!resumeUploaded) return;

    setLoading(true);
    try {
      const res = await api.get(`/api/jobs/match/${userId}`);
      setMatchedJobs(res.data);
    } catch (err) {
      alert("No jobs matched");
      setMatchedJobs([]);
    } finally {
      setLoading(false);
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
        {/* APP NAME */}
        <h1 className="app-title">JobSphere 🚀</h1>
        <p className="app-subtitle">
          Smart Resume & AI Job Matching Platform
        </p>

        {/* Resume Section */}
        <div className="form-card">
          <h2>Resume & Job Matching</h2>

          <input
            type="text"
            placeholder="Skills (java, react, spring boot)"
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
            <button onClick={uploadResume}>
              Update Resume
            </button>

            <button
              onClick={matchJobs}
              disabled={!resumeUploaded}
              style={{
                backgroundColor: resumeUploaded ? "#1e3c72" : "#999",
                cursor: resumeUploaded ? "pointer" : "not-allowed"
              }}
            >
              Match Jobs
            </button>
          </div>
        </div>

        {/* Jobs */}
        <h2 className="section-title">Recommended Jobs</h2>

        {loading && <p>Loading jobs...</p>}

        {!loading && matchedJobs.length === 0 && (
          <p>No jobs matched yet</p>
        )}

        <div className="job-grid">
          {matchedJobs.map((job) => (
            <motion.div
              key={job.id}
              className="job-card"
              whileHover={{ scale: 1.03 }}
            >
              <h3>{job.title}</h3>
              <p><b>Skills:</b> {job.skills}</p>
              <p>{job.description}</p>

              <button
                onClick={() => navigate(`/apply/${job.id}`)}
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;