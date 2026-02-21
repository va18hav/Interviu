import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, Mic, Target, Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/images/landingbot.png';
import logo from '../../assets/images/logo.png';

const NewHeroSection = () => {
    const navigate = useNavigate();
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

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

    return (
        <>
            {/* Sticky Navigation */}
            <nav className="fixed top-0 left-0 right-0 w-full border-b border-gray-200 bg-white z-50">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6 cursor-pointer" onClick={() => navigate('/')}>
                        <img src={logo} alt="Intervyu" className="w-5 h-6" />
                        <span className="text-2xl font-extrabold text-black tracking-tight -ml-4">
                            Interv<span className="text-gray-500">iu</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {userCredentials ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-5 py-2 rounded-3xl text-white bg-black hover:bg-gray-800 text-sm font-medium transition-colors"
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
                                    className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-800 text-sm font-medium transition-colors"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Content - Responsive Layout */}
            <div className="relative min-h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row items-center pt-28 lg:pt-0">
                {/* Main Content Area */}
                <div className="relative w-full px-4 sm:px-6 md:px-12 lg:px-20 z-20 flex-shrink-0">
                    <div className="max-w-4xl lg:max-w-2xl xl:max-w-3xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start">

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-[10px] sm:text-xs font-medium text-gray-600 mb-6 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span>Early Access: Coding | System Design | Behavioral Rounds For SDE/DevOps</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black tracking-tighter mb-6 leading-[1.1] px-2 sm:px-0">
                            <span className="inline-block animate-fall-in opacity-0" style={{ animationDelay: '100ms' }}>Practice Real Interviews</span>
                            <br className="hidden sm:block" />
                            <span className="inline-block animate-fall-in opacity-0 bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent" style={{ animationDelay: '300ms' }}>With an AI Interviewer</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mb-10 md:mb-12 leading-relaxed animate-fade-in-up opacity-0 px-4 sm:px-0" style={{ animationDelay: '600ms' }}>
                            Practice real coding, system design, and behavioral interviews with an AI interviewer trained on senior engineering hiring signals.
                        </p>

                        {/* Credibility Tag */}
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-lg mb-10 md:mb-12 leading-relaxed animate-fade-in-up opacity-0 px-4 sm:px-0" style={{ animationDelay: '600ms' }}>
                            <Target className="inline w-3 h-3" /> Trained on real hiring patterns | <Pen className="inline w-3 h-3" /> Built with real interview signals
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up opacity-0 w-full sm:w-auto px-4 sm:px-0" style={{ animationDelay: '800ms' }}>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-3xl bg-black text-white font-semibold hover:bg-gray-800 transition-all active:scale-95 inline-flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                            >
                                Start Free Practice
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/all-popular-interviews')}
                                className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-3xl border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-all active:scale-95 text-center"
                            >
                                View Company Simulations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hero Image - Stacks on mobile, Absolute on desktop with better sizing */}
                <div className="relative lg:absolute bottom-[-25%] right-0 lg:right-[5%] xl:right-[5%] pointer-events-none select-none z-10 w-full lg:w-auto mt-auto lg:mt-0 flex justify-center lg:block">
                    <img
                        src={heroImage}
                        alt="Intervyu Platform Interface"
                        className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[500px] lg:max-w-none lg:w-[450px] xl:w-[550px] h-auto drop-shadow-2xl animate-pop-in animation-delay-300 opacity-0 lg:translate-y-20"
                    />
                </div>

                {/* Hero AI Image Top Right */}
                {/* <div className="absolute top-5 right-20 lg:top-10 lg:right-0 opacity-50 pointer-events-none select-none">
                    <img
                        src={heroImage2}
                        alt="Intervyu Platform Interface"
                        className="w-60 lg:w-90 h-auto drop-shadow-2xl animate-pop-in animation-delay-600 opacity-0"
                    />
                </div>
                <div className="hidden lg:block absolute top-35 -right-25 lg:right-95 opacity-50">
                    <img
                        src={herocode}
                        alt="Intervyu Platform Interface"
                        className="w-70 h-auto drop-shadow-xl animate-pop-in animation-delay-900 opacity-0"
                    />
                </div>
                <div className="hidden lg:block absolute bottom-10 right-100 opacity-80">
                    <img
                        src={herofeatures}
                        alt="Intervyu Platform Interface"
                        className="w-90 h-auto drop-shadow-2xl animate-pop-in animation-delay-1200 opacity-0"
                    />
                </div> */}
            </div>

            {/* Animation Keyframes */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px) rotate(-6deg); }
                    50% { transform: translateY(-15px) rotate(-6deg); }
                }
                @keyframes ping-slow {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.5); opacity: 0.3; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes pop-in {
                    0% { opacity: 0; transform: scale(0.5) translateY(20px); }
                    70% { opacity: 1; transform: scale(1.05) translateY(-5px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes fall-in {
                    0% { opacity: 0; transform: translateY(-30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-pop-in {
                    animation: pop-in 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .animate-fall-in {
                    animation: fall-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 6s ease-in-out infinite;
                    animation-delay: 2s;
                }
                .animate-float-slow {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
                .animate-ping-slow {
                    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
};

export default NewHeroSection;
