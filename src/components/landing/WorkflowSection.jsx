import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import configureImg from "../../assets/images/configure.png";
import interviewImg from "../../assets/images/interview.png";
import feedbackImg from "../../assets/images/feedback.png";
import topTechImg from "../../assets/images/toptech.png";

gsap.registerPlugin(ScrollTrigger);

const WorkflowSection = () => {
    const sectionRef = useRef(null);

    const steps = [
        {
            id: 1,
            title: "Configure Your Interview",
            description:
                "Select your target role, difficulty level, and specific skills you want to practice. From 'Junior React Developer' to 'Senior System Architect'—you define the challenge.",
            image: configureImg,
        },
        {
            id: "or",
            title: "Choose from our top tech interview simulations",
            description:
                "Targeting FAANG? Skip the setup and dive straight into realistic interview loops modeled after top tech giants like Google, Amazon, and Meta.",
            image: topTechImg,
        },
        {
            id: 2,
            title: "AI-Driven Simulation",
            description:
                "Engage in a realistic voice conversation. The AI asks contextual questions, probes your answers, and adapts to your performance in real-time—just like a real interviewer.",
            image: interviewImg,
        },
        {
            id: 3,
            title: "Detailed Feedback",
            description:
                "Receive an instant, comprehensive report card. Review your communication score, technical accuracy, and get actionable suggestions on how to improve your answers.",
            image: feedbackImg,
        },
    ];

    useEffect(() => {
        ScrollTrigger.matchMedia({
            /** ---------------- DESKTOP EXPERIENCE ---------------- */
            "(min-width: 769px)": () => {
                const ctx = gsap.context(() => {
                    gsap.set(".step-card", { autoAlpha: 0 });
                    gsap.set(".step-card-0", { autoAlpha: 1 });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=3000",
                            pin: true,
                            scrub: 1,
                        },
                    });

                    steps.forEach((_, i) => {
                        if (i === steps.length - 1) return;

                        tl.to(`.step-card-${i} .step-text`, {
                            y: -40,
                            opacity: 0,
                            duration: 0.8,
                        })
                            .to(
                                `.step-card-${i} .step-image`,
                                {
                                    opacity: 0,
                                    scale: 0.95,
                                    duration: 0.8,
                                },
                                "<"
                            )
                            .set(`.step-card-${i}`, { autoAlpha: 0 })
                            .set(`.step-card-${i + 1}`, { autoAlpha: 1 })
                            .fromTo(
                                `.step-card-${i + 1} .step-text`,
                                { y: 40, opacity: 0 },
                                { y: 0, opacity: 1, duration: 0.8 }
                            )
                            .fromTo(
                                `.step-card-${i + 1} .step-image`,
                                { opacity: 0, scale: 1.05 },
                                { opacity: 1, scale: 1, duration: 0.8 },
                                "<"
                            )
                            .to({}, { duration: 0.4 });
                    });
                }, sectionRef);

                return () => ctx.revert();
            },

            /** ---------------- MOBILE EXPERIENCE ---------------- */
            "(max-width: 768px)": () => {
                const ctx = gsap.context(() => {
                    gsap.utils.toArray(".step-card").forEach((card) => {
                        gsap.from(card, {
                            opacity: 0,
                            y: 40,
                            duration: 0.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 80%",
                            },
                        });
                    });
                }, sectionRef);

                return () => ctx.revert();
            },
        });

        return () => ScrollTrigger.killAll();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-black overflow-hidden min-h-screen"
        >
            {/* Background glows (disabled blur on mobile for performance) */}
            <div className="hidden md:block absolute top-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
            <div className="hidden md:block absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 space-y-40 md:space-y-0">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`step-card step-card-${index} md:absolute md:top-1/2 md:-translate-y-1/2 left-0 w-full flex flex-col md:flex-row items-center gap-10 md:gap-20`}
                    >
                        {/* Text */}
                        <div className="step-text w-full md:w-5/12 flex flex-col gap-6">
                            <span className="inline-flex w-fit px-4 py-1.5 rounded-full border border-white/10 text-xs tracking-widest text-white uppercase">
                                {step.id === "or" ? "OR" : `Step 0${step.id}`}
                            </span>

                            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                {step.title}
                            </h3>

                            <p className="text-slate-400 text-base md:text-xl leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* Image */}
                        <div className="step-image w-full md:w-7/12">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 aspect-[16/10]">
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
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
