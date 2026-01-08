import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import Dashboard from "./pages/Dashboard"
import CreateInterview from "./pages/CreateInterview"
import InterviewSession from "./pages/InterviewSession"
import Feedback from "./pages/Feedback"
import ProfileSettings from "./pages/ProfileSettings"
import PreviousInterviews from "./pages/PreviousInterviews"
import PopularInterviewsPage from "./pages/PopularInterviewsPage"
import Resume from "./pages/Resume"
import InterviewDetails from "./pages/InterviewDetails"
import './App.css'

const App = () => {
  const userCredentials = JSON.parse(localStorage.getItem("userCredentials"))
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={userCredentials ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/feedback" element={<Feedback />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/dashboard/all-previous-interviews" element={<PreviousInterviews />} />
        <Route path="/dashboard/all-popular-interviews" element={<PopularInterviewsPage />} />
        <Route path="/dashboard/interview-details/:id" element={<InterviewDetails />} />
        <Route path="/dashboard/interview-details/:id/:roundId" element={<InterviewSession />} />
        <Route path="/dashboard/interview" element={<InterviewSession />} />
        <Route path="/dashboard/interview/feedback" element={<Feedback />} />
        <Route path="/create" element={<CreateInterview />} />
        <Route path="/create/interview/:id" element={<InterviewSession />} />
        <Route path="/create/interview/:id/feedback" element={<Feedback />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  )

}


export default App


