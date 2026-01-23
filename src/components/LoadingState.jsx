import React from 'react'

const FeedbackLoading = ({ header, description }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Outer Ring */}
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                    {/* Center Dot */}
                    <div className="absolute inset-0 m-auto w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-black">{header}</h3>
                    <p className="text-slate-400 text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default FeedbackLoading