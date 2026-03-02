import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import heroImage from '../../assets/images/landingbot.png';
import logo from '../../assets/images/logo.png';
import metaLogo from '../../assets/images/meta.png';
import appleLogo from '../../assets/images/apple.png';
import amazonLogo from '../../assets/images/amazon.png';
import netflixLogo from '../../assets/images/netflix.png';
import googleLogo from '../../assets/images/google.png';

const MAANG_LOGOS = [
    { src: metaLogo, alt: 'Meta' },
    { src: appleLogo, alt: 'Apple' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', alt: 'Amazon' },
    { src: netflixLogo, alt: 'Netflix' },
    { src: googleLogo, alt: 'Google' },
];

const NewHeroSection = () => {
    const navigate = useNavigate();
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const containerRef = useRef(null);

    // Scroll-based parallax for hero image — single spring chain only
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 180]), { stiffness: 60, damping: 25 });
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.7], [1, 0]), { stiffness: 60, damping: 25 });

    // Cursor parallax — only for the logo row, rAF throttled
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const logoX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 30 });
    const logoY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), { stiffness: 80, damping: 30 });

    const rafRef = useRef(null);
    const handleMouseMove = (e) => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            mouseX.set(e.clientX / window.innerWidth - 0.5);
            mouseY.set(e.clientY / window.innerHeight - 0.5);
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.18, delayChildren: 0.1 }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    return (
        <>
            {/* Sticky Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 w-full border-b border-slate-200/50 bg-white/60 backdrop-blur-2xl z-50 transition-colors"
            >
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center relative">
                            <img src={logo} alt="Logo" className="w-12 h-14 relative z-10 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col -ml-4">
                            <h1 className="text-xl font-extrabold text-black leading-none">Interviu</h1>
                            <p className="text-[10px] text-gray-500">Interview Better</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {userCredentials ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-3xl text-white bg-black hover:bg-gray-800 text-sm font-medium transition-all hover:shadow-lg active:scale-95"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 text-sm font-medium transition-all hover:shadow-lg active:scale-95"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Hero */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row items-center pt-28 lg:pt-0 z-10"
            >
                {/* CSS-only background blobs — no JS motion values */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="hero-blob hero-blob-1" />
                    <div className="hero-blob hero-blob-2" />
                    <div className="hero-blob hero-blob-3" />
                </div>

                {/* Main Content */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative w-full px-4 sm:px-6 md:px-12 lg:px-20 z-20 flex-shrink-0"
                >
                    <div className="max-w-4xl lg:max-w-2xl xl:max-w-4xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">

                        {/* Badge */}
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-[10px] sm:text-xs font-semibold text-indigo-600 mb-8 w-fit shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                            </span>
                            <span className="tracking-wide">Early Access — First Interview Loop Free</span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-[-0.04em] mb-4 leading-tight px-2 sm:px-0"
                        >
                            Find out exactly why you'd fail your next{' '}
                            <motion.span
                                style={{
                                    x: logoX,
                                    y: logoY,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    verticalAlign: 'middle',
                                    padding: '0 16px',
                                }}
                            >
                                {MAANG_LOGOS.map(({ src, alt }) => (
                                    <img
                                        key={alt}
                                        src={src}
                                        alt={alt}
                                        title={alt}
                                        className="mt-2 md:mt-0 h-7 sm:h-8 md:h-9 lg:h-9 xl:h-10 w-auto object-contain opacity-90"
                                    />
                                ))}
                            </motion.span>{' '}loop.
                        </motion.h1>

                        {/* Kicker line */}
                        <motion.p
                            variants={itemVariants}
                            className="text-lg sm:text-xl md:text-2xl text-slate-400 font-semibold mb-8 italic"
                        >
                            — Before you're sitting in the real one.
                        </motion.p>

                        {/* Subheadline — 3 lines */}
                        <motion.div variants={itemVariants} className="mb-10 md:mb-12 px-4 sm:px-0 space-y-1">
                            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                                Interviu runs you through a full onsite loop — coding, system design, debug, behavioral.
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                                When it's done, you get the same debrief a hiring committee writes after a real interview.
                            </p>
                            <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed">
                                Hire or No Hire. Every signal you gave. Every signal you missed.
                            </p>
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto px-4 sm:px-0"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] group"
                            >
                                See My Gaps For Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard/all-popular-interviews')}
                                className="w-full sm:w-auto px-10 py-4 rounded-full border border-slate-200 bg-white/40 backdrop-blur-md text-slate-900 font-bold hover:bg-white/70 transition-colors flex items-center justify-center shadow-sm"
                            >
                                Browse the Interview Catalogue
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <div
                    className="relative lg:absolute bottom-[-25%] right-0 lg:right-[-15%] xl:right-[-5%] pointer-events-none select-none z-10 w-full lg:w-auto mt-auto lg:mt-0 flex justify-center lg:block"
                >
                    {/* Glow behind image — pure CSS, no JS animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-400/10 blur-[100px] rounded-full -z-10" />

                    <motion.img
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{ y, opacity }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        src={heroImage}
                        alt="Intervyu Platform Interface"
                        className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-none lg:w-[450px] xl:w-[550px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] will-change-transform"
                    />

                    {/* Floating Dossier Card */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[-10px] sm:left-0 lg:left-[-60px] top-[30%] z-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-slate-100 px-4 py-3 pointer-events-none"
                    >
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Dossier Output</div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">STRONG HIRE</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="text-[10px] text-slate-500 font-medium">Confidence:</div>
                            <div className="text-[10px] font-black text-slate-900">8/10</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CSS blob keyframes */}
            <style>{`
                .hero-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    will-change: transform;
                }
                .hero-blob-1 {
                    top: -10%; left: -10%;
                    width: 50%; height: 50%;
                    background: #79b1ffff;
                    opacity: 0.15;
                    animation: blobDrift1 18s ease-in-out infinite;
                }
                .hero-blob-2 {
                    bottom: -10%; right: -10%;
                    width: 50%; height: 50%;
                    background: #d877fbff;
                    opacity: 0.15;
                    animation: blobDrift2 22s ease-in-out infinite;
                }
                .hero-blob-3 {
                    top: 20%; right: 10%;
                    width: 40%; height: 40%;
                    background: #92f8ffff;
                    opacity: 0.10;
                    animation: blobDrift1 16s ease-in-out infinite reverse;
                }
                @keyframes blobDrift1 {
                    0%, 100% { transform: translate(0, 0); }
                    33%       { transform: translate(30px, -20px); }
                    66%       { transform: translate(-20px, 30px); }
                }
                @keyframes blobDrift2 {
                    0%, 100% { transform: translate(0, 0); }
                    33%       { transform: translate(-40px, 20px); }
                    66%       { transform: translate(20px, -40px); }
                }
            `}</style>
        </>
    );
};

export default NewHeroSection;