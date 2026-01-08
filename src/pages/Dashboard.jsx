import React from "react";
import { Link, useLocation, useNavigate, } from "react-router-dom"
import { Sparkles, Plus, Clock, TrendingUp, Award, Target, ChevronRight, Calendar, Star, Users, Code, Briefcase, Brain, Loader2 } from 'lucide-react';
import logo from "../assets/images/logo.png"
import bot from "../assets/images/bot.png"
import google from "../assets/images/google.png"
import amazon from "../assets/images/amazon.png"
import meta from "../assets/images/meta.png"
import TechInterviews from "./TechInterviews"
import { supabase } from "../supabaseClient"
import Navbar from "../components/Navbar"
import DashboardBanner from "../components/DashboardBanner"
import PopularInterviewsBanner from "../components/PopularInterviewsBanner"
import ResumeHero from "../components/ResumeHero";

const InterviewDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [userCredentials, setUserCredentials] = React.useState(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [pastInterviews, setPastInterviews] = React.useState([]);
  const [credits, setCredits] = React.useState(null);

  React.useEffect(() => {
    getProfileAndInterviews();
  }, []);

  async function getProfileAndInterviews() {
    try {
      setLoading(true);

      // 1. Get Current User first (needed for RLS/Profile)
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // Set user details for display
      setUserCredentials({
        firstName: user.user_metadata.first_name || "User",
        lastName: user.user_metadata.last_name || "",
        email: user.email
      });

      // 2. Fetch Interviews and Profile (Credits) in parallel
      const [interviewsResponse, profileResponse] = await Promise.all([
        supabase
          .from('interviews')
          .select('id, created_at, role, date, duration, score, feedback_data') // Fetch feedback_data to check for roundKey
          .order('created_at', { ascending: false }),

        supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single()
      ]);

      if (interviewsResponse.error) throw interviewsResponse.error;

      console.log('Interviews data:', interviewsResponse.data);

      if (interviewsResponse.data) {
        // Filter out popular interviews (those with roundKey) from the recent interviews list
        const customInterviews = interviewsResponse.data.filter(interview =>
          !interview.feedback_data?.roundKey && !interview.feedback_data?.roundId
        );
        setPastInterviews(customInterviews);
      }

      if (profileResponse.data) {
        setCredits(profileResponse.data.credits);
      }

    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteinterview(id) {
    if (!confirm("Are you sure you want to delete this interview record?")) return;

    try {
      setPastInterviews(prev => prev.filter(i => i.id !== id));
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting:", error.message);
      getProfileAndInterviews();
    }
  }

  async function viewinterview(interview) {
    try {
      // Fetch the heavy feedback data only when requested
      const { data, error } = await supabase
        .from('interviews')
        .select('feedback_data')
        .eq('id', interview.id)
        .single();

      if (error) throw error;

      if (data && data.feedback_data) {
        navigate("/dashboard/feedback", { state: data.feedback_data })
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load interview details.");
    }
  }

  async function startInterview(id) {
    // --- CHECK CREDITS START ---
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!profile || profile.credits < 5) {
        alert("You need at least 5 credits to start an interview!");
        return;
      }
    }
    // --- CHECK CREDITS END ---

    sessionStorage.removeItem("interviewEnded");
    const interview = TechInterviews.find(interview => interview.id === id);

    // Flatten questions from rounds
    const questionPool = [];
    if (interview && interview.rounds) {
      Object.values(interview.rounds).forEach(round => {
        if (round.questions && Array.isArray(round.questions)) {
          questionPool.push(...round.questions);
        }
      });
    }

    navigate("/dashboard/interview", {
      state: {
        role: interview.role,
        name: `${interview.company} ${interview.role}`,
        level: interview.level,
        company: interview.company,
        duration: interview.totalDuration,
        questionPool: questionPool
      }
    })
  }

  // Helper for company colors since they are not in the data
  const getCompanyColor = (company) => {
    const colors = {
      'Google': 'cyan',
      'Amazon': 'blue',
      'Meta': 'purple',
      'Netflix': 'red',
      'Microsoft': 'green'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">

      {/* Header */}
      <Navbar credits={credits} />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

        {/* Hero Banner */}
        <DashboardBanner />

        {/* Past Interviews Section */}
        {pastInterviews.length > 0 ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  Recent Interviews
                </h3>
                <p className="text-slate-400 text-sm mt-1">Your practice history and performance</p>
              </div>
              <button
                onClick={() => navigate('/dashboard/all-previous-interviews')}
                className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1 transition-colors">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastInterviews.slice(0, 3).map((interview) => (
                <div
                  key={interview.id}
                  className="relative group rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {interview.role}
                        </h4>
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {interview.date}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border ${getScoreBg(interview.score)}`}>
                        <span className={`text-sm font-bold ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">{interview.duration}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center justify-between px-0.5">
                      <button
                        onClick={() => {
                          viewinterview(interview)
                        }}
                        className="cursor-pointer py-2.5 px-6 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:border-cyan-500/30">
                        View Details
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => deleteinterview(interview.id)}
                        className="cursor-pointer py-2.5 px-6 rounded-lg border border-slate-700 text-slate-500 hover:bg-red-500/90 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:border-red-500/30">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-10 rounded-2xl border border-white/10">
            <p className="text-slate-400 mb-2">No interviews yet.</p>
            <p className="text-sm text-slate-500">Create your first interview to get started!</p>
          </div>
        )}

        {/* Popular Interviews Section */}
        <section className="space-y-6">
          <PopularInterviewsBanner />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Popular Interviews
              </h3>
              <p className="text-slate-400 text-sm mt-1">Most practiced by the community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TechInterviews.map((interview) => {
              const colorKey = getCompanyColor(interview.company);

              const colorClasses = {
                cyan: { bg: "from-cyan-500/20 to-cyan-600/20", border: "border-cyan-500/20", text: "text-cyan-400", accent: "from-cyan-500 to-cyan-600" },
                blue: { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/20", text: "text-blue-400", accent: "from-blue-500 to-blue-600" },
                purple: { bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/20", text: "text-purple-400", accent: "from-purple-500 to-purple-600" },
                pink: { bg: "from-pink-500/20 to-pink-600/20", border: "border-pink-500/20", text: "text-pink-400", accent: "from-pink-500 to-pink-600" },
                green: { bg: "from-green-500/20 to-green-600/20", border: "border-green-500/20", text: "text-green-400", accent: "from-green-500 to-green-600" },
                orange: { bg: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/20", text: "text-orange-400", accent: "from-orange-500 to-orange-600" }
              };
              const colors = colorClasses[colorKey];

              return (
                <div
                  key={interview.id}
                  className="relative group rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                  <div className="p-6 space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <img src={interview.icon} alt="" className="w-10 h-10" />
                    </div>

                    {/* Header */}
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                        {interview.company} {interview.role}
                      </h4>
                      <p className="text-sm text-white">{interview.level}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">1.2k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-slate-400">4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">{interview.totalDuration}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => navigate(`/dashboard/interview-details/${interview.id}`)}
                      className="w-full py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:border-cyan-500/30">
                      View Details
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </section>
        <ResumeHero onButtonClick={() => navigate('/resume')} />

      </main>
    </div>
  );
};

export default InterviewDashboard;