import React from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Star, TrendingUp, Award, Target, Brain, Zap, ThumbsUp, MessageSquare, ArrowRight, ArrowDown, Download, Share2, ChevronDown, ChevronUp, X, CheckCircle, Clock, Calendar, User, Building2, Layers, FileText } from 'lucide-react';
import Navbar from "../components/Navbar";

const InterviewFeedback = () => {
    const [isgenerated, setIsGenerated] = React.useState(true)
    const [hoveredStar, setHoveredStar] = React.useState(0);
    const [selectedRating, setSelectedRating] = React.useState(0);
    const [animatedScore, setAnimatedScore] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(true);
    const location = useLocation()
    const navigate = useNavigate()
    const [expandedMetric, setExpandedMetric] = React.useState(null);
    const feedbackData = location.state || {}
    console.log("This is the feedback data from the interview: ", location.state)



    // Mock feedback data
    const overallScore = feedbackData.overallScore;
    // const qnaData = feedbackData.qna || []; // REMOVED

    // Animate score on mount
    React.useEffect(() => {
        let startTime;
        const duration = 2000; // 2 seconds

        const animateScore = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
            const currentScore = Math.floor(easeOutQuart * overallScore);

            setAnimatedScore(currentScore);

            if (percentage < 1) {
                requestAnimationFrame(animateScore);
            } else {
                setIsAnimating(false);
            }
        };

        requestAnimationFrame(animateScore);
    }, [overallScore]);
    const metrics = [
        {
            label: "Technical Knowledge",
            score: feedbackData.technicalKnowledgeScore || 0,
            rating: feedbackData.technicalKnowledge, // e.g. "solid"
            icon: Brain,
            color: "slate",
            description: feedbackData.technicalKnowledgeJustification
        },
        {
            label: "Communication Skills",
            score: feedbackData.communicationSkillsScore || 0,
            rating: feedbackData.communicationClarity, // e.g. "high"
            icon: MessageSquare,
            color: "slate",
            description: feedbackData.communicationSkillsJustification
        },
        {
            label: "Problem Solving",
            score: feedbackData.problemSolvingScore || 0,
            rating: feedbackData.problemSolving, // e.g. "basic"
            icon: Target,
            color: "slate",
            description: feedbackData.problemSolvingJustification
        },
        {
            label: "Confidence Level",
            score: feedbackData.confidenceLevelScore || 0,
            rating: feedbackData.confidenceSignal, // e.g. "moderate"
            icon: Zap,
            color: "slate",
            description: feedbackData.confidenceLevelJustification
        },
        {
            label: "Job Ready Score",
            score: feedbackData.jobReadyScore || 0,
            rating: feedbackData.jobReadyScore > 70 ? "Ready" : "Not Ready",
            icon: Award,
            color: "slate",
            description: feedbackData.jobReadyScoreJustification
        }
    ];

    const strengths = feedbackData.keyStrengths;

    const improvements = feedbackData.areasToImprove;

    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-700";
        if (score >= 60) return "text-blue-700";
        return "text-amber-700";
    };

    const getScoreGrade = (score) => {
        if (score >= 90) return "Excellent";
        if (score >= 80) return "Very Good";
        if (score >= 70) return "Good";
        if (score >= 60) return "Fair";
        return "Needs Improvement";
    };



    function handleGoToDashboard() {
        navigate("/dashboard")
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20 font-sans text-slate-800">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8">

                {/* Report Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium uppercase tracking-wider">
                            <FileText className="w-4 h-4" />
                            <span>Interview Assessment Report</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {feedbackData.company || feedbackData.role} Session
                        </h1>
                        <div className="flex flex-wrap gap-3 pt-1">
                            {!feedbackData.customInterview && feedbackData.company && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-200 text-sm font-medium text-slate-700">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    {feedbackData.company}
                                </span>
                            )}
                            {!feedbackData.customInterview && feedbackData.roundType && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-200 text-sm font-medium text-slate-700">
                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                    {feedbackData.roundType}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-gray-200 text-sm font-medium text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                {feedbackData.duration || "15 min"}
                            </span>
                        </div>
                    </div>

                    {/* New Badges for Negative Signals */}
                    <div className="flex gap-3 pt-2">
                        {feedbackData.interviewerInterventionNeeded && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 uppercase tracking-wide">
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                Intervention Required
                            </span>
                        )}
                        {feedbackData.genericResponsesObserved && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 border border-red-200 text-xs font-bold text-red-700 uppercase tracking-wide">
                                <Award className="w-3.5 h-3.5 text-red-500" />
                                Generic Responses
                            </span>
                        )}
                    </div>


                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleGoToDashboard}
                            className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                            Return to Dashboard
                        </button>
                        <button className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Left 2/3 */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Executive Summary Section */}
                        <section className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-baseline justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-slate-400" />
                                    Executive Summary
                                </h2>
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                                    {feedbackData.summary || "No summary available for this interview."}
                                </p>
                            </div>

                            {/* <div className="mt-6 pt-6 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => setShowAnswersModal(true)}
                                    className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
                                >
                                    View Full Transcript & Answers <ArrowRight className="w-3 h-3" />
                                </button>
                            </div> */}
                        </section>

                        {/* Detailed Metrics Section */}
                        <section className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-slate-400" />
                                    Performance Metrics
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {metrics.map((metric, index) => {
                                    const Icon = metric.icon;
                                    const isExpanded = expandedMetric === index;

                                    return (
                                        <div key={index} className="group hover:bg-gray-50/50 transition-colors">
                                            <button
                                                onClick={() => setExpandedMetric(isExpanded ? null : index)}
                                                className="w-full flex items-center justify-between p-8 focus:outline-none"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="font-semibold text-slate-900">{metric.label}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5">Click for details</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="w-32 hidden sm:block">
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${metric.score >= 80 ? 'bg-emerald-600' : metric.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'}`}
                                                                style={{ width: `${metric.score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={`text-lg font-bold w-full sm:w-auto text-right ${getScoreColor(metric.score)} flex flex-col items-end`}>
                                                        <span>{metric.score}%</span>
                                                        {metric.rating && (
                                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                                                                {metric.rating}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isExpanded ?
                                                        <ChevronUp className="w-5 h-5 text-gray-400" /> :
                                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                                    }
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-6 pb-6 pt-0 ml-[4.5rem]">
                                                    <div className="text-sm text-slate-600 bg-white border border-gray-100 rounded-lg p-4 leading-relaxed">
                                                        <span className="font-medium text-slate-900 block mb-1">Feedback:</span>
                                                        {metric.description}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                    </div>

                    {/* Sidebar - Right 1/3 */}
                    <div className="space-y-8">

                        {/* Overall Score Card */}
                        <div className="bg-white rounded-xl border border-gray-200 px-8 py-4 text-center shadow-sm">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Overall Score</p>

                            <div className="relative w-48 h-48 mx-auto mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-gray-100"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 88}`}
                                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - animatedScore / 100)}`}
                                        className={`${animatedScore >= 80 ? 'text-emerald-600' : animatedScore >= 60 ? 'text-blue-600' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-bold tracking-tighter ${getScoreColor(animatedScore)}`}>
                                        {animatedScore}
                                    </span>
                                    <span className="text-sm font-medium text-slate-400 mt-1">out of 100</span>
                                </div>
                            </div>

                            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${animatedScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                animatedScore >= 60 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                {getScoreGrade(animatedScore)}
                            </div>
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <ThumbsUp className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-900">Key Strengths</h3>
                                </div>
                                <ul className="space-y-3">
                                    {strengths.map((str, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                            <span className="leading-snug">{str}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <ArrowDown className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-bold text-slate-900">Areas for Improvement</h3>
                                </div>
                                <ul className="space-y-3">
                                    {improvements.map((imp, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            <span className="leading-snug">{imp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Experience Rating */}
                        <div className="bg-white rounded-xl border border-gray-200 p-7 shadow-sm text-center">
                            <h3 className="font-bold text-slate-900 mb-4 text-sm">Rate this Session</h3>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setSelectedRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-6 h-6 ${star <= (hoveredStar || selectedRating)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div >

            </div >

            {/* Answers Modal REMOVED */}
        </main >
    );
};

export default InterviewFeedback;
