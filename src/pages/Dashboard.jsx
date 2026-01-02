import React from "react";
import { Link, useLocation, useNavigate, } from "react-router-dom"
import { Sparkles, Plus, Clock, TrendingUp, Award, Target, ChevronRight, Calendar, Star, Users, Code, Briefcase, Brain, Loader2 } from 'lucide-react';
import logo from "../assets/images/logo.png"
import bot from "../assets/images/bot.png"
import google from "../assets/images/google.png"
import amazon from "../assets/images/amazon.png"
import meta from "../assets/images/meta.png"
import popularInterviews from "./popularInterviews"
import { supabase } from "../supabaseClient"

const InterviewDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [userCredentials, setUserCredentials] = React.useState(null);
  const [showProfile, setShowProfile] = React.useState(false);
  const [pastInterviews, setPastInterviews] = React.useState([]);

  React.useEffect(() => {
    getProfileAndInterviews();
  }, []);

  async function getProfileAndInterviews() {
    try {
      setLoading(true);
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Determine if we have a fallback or should redirect
        navigate('/login');
        return;
      }

      // Set user details for display
      setUserCredentials({
        firstName: user.user_metadata.first_name || "User",
        lastName: user.user_metadata.last_name || "",
        email: user.email
      });

      // 2. Fetch Interviews from Supabase
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform data structure if needed to match UI expectations
        // (Our table columns match the UI pretty well already)
        setPastInterviews(data);
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
      // Optimistic update
      setPastInterviews(prev => prev.filter(i => i.id !== id));

      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
        // Revert if failed (omitted for brevity, but good practice)
      }
    } catch (error) {
      console.error("Error deleting:", error.message);
      // Ideally refetch to restore state
      getProfileAndInterviews();
    }
  }

  function viewinterview(interview) {
    // We stored the complex JSON in 'feedback_data' column
    navigate("/dashboard/past-interviews", { state: interview.feedback_data })
  }

  function startInterview(id) {
    sessionStorage.removeItem("interviewEnded");
    const interview = popularInterviews.find(interview => interview.id === id);
    navigate("/dashboard/stored-interview", {
      state: {
        role: interview.role,
        name: interview.name,
        level: interview.level,
        company: interview.company,
        duration: interview.duration,
        questionPool: interview.questions
      }
    })
  }

  // Mock data for popular interviews


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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-15 h-15" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Inter<span className="text-cyan-400">vyu</span></h1>
                <p className="text-xs text-slate-400">Practice Smarter</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{userCredentials?.firstName + " " + userCredentials?.lastName}</p>
                  <p className="text-xs text-slate-400">{userCredentials?.email}</p>
                </div>
                <button onClick={() => setShowProfile(prev => !prev)} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                  {showProfile ? "X" : userCredentials?.firstName?.charAt(0).toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {showProfile && <div className="absolute top-0 -right-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-700/20 text-slate-400 rounded-lg p-4 flex flex-col items-center gap-2 z-50 shadow-xl border border-slate-800">
          <div className="w-15 h-15 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl text-white font-semibold shadow-lg">
            {userCredentials?.firstName?.charAt(0).toUpperCase()}
          </div>
          <p className="text-white">{userCredentials?.firstName + " " + userCredentials?.lastName}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              localStorage.removeItem("userCredentials"); // Cleanup old method
              navigate('/login');
            }}
            className="w-full py-2 px-4 rounded-lg bg-cyan-500 border border-cyan-500 text-black hover:bg-cyan-500/20 hover:text-white transition-colors">
            Log out
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mt-2"
          >
            Profile Settings
          </button>
        </div>}

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 px-6 md:px-8 lg:px-16 py-6 md:py-6 lg:py-18 flex items-center justify-between">
            <img src={bot} alt="" className="hidden lg:block absolute -bottom-27 -right-10 w-100 h-150 -rotate-[20deg]" />
            <div className="max-w-2xl space-y-6">
              <div className="hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur">

                <span className="text text-cyan-400 font-medium">AI-Powered Practice</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Ready to Ace Your
                <br />
                <span className="bg-gradient-to-r from-green-600 via-green-300 to-green-200 bg-clip-text text-transparent">
                  Next Interview?
                </span>
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed">
                Create personalized mock interviews tailored to your role, experience level, and target companies. Get instant AI feedback to improve your performance.
              </p>

              <div className="flex items-center gap-4 pt-4">


                <button
                  onClick={() => navigate('/create')}
                  className="group relative px-8 py-4 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 shadow-lg shadow-cyan-500/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Interview
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>



                <button className="hidden md:block px-8 py-4 rounded-xl font-semibold text-base border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800/60 transition-all backdrop-blur-sm">
                  View All Interviews
                </button>
              </div>

              {/* Stats */}

            </div>

          </div>
        </div>

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
              <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1 transition-colors">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                >
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
                        className="cursor-pointer py-2.5 px-6 rounded-lg bg-gradient-to-br from-red-600/20 to-red-500/20 hover:bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/50 text-white hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-slate-400 mb-2">No interviews yet.</p>
            <p className="text-sm text-slate-500">Create your first interview to get started!</p>
          </div>
        )}

        {/* Popular Interviews Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                Popular Interviews
              </h3>
              <p className="text-slate-400 text-sm mt-1">Most practiced by the community</p>
            </div>
            <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1 transition-colors">
              Explore All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularInterviews.map((interview) => {
              const Icon = interview.icon;
              const colorClasses = {
                cyan: { bg: "from-cyan-500/20 to-cyan-600/20", border: "border-cyan-500/20", text: "text-cyan-400", accent: "from-cyan-500 to-cyan-600" },
                blue: { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/20", text: "text-blue-400", accent: "from-blue-500 to-blue-600" },
                purple: { bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/20", text: "text-purple-400", accent: "from-purple-500 to-purple-600" },
                pink: { bg: "from-pink-500/20 to-pink-600/20", border: "border-pink-500/20", text: "text-pink-400", accent: "from-pink-500 to-pink-600" },
                green: { bg: "from-green-500/20 to-green-600/20", border: "border-green-500/20", text: "text-green-400", accent: "from-green-500 to-green-600" },
                orange: { bg: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/20", text: "text-orange-400", accent: "from-orange-500 to-orange-600" }
              };
              const colors = colorClasses[interview.color];

              return (
                <div
                  key={interview.id}
                  className="group rounded-2xl border border-cyan-500/20 bg-white/8  backdrop-blur-xl overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer"
                >
                  <div className="p-6 space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <img src={interview.icon} alt="" className="w-10 h-10" />
                    </div>

                    {/* Header */}
                    <div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                        {interview.role}
                      </h4>
                      <p className="text-sm text-white">{interview.level}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">{interview.participants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-slate-400">{interview.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-400">{interview.duration}</span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => startInterview(interview.id)}
                      className="w-full py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:border-cyan-500/30">
                      Take Interview
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default InterviewDashboard;