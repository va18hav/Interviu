import React from 'react'

const InterviewerCard = ({ interviewState }) => {
    return (
        <div
            className={`group w-full h-full bg-white rounded-2xl shadow-sm transition-all duration-500 relative overflow-hidden flex items-center justify-center ${interviewState === "ai-speaking"
                ? "border-2 border-cyan-500 shadow-xl shadow-cyan-500/10"
                : "border border-gray-200"
                }`}
        >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />

            {/* Active Speaker Indicator Border Effect */}
            {interviewState === "ai-speaking" && (
                <div className="absolute inset-0 border-4 border-cyan-100/50 rounded-2xl z-10 pointer-events-none animate-pulse"></div>
            )}

            <div className="flex flex-col items-center justify-center gap-6 p-6 relative z-10 w-full">
                <div className="relative">
                    {/* Animated Ripples */}
                    {interviewState === "ai-speaking" && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-45"></div>
                            <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-pulse opacity-45"></div>
                        </>
                    )}

                    {/* Avatar Container */}
                    <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 h-32 w-32 sm:h-40 sm:w-40 rounded-full shadow-xl flex items-center justify-center z-10 overflow-hidden transform transition-transform duration-500 group-hover:scale-105">
                        {/* Abstract Avatar Pattern caused by CSS */}
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Active Mic Indicator */}
                    {interviewState === "ai-speaking" && (
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md z-20">
                            <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Visualizer Waves (Fake) */}
                {interviewState === "ai-speaking" && (
                    <div className="flex items-end gap-1 h-8">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1.5 bg-cyan-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: '0.4s', animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewerCard