import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Award, Mic, Target, Pen, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
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

    // Mouse tracking for interactive effects
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Normalize coordinates to -0.5 to 0.5
        mouseX.set((clientX / innerWidth) - 0.5);
        mouseY.set((clientY / innerHeight) - 0.5);
    };

    // Parallax values for background blobs
    const blobX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
    const blobY1_p = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);
    const blobX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig);
    const blobY2_p = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), springConfig);

    // 3D Tilt for Hero Image
    const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
    const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

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

            {/* Hero Content - Responsive Layout */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row items-center pt-28 lg:pt-0 z-10"
            >
                {/* Premium Background Elements (Inside Hero) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Noise Texture */}
                    <div
                        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")`
                        }}
                    />

                    {/* Mesh Gradient blobs */}
                    <motion.div
                        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
                        style={{ backgroundColor: '#4f46e5', x: blobX1, y: blobY1_p, willChange: "transform" }}
                    />
                    <motion.div
                        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[80px]"
                        style={{ backgroundColor: '#8b5cf6', x: blobX2, y: blobY2_p, willChange: "transform" }}
                    />
                    <motion.div
                        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[60px]"
                        style={{ backgroundColor: '#0ea5e9', x: blobX1, y: blobY2_p, willChange: "transform" }}
                    />

                    {/* Subtle floating interactive bits */}
                    {/* <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ x: useTransform(mouseX, [-0.5, 0.5], [20, -20]), willChange: "transform" }}
                        className="absolute top-[30%] left-[25%] text-indigo-200/40"
                    >
                        <Pen size={40} />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ x: useTransform(mouseX, [-0.5, 0.5], [-30, 30]), willChange: "transform" }}
                        className="absolute bottom-[40%] left-[35%] text-purple-200/40"
                    >
                        <Award size={32} />
                    </motion.div> */}
                </div>

                {/* Main Content Area */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="relative w-full px-4 sm:px-6 md:px-12 lg:px-20 z-20 flex-shrink-0"
                >
                    <div className="max-w-4xl lg:max-w-2xl xl:max-w-4xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">

                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-[10px] sm:text-xs font-semibold text-indigo-600 mb-8 w-fit shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="tracking-wide">Early Access: Free 300 credits on Sign Up</span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black text-slate-900 tracking-[-0.04em] mb-6 leading-tight px-2 sm:px-0"
                            style={{ textWrap: 'balance' }}
                        >
                            Practice Real Interviews
                            <br className="hidden sm:block" />
                            With an <br className="block md:hidden" /> <motion.span
                                style={{
                                    x: useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig),
                                    y: useSpring(useTransform(mouseY, [-0.5, 0.5], [-10, 10]), springConfig),
                                    display: 'inline-block'
                                }}
                                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
                            >
                                AI Interviewer
                            </motion.span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-slate-600/90 max-w-2xl mb-10 md:mb-12 leading-relaxed px-4 sm:px-0 font-medium"
                        >
                            Master your next career move with personalized, industry-standard interview simulations powered by advanced AI.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="flex items-center flex-wrap justify-center lg:justify-start gap-4 mb-10 md:mb-12"
                        >
                            <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-700 font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-white/80 hover:border-slate-300 cursor-default"
                            >
                                <Target className="w-4 h-4 text-indigo-500" /> Trained on real hiring signals
                            </motion.span>
                        </motion.div>
                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto px-4 sm:px-0"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-10 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all inline-flex items-center justify-center gap-2 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Free Practice
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02, x: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard/all-popular-interviews')}
                                className="w-full sm:w-auto px-10 py-4 rounded-full border border-slate-200 bg-white/40 backdrop-blur-md text-slate-900 font-bold hover:bg-white/60 transition-all flex items-center justify-center shadow-sm"
                            >
                                View Simulations
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Hero Image Section */}
                <div
                    className="relative lg:absolute bottom-[-25%] right-0 lg:right-[5%] xl:right-[5%] pointer-events-none select-none z-10 w-full lg:w-auto mt-auto lg:mt-0 flex justify-center lg:block"
                    style={{ perspective: "1200px" }}
                >
                    {/* Multi-layered Background Glows - Refined for atmosphere */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] -z-10 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.4, 0.3],
                            }}
                            style={{ y: glowY1, willChange: "transform" }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[800px] h-[800px] bg-indigo-500/10 blur-[100px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1.1, 1, 1.1],
                                opacity: [0.2, 0.3, 0.2],
                            }}
                            style={{ y: glowY2, willChange: "transform" }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute w-[700px] h-[700px] bg-purple-500/10 blur-[80px] rounded-full"
                        />
                    </div>

                    <motion.img
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{
                            y,
                            opacity,
                            rotateX: tiltX,
                            rotateY: tiltY,
                            transformStyle: "preserve-3d"
                        }}
                        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                        src={heroImage}
                        alt="Intervyu Platform Interface"
                        className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-none lg:w-[450px] xl:w-[550px] h-auto drop-shadow-[0_20px_60px_rgba(79,70,229,0.2)] filter saturate-[1.1] will-change-transform"
                    />
                </div>
            </div>
        </>
    );
};

export default NewHeroSection;