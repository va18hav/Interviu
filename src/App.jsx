import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import Dashboard from "./pages/Dashboard"
import CreateInterview from "./pages/CreateInterview"
import ProfileSettings from "./pages/ProfileSettings"
import PreviousInterviews from "./pages/PreviousInterviews"
import PopularInterviewsPage from "./pages/PopularInterviewsPage"
import Resume from "./pages/Resume"
import InterviewDetails from "./pages/InterviewDetails"
import LandingPage from "./pages/LandingPage"
import ProtectedRoute from "./components/ProtectedRoute"
import './App.css'

import DashboardBlack from "./pages/DashboardBlack"
import Onboarding from "./pages/Onboarding"
import CreditsPage from "./pages/Credits"

// Interview Rounds
import DesignRound from "./pages/DesignRound"
import CodingRound from "./pages/CodingRound"
import DebugRound from "./pages/DebugRound"
import BehavioralRound from "./pages/BehavioralRound"
import InterviewReport from "./pages/InterviewReport"

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
          <Route path="/resume" element={<Resume />} />
          <Route path="/dashboard/all-previous-interviews" element={<PreviousInterviews />} />
          <Route path="/dashboard/all-popular-interviews" element={<PopularInterviewsPage />} />
          <Route path="/dashboard/interview-details/:id" element={<InterviewDetails />} />
          <Route path="/create" element={<CreateInterview />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Interview Rounds */}
          <Route path="/design-round" element={<DesignRound />} />
          <Route path="/coding-round" element={<CodingRound />} />
          <Route path="/debug-round" element={<DebugRound />} />
          <Route path="/behavioral-round" element={<BehavioralRound />} />
          <Route path="/report" element={<InterviewReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )

}


export default App
