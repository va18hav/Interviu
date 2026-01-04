import React from 'react'

const UserCard = ({ interviewState, firstName }) => {
    return (
        <div
            className={`group flex-1 bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-600/10 backdrop-blur-2xl rounded-3xl shadow-2xl transition-all duration-500 h-full relative overflow-hidden ${interviewState === "user-speaking"
                ? "border-2 border-green-400/60 ring-4 ring-green-400/30 shadow-green-500/50"
                : "border border-white/20 hover:border-white/40"
                }`}
        >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${interviewState === "user-speaking" ? "opacity-100 animate-pulse" : ""
                }`}></div>

            <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8 h-full relative z-10">
                <div className="relative">
                    {/* Animated rings */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 opacity-20 blur-xl ${interviewState === "user-speaking" ? "animate-ping" : ""
                        }`}></div>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 opacity-10 ${interviewState === "user-speaking" ? "animate-pulse" : ""
                        }`} style={{ transform: "scale(1.2)" }}></div>

                    <div className="relative bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800 h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {/* Inner glow */}
                        <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    {interviewState === "user-speaking" && (
                        <div className="absolute bottom-2 right-2 bg-green-400 h-7 w-7 rounded-full border-4 border-slate-900 shadow-lg shadow-green-500/50 animate-pulse">
                            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">You</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-500/20 rounded-full border border-slate-400/30">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                        <p className="text-xs sm:text-sm text-slate-200 font-medium">{firstName}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard