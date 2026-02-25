import React from 'react'

const UserCard = ({ interviewState, firstName, lastName, first_name, last_name, avatar_url }) => {
    // Standardize names (handle both prop variants for safety)
    const fName = first_name || firstName || '';
    const lName = last_name || lastName || '';

    const getInitials = () => {
        const first = fName?.trim()?.charAt(0) || '';
        const last = lName?.trim()?.charAt(0) || '';
        return (first + last).toUpperCase() || 'U';
    };

    return (
        <div
            className={`group w-full h-full bg-white rounded-3xl shadow-sm transition-all duration-500 relative overflow-hidden flex items-center justify-center ${interviewState === "user-speaking"
                ? "border-2 border-green-500 shadow-xl shadow-green-500/10"
                : "border border-slate-100"
                }`}
        >
            {/* Premium Subtle Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white" />

            {/* Active Speaker Indicator Border */}
            {interviewState === "user-speaking" && (
                <div className="absolute inset-0 border-4 border-green-500/10 rounded-3xl z-10 pointer-events-none animate-pulse"></div>
            )}

            <div className="flex flex-col items-center justify-center gap-6 p-6 relative z-10 w-full">
                <div className="relative">
                    {/* Avatar Container */}
                    <div className={`relative h-32 w-32 sm:h-40 sm:w-40 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 transition-all duration-500 transform group-hover:scale-105 ${interviewState === "user-speaking" ? "bg-slate-900 border-green-500" : "bg-slate-900 border-white"
                        }`}>
                        {avatar_url && avatar_url !== 'null' && avatar_url !== 'undefined' ? (
                            <img
                                src={avatar_url}
                                alt="User"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                                {getInitials()}
                            </span>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Active Mic Indicator */}
                    {interviewState === "user-speaking" && (
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg z-20 border border-slate-50">
                            <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserCard
