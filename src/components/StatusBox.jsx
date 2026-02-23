import React from 'react'
import { MessageSquare } from 'lucide-react'

const StatusBox = ({ interviewState, currentQuestion, currentAnswer }) => {
    return (
        <div className="w-full">
            {/* Live Caption Style Box - Premium Light Glass */}
            <div className="bg-white/40 md:bg-white/80 backdrop-blur-md md:backdrop-blur-xl rounded-[2.5rem] shadow-lg md:shadow-2xl overflow-hidden border border-white/40 transition-all duration-500 transform hover:scale-[1.01]">
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
                                {interviewState === "user-speaking" && (currentAnswer || <span className="text-slate-300">Processing input...</span>)}
                                {interviewState === "ending" && "Finalizing evaluation report..."}
                                {interviewState === "ended" && "Session successfully concluded."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusBox