import { useState } from "react";
import api from "../services/api";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const uploadResume = async () => {
  if (!file) {
    alert("Please select resume");
    return;
  }

  if (!userId || isNaN(userId)) {
    alert("User not logged in. Please login again.");
    return;
  }

  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("skills", skills);
  formData.append("experience", Number(experience));
  formData.append("resume", file);

  try {
    await api.post("/api/resume/upload", formData);
    alert("Resume uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("Resume upload failed");
  }
};


  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <input placeholder="Skills" onChange={e => setSkills(e.target.value)} />
      <input placeholder="Experience" onChange={e => setExperience(e.target.value)} />
      <button onClick={uploadResume}>Upload</button>
    </div>
  );
}

export default UploadResume;
