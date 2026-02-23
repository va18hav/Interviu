import React from 'react'

const InterviewerCard = ({ interviewState }) => {
    return (
        <div
            className={`group w-full h-full bg-white rounded-3xl shadow-sm transition-all duration-500 relative overflow-hidden flex items-center justify-center ${interviewState === "ai-speaking"
                ? "border-2 border-indigo-500 shadow-xl shadow-indigo-500/10"
                : "border border-slate-100"
                }`}
        >
            {/* Premium Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white" />

            {/* Active Speaker Indicator Border Effect */}
            {interviewState === "ai-speaking" && (
                <div className="absolute inset-0 border-4 border-indigo-100/30 rounded-3xl z-10 pointer-events-none animate-pulse"></div>
            )}

            <div className="flex flex-col items-center justify-center gap-6 p-6 relative z-10 w-full">
                <div className="relative">
                    {/* Animated Ripples */}
                    {interviewState === "ai-speaking" && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping opacity-45"></div>
                            <div className="absolute -inset-4 rounded-full bg-indigo-500/20 animate-pulse opacity-45"></div>
                        </>
                    )}

                    {/* Avatar Container */}
                    <div className="relative bg-slate-900 h-32 w-32 sm:h-40 sm:w-40 rounded-full shadow-2xl flex items-center justify-center z-10 overflow-hidden transform transition-all duration-500 group-hover:scale-105">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Active Mic Indicator */}
                    {interviewState === "ai-speaking" && (
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg z-20 border border-slate-50">
                            <div className="bg-indigo-500 w-6 h-6 rounded-full flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Visualizer Waves (Enhanced) */}
                <div className={`flex items-end gap-1.5 h-10 transition-opacity duration-300 ${interviewState === "ai-speaking" ? "opacity-100" : "opacity-0"}`}>
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                        <div key={i} className="w-1.5 bg-indigo-500/80 rounded-full" style={{
                            height: interviewState === "ai-speaking" ? `${30 + Math.random() * 70}%` : '4px',
                            transition: 'height 0.2s ease-in-out',
                            animation: interviewState === "ai-speaking" ? `wave ${0.4 + Math.random() * 0.4}s infinite alternate` : 'none',
                            animationDelay: `${i * 0.05}s`
                        }}></div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes wave {
                    from { transform: scaleY(0.5); }
                    to { transform: scaleY(1.5); }
                }
            `}</style>
        </div>
    )
}

const StatusBox = ({ interviewState, currentQuestion, currentAnswer }) => {
    return (
        <div className="w-full">
            {/* Live Caption Style Box - Premium Light Glass */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 transition-all duration-500 transform hover:scale-[1.01]">
                <div className="px-8 py-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar / Icon based on state */}
                        <div className="flex-shrink-0 mt-1">
                            {interviewState === "initializing" && (
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center animate-pulse">
                                    <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                </div>
                            )}
                            {interviewState === "ai-speaking" && (
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 ring-4 ring-slate-50">
                                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                            )}
                            {interviewState === "user-speaking" && (
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 ring-4 ring-slate-50">
                                    <span className="text-[10px] font-black text-white tracking-widest">USER</span>
                                </div>
                            )}
                            {(interviewState === "ending" || interviewState === "ended") && (
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-amber-500" />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${interviewState === "ai-speaking" ? "text-indigo-600 bg-indigo-50" :
                                        interviewState === "user-speaking" ? "text-green-600 bg-green-50" :
                                            "text-slate-500 bg-slate-50"
                                    }`}>
                                    {interviewState === "initializing" && "System Protocol"}
                                    {interviewState === "ai-speaking" && "Interviewer Signal"}
                                    {interviewState === "user-speaking" && "Candidate Feed"}
                                    {interviewState === "ending" && "Session Termination"}
                                </span>
                            </div>

                            <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed tracking-tight">
                                {interviewState === "initializing" && "Initializing production-grade interview environment..."}
                                {interviewState === "ai-speaking" && (currentQuestion || <span className="animate-pulse text-slate-300">Decoding response...</span>)}
                                {interviewState === "user-speaking" && (currentAnswer || <span className="text-slate-300">Listening...</span>)}
                                {interviewState === "ending" && "Analyzing session metrics and finalizing results..."}
                                {interviewState === "ended" && "Interview protocol completed successfully."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewerCard