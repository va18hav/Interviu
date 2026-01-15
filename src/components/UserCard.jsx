import React from 'react'

const UserCard = ({ interviewState, firstName }) => {
    return (
        <div
            className={`group w-full h-full bg-slate-900 rounded-2xl shadow-sm transition-all duration-500 relative overflow-hidden flex items-center justify-center ${interviewState === "user-speaking"
                ? "border-2 border-green-500 shadow-xl shadow-green-500/10"
                : "border border-gray-200"
                }`}
        >
            {/* Dark background for user camera usually looks better or more realistic as a placeholder for a cam feed */}
            <div className="absolute inset-0 bg-slate-800" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

            {/* Active Speaker Indicator Border */}
            {interviewState === "user-speaking" && (
                <div className="absolute inset-0 border-4 border-green-500/30 rounded-2xl z-10 pointer-events-none"></div>
            )}

            <div className="flex flex-col items-center justify-center gap-6 p-6 relative z-10 w-full">
                <div className="relative">
                    {/* Placeholder for Camera Feed */}
                    <div className="relative bg-slate-700 h-32 w-32 sm:h-40 sm:w-40 rounded-full shadow-inner flex items-center justify-center overflow-hidden border-4 border-slate-600">
                        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    {/* Active Mic Indicator */}
                    {interviewState === "user-speaking" && (
                        <div className="absolute -bottom-1 -right-1 bg-slate-800 p-1 rounded-full shadow-md z-20 border border-slate-700">
                            <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-slate-400 text-sm font-medium mt-2">Camera Off</p>
            </div>
        </div>
    )
}

export default UserCard