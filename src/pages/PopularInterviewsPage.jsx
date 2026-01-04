import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Star, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import Navbar from "../components/Navbar";
import popularInterviews from "./popularInterviews";

const PopularInterviewsPage = () => {
    const navigate = useNavigate();

    function startInterview(id) {
        sessionStorage.removeItem("interviewEnded");
        const interview = popularInterviews.find(interview => interview.id === id);
        if (!interview) return;

        navigate("/dashboard/stored-interview", {
            state: {
                role: interview.role,
                name: interview.name,
                level: interview.level,
                company: interview.company,
                duration: interview.duration,
                questionPool: interview.questions
            }
        });
    }

    return (
        <div className="min-h-screen bg-black/90">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Popular Interviews</h1>
                        <p className="text-slate-400 mt-1">Explore trending interview templates used by the community</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularInterviews.map((interview) => {
                        const colorClasses = {
                            cyan: { bg: "from-cyan-500/20 to-cyan-600/20", border: "border-cyan-500/20", text: "text-cyan-400", accent: "from-cyan-500 to-cyan-600" },
                            blue: { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/20", text: "text-blue-400", accent: "from-blue-500 to-blue-600" },
                            purple: { bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/20", text: "text-purple-400", accent: "from-purple-500 to-purple-600" },
                            pink: { bg: "from-pink-500/20 to-pink-600/20", border: "border-pink-500/20", text: "text-pink-400", accent: "from-pink-500 to-pink-600" },
                            green: { bg: "from-green-500/20 to-green-600/20", border: "border-green-500/20", text: "text-green-400", accent: "from-green-500 to-green-600" },
                            orange: { bg: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/20", text: "text-orange-400", accent: "from-orange-500 to-orange-600" }
                        };
                        const colors = colorClasses[interview.color] || colorClasses.cyan;

                        return (
                            <div
                                key={interview.id}
                                className="group rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer flex flex-col"
                            >
                                <div className="p-6 space-y-4 flex-1">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <img src={interview.icon} alt="" className="w-10 h-10 object-contain" />
                                    </div>

                                    {/* Header */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                                            {interview.role}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className={`px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs`}>
                                                {interview.company}
                                            </span>
                                            <span>•</span>
                                            <span>{interview.level}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm text-slate-400">{interview.participants || '1.2k'}</span>
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
                                </div>

                                {/* Action Button */}
                                <div className="p-4 pt-0">
                                    <button
                                        onClick={() => startInterview(interview.id)}
                                        className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-sm font-medium flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                                        Start Practice
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default PopularInterviewsPage;
