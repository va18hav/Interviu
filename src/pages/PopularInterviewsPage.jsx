import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Users,
    Star,
    Clock,
    ChevronRight,
    TrendingUp,
    Filter,
    Layers,
    Search,
    Sparkles,
    Target
} from 'lucide-react';
import Navbar from "../components/Navbar";
import PopularInterviewsHero from "../components/PopularInterviewsHero";

const PopularInterviewsPage = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [roleFilter, setRoleFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');

    // Defines the broader role categories for the UI filter
    const ROLE_CATEGORIES = ['Software Engineering', 'AI/ML', 'Data', 'Cloud', 'Product Management', 'Other'];

    // Defines exact filtering options for companies and levels derived from data
    const [uniqueCompanies, setUniqueCompanies] = useState([]);
    const [uniqueLevels, setUniqueLevels] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interviews`);
                const allData = await response.json();

                if (!response.ok) throw new Error(allData.error || "Failed to fetch interviews");

                if (allData.length > 0) {
                    // Normalize data: map icon_link to icon_url
                    const normalizedData = allData.map(item => ({
                        ...item,
                        icon_url: item.icon_link
                    }));

                    const companies = [...new Set(normalizedData.map(item => item.company))].sort();
                    const levels = [...new Set(normalizedData.map(item => item.level))].sort();

                    setUniqueCompanies(companies);
                    setUniqueLevels(levels);

                    const sortedData = normalizedData.sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                    setInterviews(sortedData);
                }
            } catch (error) {
                console.error("Error fetching popular interviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const getRoleCategory = (roleName) => {
        const r = roleName.toLowerCase();
        if (r.includes('software engineer') || r.includes('sde') || r.includes('developer') || r.includes('frontend') || r.includes('backend') || r.includes('full stack') || r.includes('ios') || r.includes('android')) return 'Software Engineering';
        if (r.includes('ai') || r.includes('machine learning') || r.includes('ml') || r.includes('deep learning') || r.includes('vision') || r.includes('nlp')) return 'AI/ML';
        if (r.includes('data')) return 'Data';
        if (r.includes('cloud') || r.includes('devops') || r.includes('sre') || r.includes('solutions architect') || r.includes('azure')) return 'Cloud';
        if (r.includes('product') || r.includes('manager')) return 'Product Management';
        return 'Other';
    };

    const getCompanyColor = (company) => {
        const colors = {
            'Google': 'cyan',
            'Amazon': 'amber',
            'Meta': 'blue',
            'Netflix': 'red',
            'Microsoft': 'sky',
            'Apple': 'slate',
            'Nvidia': 'emerald',
            'OpenAI': 'indigo'
        };
        return colors[company] || 'indigo';
    };

    const colorClasses = {
        cyan: { bg: "bg-cyan-50", text: "text-cyan-600", accent: "from-cyan-500 to-cyan-600", border: "border-cyan-100", light: "bg-cyan-50/50", glow: "shadow-cyan-200" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", accent: "from-amber-500 to-amber-600", border: "border-amber-100", light: "bg-amber-50/50", glow: "shadow-amber-200" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", accent: "from-blue-500 to-blue-600", border: "border-blue-100", light: "bg-blue-50/50", glow: "shadow-blue-200" },
        red: { bg: "bg-red-50", text: "text-red-600", accent: "from-red-500 to-red-600", border: "border-red-100", light: "bg-red-50/50", glow: "shadow-red-200" },
        sky: { bg: "bg-sky-50", text: "text-sky-600", accent: "from-sky-500 to-sky-600", border: "border-sky-100", light: "bg-sky-50/50", glow: "shadow-sky-200" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", accent: "from-emerald-500 to-emerald-600", border: "border-emerald-100", light: "bg-emerald-50/50", glow: "shadow-emerald-200" },
        indigo: { bg: "bg-indigo-50", text: "text-indigo-600", accent: "from-indigo-500 to-indigo-600", border: "border-indigo-100", light: "bg-indigo-50/50", glow: "shadow-indigo-200" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", accent: "from-slate-600 to-slate-800", border: "border-slate-200", light: "bg-slate-50/50", glow: "shadow-slate-400" }
    };

    const filteredInterviews = interviews.filter(interview => {
        const category = getRoleCategory(interview.role);
        const roleMatch = roleFilter === 'All' || category === roleFilter;
        const companyMatch = companyFilter === 'All' || interview.company === companyFilter;
        const levelMatch = levelFilter === 'All' || interview.level === levelFilter;
        return roleMatch && companyMatch && levelMatch;
    });

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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Hero Banner */}
                <PopularInterviewsHero />

                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Popular Interviews</h1>
                            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-500" />
                                Trending industry simulations
                            </p>
                        </div>
                    </motion.div>

                    {/* Filters Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-[2rem] border border-slate-100"
                    >
                        <div className="flex items-center gap-2 pl-4 pr-2 text-slate-400">
                            <Filter className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-bold cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        >
                            <option value="All">All Roles</option>
                            {ROLE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-bold cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        >
                            <option value="All">All Companies</option>
                            {uniqueCompanies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-bold cursor-pointer hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
                        >
                            <option value="All">All Levels</option>
                            {uniqueLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>

                        <AnimatePresence>
                            {(roleFilter !== 'All' || companyFilter !== 'All' || levelFilter !== 'All') && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={() => {
                                        setRoleFilter('All');
                                        setCompanyFilter('All');
                                        setLevelFilter('All');
                                    }}
                                    className="px-4 py-2 text-xs font-black text-slate-500 hover:text-red-500 uppercase tracking-widest transition-colors"
                                >
                                    Reset
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">Syncing catalog...</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                interview={interview}
                                onClick={(item) => navigate(`/dashboard/interview-details/${item.id}?type=${item.type}`)}
                                colorClasses={colorClasses}
                                getCompanyColor={getCompanyColor}
                            />
                        )) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                                    <Target className="w-10 h-10 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xl font-black text-slate-900">No compatible simulations</p>
                                    <p className="text-slate-400 font-medium max-w-xs mx-auto">Adjust your filters to discover other world-class interview tracks.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setRoleFilter('All');
                                        setCompanyFilter('All');
                                        setLevelFilter('All');
                                    }}
                                    className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors"
                                >
                                    View catalog
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

const InterviewCard = React.memo(({ interview, onClick, colorClasses, getCompanyColor }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const companyColor = getCompanyColor(interview.company);
    const colors = colorClasses[companyColor];

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            onClick={() => onClick(interview)}
            className={`group relative rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col p-8 space-y-6 overflow-hidden ${colors.glow}`}
        >
            {/* Glass Decorative Overlay */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${colors.light} rounded-bl-[5rem] translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-700`} />

            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${colors.light} shadow-lg border border-slate-100 flex items-center justify-center p-3 group-hover:scale-110 transition-all duration-500 ${colors.border} group-hover:border-opacity-100`}>
                        <img src={interview.icon_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 leading-tight">
                            {interview.role}
                        </h4>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{interview.company}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${(() => {
                    const l = (interview.level || '').toLowerCase();
                    if (l.includes('junior') || l.includes('entry')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    if (l.includes('mid') || l.includes('intermediate')) return 'bg-blue-50 text-blue-700 border-blue-100';
                    if (l.includes('senior')) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
                    return 'bg-slate-50 text-slate-600 border-slate-100';
                })()}`}>
                    {interview.level}
                </span>
                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-sm shadow-slate-200">
                    {interview.type}
                </span>
            </div>

            <div className="flex items-center justify-between py-6 border-y border-slate-50">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                    <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-sm font-bold text-slate-700">{interview.total_duration}m</span>
                    </div>
                </div>
                <div className="w-[1px] h-8 bg-slate-100" />
                <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Curriculum</p>
                    <div className="flex items-center gap-2 justify-end">
                        <Layers className={`w-4 h-4 ${colors.text}`} />
                        <span className="text-sm font-bold text-slate-700">{interview.rounds?.length || 0} Phases</span>
                    </div>
                </div>
            </div>

            <div className="relative pt-4 overflow-hidden rounded-2xl">
                <button
                    className={`w-full py-4 rounded-2xl bg-slate-50 hover:bg-opacity-90 group-hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 shadow-sm ${(() => {
                        const hoverColor = colors.accent.split(' ')[0].replace('from-', 'bg-');
                        return `group-hover:${hoverColor}`;
                    })()}`}
                >
                    Initialize Simulation
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
});

export default PopularInterviewsPage;
