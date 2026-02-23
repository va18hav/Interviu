import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Calendar,
    ChevronRight,
    Star,
    Filter,
    Search,
    ArrowLeft,
    Trash,
    History,
    Sparkles,
    Layout,
    Target,
    Settings
} from 'lucide-react';
import Navbar from '../components/Navbar';

const PreviousInterviews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'curated', 'custom'
    const [interviews, setInterviews] = useState([]);
    const [filteredInterviews, setFilteredInterviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInterviews();
    }, []);

    useEffect(() => {
        filterInterviews();
    }, [activeTab, searchQuery, interviews]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) {
                navigate('/login');
                return;
            }
            const token = localStorage.getItem('authToken');
            const fetchParams = { headers: { 'Authorization': `Bearer ${token}` } };

            const [curatedRes, customRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/curated?userId=${userCreds.id}`, fetchParams),
                fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/custom?userId=${userCreds.id}`, fetchParams)
            ]);

            const curatedData = curatedRes.ok ? await curatedRes.json() : [];
            const customData = customRes.ok ? await customRes.json() : [];

            const curatedNormalized = curatedData.map(item => ({
                ...item,
                category: 'curated',
                displayTitle: item.title || `${item.company} ${item.type} Interview`,
                displaySubtitle: `${item.company || 'Tech Company'} • ${item.type?.toUpperCase()}`,
                date: new Date(item.completed_at)
            }));

            const customNormalized = customData.map(item => ({
                ...item,
                category: 'custom',
                displayTitle: item.title,
                displaySubtitle: `${item.job_role} • Custom Scenario`,
                date: new Date(item.completed_at)
            }));

            const combined = [...curatedNormalized, ...customNormalized].sort((a, b) => b.date - a.date);
            setInterviews(combined);

        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterInterviews = () => {
        let result = [...interviews];
        if (activeTab !== 'all') {
            result = result.filter(item => item.category === activeTab);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.displayTitle.toLowerCase().includes(query) ||
                item.displaySubtitle.toLowerCase().includes(query)
            );
        }
        setFilteredInterviews(result);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this interview record?")) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setInterviews(prev => prev.filter(i => i.id !== id));
            } else {
                const data = await response.json();
                alert(data.error || "Failed to delete interview");
            }
        } catch (error) {
            console.error("Error deleting interview:", error);
            alert("Failed to delete interview record.");
        }
    };

    const getScoreStyles = (score) => {
        if (score >= 8) return {
            color: "text-emerald-700",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            glow: "shadow-emerald-200"
        };
        if (score >= 5) return {
            color: "text-amber-700",
            bg: "bg-amber-50",
            border: "border-amber-100",
            glow: "shadow-amber-200"
        };
        return {
            color: "text-rose-700",
            bg: "bg-rose-50",
            border: "border-rose-100",
            glow: "shadow-rose-200"
        };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Header Section */}
            <div className="relative w-full overflow-hidden bg-slate-950 px-6 py-20 md:px-16 md:py-32 mb-12 rounded-b-[4rem]">
                {/* Visual Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
                </div>

                <div className="relative max-w-7xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-xs uppercase tracking-[0.2em]">Return to Hub</span>
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                            Performance <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Chronicle.</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                            A historical retrospective of your technical simulations. Review transcripts, analyze scores, and track your engineering trajectory.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-6 pt-12"
                    >
                        <div className="flex-1 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 backdrop-blur-xl transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-2 p-1.5 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-sm">
                        {['all', 'curated', 'custom'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                    ? "bg-white text-indigo-600 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                                    : "text-slate-500 hover:text-slate-900"
                                    }`}
                            >
                                {tab} ({
                                    tab === 'all' ? interviews.length : interviews.filter(i => i.category === tab).length
                                })
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-slate-400">
                        <History className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Found {filteredInterviews.length} Simulations
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Retrieving archives...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => {
                                const styles = getScoreStyles(interview.score);
                                return (
                                    <motion.div
                                        key={interview.id}
                                        variants={itemVariants}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ x: 8 }}
                                        onClick={() => navigate('/report', {
                                            state: {
                                                reportData: interview.report_data,
                                                role: interview.category === 'curated' ? interview.type?.toUpperCase() : interview.job_role,
                                                type: interview.displayTitle,
                                                isPastInterview: true,
                                                completedAt: interview.completed_at,
                                            }
                                        })}
                                        className="group relative flex flex-col md:flex-row items-center gap-8 rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 cursor-pointer overflow-hidden"
                                    >
                                        {/* Background Decoration */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -translate-y-8 translate-x-8 transition-transform group-hover:translate-x-4 group-hover:-translate-y-4" />

                                        {/* Date Segment */}
                                        <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-slate-50 border border-slate-100 min-w-[100px] shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                            <span className="text-xl font-black text-slate-900">
                                                {interview.date.getDate()}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {interview.date.toLocaleDateString(undefined, { month: 'short' })}
                                            </span>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 space-y-3 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${interview.category === 'curated'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-100 underline decoration-indigo-200 decoration-2 underline-offset-4'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100 underline decoration-emerald-200 decoration-2 underline-offset-4'
                                                    }`}>
                                                    {interview.category}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {interview.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                {interview.displayTitle}
                                            </h3>
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <p className="text-sm font-bold truncate max-w-[200px]">{interview.displaySubtitle}</p>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                                    <Timer className="w-3.5 h-3.5 text-indigo-400" />
                                                    {interview.duration_mins || 45}m
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score Section */}
                                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-50 pt-6 md:pt-0">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border ${styles.bg} ${styles.border} ${styles.color} shadow-lg ${styles.glow} transition-all duration-500 scale-100 group-hover:scale-110`}>
                                                    <Star className="w-5 h-5 fill-current" />
                                                    <span className="text-2xl font-black">{interview.score}</span>
                                                    <span className="text-sm border-l border-current/20 pl-2 opacity-60">/10</span>
                                                </div>
                                                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 pr-2">Overall Proficiency</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => handleDelete(e, interview.id)}
                                                    className="p-4 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                                <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-8"
                                >
                                    <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center border border-slate-100 relative">
                                        <History className="w-12 h-12 text-slate-200" />
                                        <div className="absolute inset-0 border-2 border-indigo-200 border-dashed rounded-[3rem] animate-[spin_10s_linear_infinite]" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-slate-900">Archive is Empty</h3>
                                        <p className="text-slate-400 font-medium max-w-xs mx-auto">
                                            The technical record is clear. Complete your first module to begin your performance history.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/create')}
                                        className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-3"
                                    >
                                        Initiate Simulation
                                        <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

// Reusable Small Components
const Timer = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" />
    </svg>
);

export default PreviousInterviews;
