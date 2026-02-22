import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Clock,
  TrendingUp,
  Award,
  Target,
  ChevronRight,
  Calendar,
  Star,
  Users,
  Code,
  Briefcase,
  Brain,
  Loader2,
  Trash,
  Signal,
  Layers,
  ArrowRight,
  History,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import CustomInterviewBanner from "../components/CustomInterviewBanner";
import DashboardHeroBanner from "../components/DashboardHeroBanner";
import RecentActivity from "../components/RecentActivity";
import Onboarding from "./Onboarding";

const InterviewDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userCredentials, setUserCredentials] = useState(null);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [popularInterviews, setPopularInterviews] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
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

      setUserCredentials(storedUser);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard?userId=${storedUser.id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to load dashboard data");

      setCredits(data.profile?.credits || 0);
      setPopularInterviews(data.popularInterviews || []);

      // Fetch custom interviews separately
      const customRes = await fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/custom?userId=${storedUser.id}`);
      if (customRes.ok) {
        const customData = await customRes.json();
        setPastInterviews(customData || []);
      }

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

  async function deleteInterview(id) {
    if (!confirm("Are you sure you want to delete this interview record?")) return;

    try {
      setPastInterviews(prev => prev.filter(i => i.id !== id));
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/${id}`, {
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

  const SectionTitle = ({ icon: Icon, title, subtitle, actionLabel, onAction }) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>
        <p className="text-slate-500 font-medium">{subtitle}</p>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="group flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );

  const getScoreColor = (score) => {
    if (score >= 80) return "emerald";
    if (score >= 60) return "amber";
    return "rose";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <div className={`transition-all duration-700 ${showOnboarding ? 'blur-xl scale-[0.98] pointer-events-none' : ''}`}>

        {/* Integrated Command Center Hero */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 h-full">
              <DashboardHeroBanner firstName={userCredentials?.firstName || "Candidate"} />
            </div>
            <div className="lg:col-span-4 h-full">
              <RecentActivity />
            </div>
          </motion.div>
        </div>

        <main className="max-w-[1440px] mx-auto px-4 md:px-8 pb-32 space-y-24">

          {/* Tailored Simulations */}
          <section>
            <SectionTitle
              icon={Sparkles}
              title="Tailored Simulations"
              subtitle="High-fidelity environments calibrated to your profile."
              actionLabel="Explore All Library"
              onAction={() => navigate('/dashboard/all-popular-interviews')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularInterviews.slice(0, 6).map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/dashboard/interview-details/${interview.id}?type=${interview.type}`)}
                  className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative flex items-start justify-between mb-8">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                      <img src={interview.icon_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${(() => {
                      const l = (interview.level || '').toLowerCase();
                      if (l.includes('entry') || l.includes('l3')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
                      if (l.includes('senior') || l.includes('l5')) return 'bg-amber-50 text-amber-600 border-amber-100';
                      if (l.includes('staff') || l.includes('lead')) return 'bg-rose-50 text-rose-600 border-rose-100';
                      return 'bg-indigo-50 text-indigo-600 border-indigo-100';
                    })()}`}>
                      {interview.level}
                    </div>
                  </div>

                  <div className="space-y-2 mb-8">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {interview.company} {interview.role}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{interview.rounds?.length || 0} Modules</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{interview.total_duration}m Session</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest transition-colors">View Details</span>
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-500">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Simulation Blueprint Callout */}
          <div className="relative rounded-[3rem] overflow-hidden">
            <CustomInterviewBanner firstName={userCredentials?.firstName || "Candidate"} />
          </div>

          {/* Performance Chronicle (Past Interviews) */}
          <section>
            <SectionTitle
              icon={History}
              title="Performance Chronicle"
              subtitle="Historical data from your previous simulations."
              actionLabel="View Full History"
              onAction={() => navigate('/dashboard/history')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastInterviews.length > 0 ? (
                pastInterviews.slice(0, 6).map((interview, index) => {
                  const scoreColor = getScoreColor(interview.score);
                  const date = new Date(interview.completed_at);

                  return (
                    <motion.div
                      key={interview.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center justify-center w-12 py-2 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{date.toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl font-black text-slate-900 leading-none">{date.getDate()}</span>
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{interview.title}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{interview.job_role}</p>
                          </div>
                        </div>

                        <div className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${scoreColor === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                          scoreColor === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                            'bg-rose-50 border-rose-100 text-rose-600'
                          }`}>
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Score</span>
                          <span className="text-lg font-black leading-none">{interview.score}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
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
                          className="flex-1 py-3 px-6 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300"
                        >
                          Audit Analysis
                        </button>
                        <button
                          onClick={() => deleteInterview(interview.id)}
                          className="w-12 h-12 rounded-2xl border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 flex items-center justify-center transition-all"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 italic">
                    ...
                  </div>
                  <div>
                    <p className="text-slate-900 font-black">No simulations on record.</p>
                    <p className="text-slate-500 font-medium text-sm">Architect your first simulation to begin your chronicle.</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Onboarding Pop-up Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm"
          >
            <Onboarding onComplete={() => setShowOnboarding(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewDashboard;
