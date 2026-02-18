import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserProfile() {
  const userId = Number(localStorage.getItem("userId"));
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const fetchResume = () => {
    api.get(`/api/resume/user/${userId}`).then(res => {
      setResume(res.data);
    });
  };

  useEffect(() => {
    fetchResume();
  }, [userId]);

  return (
    <div>
      <h2>{userName}</h2>
      <p>{userEmail}</p>

      {!resume ? (
        <>
          <p>No resume uploaded</p>
          <button onClick={() => navigate("/user")}>
            Upload Resume
          </button>
        </>
      ) : (
        <>
          <p><b>Skills:</b> {resume.skills}</p>
          <p><b>Experience:</b> {resume.experience} year(s)</p>

          <a
            href={`http://localhost:5000/uploads/${resume.resume_file}`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>

          <br /><br />

          <button onClick={() => navigate("/user")}>
            Update Resume
          </button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
