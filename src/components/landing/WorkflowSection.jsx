import React, { useLayoutEffect, useRef } from 'react';
import { Settings, Mic, BarChart3 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import configureImg from '../../assets/images/configure.png';
import interviewImg from '../../assets/images/interview.png';
import feedbackImg from '../../assets/images/feedback.png';
import topTechImg from '../../assets/images/toptech.png';

gsap.registerPlugin(ScrollTrigger);

const WorkflowSection = () => {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    const steps = [
        {
            id: 1,
            title: "Configure Your Interview",
            description: "Select your target role, difficulty level, and specific skills you want to practice. From 'Junior React Developer' to 'Senior System Architect'—you define the challenge.",
            image: configureImg,
        },
        {
            id: 'or',
            title: "Choose from our top tech interview simulations",
            description: "Targeting FAANG? Skip the setup and dive straight into realistic interview loops modeled after top tech giants like Google, Amazon, and Meta.",
            image: topTechImg,
        },
        {
            id: 2,
            title: "AI-Driven Simulation",
            description: "Engage in a realistic voice conversation. The AI asks contextual questions, probes your answers, and adapts to your performance in real-time—just like a real interviewer.",
            image: interviewImg,
        },
        {
            id: 3,
            title: "Detailed Feedback",
            description: "Receive an instant, comprehensive report card. Review your communication score, technical accuracy, and get actionable suggestions on how to improve your answers.",
            image: feedbackImg,
        }
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 768;

            // Optimization: Shorter scroll distance on mobile to feel snappier
            const scrollDistance = isMobile ? "+=1500" : "+=3000";

            // Initial Setup: Stack cards absolutely in the center
            gsap.set('.step-card', {
                autoAlpha: 0,
                position: 'absolute',
                top: '50%',
                left: '0',
                yPercent: -50,
                width: '100%'
            });
            gsap.set('.step-card-0', { autoAlpha: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: scrollDistance,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1, // Crucial for mobile smoothness
                    fastScrollEnd: true, // Prevents glitching on fast scrolls
                }
            });

            steps.forEach((_, i) => {
                if (i === steps.length - 1) return;

                // Adjust animation intensity for mobile
                const yDistance = isMobile ? 30 : 50;

                // Transition Current Step Out
                tl.to(`.step-card-${i} .step-text`, { y: -yDistance, opacity: 0, duration: 1 })
                    .to(`.step-card-${i} .step-image`, { scale: 0.95, opacity: 0, duration: 1 }, "<") // Reduced scale effect

                    // Transition Next Step In
                    .fromTo(`.step-card-${i + 1}`,
                        { autoAlpha: 0 },
                        { autoAlpha: 1, duration: 0.05 } // Fast visibility toggle
                    )
                    .fromTo(`.step-card-${i + 1} .step-text`,
                        { y: yDistance, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1 },
                    )
                    .fromTo(`.step-card-${i + 1} .step-image`,
                        { scale: 1.05, opacity: 0 }, // Reduced scale effect
                        { scale: 1, opacity: 1, duration: 1 },
                        "<"
                    );

                tl.to({}, { duration: 0.5 }); // Pause for reading
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        // Use 100svh to handle mobile address bar resizing gracefully
        <section ref={sectionRef} className="relative bg-black overflow-hidden h-[100svh]">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-900/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none will-change-transform" />
            <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-900/10 rounded-full blur-[80px] md:blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none will-change-transform" />

            {/* Container */}
            <div ref={containerRef} className="w-full max-w-7xl mx-auto px-6 h-full relative z-10">

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`step-card step-card-${index} absolute top-1/2 -translate-y-1/2 left-0 w-full px-0 md:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-20 will-change-transform`}
                    >
                        {/* Text Content */}
                        <div className="step-text w-full md:w-5/12 flex flex-col gap-6 order-2 md:order-1">
                            {/* Step Indicator */}
                            <div className={`inline-flex items-center self-start gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 bg-opacity-10 border border-white/10`}>
                                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
                                    {step.id === 'or' ? 'OR' : `Step 0${step.id}`}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-base md:text-xl text-slate-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* Image Content */}
                        <div className="step-image w-full md:w-7/12 order-1 md:order-2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/50 aspect-[16/10] will-change-transform">
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent pointer-events-none z-10" />
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover object-left-top"
                                    loading="eager" // Eager load for smoother initial scroll
                                />
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
};

export default WorkflowSection;
