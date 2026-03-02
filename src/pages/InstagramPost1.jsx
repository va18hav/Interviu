import React from 'react';
import { motion } from 'framer-motion';
import {
    Code2,
    Activity,
    LayoutDashboard,
    BrainCircuit,
    ArrowRight,
    X,
    Check,
    Keyboard,
    Building2,
    Search,
    Mic2,
    Calendar,
    Globe,
    FileText,
    User,
    ShieldCheck,
    Zap
} from 'lucide-react';

// Asset Imports
import logo from '../assets/images/logo.png';
import landingbot from '../assets/images/landingbot.png';
import codinground from '../assets/images/UI/codinground.png';
import designround from '../assets/images/UI/designround.png';
import debuground from '../assets/images/UI/debuground.png';
import behavioralRound from '../assets/images/UI/interview.png';
import report from '../assets/images/UI/report1.png';
import companyGrid from '../assets/images/UI/company-specific-interviews.png';
import interviewChat from '../assets/images/UI/interview.png';
import configureBot from '../assets/images/configure.png';
import catalogue from '../assets/images/UI/catalogue.png';

const SlideContainer = ({ children, className = "" }) => (
    <div className={`relative w-[1080px] h-[1350px] overflow-hidden flex-shrink-0 shadow-2xl rounded-sm ${className}`} style={{ transform: 'scale(0.5)', transformOrigin: 'top center', marginBottom: '-675px' }}>
        {children}
    </div>
);

const InstagramPost1 = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 gap-24 overflow-y-auto font-sans">
            <div className="text-center mb-4">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase">Instagram Post Redesign</h1>
                <p className="text-slate-400 mt-4 font-medium max-w-2xl mx-auto">
                    7 Production Grade slides for Interviu.pro. <br />
                    Resolution: 1080x1350 (4:5 Portrait). Scaled to 50% for preview.
                </p>
            </div>

            {/* Slide 1: Cover / Hook */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col">
                <div className="absolute top-16 left-16 flex items-center gap-3">
                    <span className="text-[20px] font-bold tracking-[0.3em] uppercase text-white/40">Introducing Interviu</span>
                </div>

                <div className="flex-1 flex flex-col justify-center px-20 relative z-10">
                    <h1 className="text-[92px] leading-[0.95] font-black tracking-tight mb-8 max-w-[800px]">
                        Find out exactly where <br />
                        <span className="text-indigo-500 italic">you'd fail</span> your <br />
                        next interview.
                    </h1>

                    <p className="text-[36px] font-medium italic text-white/60 mb-20">
                        — Before you're sitting in the real one.
                    </p>

                    <div className="flex items-center gap-16 py-10 border-y border-white/10">
                        <div className="flex flex-col">
                            <span className="text-[42px] font-black leading-none">40+</span>
                            <span className="text-[18px] font-bold uppercase tracking-widest text-white/40 mt-2">Onsite Loops</span>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[42px] font-black leading-none">4</span>
                            <span className="text-[18px] font-bold uppercase tracking-widest text-white/40 mt-2">Round Types</span>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[42px] font-black leading-none">L2–L6</span>
                            <span className="text-[18px] font-bold uppercase tracking-widest text-white/40 mt-2">All Levels</span>
                        </div>
                    </div>
                </div>

                {/* Robot Image - Right side dominant */}
                <div className="absolute right-[-20%] bottom-0 h-full w-[80%] z-0 pointer-events-none opacity-80">
                    <img
                        src={landingbot}
                        alt="Interviu Bot"
                        className="h-full w-full object-cover object-left grayscale-[0.2] contrast-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
                </div>

                <div className="px-20 py-16 flex justify-between items-center bg-black/40 backdrop-blur-md relative z-10">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">01/07</span>
                </div>
            </SlideContainer>

            {/* Slide 2: The Problem */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col p-20">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-[82px] leading-[0.95] font-black tracking-tight mb-24 max-w-[800px]">
                        Most prep tools <br />
                        are built for <br />
                        <span className="text-slate-500">junior engineers.</span>
                    </h2>

                    <div className="space-y-16">
                        {[
                            {
                                title: "Question banks, not real loops",
                                description: "You practice isolated questions. Real loops test how you think across 5+ hours of consecutive pressure."
                            },
                            {
                                title: "Scripted AI, not adaptive probing",
                                description: "They move to the next question on a timer. Real bar raisers follow your answer until they find the gap."
                            },
                            {
                                title: "Scores, not verdicts",
                                description: "You get a number. You need to know: would I get the offer? And exactly why or why not."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <X className="w-8 h-8 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-[36px] font-black tracking-tight mb-2 text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-[26px] font-medium leading-relaxed text-white/50 max-w-[700px]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-16 flex justify-between items-center border-t border-white/5">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">02/07</span>
                </div>
            </SlideContainer>

            {/* Slide 3: The Four Rounds */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col p-20">
                <h2 className="text-[64px] leading-[1.1] font-black tracking-tight mb-16 max-w-[900px]">
                    A full onsite loop. <br />
                    <span className="text-indigo-500">Four real round types.</span>
                </h2>

                <div className="grid grid-cols-2 gap-8 flex-1">
                    {[
                        {
                            title: "Coding Round",
                            description: "Production-level features. Not LeetCode. Probed for failure modes and production thinking.",
                            icon: "⌨️",
                            image: codinground
                        },
                        {
                            title: "System Design Round",
                            description: "Interactive architecture canvas. Design it — then defend every decision under expert critique.",
                            icon: "🏗️",
                            image: designround
                        },
                        {
                            title: "Debug Round",
                            description: "Real production incident scenarios. Diagnose cascading failures under time pressure.",
                            icon: "🔍",
                            image: debuground
                        },
                        {
                            title: "Leadership Round",
                            description: "Voice-based. The AI maps every answer to Leadership Principles and probes until it finds the signal.",
                            icon: "🎙️",
                            image: behavioralRound
                        }
                    ].map((round, idx) => (
                        <div key={idx} className="bg-[#111] rounded-[32px] overflow-hidden border border-white/5 flex flex-col shadow-2xl">
                            <div className="p-8 pb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl">{round.icon}</span>
                                    <h3 className="text-[32px] font-black tracking-tight">{round.title}</h3>
                                </div>
                                <p className="text-[20px] font-medium leading-relaxed text-white/40">
                                    {round.description}
                                </p>
                            </div>
                            <div className="flex-1 min-h-0 relative mt-4">
                                <img
                                    src={round.image}
                                    alt={round.title}
                                    className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-12 flex justify-between items-center border-t border-white/5">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">03/07</span>
                </div>
            </SlideContainer>

            {/* Slide 4: The Technical Dossier */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col items-center">
                <div className="pt-16 pb-8 text-center">
                    <span className="text-[20px] font-bold tracking-[0.4em] uppercase text-indigo-400 mb-6 block">After Every Session</span>
                    <h2 className="text-[92px] leading-[0.9] font-black tracking-tight mb-8">
                        Not a score. <br />
                        <span className="text-white">A verdict.</span>
                    </h2>
                    <p className="text-[28px] font-medium text-white/50 max-w-[800px] leading-relaxed mx-auto">
                        The same debrief a hiring committee writes after a real interview. <br />
                        <span className="text-white font-bold">Hire or No Hire. Every signal. Every gap.</span>
                    </p>
                </div>

                <div className="flex-1 w-full px-12 pb-20 relative">
                    <div className="w-full h-full relative rounded-[40px] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                        <img
                            src={report}
                            alt="Technical Dossier"
                            className="w-full h-full object-cover object-top scale-105"
                        />
                        {/* Gradient overlays to focus on the content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    </div>
                </div>

                <div className="w-full px-20 py-12 flex justify-between items-center border-t border-white/5 bg-black/40 backdrop-blur-md">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">04/07</span>
                </div>
            </SlideContainer>

            {/* Slide 5: The Catalogue */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col p-20">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-[72px] leading-[1.1] font-black tracking-tight mb-8">
                        40+ full loops. <br />
                        <span className="text-indigo-500">Every major company.</span>
                    </h2>
                    <p className="text-[28px] font-medium text-white/50 mb-16 leading-relaxed">
                        Not the same questions recycled. Company-specific bars. <br />
                        <span className="text-white font-bold opacity-80">Amazon SDE III feels nothing like Google L5.</span>
                    </p>

                    <div className="relative w-full aspect-[16/10] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
                        <img
                            src={catalogue}
                            alt="Catalogue"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-[-1] opacity-20 pointer-events-none">
                    <img src={companyGrid} alt="Company Grid" className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-[#050505]/80" />
                </div>

                <div className="pt-12 flex justify-between items-center border-t border-white/5">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">05/07</span>
                </div>
            </SlideContainer>

            {/* Slide 6: The Adaptive AI */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col p-20 relative">
                {/* Centered Background Image */}
                <div className="absolute inset-0 flex items-center justify-center z-0 opacity-30 grayscale pointer-events-none">
                    <img
                        src={interviewChat}
                        alt="Interview Interface"
                        className="w-[120%] h-auto max-w-none rounded-[60px] shadow-3xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <h2 className="text-[64px] leading-[1.05] font-black tracking-tight mb-16 max-w-[850px]">
                        It <span className="text-indigo-500">doesn't ask</span> the <br />
                        next question until it <br />
                        understands your last answer.
                    </h2>

                    <div className="space-y-8 relative max-w-[900px]">
                        {/* Interviewer Bubble */}
                        <div className="flex flex-col items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <BrainCircuit size={16} />
                                </div>
                                <span className="text-[20px] font-black tracking-widest uppercase text-indigo-400">Interviewer</span>
                            </div>
                            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[32px] rounded-tl-none text-[28px] font-medium leading-relaxed max-w-[80%] backdrop-blur-sm">
                                Walk me through how you'd handle inventory consistency during the flash sale window across three regions.
                            </div>
                        </div>

                        {/* Candidate Bubble */}
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[20px] font-black tracking-widest uppercase text-white/40">You</span>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] rounded-tr-none text-[28px] font-medium leading-relaxed max-w-[80%] text-white/80 backdrop-blur-sm">
                                I'd use Redis with DECRBY for atomic decrements. Secondary nodes might have stale data until the background sync finishes.
                            </div>
                        </div>

                        {/* Interviewer Probing Bubble */}
                        <div className="flex flex-col items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <BrainCircuit size={16} />
                                </div>
                                <span className="text-[20px] font-black tracking-widest uppercase text-indigo-400">Interviewer (probing)</span>
                            </div>
                            <div className="bg-indigo-600/20 border border-indigo-500/40 p-10 rounded-[32px] rounded-tl-none text-[32px] font-bold leading-tight max-w-[85%] shadow-[0_0_50px_rgba(79,70,229,0.2)] backdrop-blur-md">
                                You mentioned stale data until sync finishes — if the client requires strict consistency, how do you mitigate that? And what's the blast radius if the primary goes down mid-sale?
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-8 py-4 px-6 bg-white/10 rounded-full w-fit backdrop-blur-sm">
                            <Zap className="text-yellow-400" />
                            <span className="text-[24px] font-black tracking-tight text-white/80">Adaptive probe — based on your exact words. No script. No timer.</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-12 flex justify-between items-center border-t border-white/5">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">06/07</span>
                </div>
            </SlideContainer>

            {/* Slide 7: CTA */}
            <SlideContainer className="bg-[#050505] text-white flex flex-col items-center justify-center p-20 relative overflow-hidden">
                {/* Background ambient light */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-600/20 rounded-full blur-[180px]" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                    <span className="text-[20px] font-bold tracking-[0.4em] uppercase text-indigo-400 mb-8 block">Early Access — Now Open</span>

                    <h2 className="text-[100px] leading-[0.9] font-black tracking-tight mb-12">
                        One session. <br />
                        <span className="text-white">More clarity than <br /> a month of prep.</span>
                    </h2>

                    <p className="text-[32px] font-medium text-white/50 max-w-[800px] leading-relaxed mb-16">
                        First round is free. No credit card. Takes 60 minutes. <br />
                        <span className="text-white font-bold italic">Most engineers wish they'd done this sooner.</span>
                    </p>

                    <div className="bg-indigo-600 hover:bg-indigo-500 text-white px-16 py-8 rounded-full font-black text-[36px] tracking-tight flex items-center gap-6 shadow-[0_20px_60px_rgba(79,70,229,0.4)] mb-12 transform transition-transform hover:scale-105">
                        Check your readiness now
                        <ArrowRight size={44} />
                    </div>

                    <div className="flex items-center gap-6 text-[20px] font-bold uppercase tracking-[0.2em] text-white/40">
                        <span>First loop free</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>No credit card</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>Early access credits</span>
                    </div>
                </div>


                <div className="absolute bottom-16 w-full px-20 flex justify-between items-center z-20">
                    <span className="text-[24px] font-black tracking-widest text-white/60 uppercase">Link in bio · interviu.pro</span>
                    <span className="text-[24px] font-black tracking-widest text-white/30 uppercase">07/07</span>
                </div>
            </SlideContainer>
        </div>
    );
};

export default InstagramPost1;
