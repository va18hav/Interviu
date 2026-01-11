import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Mic } from 'lucide-react';
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
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logo} alt="Intervyu" className="w-15 h-15 contrast-125 brightness-150" />
                        <span className="text-2xl font-extrabold text-white tracking-tighter">Inter<span className='text-cyan-400'>viu</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        {userCredentials ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-full bg-white/80 text-slate-900 hover:scale-105 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
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
                                    className="px-5 py-2 rounded-full bg-white/80 text-slate-900 hover:scale-105 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* Subtle White Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 md:w-100 md:h-100 bg-white opacity-[0.15] blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-45 md:pt-40 pb-16 flex flex-col items-center text-center">
                {/* Heading */}
                <h2 className="font-sans text-4xl md:text-6xl font-extrabold text-white tracking-tighter mt-16 mb-5 relative max-w-none">
                    <span className="relative z-10">Ready to Ace Your</span>
                    <br />
                    <div className="w-screen relative left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 mt-2 opacity-100">
                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-green-500/50 to-transparent"></div>

                        {/* AI Transcript (Green) */}
                        <div className="relative shrink-0 hidden md:block">
                            <PulseWave className="w-20 md:w-72 text-green-300" />
                            <TranscriptBubble
                                type="ai"
                                text="Hello! I'm your AI Interviewer."
                                className="absolute bottom-full right-10 -translate-x-1/2 mb-6"
                                startDelay={4000}
                            />
                        </div>

                        <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-200 to-blue-500/80 bg-clip-text text-transparent shrink-0">Next Interview?</span>

                        {/* User Transcript (Cyan) */}
                        <div className="relative shrink-0 hidden md:block">
                            <PulseWave className="w-20 md:w-72 text-cyan-400 scale-x-[-1]" />
                            <TranscriptBubble
                                type="user"
                                text="Hi, I'm ready to begin."
                                className="absolute top-full left-75 -translate-x-1/2 mt-6"
                                startDelay={5500}
                            />
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                    </div>
                </h2>


                {/* Subheading */}
                <p className="text-sm md:text-lg text-slate-400 max-w-2xl mt-5 mb-10 leading-tight text-center animate-fade-in-up delay-200">
                    Practice with AI-generated interviews tailored to your specific role, level and skills. Or master your next technical interview with realistic, voice-based AI simulations for Google, Amazon, and Meta. Get real-time feedback and detailed performance metrics.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                    <button
                        onClick={() => navigate('/login')}
                        className="h-12 px-8 rounded-full bg-gradient-to-r from-blue-300/90 to-blue-500/90 text-white/80 font-semibold text-base hover:bg-blue-500 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/about')}
                        className="hidden md:block h-12 px-8 rounded-full border border-white/10 text-white font-medium text-base hover:bg-white/10 hover:scale-105 transition-all backdrop-blur-sm px-12"
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

const PulseWave = ({ className }) => (
    <svg viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M0 12 H20 L25 4 L30 20 L35 12 H50 L55 5 L60 19 L65 12 H100" />
    </svg>
);

const TranscriptBubble = ({ text, type, className, startDelay = 0, typingSpeed = 50 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const isAi = type === 'ai';

    useEffect(() => {
        let timeout;
        let interval;
        let charIndex = 0;

        timeout = setTimeout(() => {
            setIsVisible(true);
            interval = setInterval(() => {
                if (charIndex <= text.length) {
                    setDisplayedText(text.slice(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(interval);
                }
            }, typingSpeed);
        }, startDelay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, startDelay, typingSpeed]);

    return (
        <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                } ${isAi
                    ? 'border-green-500/30 bg-green-500/5 text-green-100'
                    : 'border-cyan-500/30 bg-cyan-500/5 text-cyan-100'
                } ${className}`}>
            <Mic className={`w-3 h-3 ${isAi ? 'text-green-400' : 'text-cyan-400'}`} />
            <span className="text-xs font-medium tracking-wide whitespace-nowrap opacity-80">{displayedText}</span>
        </div>
    );
};

export default HeroSection;
