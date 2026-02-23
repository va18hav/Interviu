import React, { useEffect, useRef } from 'react'
import { ArrowRight, Sparkles, FileText, Target } from 'lucide-react'
import resumebanner from '../assets/images/resumebanner.png'
import gsap from 'gsap';

const ResumeHero = (props) => {
    const heroRef = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation
            gsap.from(".hero-content > *", {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
                force3D: true
            });

            gsap.from(".hero-image", {
                scale: 0.9,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out",
                delay: 0.5,
                force3D: true
            });

            // Background orbs animation
            gsap.to(orb1Ref.current, {
                x: "random(-30, 30)",
                y: "random(-30, 30)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "none",
                force3D: true
            });
            gsap.to(orb2Ref.current, {
                x: "random(-30, 30)",
                y: "random(-30, 30)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "none",
                force3D: true
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={heroRef} className='relative rounded-[2.5rem] overflow-hidden bg-white/70 backdrop-blur-lg border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] group'>
            {/* Cinematic Background elements */}
            <div ref={orb1Ref} className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none will-change-transform" />
            <div ref={orb2Ref} className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none will-change-transform" />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 lg:p-16 relative z-10">
                <div className="flex-1 flex flex-col items-start gap-8 hero-content">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-900/10 shadow-sm animate-pulse">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">AI-Powered Optimization</span>
                    </div>

                    <h1 className='text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.95]'>
                        Master Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Professional Identity</span>
                    </h1>

                    <p className='text-base lg:text-lg text-slate-500 max-w-xl font-medium leading-relaxed'>
                        Our proprietary analysis engine doesn't just score your resume—it constructs a high-fidelity roadmap to beat top-tier ATS and secure executive-level interviews.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button
                            onClick={props.onButtonClick}
                            className="group relative flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-indigo-600 transition-all z-20 shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/30 hover:-translate-y-1 active:scale-95"
                        >
                            {props.buttonText || "Initialize Scan"}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-8 w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <Target size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">ATS Optimized</span>
                                <span className="text-[10px] text-slate-400 font-bold tracking-tight">Rank 1% Protocol</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <Sparkles size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">Smart Insights</span>
                                <span className="text-[10px] text-slate-400 font-bold tracking-tight">AI Driven Repair</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="flex-1 relative z-20 flex justify-center items-center hero-image"
                    onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - left - width / 2) / 30;
                        const y = (e.clientY - top - height / 2) / 30;
                        e.currentTarget.querySelector('.banner-wrapper').style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02, 1.02, 1.02)`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.banner-wrapper').style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
                    }}
                >
                    <div className="banner-wrapper transition-transform duration-500 ease-out p-4 md:p-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-2xl relative">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
                        <img
                            src={resumebanner}
                            alt="Resume Banner"
                            className="w-full max-w-[400px] h-auto object-contain relative z-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeHero