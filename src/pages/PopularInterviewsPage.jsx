import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Star, Clock, ChevronRight, TrendingUp } from 'lucide-react';
import Navbar from "../components/Navbar";
import TechInterviews from "./TechInterviews";
import PopularInterviewsBanner from "../components/PopularInterviewsBanner";

const PopularInterviewsPage = () => {
    const navigate = useNavigate();

    function startInterview(id) {
        sessionStorage.removeItem("interviewEnded");
        const interview = TechInterviews.find(interview => interview.id === id);
        if (!interview) return;

        // Flatten questions from rounds
        const questionPool = [];
        if (interview.rounds) {
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
        });
    }

    // Helper for company colors
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Popular Interviews</h1>
                        <p className="text-slate-500 mt-1">Explore trending interview templates used by the community</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TechInterviews.map((interview) => {
                        const colorKey = getCompanyColor(interview.company);

                        const colorClasses = {
                            cyan: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-200", text: "text-cyan-600", accent: "from-cyan-500 to-cyan-600" },
                            blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-600", accent: "from-blue-500 to-blue-600" },
                            purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-600", accent: "from-purple-500 to-purple-600" },
                            pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-600", accent: "from-pink-500 to-pink-600" },
                            green: { bg: "from-green-50 to-green-100", border: "border-green-200", text: "text-green-600", accent: "from-green-500 to-green-600" },
                            orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-600", accent: "from-orange-500 to-orange-600" },
                            red: { bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-600", accent: "from-red-500 to-red-600" }
                        };
                        const colors = colorClasses[colorKey] || colorClasses.cyan;

                        return (
                            <div
                                key={interview.id}
                                className="relative group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col shadow-sm"
                            >
                                <div className={`absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br ${colors.bg} rounded-full blur-[60px] opacity-60 -translate-y-1/2 translate-x-1/2`} />
                                <div className="p-6 space-y-4 flex-1">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <img src={interview.icon} alt="" className="w-10 h-10 object-contain" />
                                    </div>

                                    {/* Header */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1">
                                            {interview.company} {interview.role}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span className={`px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium`}>
                                                {interview.company}
                                            </span>
                                            <span>•</span>
                                            <span>{interview.level}</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">1.2k</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm text-slate-600">4.8</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">{interview.totalDuration}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="p-4 pt-0">
                                    <button
                                        onClick={() => navigate(`/dashboard/interview-details/${interview.id}`)}
                                        className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-200 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                                        View More
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
