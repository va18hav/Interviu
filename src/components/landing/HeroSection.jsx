import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import InteractiveGridBackground from './InteractiveGridBackground';

import googleLogo from '../../assets/images/google.png';
import metaLogo from '../../assets/images/meta.png';
import amazonLogo from '../../assets/images/amazon.png';
import microsoftLogo from '../../assets/images/microsoft.png';
import netflixLogo from '../../assets/images/netflix.png';
import appleLogo from '../../assets/images/apple.png';

const HeroSection = () => {
    const navigate = useNavigate();
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    return (
        <div className="relative min-h-screen bg-white overflow-hidden selection:bg-cyan-500/30">
            {/* Interactive Grid Background */}

            <InteractiveGridBackground />
            {/* Navigation */}
            <nav className="absolute top-0 w-full z-50 border-b border-slate-200 bg-white/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logo} alt="Intervyu" className="w-15 h-15 contrast-125 brightness-150" />
                        <span className="text-2xl font-extrabold text-black tracking-tighter">Inter<span className='text-cyan-400'>viu</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        {userCredentials ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-400/70 to-cyan-500 text-white hover:scale-105 text-sm font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
                            >
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-slate-900 hover:text-cyan-600 transition-colors hidden sm:block"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-5 py-2 rounded-full bg-white/40 text-slate-900 hover:scale-105 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* Subtle White Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 md:w-100 md:h-100 bg-blue-200 opacity-[0.15] blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-45 md:pt-35 pb-16 flex flex-col items-center text-center">
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/5 border border-cyan-500/20 backdrop-blur">
                    <span className="text-sm text-cyan-400 font-medium">AI-Powered Practice</span>
                </div> */}
                {/* Mobile Transcripts (Absolute Positioned) */}
                <div className="absolute top-42 -left-4 md:hidden z-20">
                    <TranscriptBubble
                        type="ai"
                        text="Hello! I'm your AI Interviewer."
                        className="shadow-sm"
                        startDelay={2500}
                    />
                </div>

                <div className="absolute -bottom-6 -right-4 md:hidden z-20">
                    <TranscriptBubble
                        type="user"
                        text="Hi, I'm ready to begin."
                        className="shadow-sm"
                        startDelay={4200}
                    />
                </div>

                {/* Heading */}
                <h2 className="font-sans text-4xl md:text-6xl font-extrabold text-gray-700 tracking-tighter mt-14 mb-5 relative max-w-none">
                    <span className="relative z-10">Ready to Ace Your</span>
                    <br />
                    <div className="w-screen relative left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 mt-2 opacity-100">
                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-l from-green-500/50 to-transparent"></div>

                        {/* AI Transcript (Green) */}
                        <div className="relative shrink-0 hidden md:block">
                            <PulseWave className="w-20 md:w-72 text-green-500" />
                            <TranscriptBubble
                                type="ai"
                                text="Hello! I'm your AI Interviewer."
                                className="absolute bottom-full right-10 -translate-x-1/2 mb-6"
                                startDelay={2500}
                            />
                        </div>

                        <span className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400/90 to-blue-600/90 bg-clip-text text-transparent shrink-0">Next Interview?</span>

                        {/* User Transcript (Cyan) */}
                        <div className="relative shrink-0 hidden md:block">
                            <PulseWave className="w-20 md:w-72 text-blue-500 scale-x-[-1]" />
                            <TranscriptBubble
                                type="user"
                                text="Hi, I'm ready to begin."
                                className="absolute top-full left-75 -translate-x-1/2 mt-6"
                                startDelay={4200}
                            />
                        </div>

                        <div className="hidden md:block flex-1 h-[2px] bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                    </div>
                </h2>


                {/* Subheading */}
                <p className="text-sm md:text-2xl text-slate-800 max-w-2xl mt-5 mb-10 leading-tight text-center animate-fade-in-up delay-200">
                    Practice realistic, voice-based interviews simulations modeled after real interviews at MAANG companies.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                    <button
                        onClick={() => navigate('/login')}
                        className="h-12 px-8 rounded-full bg-gradient-to-r from-gray-200/70 to-gray-300 text-black font-semibold text-base hover:bg-gray-500 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Practice Interview
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/about')}
                        className="hidden md:block h-12 px-8 rounded-full border border-black/10 text-black font-medium text-base hover:bg-gray-500/10 hover:scale-105 transition-all backdrop-blur-sm px-12"
                    >
                        Custom Interview
                    </button>
                </div>

                {/* Company Simulation Banner */}
                <div className="mt-10 flex items-center gap-4 animate-fade-in-up delay-500">
                    <div className="flex -space-x-3">
                        {[googleLogo, metaLogo, amazonLogo, microsoftLogo, netflixLogo, appleLogo].map((logo, index) => (
                            <div key={index} className="w-8 h-8 rounded-full border-2 border-white bg-white flex items-center justify-center p-1 overflow-hidden shadow-sm z-10 hover:scale-110 transition-transform duration-200">
                                <img src={logo} alt="Company Logo" className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 leading-tight">Interview simulations</p>
                        <p className="text-xs font-medium text-slate-500">of top tech companies</p>
                    </div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10" />
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
                    ? 'border-green-500/30 bg-green-500/5 text-green-500'
                    : 'border-cyan-500/30 bg-cyan-500/5 text-cyan-500'
                } ${className}`}>
            <Mic className={`w-3 h-3 ${isAi ? 'text-green-400' : 'text-cyan-400'}`} />
            <span className="text-xs font-medium tracking-wide whitespace-nowrap opacity-80">{displayedText}</span>
        </div>
    );
};

export default HeroSection;
