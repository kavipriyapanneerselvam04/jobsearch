import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import UserDashboard from "./components/UserDashboard";
import ApplyJob from "./components/ApplyJob";
import PostJob from "./components/PostJob";
import UploadResume from "./components/UploadResume";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/upload-resume" element={<UploadResume />} />

        {/* RECRUITER */}
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
