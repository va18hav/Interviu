import React from 'react'

const StatusBox = ({ interviewState, currentQuestion, currentAnswer }) => {
    return (
        <div className="max-w-7xl mx-auto w-full flex-shrink-0 relative z-10">
            <div className="border border-white/20 rounded-3xl shadow-2xl overflow-hidden bg-slate-800/50">
                <div className="px-2 py-2 lg:px-6 lg:py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0 relative">
                                {interviewState === "initializing" && (
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-3 shadow-lg shadow-purple-500/30 animate-pulse">
                                            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-0 bg-purple-400/30 rounded-2xl blur-xl animate-pulse"></div>
                                    </div>
                                )}
                                {interviewState === "ai-speaking" && (
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-3 shadow-lg shadow-cyan-500/30">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-xl"></div>
                                    </div>
                                )}
                                {interviewState === "user-speaking" && (
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 shadow-lg shadow-green-500/30">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-0 bg-green-400/30 rounded-2xl blur-xl"></div>
                                    </div>
                                )}
                                {interviewState === "ending" || interviewState === "ended" && (
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl p-3 shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base sm:text-lg font-semibold text-white">
                                    {interviewState === "initializing" && "Please wait while we prepare your interview"}
                                    {interviewState === "ai-speaking" && (currentQuestion || "Interviewer speaking...")}
                                    {interviewState === "user-speaking" && (currentAnswer || "Listening… You can speak now.")}
                                    {interviewState === "ending" && "Ending interview…"}
                                    {interviewState === "ended" && "Interview ended"}
                                </p>
                                <span className="text-xs text-slate-400 font-medium">
                                    {interviewState === "initializing" && "Setting up your session"}
                                    {interviewState === "ai-speaking" && "AI is responding"}
                                    {interviewState === "user-speaking" && "Microphone active"}
                                    {interviewState === "ending" && "Wrapping up"}
                                    {interviewState === "ended" && "Get your feedback"}
                                </span>
                            </div>
                        </div>

                        {/* Enhanced audio visualizer - moved to right, only for AI speaking */}
                        {interviewState === "ai-speaking" && (
                            <div className="flex-shrink-0 hidden lg:block">
                                <div className="flex gap-1.5 items-end h-12">
                                    {[0, 150, 300, 450, 600, 150, 400, 200, 500, 100, 350, 250, 200, 350, 100, 450].map((delay, i) => {
                                        // Generate random heights for more natural variation
                                        const randomHeight = 16 + Math.floor(Math.random() * 40);
                                        return (
                                            <div
                                                key={i}
                                                className="w-1.5 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full transition-all duration-300 animate-pulse"
                                                style={{
                                                    animationDelay: `${delay}ms`,
                                                    height: `${randomHeight}px`
                                                }}
                                            ></div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusBox