import React from 'react'
import Navbar from '../components/Navbar'
import { Sparkles, FileText, Search, Wand2, FilePlus, Upload, Download, Eye, TrendingUp, Target, Award, ChevronRight, Check, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom'

const Resume = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
            <Navbar />
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                {/* Banner */}
                <div className='bg-gradient-to-br from-black/30 to-black/10 rounded-2xl p-4 flex flex-col justify-center items-start gap-2 z-50 shadow-xl border border-slate-800'>
                    <h1 className='text-2xl font-extrabold text-white'>Resume</h1>
                    <p className='text-white'>Create your resume and get ready to ace your next interview.</p>
                    {/* action */}
                    <div className='flex items-center gap-4'>
                        <button className='bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full text-cyan-400 font-medium hover:bg-cyan-500/20 transition-colors'>Analyse</button>
                        <button className='bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full text-cyan-400 font-medium hover:bg-cyan-500/20 transition-colors'>Create</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Resume