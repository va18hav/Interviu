import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RecentActivity = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentInterviews = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (!userCreds?.id) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recent-interviews?userId=${userCreds.id}`);
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

    // Auto-cycle carousel
    useEffect(() => {
        if (interviews.length <= 1) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % interviews.length);
        }, 5000); // Cycle every 5 seconds

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
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95
        })
    };

    if (loading) {
        return (
            <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm h-full flex items-center justify-center p-10">
                <div className="animate-pulse flex flex-col items-center w-full">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-6 self-start"></div>
                    <div className="h-40 w-full bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (interviews.length === 0) {
        return (
            <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
                    <Clock className="w-12 h-12 mb-4 text-gray-200" />
                    <p className="font-medium">No recent interviews found</p>
                    <p className="text-sm">Start your first interview to see progress here!</p>
                </div>
            </div>
        );
    }

    const currentInterview = interviews[currentIndex];

    return (
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            {/* Carousel Content */}
            <div className="flex-1 px-4 pb-8 relative z-10 flex flex-col pt-8">
                <div className="flex items-center gap-2 flex-1">
                    {/* Left Button */}
                    {interviews.length > 1 && (
                        <button
                            onClick={handlePrev}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors shrink-0"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    <div className="relative min-h-[200px] flex-1">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }}
                                className="absolute inset-0"
                            >
                                <div
                                    onClick={() => navigate(`/dashboard/interview-details/${currentInterview.id}`)}
                                    className="shadow-lg h-full rounded-2xl border border-gray-200 bg-gray-50/50 p-6 flex flex-col justify-between hover:border-blue-200 hover:bg-white hover:shadow-xl cursor-pointer group transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                            <img
                                                src={currentInterview.icon_url}
                                                alt={currentInterview.company}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 truncate mb-2">
                                                {currentInterview.company} {currentInterview.role}
                                            </h3>
                                            {/* Progress Section moved up */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-bold">
                                                    <span className="text-gray-400 uppercase tracking-wider">Progress</span>
                                                    <span className="text-blue-600 font-black">{currentInterview.progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${currentInterview.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-blue-600 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="mt-6 w-full py-3 rounded-xl bg-gray-200 text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-all"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4 text-black" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Button */}
                    {interviews.length > 1 && (
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors shrink-0"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Dots Indicator */}
                {interviews.length > 1 && (
                    <>
                        <div className="flex justify-center gap-1.5 mt-8 mb-2">
                            {interviews.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={false}
                                    animate={{
                                        width: idx === currentIndex ? 24 : 6,
                                        backgroundColor: idx === currentIndex ? "#2563eb" : "#e5e7eb"
                                    }}
                                    className="h-1.5 rounded-full cursor-pointer"
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                />
                            ))}
                        </div>
                        <span className="text-center text-gray-400 text-sm">Continue your journey</span>
                    </>
                )}
            </div>

            {/* Subtle Gradient Spot */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-[60px] opacity-50"></div>
        </div>
    );
};

export default RecentActivity;
