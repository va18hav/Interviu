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
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import InterviewSessionStatic from "./pages/InterviewSessionStatic"
import './App.css'

import DashboardBlack from "./pages/DashboardBlack"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/black" element={<DashboardBlack />} />
          <Route path="/dashboard/feedback" element={<Feedback />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/dashboard/all-previous-interviews" element={<PreviousInterviews />} />
          <Route path="/dashboard/all-popular-interviews" element={<PopularInterviewsPage />} />
          <Route path="/dashboard/interview-details/:id" element={<InterviewDetails />} />
          <Route path="/dashboard/interview-details/:id/:roundId" element={<InterviewSession />} />
          <Route path="/dashboard/interview" element={<InterviewSession />} />
          <Route path="/dashboard/static-interview" element={<InterviewSessionStatic />} />
          <Route path="/dashboard/interview/feedback" element={<Feedback />} />
          <Route path="/create" element={<CreateInterview />} />
          <Route path="/create/interview/:id" element={<InterviewSession />} />
          <Route path="/create/interview/:id/feedback" element={<Feedback />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )

}


export default App


