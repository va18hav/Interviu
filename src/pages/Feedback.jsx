import React from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Star, TrendingUp, Award, Target, Brain, Zap, ThumbsUp, MessageSquare, ArrowRight, Download, Share2 } from 'lucide-react';

const InterviewFeedback = () => {
    const [isgenerated, setIsGenerated] = React.useState(true)
    const [hoveredStar, setHoveredStar] = React.useState(0);
    const [selectedRating, setSelectedRating] = React.useState(0);
    const [animatedScore, setAnimatedScore] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(true);
    const location = useLocation()
    const navigate = useNavigate()
    const { role, level, focus, feedbackData } = location.state || {}
    console.log("This is the feedback data from the interview: ", location.state)



    // Mock feedback data
    const overallScore = feedbackData.overallScore;

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
        { label: "Technical Knowledge", score: feedbackData.technicalKnowledge, icon: Brain, color: "cyan" },
        { label: "Communication Skills", score: feedbackData.communicationSkills, icon: MessageSquare, color: "blue" },
        { label: "Problem Solving", score: feedbackData.problemSolving, icon: Target, color: "purple" },
        { label: "Confidence Level", score: feedbackData.confidenceLevel, icon: Zap, color: "pink" },
        { label: "Job Ready Score", score: feedbackData.jobReadyScore, icon: Award, color: "green" }
    ];

    const strengths = feedbackData.keyStrengths;

    const improvements = feedbackData.areasToImprove;

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-400";
        if (score >= 60) return "text-cyan-400";
        return "text-yellow-400";
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
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">

            {isgenerated === false && <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-5xl font-bold text-white">Generating Feedback...</h1>
                <p className="text-lg text-slate-400">Please wait while we generate your feedback</p>
            </div>}


            {isgenerated === true && <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold text-white">
                        Interview <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Complete!</span>
                    </h1>
                    <p className="text-lg text-slate-400">Here's your detailed performance analysis</p>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Overall Score Card */}
                        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                            <div className="relative p-8">
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                                <div className="relative z-10 flex flex-col items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-slate-400 text-sm font-medium mb-2">Overall Performance</p>
                                        <div className="flex items-baseline gap-3 justify-center">
                                            <h2 className={`text-6xl font-bold ${getScoreColor(animatedScore)}`}>
                                                {animatedScore}
                                            </h2>
                                            <span className="text-3xl text-slate-500">/100</span>
                                        </div>
                                        <p className="mt-3 text-xl font-semibold text-white">{getScoreGrade(animatedScore)}</p>
                                    </div>

                                    {/* Circular Progress */}
                                    <div className="relative w-40 h-40">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="none"
                                                className="text-slate-800"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="url(#gradient)"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 70}`}
                                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - animatedScore / 100)}`}
                                                className="transition-all duration-200 ease-out"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#06b6d4" />
                                                    <stop offset="100%" stopColor="#3b82f6" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <TrendingUp className="w-12 h-12 text-cyan-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
                        </div>

                        {/* Strengths */}
                        <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-slate-900/40 backdrop-blur-xl shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                    <ThumbsUp className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Key Strengths</h3>
                            </div>

                            <ul className="space-y-3">
                                {strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-green-400" />
                                        </div>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Areas for Improvement */}
                        <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-slate-900/40 backdrop-blur-xl shadow-xl p-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Areas to Improve</h3>
                            </div>

                            <ul className="space-y-3">
                                {improvements.map((improvement, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        </div>
                                        <span>{improvement}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Performance Breakdown */}
                    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-xl p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-6 h-6 text-cyan-400" />
                            Performance Breakdown
                        </h3>

                        <div className="space-y-9 flex-1">
                            {metrics.map((metric, index) => {
                                const Icon = metric.icon;
                                const colorClasses = {
                                    cyan: "from-cyan-500 to-cyan-600",
                                    blue: "from-blue-500 to-blue-600",
                                    purple: "from-purple-500 to-purple-600",
                                    pink: "from-pink-500 to-pink-600",
                                    green: "from-green-500 to-green-600"
                                };

                                return (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[metric.color]}/20 border border-${metric.color}-500/20 flex items-center justify-center`}>
                                                    <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                                                </div>
                                                <span className="text-slate-300 font-medium">{metric.label}</span>
                                            </div>
                                            <span className={`text-xl font-bold ${getScoreColor(metric.score)}`}>
                                                {metric.score}%
                                            </span>
                                        </div>

                                        {/* Animated Progress Bar */}
                                        {/* <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClasses[metric.color]} rounded-full transition-all duration-1000 ease-out`}
                                                style={{
                                                    width: `${metric.score}%`,
                                                    animation: `slideIn 1s ease-out ${index * 0.1}s both`
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                            </div>
                                        </div> */}

                                        {/* Score Indicator Bars */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex items-center gap-1">
                                                {[20, 40, 60, 80, 100].map((threshold) => (
                                                    <div
                                                        key={threshold}
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 delay-${index * 100} ${metric.score >= threshold
                                                            ? `bg-gradient-to-r ${colorClasses[metric.color]}`
                                                            : 'bg-slate-700'
                                                            }`}
                                                        style={{
                                                            animation: metric.score >= threshold ? `fadeIn 0.3s ease-out ${(index * 0.1) + (threshold / 500)}s both` : 'none'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium min-w-[60px] text-right">
                                                {metric.score >= 80 ? 'Excellent' : metric.score >= 60 ? 'Good' : 'Fair'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Info Section */}
                        <div className="mt-8 pt-6 border-t border-slate-800/50">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            Your <span className="text-cyan-400 font-semibold">Job Ready Score</span> combines all performance metrics to indicate your overall preparedness for real interviews.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                        <div className="text-cyan-400 text-lg font-bold">15</div>
                                        <div className="text-xs text-slate-500">Questions</div>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                        <div className="text-blue-400 text-lg font-bold">32m</div>
                                        <div className="text-xs text-slate-500">Duration</div>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                                        <div className="text-purple-400 text-lg font-bold">8/10</div>
                                        <div className="text-xs text-slate-500">Accuracy</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rate Your Experience */}
                <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-2 text-center">Rate Your Experience</h3>
                    <p className="text-slate-400 text-sm text-center mb-6">How was your interview practice session?</p>

                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setSelectedRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="transform transition-all duration-200 hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    className={`w-12 h-12 transition-colors duration-200 ${star <= (hoveredStar || selectedRating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-slate-700'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {selectedRating > 0 && (
                        <div className="text-center animate-fade-in">
                            <p className="text-cyan-400 font-semibold">
                                {selectedRating === 5 ? "Awesome! 🎉" :
                                    selectedRating === 4 ? "Great! 👍" :
                                        selectedRating === 3 ? "Good! 😊" :
                                            selectedRating === 2 ? "Okay 🙂" :
                                                "We'll improve! 💪"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleGoToDashboard}
                        className="flex-1 group relative px-6 py-4 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 shadow-lg shadow-cyan-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative text-white flex items-center justify-center gap-2">
                            Go To Dashboard
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <button className="px-6 py-4 rounded-xl font-semibold text-base border border-slate-700 bg-slate-900/60 text-white hover:bg-slate-800/60 transition-all duration-300 flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Download Report
                    </button>
                </div>

            </div>}

            <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: var(--final-width);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </main >
    );
};

export default InterviewFeedback;