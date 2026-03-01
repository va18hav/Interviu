import React from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import techBanner from "../assets/images/techbanner1.png"

const DashboardHeroBanner = ({ firstName }) => {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className='relative flex items-center justify-between rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl h-full group'
        >
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-indigo-500/10 to-transparent opacity-30 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
            </div>

            <div className="relative flex flex-col items-start z-10 px-12 py-14 md:px-16 space-y-6 w-full md:max-w-[65%]">
                {/* <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.15em]">Interactive Simulations</span>
                </motion.div> */}

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='font-sans text-5xl lg:text-6xl text-white font-black tracking-tighter leading-tight'
                >
                    Hi <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300'>{firstName},</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='text-base text-lg text-slate-400 max-w-sm font-medium leading-relaxed'
                >
                    Pick your target. Run the loop.
                    <br />
                    <span className='text-xl'>Find out where you stand.</span>
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/dashboard/all-popular-interviews')}
                    className="px-8 py-3.5 rounded-2xl bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.15em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2.5 group"
                >
                    Browse all Loops
                    <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="hidden md:block absolute right-0 top-0 bottom-0 w-[40%] z-0"
            >
                <img
                    src={techBanner}
                    alt=""
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(79,70,229,0.15)] group-hover:scale-105 transition-transform duration-700"
                />
            </motion.div>
        </motion.div>
    )
}

export default DashboardHeroBanner
