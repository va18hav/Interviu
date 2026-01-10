import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import InteractiveGridBackground from './InteractiveGridBackground';

const HeroSection = () => {
    const navigate = useNavigate();
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    return (
        <div className="relative min-h-screen bg-black overflow-hidden selection:bg-cyan-500/30">
            {/* Interactive Grid Background */}
            <InteractiveGridBackground />

            {/* Navigation */}
            <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logo} alt="Intervyu" className="w-15 h-15 contrast-125 brightness-150" />
                        <span className="text-2xl font-extrabold text-white tracking-tighter">Inter<span className='text-cyan-400'>viu</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        {userCredentials ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-500 text-black/70 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-white hover:text-cyan-400 transition-colors hidden sm:block"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-5 py-2 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-500 text-black/70 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>



            {/* Subtle White Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white opacity-[0.15] blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-52 md:pt-32 pb-16 flex flex-col items-center text-center">

                {/* Announcement Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-medium text-slate-300">
                        New: <span className="text-white">AI Resume Analysis</span> is now live
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-center font-inter text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] tracking-[-0.03em]
               text-white
               drop-shadow-[0_0_40px_rgba(255,255,255,0.05)]
               drop-shadow-[0_0_80px_rgba(255,255,255,0.02)]">

                    <span className="block font-extrabold">
                        Practice smarter.
                    </span>

                    <span className="block font-extrabold 
                   bg-gradient-to-b from-cyan-400 to-cyan-500
                   bg-clip-text text-transparent tracking-tighter">
                        Interview better.
                    </span>

                </h1>


                {/* Subheading */}
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-200">
                    Master your next technical interview with realistic, voice-based AI simulations for Google, Amazon, and Meta. Get real-time feedback and detailed performance metrics.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                    <button
                        onClick={() => navigate('/login')}
                        className="h-12 px-8 rounded-full bg-gradient-to-b from-cyan-300/90 to-cyan-500/90 text-black/70 font-semibold text-base hover:bg-cyan-500 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/about')}
                        className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                        Learn more
                    </button>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
    );
};

export default HeroSection;
