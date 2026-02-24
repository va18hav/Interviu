import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import bot from "../assets/images/bot.png"
import configure from "../assets/images/custominterview2.png"

const CustomInterviewBanner = ({ firstName }) => {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group"
        >
            {/* Cinematic Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
            </div>

            <div className="relative z-10 px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl space-y-8 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mx-auto md:mx-0">
                            <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.15em]">Flexibile Setup</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                            Custom Interview <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">Configuration.</span>
                        </h2>
                        <p className="text-base text-slate-400 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                            Configure your interview session by selecting specific roles, difficulty levels, and technical rounds to match your preparation needs.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                        <button
                            onClick={() => navigate('/create')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-400 text-white font-black text-[10px] uppercase tracking-[0.15em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2.5 group"
                        >
                            <Plus className="w-4 h-4" />
                            Create Custom Session
                            <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/all-previous-interviews')}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-800 bg-white/5 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            View History
                        </button>
                    </div>
                </div>

                <div className="relative w-full md:w-auto flex justify-center md:block">
                    <img
                        src={configure}
                        alt=""
                        className="relative z-10 w-48 md:w-134 object-contain drop-shadow-[0_0_40px_rgba(79,70,229,0.2)] group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
                </div>
            </div>
        </motion.div>
    )
}

export default CustomInterviewBanner
