import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import "../ui/apply.css";

function ApplyJob() {
  const { jobId } = useParams();
  const userId = localStorage.getItem("userId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const submitApplication = async () => {
    await api.post("/api/jobs/apply", {
      user_id: userId,
      job_id: jobId,
      name,
      email,
      phone,
      coverLetter
    });

    alert("Application submitted successfully");
  };

  return (
    <div className="apply-page">
      <motion.div
        className="apply-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Apply for Job</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Cover Letter"
          rows="4"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submitApplication}
        >
          Submit Application
        </motion.button>
      </motion.div>
    </div>
  );
}

export default ApplyJob;
