import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RecruiterDashboard from "./components/RecruiterDashboard";
import UserDashboard from "./components/UserDashboard";
import ApplyJob from "./components/ApplyJob";
import PostJob from "./components/PostJob";
import UploadResume from "./components/UploadResume";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/upload-resume" element={<UploadResume />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
