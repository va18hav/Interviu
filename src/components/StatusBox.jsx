import React from 'react'
import { MessageSquare } from 'lucide-react'

const StatusBox = ({ interviewState, currentQuestion, currentAnswer }) => {
    return (
        <div className="w-full">
            {/* Live Caption Style Box */}
            <div className="bg-gray-600/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/10 transition-all duration-300">
                <div className="px-6 py-4">
                    <div className="flex items-start gap-4">
                        {/* Avatar / Icon based on state */}
                        <div className="flex-shrink-0 mt-1">
                            {interviewState === "initializing" && (
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                </div>
                            )}
                            {interviewState === "ai-speaking" && (
                                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                            )}
                            {interviewState === "user-speaking" && (
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <span className="text-xs font-bold text-white">YOU</span>
                                </div>
                            )}
                            {(interviewState === "ending" || interviewState === "ended") && (
                                <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${interviewState === "ai-speaking" ? "text-cyan-300" :
                                    interviewState === "user-speaking" ? "text-green-300" :
                                        "text-slate-300"
                                    }`}>
                                    {interviewState === "initializing" && "System"}
                                    {interviewState === "ai-speaking" && "Interviewer"}
                                    {interviewState === "user-speaking" && "You"}
                                    {interviewState === "ending" && "System"}
                                </span>
                            </div>

                            <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                                {interviewState === "initializing" && "Please wait while we prepare your interview..."}
                                {interviewState === "ai-speaking" && (currentQuestion || <span className="animate-pulse text-white/50">Speaking...</span>)}
                                {interviewState === "user-speaking" && (currentAnswer || <span className="animate-pulse text-white/50">Listening...</span>)}
                                {interviewState === "ending" && "Wrapping up session..."}
                                {interviewState === "ended" && "Interview ended."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusBox