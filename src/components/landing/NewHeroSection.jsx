import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Award, Mic, Target, Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import heroImage from '../../assets/images/landingbot.png';
import logo from '../../assets/images/logo.png';

const NewHeroSection = () => {
    const navigate = useNavigate();
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

    const yTransform = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const y = useSpring(yTransform, springConfig);
    const opacity = useSpring(opacityTransform, springConfig);

    const glowY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);
    const glowY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), springConfig);

    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = ["Coding", "System Design", "Behavioral"];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 100 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <>
            {/* Sticky Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl z-50"
            >
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center relative">
                            <img src={logo} alt="Logo" className="w-12 h-14 relative z-10 group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col -ml-4">
                            <h1 className="text-xl font-extrabold text-black leading-none">Interviu</h1>
                            <p className="text-xs text-gray-500">Interview Better</p>
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

            {/* Hero Content - Responsive Layout */}
            <div ref={containerRef} className="relative min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row items-center pt-28 lg:pt-0">
                {/* Main Content Area */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative w-full px-4 sm:px-6 md:px-12 lg:px-20 z-20 flex-shrink-0"
                >
                    <div className="max-w-4xl lg:max-w-2xl xl:max-w-3xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">

                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] sm:text-xs font-bold text-indigo-600 mb-6 w-fit shadow-sm shadow-indigo-500/5"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span>Early Access: 3+ Round types For SDE/DevOps</span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-black tracking-tighter mb-6 leading-[1.1] px-2 sm:px-0"
                        >
                            <span>Practice Real Interviews</span>
                            <br className="hidden sm:block" />
                            <span className="text-black">With an <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">AI Interviewer</span></span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mb-10 md:mb-12 leading-relaxed px-4 sm:px-0"
                        >
                            Practice real coding, system design, and behavioral interviews with an AI interviewer trained on senior engineering hiring signals.
                        </motion.p>

                        {/* Credibility Tag */}
                        <motion.p
                            variants={itemVariants}
                            className="text-xs sm:text-sm md:text-base text-gray-600 max-w-lg mb-10 md:mb-12 leading-relaxed px-4 sm:px-0 flex items-center flex-wrap justify-center lg:justify-start gap-4"
                        >
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 font-bold text-[10px] uppercase tracking-wider">
                                <Target className="w-3.5 h-3.5" /> Trained on real hiring patterns
                            </span>
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-3xl bg-black text-white font-semibold hover:bg-gray-800 transition-all active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg shadow-black/10 group"
                            >
                                Start Free Practice
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/all-popular-interviews')}
                                className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-3xl border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-all active:scale-95 text-center"
                            >
                                View Company Simulations
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Hero Image Section */}
                <div className="relative lg:absolute bottom-[-25%] right-0 lg:right-[5%] xl:right-[5%] pointer-events-none select-none z-10 w-full lg:w-auto mt-auto lg:mt-0 flex justify-center lg:block">
                    {/* Multi-layered Background Glows */}
                    <div className="absolute inset-0 -z-10 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.4, 0.3]
                            }}
                            style={{ y: glowY1 }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[500px] h-[500px] bg-indigo-500/15 blur-[120px] rounded-full will-change-transform"
                        />
                        <motion.div
                            animate={{
                                scale: [1.1, 1, 1.1],
                                opacity: [0.2, 0.3, 0.2]
                            }}
                            style={{ y: glowY2 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute w-[450px] h-[450px] bg-blue-500/10 blur-[100px] rounded-full will-change-transform"
                        />
                        {/* Core Atmospheric Glow */}
                        <div className="absolute w-[500px] h-[500px] bg-indigo-600/25 blur-[80px] rounded-full" />
                    </div>

                    <motion.img
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{ y, opacity }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        src={heroImage}
                        alt="Intervyu Platform Interface"
                        className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-none lg:w-[450px] xl:w-[550px] h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)] filter saturate-[1.1] will-change-transform"
                    />
                </div>
            </div>
        </>
    );
};

export default NewHeroSection;