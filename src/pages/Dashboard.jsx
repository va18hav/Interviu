import React from "react";
import { Link, useLocation, useNavigate, } from "react-router-dom"
import { Sparkles, Plus, Clock, TrendingUp, Award, Target, ChevronRight, Calendar, Star, Users, Code, Briefcase, Brain, Loader2, Trash, Signal } from 'lucide-react';
import logo from "../assets/images/logo.png"
import bot from "../assets/images/bot.png"

import Navbar from "../components/Navbar"
import CustomInterviewBanner from "../components/CustomInterviewBanner"
import DashboardHeroBanner from "../components/DashboardHeroBanner"
import ResumeHero from "../components/ResumeHero";
import RecentActivity from "../components/RecentActivity";

import Onboarding from "./Onboarding";

const InterviewDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [userCredentials, setUserCredentials] = React.useState(null);
  const [pastInterviews, setPastInterviews] = React.useState([]);
  const [popularInterviews, setPopularInterviews] = React.useState([]);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [credits, setCredits] = React.useState(0); // New state for credits

  React.useEffect(() => {
    getProfileAndInterviews();
  }, []);

  async function getProfileAndInterviews() {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("userCredentials"));
      if (!storedUser?.id) {
        navigate('/login');
        return;
      }

      // Set user details for display if not already set correctly from localStorage (though dashboard usually relies on this state)
      setUserCredentials(storedUser);

      const response = await fetch(`http://localhost:5000/api/dashboard?userId=${storedUser.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to load dashboard data");

      setCredits(data.profile?.credits || 0);
      setPopularInterviews(data.popularInterviews || []);

      // Fetch custom interviews separately
      const customRes = await fetch(`http://localhost:5000/api/completed-interviews/custom?userId=${storedUser.id}`);
      if (customRes.ok) {
        const customData = await customRes.json();
        setPastInterviews(customData || []);
      }

      // Handle onboarding
      if (data.profile && !data.profile.onboarding_completed) {
        setTimeout(() => {
          setShowOnboarding(true);
        }, 500);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteinterview(id) {
    if (!confirm("Are you sure you want to delete this interview record?")) return;

    try {
      setPastInterviews(prev => prev.filter(i => i.id !== id));

      const response = await fetch(`http://localhost:5000/api/interviews/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete interview");
      }

    } catch (error) {
      console.error("Error deleting:", error.message);
      getProfileAndInterviews();
    }
  }

  async function viewinterview(interview) {
    try {
      // Fetch the heavy feedback data only when requested
      const response = await fetch(`http://localhost:5000/api/completed-interviews/${interview.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch feedback");

      if (data && data.feedback_data) {
        navigate("/dashboard/feedback", { state: data.feedback_data })
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load interview details.");
    }
  }
  // Helper for company colors since they are not in the data
  const getCompanyColor = (company) => {
    const colors = {
      'Google': 'cyan',
      'Amazon': 'blue',
      'Meta': 'purple',
      'Netflix': 'red',
      'Microsoft': 'green',
      'Apple': 'cyan',
      'Nvidia': 'green'
    };
    return colors[company] || 'cyan';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-cyan-400";
    return "text-yellow-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-cyan-500/10 border-cyan-500/20";
    return "bg-yellow-500/10 border-yellow-500/20";
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className={`transition-all duration-500 ${showOnboarding ? 'blur-md pointer-events-none brightness-50' : ''}`}>
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        {loading ? <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </div> : <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

          {/* Popular Interviews Section */}
          <section className="space-y-6">
            {/* Banner and Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardHeroBanner firstName={userCredentials?.firstName || "User"} />
              </div>
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-slate-900 text-sm mt-1">In Demand</p>
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularInterviews.map((interview, index) => {
                return (
                  <div
                    key={interview.id}
                    className="relative group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer p-6 space-y-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <img src={interview.icon_url} alt="" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                            {interview.role}
                          </h4>
                          <p className="text-sm text-gray-500 font-medium">{interview.level}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-gray-50 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">1.2k</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-600 font-medium">4.8</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 font-medium">{interview.total_duration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/dashboard/interview-details/${interview.id}`)}
                      className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:border-gray-200">
                      View Details
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <CustomInterviewBanner firstName={userCredentials?.firstName || "User"} />

          {/* Past Interviews Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastInterviews.length > 0 ? (
              pastInterviews.slice(0, 6).map((interview) => (
                <div key={interview.id} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg line-clamp-2" title={interview.title}>{interview.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{interview.job_role} • {new Date(interview.completed_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md shrink-0">
                        <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                        <span className="font-bold text-green-700 text-sm">{interview.score}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 items-center justify-between">
                    <button
                      onClick={() => navigate('/report', {
                        state: {
                          reportData: interview.report_data,
                          role: interview.job_role,
                          type: interview.title,
                          isPastInterview: true,
                          completedAt: interview.completed_at,
                        }
                      })}
                      className="px-6 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors w-fit shadow-sm"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => deleteinterview(interview.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Interview"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 rounded-2xl border border-slate-200 bg-slate-50">
                <p className="text-slate-700 mb-2">No past custom interviews yet.</p>
                <p className="text-sm text-slate-600">Create your first interview to get started!</p>
              </div>
            )}
          </div>
        </main>}
      </div>

      {/* Onboarding Pop-up Overlay */}
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
};

export default InterviewDashboard;