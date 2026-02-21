import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Brain, Code, MessageSquare, Terminal, ChevronRight, X, Loader2, Bug, Database, CodeXml } from 'lucide-react';
import Navbar from '../components/Navbar';

const InterviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type'); // 'sde' or 'devops'

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    const [completedRounds, setCompletedRounds] = useState({});
    const [currentScore, setCurrentScore] = useState(0);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [ttsProvider, setTtsProvider] = useState('google-cloud'); // Default to Google Cloud
    const [showCreditModal, setShowCreditModal] = useState(false);

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                if (!id) return;
                setCompletedRounds({});

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interviews/${id}?type=${type || 'sde'}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Interview not found');
                }

                if (!data) {
                    throw new Error('Interview not found');
                }

                // Normalize data
                setInterview({
                    ...data,
                    icon_url: data.icon_link
                });

                // Fetch completed interviews for progress tracking
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (userCreds?.id) {
                    const progressRes = await fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/curated?userId=${userCreds.id}&interviewId=${id}`);
                    if (progressRes.ok) {
                        const progressData = await progressRes.json();
                        const completedMap = {};
                        progressData.forEach(item => {
                            if (item.round_id && !completedMap[item.round_id]) {
                                // First match is the latest because API returns ordered by completed_at desc
                                completedMap[item.round_id] = item;
                            }
                        });
                        setCompletedRounds(completedMap);
                    }
                }
            } catch (err) {
                console.error("Error fetching interview details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviewDetails();
    }, [id, type]);




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

    // Calculate progress dynamically
    const progress = React.useMemo(() => {
        if (!interview || !interview.rounds || interview.rounds.length === 0) return 0;
        const totalRounds = interview.rounds.length;
        const completedCount = Object.keys(completedRounds).length;
        return Math.round((completedCount / totalRounds) * 100);
    }, [interview, completedRounds]);

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
                duration: `${round.duration}`,
                icon: round.type === 'behavioral' ? MessageSquare : round.type === 'debugging' ? Bug : round.type === 'design' ? Database : CodeXml,
                desc: round.overview,
                // Pass-through fields from new data structure
                flow: round.flow,
                persona: round.persona,
                problemData: round.problem, // Renamed to avoid confusion with actual problem fetching
                evaluation: round.evaluation,
                // New Feedback Data Fields
                evaluation_intelligence: round.evaluation_intelligence,
                candidate_reasoning_signals: round.candidate_reasoning_signals,
                // Legacy fields (if any still exist, keep for safety)
                slug: round.slug || round.questionSlug // Support both naming conventions
            });
        });
    }

    const rounds = roundsList.length > 0 ? roundsList : [];

    // Official Design Round Launcher
    async function startDesignRound(index, provider = ttsProvider) {
        const selectedRound = roundsList[index];
        const commonState = {
            role: interview.role,
            icon: interview.icon_url,
            name: `${interview.role}`,
            level: interview.level,
            company: interview.company,
            customInterview: false,
            roundKey: `${interview.id}-round-${index + 1}`,
            roundId: selectedRound.roundId,
            type: selectedRound.type,
            title: selectedRound.title,
            description: selectedRound.desc,
            flow: selectedRound.flow,
            persona: selectedRound.persona,
            roundProblemData: selectedRound.problemData,
            evaluation: selectedRound.evaluation,
            evaluation_intelligence: selectedRound.evaluation_intelligence,
            candidate_reasoning_signals: selectedRound.candidate_reasoning_signals,
            depthScaling: selectedRound.depthScaling,
            interviewContext: selectedRound.interviewContext,
            focusAspects: selectedRound.focusAspects,
            roundNum: index + 1,
            ttsProvider: provider // Pass selected provider
        };

        // Server-Side Credit Check
        try {
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) {
                console.error("No user found");
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/start-interview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userCreds.id,
                    context: commonState // Pass the state as context for prompt generation/logging
                }),
            });

            if (response.status === 403) {
                setShowCreditModal(true);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Success - Navigate
            navigate("/design-round", { state: commonState });

        } catch (error) {
            console.error("Error starting Design Round:", error);
            // Optionally show generic error toast here
        }
    }

    async function startRound(index) {
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

            // New Data Structure Passing
            flow: selectedRound.flow,
            persona: selectedRound.persona,
            roundProblemData: selectedRound.problemData, // Renamed
            evaluation: selectedRound.evaluation,
            evaluation_intelligence: selectedRound.evaluation_intelligence,
            candidate_reasoning_signals: selectedRound.candidate_reasoning_signals,

            // Legacy Context passing (keep for safety during migration)
            depthScaling: selectedRound.depthScaling,
            interviewContext: selectedRound.interviewContext,
            focusAspects: selectedRound.focusAspects,

            // Round Number for Coding Question Fetching
            roundNum: index + 1,
            slug: selectedRound.slug // Pass slug to CodingRound
        };

        // Server-Side Credit Check
        try {
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) {
                console.error("No user found");
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/start-interview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userCreds.id,
                    context: commonState
                }),
            });

            if (response.status === 403) {
                setShowCreditModal(true);
                return;
            }

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Success - Navigate based on type
            if (selectedRound.type === 'coding' || selectedRound.type === 'coding-algo' || selectedRound.type === 'coding-dsa') {

                navigate("/coding-round", {
                    state: commonState
                });
            } else if (selectedRound.type === 'debugging' || selectedRound.type === 'debug') {
                navigate("/debug-round", {
                    state: commonState
                });
            } else if (selectedRound.type === 'behavioral') {
                navigate("/behavioral-round", {
                    state: commonState
                });
            } else {
                navigate("/behavioral-round", {
                    state: commonState
                });
            }

        } catch (error) {
            console.error("Error starting Round:", error);
        }
    }

    // Modal Component
    const CreditWarningModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-red-600 fill-red-600" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">Insufficient Credits</h3>
                        <p className="text-slate-500 leading-relaxed">
                            You need at least <span className="font-semibold text-slate-900">5 credits</span> to start a new interview session.
                        </p>
                    </div>

                    <div className="w-full pt-4 flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/credits')}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                        >
                            <Star className="w-4 h-4 fill-white/20" />
                            Get More Credits
                        </button>
                        <button
                            onClick={() => setShowCreditModal(false)}
                            className="w-full bg-white hover:bg-slate-50 text-slate-600 font-medium py-3 px-4 rounded-xl transition-colors border border-slate-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {showCreditModal && <CreditWarningModal />}

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
                                    <span className="flex items-center gap-1.5 text-sm md:text-base"><Clock className="w-4 h-4" />{interview.total_duration} minutes</span>
                                    <span className="hidden md:block w-1 h-1 rounded-full bg-slate-400" />
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">{interview.level}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full md:w-64 space-y-2 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm mt-4 md:mt-0">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-700">Interview Progress</span>
                                <span className="text-slate-900 font-bold">{progress}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${colors.accent} transition-all duration-1000 ease-out`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 font-medium md:text-right">
                                {Object.keys(completedRounds).length} of {rounds.length} rounds completed
                            </p>
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
                                {rounds.map((round) => {
                                    const completionData = completedRounds[round.roundId];
                                    return (
                                        <div key={round.id} className="relative group p-4 rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col h-full shadow-sm">
                                            <div className={`absolute top-0 right-0 w-[100px] h-[100px] bg-gradient-to-br ${colors.bg} rounded-full blur-[40px] opacity-50`} />

                                            <div className="relative z-10 flex flex-col items-start gap-2 flex-grow">
                                                <div className="w-full flex items-start justify-between mb-4">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="text-sm font-bold text-slate-800 capitalize whitespace-nowrap">
                                                            {round.type} Round
                                                        </span>
                                                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {round.duration}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {completionData ? (
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                                                                <span className={`text-lg font-black ${completionData.score >= 7 ? 'text-green-600' : 'text-slate-900'}`}>
                                                                    {completionData.score}/10
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className={`w-10 h-10 rounded-lg ${colors.iconBg} border border-slate-200 flex items-center justify-center ${colors.iconText} transition-all`}>
                                                                <round.icon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">{round.title}</h3>
                                                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                                    {round.desc}
                                                </p>
                                            </div>

                                            <div className="relative z-10 flex gap-3 w-full mt-auto pt-2">
                                                {completionData ? (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/report', {
                                                                state: {
                                                                    isPastInterview: true,
                                                                    reportData: completionData.report_data,
                                                                    completedAt: completionData.completed_at,
                                                                    type: round.type,
                                                                    role: interview.role,
                                                                    firstName: 'Candidate'
                                                                }
                                                            })}
                                                            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm flex items-center justify-center gap-1.5 shadow-sm"
                                                        >
                                                            View Report
                                                        </button>
                                                        <button
                                                            onClick={round.type === 'design' ? () => startDesignRound(round.key) : () => startRound(round.key)}
                                                            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 hover:shadow-md transition-all text-sm flex items-center justify-center gap-1.5"
                                                        >
                                                            Retry
                                                        </button>
                                                    </>
                                                ) : (
                                                    round.type === 'design' ? (
                                                        <button
                                                            onClick={() => startDesignRound(round.key)}
                                                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                                                        >
                                                            Start Design Round
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => startRound(round.key)}
                                                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold shadow-md hover:bg-slate-800 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                                                            Start Round
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewDetails;
