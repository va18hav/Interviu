import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import Dashboard from "./pages/Dashboard"
import CreateInterview from "./pages/CreateInterview"
import InterviewSession from "./pages/InterviewSession"
import PastInterviews from "./pages/PastInterviews"
import StoredInterview from "./pages/StoredInterview"
import Feedback from "./pages/Feedback"
import ProfileSettings from "./pages/ProfileSettings"
import './App.css'

const App = () => {
  const userCredentials = JSON.parse(localStorage.getItem("userCredentials"))
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userCredentials ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/past-interviews" element={<PastInterviews />} />
        <Route path="/dashboard/stored-interview" element={<StoredInterview />} />
        <Route path="/dashboard/stored-interview/feedback" element={<Feedback />} />
        <Route path="/create" element={<CreateInterview />} />
        <Route path="/create/interview/:id" element={<InterviewSession />} />
        <Route path="/create/interview/:id/feedback" element={<Feedback />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App


