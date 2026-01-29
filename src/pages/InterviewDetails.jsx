import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Brain, Code, MessageSquare, Terminal, ChevronRight, X, Loader2, Bug } from 'lucide-react';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';

const InterviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type'); // 'sde' or 'devops'

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    const [completedRounds, setCompletedRounds] = useState({});
    const [progress, setProgress] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                if (!id) return;

                let data, error;

                // Fetch based on type parameter
                if (type === 'devops') {
                    ({ data, error } = await supabase
                        .from('devops_interviews')
                        .select('*')
                        .eq('id', id)
                        .single());
                } else {
                    // Default to sde_interviews (for type='sde' or missing type)
                    ({ data, error } = await supabase
                        .from('sde_interviews')
                        .select('*')
                        .eq('id', id)
                        .single());
                }

                // Fallback / Error Handling
                if (error) {
                    // Optional: If specific not found and no type specified, could try other table
                    // But explicitly respecting the type is safer to avoid ID collisions.
                    throw error;
                }

                if (!data) {
                    throw new Error('Interview not found');
                }

                // Normalize data
                setInterview({
                    ...data,
                    icon_url: data.icon_link
                });
            } catch (err) {
                console.error("Error fetching interview details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviewDetails();
    }, [id, type]);

    useEffect(() => {
        const fetchCompletedRounds = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user || !interview) return;

                const { data, error } = await supabase
                    .from('interviews')
                    .select('feedback_data, score') // Fetch score column as well
                    .eq('user_id', user.id)
                    .eq('role', interview.role);

                if (error) throw error;

                const map = {};
                let completedCount = 0;
                let totalScore = 0;

                if (data) {
                    data.forEach(entry => {
                        const feedback = entry.feedback_data;
                        if (feedback && feedback.roundKey) {
                            // Prevent cross-talk between companies with same role name
                            if (feedback.company && feedback.company !== interview.company) {
                                return;
                            }
                            map[feedback.roundKey] = { ...feedback, dbScore: parseFloat(entry.score) || 0 };
                            completedCount++;
                            // Safely handle score addition
                            const score = parseFloat(entry.score) || 0;
                            totalScore += score;
                        }
                    });
                }
                setCompletedRounds(map);

                // Calculate Progress and Score
                let roundsCount = 0;
                if (interview.rounds) {
                    if (interview.rounds.techRoundOne) roundsCount++;
                    if (interview.rounds.techRoundTwo) roundsCount++;
                    if (interview.rounds.techRoundThree) roundsCount++;
                    if (interview.rounds.behavioral) roundsCount++;
                } else {
                    roundsCount = 5; // Fallback
                }

                const newProgress = roundsCount > 0 ? Math.round((completedCount / roundsCount) * 100) : 0;
                setProgress(newProgress);

                // Calculate Average Score (out of 10)
                const avgScore = completedCount > 0 ? (totalScore / completedCount) : 0;
                setCurrentScore((avgScore / 10).toFixed(1));

            } catch (err) {
                console.error("Error fetching completed rounds:", err);
            }
        };

        if (interview) {
            fetchCompletedRounds();
        }
    }, [id, interview]);

    // Helper for company colors
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-slate-800 animate-spin" />
            </div>
        );
    }

    if (!interview) {
        return <div className="text-slate-900 min-h-screen flex items-center justify-center">Interview not found</div>;
    }

    const colorKey = getCompanyColor(interview.company);
    const colorClasses = {
        cyan: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-200", text: "text-cyan-600", accent: "from-cyan-500 to-cyan-600", iconBg: "bg-cyan-50", iconText: "text-cyan-600" },
        blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-600", accent: "from-blue-500 to-blue-600", iconBg: "bg-blue-50", iconText: "text-blue-600" },
        purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-600", accent: "from-purple-500 to-purple-600", iconBg: "bg-purple-50", iconText: "text-purple-600" },
        pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-600", accent: "from-pink-500 to-pink-600", iconBg: "bg-pink-50", iconText: "text-pink-600" },
        green: { bg: "from-green-50 to-green-100", border: "border-green-200", text: "text-green-600", accent: "from-green-500 to-green-600", iconBg: "bg-green-50", iconText: "text-green-600" },
        orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-600", accent: "from-orange-500 to-orange-600", iconBg: "bg-orange-50", iconText: "text-orange-600" },
        red: { bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-600", accent: "from-red-500 to-red-600", iconBg: "bg-red-50", iconText: "text-red-600" }
    };
    const colors = colorClasses[colorKey] || colorClasses.cyan;

    // Mapping rounds to UI structure
    const roundsList = [];
    if (interview.rounds && Array.isArray(interview.rounds)) {
        interview.rounds.forEach((round, index) => {
            roundsList.push({
                id: index + 1,
                key: index, // Use index as key for now since we traverse array
                roundId: round.id, // Actual ID from JSON
                title: round.title,
                type: round.type, // 'coding', 'design', 'behavioral', 'debugging'
                duration: `${round.duration} min`,
                icon: round.type === 'behavioral' ? MessageSquare : round.type === 'debugging' ? Bug : Code,
                desc: round.overview,
                // Pass-through fields
                depthScaling: round.depthScaling,
                interviewContext: round.interviewContext,
                focusAspects: round.focusAspects,
                flow: round.flow,
                evaluation: round.evaluation,
            });
        });
    }

    const rounds = roundsList.length > 0 ? roundsList : [];

    async function startRound(index) {
        try {
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
        } catch (error) {
            console.error("Error checking credits:", error);
        }

        sessionStorage.removeItem("interviewEnded");

        const selectedRound = roundsList[index]; // Use the parsed roundsList

        const commonState = {
            role: interview.role,
            icon: interview.icon_url, // Use normalized icon_url
            name: `${interview.role}`,
            level: interview.level,
            company: interview.company,
            customInterview: false,
            roundKey: `${interview.id}-round-${index + 1}`, // Unique key for progress tracking
            roundId: selectedRound.roundId,
            type: selectedRound.type,
            title: selectedRound.title,
            description: selectedRound.desc,
            // Context passing
            depthScaling: selectedRound.depthScaling,
            interviewContext: selectedRound.interviewContext,
            focusAspects: selectedRound.focusAspects,
            flow: selectedRound.flow,
            evaluation: selectedRound.evaluation,
            // Round Number for Coding Question Fetching
            roundNum: index + 1
        };

        if (selectedRound.type === 'coding') {
            // Check if it's a DevOps role to route to the specialized page
            const isDevOps = interview.role.toLowerCase().includes('devops') ||
                interview.role.toLowerCase().includes('sre') ||
                interview.role.toLowerCase().includes('reliability');

            if (isDevOps) {
                navigate("/devops-coding-interview", {
                    state: commonState
                });
            } else {
                navigate("/coding-interview", {
                    state: commonState
                });
            }
        } else {
            navigate("/create/interview/session", {
                state: commonState
            });
        }
    }

    async function resetProgress() {
        if (!confirm("Are you sure you want to reset your progress? This will delete all your interview history and feedback for this role.")) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: existingInterviews } = await supabase
                .from('interviews')
                .select('id, feedback_data')
                .eq('user_id', user.id)
                .eq('role', interview.role);

            if (existingInterviews && existingInterviews.length > 0) {
                const idsToDelete = [];
                existingInterviews.forEach(entry => {
                    const fb = entry.feedback_data;
                    if (fb && fb.company === interview.company) {
                        idsToDelete.push(entry.id);
                    }
                });

                if (idsToDelete.length > 0) {
                    const { error } = await supabase
                        .from('interviews')
                        .delete()
                        .in('id', idsToDelete);

                    if (error) throw error;
                    setCompletedRounds({});
                    setProgress(0);
                    setCurrentScore(0);
                }
            }
        } catch (error) {
            console.error("Error resetting progress:", error);
            alert("Failed to reset progress.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header & Buttons */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Interviews</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {progress > 0 && (
                            <button
                                onClick={() => setShowDetailsPopup(true)}
                                className={`text-sm font-semibold px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm`}
                            >
                                View Details
                            </button>
                        )}

                        {progress > 0 && (
                            <button
                                onClick={resetProgress}
                                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                Reset Progress
                            </button>
                        )}
                    </div>
                </div>

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm p-5 sm:p-6 md:p-8">
                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${colors.bg} rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60`} />

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center p-2 bg-white shadow-lg border border-slate-100 shrink-0`}>
                                <img src={interview.icon_url} alt={interview.company} className="w-full h-full object-contain" />
                            </div>
                            <div className="space-y-3 md:space-y-2">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">{interview.role}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-slate-500">
                                    <span className="flex items-center gap-1.5 text-sm md:text-base"><Clock className="w-4 h-4" />{interview.total_duration}</span>
                                    <span className="hidden md:block w-1 h-1 rounded-full bg-slate-400" />
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">{interview.level}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 items-center justify-center w-full md:w-auto'>
                            {progress > 0 && <div className="w-full max-w-[280px] md:w-[200px] flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500 font-medium">Progress</span>
                                    <span className={`text-sm font-bold ${colors.text}`}>{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`bg-gradient-to-r ${colors.accent} h-1.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>}
                            {progress > 0 && <div className="w-full max-w-[280px] md:w-[200px] flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <span className="text-sm text-slate-500 font-medium">Current Score</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    <span className="text-sm font-bold text-slate-900">{currentScore}/10</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Left Column: Details & Skills */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Role Overview Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 h-full shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                    Role Overview
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-base">
                                    {interview.overview}
                                </p>
                            </div>

                            {/* Skills Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 h-full shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                    Required Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {(interview.skills || ['Data Structures', 'Algorithms', 'System Design']).map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium hover:border-slate-300 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rounds Section */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                Interview Rounds ({rounds.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rounds.map((round) => (
                                    <div key={round.id} className="relative group p-4 rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col h-full shadow-sm">
                                        <div className={`absolute top-0 right-0 w-[100px] h-[100px] bg-gradient-to-br ${colors.bg} rounded-full blur-[40px] opacity-50`} />

                                        <div className="relative z-10 flex flex-col items-start gap-2 flex-grow">
                                            <div className="w-full flex items-center justify-between gap-4 mb-4">
                                                <div className={`w-10 h-10 rounded-lg ${colors.iconBg} border border-slate-200 flex items-center justify-center ${colors.iconText} transition-all`}>
                                                    <round.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                                    {round.duration}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">{round.title}</h3>
                                            {/* <div className="flex flex-wrap gap-2 mb-3">
                                                {typeof round.type === 'string' && round.type.split(',').map((t, i) => (
                                                    <span key={i} className={`text-[10px] font-semibold ${colors.text} ${colors.bg} border ${colors.border} px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div> */}
                                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                                {round.desc}
                                            </p>
                                        </div>
                                        <div className="relative z-10 flex gap-3 w-full mt-auto pt-2">
                                            <button
                                                onClick={() => startRound(round.key)}
                                                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                                                {completedRounds[round.key] ? "Retry Round" : "Start Round"}
                                            </button>
                                            {completedRounds[round.key] && (
                                                <button
                                                    onClick={() => navigate('/dashboard/interview/feedback', { state: completedRounds[round.key] })}
                                                    className={`flex-1 px-4 py-2.5 rounded-xl bg-white border ${colors.border} ${colors.text} font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm group/btn shadow-sm`}>
                                                    Feedback
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Completed Rounds Details Popup */}
            {showDetailsPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-900">Completed Rounds</h2>
                            <button
                                onClick={() => setShowDetailsPopup(false)}
                                className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {rounds.filter(r => completedRounds[r.key]).map((round) => {
                                const details = completedRounds[round.key];
                                const score = details.dbScore !== undefined ? details.dbScore : 0;

                                return (
                                    <div key={round.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm`}>
                                                <round.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">{round.title}</h3>
                                                <p className="text-xs text-slate-500">{new Date(details.timestamp || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-bold ${score >= 80 ? 'text-green-600' :
                                                score >= 50 ? 'text-cyan-600' :
                                                    'text-orange-500'
                                                }`}>
                                                {score}/100
                                            </span>
                                            <p className="text-xs text-slate-600">Score</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewDetails;
