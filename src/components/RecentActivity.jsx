import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, ChevronLeft, ChevronRight, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RecentActivity = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentInterviews = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (!userCreds?.id) return;

                const token = localStorage.getItem('authToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recent-interviews?userId=${userCreds.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setInterviews(data);
                }
            } catch (error) {
                console.error("Failed to fetch recent interviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentInterviews();
    }, []);

    useEffect(() => {
        if (interviews.length <= 1) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % interviews.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [interviews.length]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % interviews.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + interviews.length) % interviews.length);
    };

    const variants = {
        enter: (direction) => ({
            y: 20,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            y: -20,
            opacity: 0
        })
    };

    if (loading) {
        return (
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-full flex flex-col p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-3.5 w-24 bg-slate-800 rounded-full"></div>
                    <div className="h-40 w-full bg-slate-900 rounded-[1.5rem]"></div>
                </div>
            </div>
        );
    }

    if (interviews.length === 0) {
        return (
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-full flex flex-col p-8 justify-center items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto">
                        <Activity className="w-6 h-6 text-slate-700" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-lg font-black text-white tracking-tight">System Idle</h2>
                        <p className="text-xs text-slate-500 max-w-[180px] font-medium leading-relaxed mx-auto">No recent interview activity found in your history.</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentInterview = interviews[currentIndex];

    return (
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-full flex flex-col group">
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            <div className="relative z-10 flex-1 flex flex-col p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <div className="relative w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        </div>
                        <h2 className="text-[9px] font-black text-white uppercase tracking-[0.15em]">Recent Activity</h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button onClick={handlePrev} className="p-1.5 rounded-full border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={handleNext} className="p-1.5 rounded-full border border-slate-800 text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="relative flex-1">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentIndex}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                y: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="h-full flex flex-col"
                        >
                            <div
                                onClick={() => navigate(`/dashboard/interview-details/${currentInterview.id}`)}
                                className="flex-1 flex flex-col justify-between cursor-pointer"
                            >
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-[1rem] bg-white border border-slate-800 flex items-center justify-center p-3 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={currentInterview.icon_url}
                                                alt={currentInterview.company}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-black text-white truncate group-hover:text-indigo-400 transition-colors">
                                                {currentInterview.company}
                                            </h3>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                                {currentInterview.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                            <span className="text-slate-500">Progress</span>
                                            <span className="text-indigo-400">{currentInterview.progress}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${currentInterview.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-6 w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md"
                                >
                                    Continue
                                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {interviews.length > 1 && (
                    <div className="flex justify-center gap-1 mt-6">
                        {interviews.map((_, idx) => (
                            <motion.div
                                key={idx}
                                initial={false}
                                animate={{
                                    width: idx === currentIndex ? 16 : 4,
                                    backgroundColor: idx === currentIndex ? "#6366f1" : "#1e293b"
                                }}
                                className="h-0.5 rounded-full cursor-pointer"
                                onClick={() => {
                                    setDirection(idx > currentIndex ? 1 : -1);
                                    setCurrentIndex(idx);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
