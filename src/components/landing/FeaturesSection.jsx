import React, { useRef, useLayoutEffect } from 'react';
import { ArrowRight, Brain, Building2, FileText, Sparkles, Target, Zap, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const icons = gsap.utils.toArray('.feature-icon');

            icons.forEach((icon) => {
                gsap.fromTo(icon,
                    {
                        opacity: 0.1,
                        scale: 0.2,
                        filter: 'blur(10px)',
                        color: '#334155' // slate-700
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        color: '#ffffff', // white
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: icon,
                            start: "top 90%", // Start highlighting when icon enters bottom 15% of viewport
                            end: "center 55%",   // Finishes highlighting when it's near center
                            scrub: 1,         // Smooth scrubbing logic
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: <Target className="w-10 h-10" />, // Removed text-white to allow parent color control
            title: "Personalized Interviews",
            description: "Create custom interview scenarios tailored specifically to your target role, experience level, and desired skill set. AI adapts to your responses in real-time.",
            action: "Create Interview",
            link: "/create"
        },
        {
            icon: <Mic className="w-10 h-10" />,
            title: "Top Tech Simulations",
            description: "Practice with realistic interview loops modeled after top tech giants like Google, Amazon, and Meta. Master the specific formats and questions used by industry leaders.",
            action: "View Companies",
            link: "/dashboard/all-popular-interviews"
        },
        {
            icon: <FileText className="w-10 h-10" />,
            title: "AI Resume Analysis",
            description: "Get instant, actionable feedback on your resume. Our ATS-focused analysis helps you optimize keywords, formatting, and content to get noticed by recruiters.",
            action: "Analyze Resume",
            link: "/resume"
        }
    ];

    return (
        <section ref={sectionRef} id="features" className="relative py-24 bg-black overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        The core of smarter preparation
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Complete your interview toolkit with features designed to accelerate your career growth.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 border border-slate-800/60 hover:bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:-translate-y-1"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Icon Container */}
                                <div className="mb-10 flex justify-center feature-icon text-slate-700">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {feature.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                                    {feature.description}
                                </p>

                                <button
                                    onClick={() => navigate(feature.link)}
                                    className="flex items-center gap-2 border border-slate-700 px-4 py-2 rounded-2xl w-1/2 text-sm font-semibold text-white/80 group-hover:bg-slate-800/60 transition-colors"
                                >
                                    {feature.action}
                                    <ArrowRight className="hidden md:block w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
