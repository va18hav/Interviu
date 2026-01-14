import React from 'react'
import bot from "../assets/images/bot.png"
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'

const DashboardBanner = ({ firstName }) => {
    const navigate = useNavigate()
    return (
        <div className="bg-gradient-to-br from-slate-100/90 to-slate-100/80 relative rounded-2xl overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from black/100 via black/60 to black/100" />
            <div className="absolute top-10 -right-0 w-50 md:w-64 lg:w-80 h-50 md:h-64 lg:h-80 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 -left-0 w-50 md:w-64 lg:w-80 h-50 md:h-64 lg:h-80 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 px-6 md:px-8 lg:px-16 py-16 md:py-6 lg:pt-38 lg:pb-18 flex items-center justify-between">
                <img src={bot} alt="" className="hidden lg:block absolute -bottom-29 -right-10 w-100 -rotate-[20deg] hover:scale-105 transition-all duration-300" />
                <div className="max-w-2xl space-y-6">
                    <h2 className="font-sans text-5xl md:text-7xl font-extrabold text-black tracking-tight">
                        <span className="bg-gradient-to-r from-black/90 via-black/70 to-black/50 bg-clip-text text-transparent">Hi {firstName}!</span>
                    </h2>

                    <p className="font-space text-sm lg:text-xl text-slate-900 tracking-tight">
                        Practice with AI-generated interviews tailored to your specific role, level and skills. Get instant feedback to land your dream job.
                    </p>

                    <div className="flex items-center gap-4 pt-4">


                        <button
                            onClick={() => navigate('/create')}
                            className="group relative px-5 md:px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 shadow-lg shadow-cyan-500/30">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/80 to-cyan-400/90 transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative text-black flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>



                        <button
                            onClick={() => navigate('/dashboard/all-previous-interviews')}
                            className="hidden md:block px-8 py-4 rounded-2xl font-semibold text-base border border-slate-700 bg-slate-200/20 text-black hover:bg-slate-200/60 transition-all backdrop-blur-sm">
                            View Past Interviews
                        </button>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default DashboardBanner