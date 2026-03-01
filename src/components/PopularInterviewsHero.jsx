import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Globe, Shield } from 'lucide-react';
import googleLogo from '../assets/images/google.png';
import metaLogo from '../assets/images/meta.png';
import amazonLogo from '../assets/images/amazon.png';
import microsoftLogo from '../assets/images/microsoft.png';
import netflixLogo from '../assets/images/netflix.png';
import appleLogo from '../assets/images/apple.png';

// Fallback or external URL for the 7th icon (Nvidia)
const nvidiaLogo = "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg";

const logos = [
    { src: googleLogo, name: 'Google', color: 'from-blue-500/10 to-transparent' },
    { src: metaLogo, name: 'Meta', color: 'from-indigo-500/10 to-transparent' },
    { src: amazonLogo, name: 'Amazon', color: 'from-orange-500/10 to-transparent' },
    { src: microsoftLogo, name: 'Microsoft', color: 'from-green-500/10 to-transparent' },
    { src: netflixLogo, name: 'Netflix', color: 'from-red-500/10 to-transparent' },
    { src: appleLogo, name: 'Apple', color: 'from-slate-500/10 to-transparent' },
    { src: nvidiaLogo, name: 'Nvidia', color: 'from-emerald-500/10 to-transparent' }
];

const Hexagon = ({ logo, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className="relative w-20 h-24 md:w-28 md:h-32 flex items-center justify-center group"
    >
        {/* Animated Glow Effect */}
        <div className="absolute inset-x-0 inset-y-0 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse scale-75" />

        {/* Hexagon Shape Background (SVG for reliability) */}
        <svg
            viewBox="0 0 100 115"
            className="absolute inset-0 w-full h-full drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-xl"
            preserveAspectRatio="none"
        >
            <path
                d="M50 0 L100 25 L100 90 L50 115 L0 90 L0 25 Z"
                className="fill-white/90 group-hover:fill-white transition-colors duration-300"
            />
        </svg>

        {/* Inner Content */}
        <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center p-3">
            <img
                src={logo.src}
                alt={logo.name}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
            />
        </div>

        {/* Floating Label */}
        <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 z-20">
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-xl uppercase tracking-widest">
                {logo.name}
            </span>
        </div>
    </motion.div>
);

const PopularInterviewsHero = () => {
    return (
        <section className="relative w-full rounded-[2.5rem] overflow-hidden bg-slate-950 px-6 py-16 md:px-16 md:py-24 mb-12 shadow-2xl">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-screen animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
            </div>

            <div className="relative z-10 container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-16 lg:gap-8">
                {/* Left Content */}
                <div className="max-w-2xl space-y-8 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-2"
                    >
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em]">Industry Standards</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight"
                    >
                        Your target. Your bar.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 animate-gradient-x">
                            Your loop.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
                    >
                        Company-specific loops. Production-level problems.
                        <br />
                        A verdict at the end — not just a score.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4"
                    >
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-2xl font-black text-white">40+</span>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Full Loops</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10 hidden sm:block" />
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-2xl font-black text-white">4</span>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Round types</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Content - Honeycomb Animation */}
                <div className="relative">
                    <div className="flex flex-col items-center scale-90 sm:scale-100 lg:scale-110">
                        {/* Row 1 */}
                        <div className="flex mb-[-18px] md:mb-[-22px] gap-2">
                            <Hexagon logo={logos[0]} delay={0.4} />
                            <Hexagon logo={logos[1]} delay={0.5} />
                        </div>

                        {/* Row 2 */}
                        <div className="flex mb-[-18px] md:mb-[-22px] gap-2">
                            <Hexagon logo={logos[2]} delay={0.6} />
                            <Hexagon logo={logos[3]} delay={0.3} />
                            <Hexagon logo={logos[4]} delay={0.7} />
                        </div>

                        {/* Row 3 */}
                        <div className="flex gap-2">
                            <Hexagon logo={logos[5]} delay={0.8} />
                            <Hexagon logo={logos[6]} delay={0.9} />
                        </div>
                    </div>

                    {/* Decorative Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[120%] h-[120%] -left-[10%] border border-white/5 rounded-full pointer-events-none"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-[140%] h-[140%] -left-[20%] border border-white/5 rounded-full pointer-events-none"
                    />
                </div>
            </div>
        </section>
    );
};

export default PopularInterviewsHero;
