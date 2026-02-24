import React from 'react';
import { motion } from 'framer-motion';
import fulllogo from '../assets/images/fulllogo.png';
import logo from '../assets/images/logo.png';
import bot from '../assets/images/newbot.png'; // or bot.png
import codinground from '../assets/images/UI/codinground.png';
import debuground from '../assets/images/UI/debuground.png';
import report from '../assets/images/UI/report.png';
import resumebanner from '../assets/images/resumebanner.png';
import { Code2, Activity, LayoutDashboard, BrainCircuit, ArrowRight } from 'lucide-react';

const SlideContainer = ({ children, className = "" }) => (
    <div className={`relative w-[1080px] h-[1350px] overflow-hidden flex-shrink-0 shadow-2xl rounded-sm ${className}`} style={{ transform: 'scale(0.5)', transformOrigin: 'top center', marginBottom: '-675px' }}>
        {children}
    </div>
);

const InstagramPost1 = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center py-12 gap-12 overflow-y-auto font-sans">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Instagram Post #1</h1>
                <p className="text-slate-500 mt-2 font-medium">Resolution: 1080x1350 (4:5 Portrait). Scaled to 50% for preview.<br />Use a browser extension or dev tools to screenshot the raw 1080x1350 node.</p>
            </div>

            {/* Slide 1: The Hook (Minimal) */}
            <SlideContainer className="bg-slate-50 flex flex-col items-center justify-center">
                {/* Background ambient light */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
                </div>

                <img src={logo} alt="Interviu" className="w-[600px] relative z-10" />
                <h1 className="text-[52px] font-black tracking-tight text-slate-800 uppercase mt-4 mb-4 z-10">interviu.pro</h1>

                <div className="absolute bottom-12 w-full flex justify-center">
                    <div className="w-16 h-1.5 bg-slate-300 rounded-full" />
                </div>
            </SlideContainer>

            {/* Slide 2: The Core Problem */}
            <SlideContainer className="bg-white">
                <div className="absolute inset-0 bg-slate-50/50" />
                <div className="relative h-full flex flex-col justify-center px-32">
                    <div className="w-24 h-24 rounded-3xl bg-amber-100 flex items-center justify-center mb-16 shadow-lg shadow-amber-500/10">
                        <Activity className="w-12 h-12 text-amber-600" />
                    </div>
                    <h2 className="text-[80px] leading-[1.05] font-black text-slate-900 tracking-tight">
                        Traditional <br />mock interviews <br />are unpredictable,<br />expensive, <br /><span className="text-amber-500">and stressful.</span>
                    </h2>
                    <p className="text-[32px] font-medium text-slate-500 mt-12 leading-relaxed">
                        Say goodbye to scheduling conflicts and inconsistent human feedback.
                    </p>
                </div>
            </SlideContainer>

            {/* Slide 3: The AI Solution */}
            <SlideContainer className="bg-slate-900 overflow-visible">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]" />
                </div>
                <div className="relative h-full flex flex-col pt-32 px-24">
                    <h2 className="text-[72px] leading-[1.1] font-black text-white tracking-tight z-20">
                        Master technical rounds with an <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AI Interviewer.</span>
                    </h2>
                    <p className="text-[28px] font-medium text-slate-400 mt-8 z-20">
                        Real-time voice and code evaluation in a unified, premium canvas.
                    </p>

                    {/* Floating UI Element */}
                    <div className="mt-20 relative w-full flex-1 perspective-1000 z-10">
                        <div className="absolute top-20 left-[-40px] right-[-40px] rounded-[40px] overflow-hidden shadow-2xl border border-white/20 transform bg-slate-950">
                            <img src={codinground} alt="Coding Round" className="w-full h-auto opacity-90 scale-105" />
                        </div>
                    </div>
                </div>
            </SlideContainer>

            {/* Slide 4: Insight / Feedback */}
            <SlideContainer className="bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/50" />
                <div className="relative h-full flex flex-col items-center">
                    <div className="px-24 pt-32 pb-12 shrink-0 z-20 text-center flex flex-col items-center">
                        <h2 className="text-[72px] leading-[1.1] font-black text-slate-900 tracking-tight">
                            Granular Performance <br />Analysis instantly.
                        </h2>
                        <div className="w-32 h-2 bg-indigo-600 mt-12 mb-12 rounded-full" />

                        <div className="flex flex-wrap justify-center gap-4 max-w-[800px]">
                            {['Communication Score', 'Technical Accuracy', 'Response Tone', 'Code Quality', 'Pacing & Fluency'].map((tag) => (
                                <span key={tag} className="px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-black tracking-widest uppercase text-sm shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Centered Report Image */}
                    <div className="relative w-full px-12 pb-24 flex justify-center z-20">
                        <div className="w-full max-w-[900px] rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] border border-slate-200/50 overflow-hidden">
                            <img src={report} alt="Report UI" className="w-500 object-cover object-top" />
                        </div>
                    </div>
                </div>
            </SlideContainer>

            {/* Slide 5: CTA */}
            <SlideContainer className="bg-slate-950 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-600/30 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center mt-[-100px]">
                    <h2 className="text-[80px] font-black text-white tracking-tight mt-12 mb-6">
                        System Online.
                    </h2>
                    <p className="text-[36px] font-medium text-slate-300 text-center max-w-[800px] leading-tight mb-20">
                        Join the Early Access and elevate your interview protocol today.
                    </p>

                    <div className="z-10 bg-white text-slate-900 px-16 py-8 rounded-full font-black text-[32px] tracking-widest uppercase flex items-center gap-6 shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                        Link In Bio
                        <ArrowRight size={40} className="text-indigo-600" />
                    </div>
                    <img src={bot} alt="AI Bot" className="absolute -bottom-100 opacity-15 w-300 z-0" />
                </div>

                <div className="absolute bottom-16 text-[24px] font-black tracking-[0.4em] uppercase text-white/30">
                    INTERVIU.PRO
                </div>
            </SlideContainer>

        </div>
    );
};

export default InstagramPost1;
