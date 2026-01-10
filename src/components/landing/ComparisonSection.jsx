import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ComparisonSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            const words = textRef.current.querySelectorAll('.word');

            // --- Desktop Animation (Scrub based - High Fidelity) ---
            mm.add("(min-width: 768px)", () => {
                // Reset to initial state
                gsap.set(words, { color: "rgba(64,64,64,0.3)" });

                gsap.to(words, {
                    color: (i, target) => target.dataset.color || "#ffffff",
                    stagger: 0.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        end: "bottom 50%",
                        scrub: 0.5,
                    }
                });
            });

            // --- Mobile Animation (Trigger based - High Performance) ---
            mm.add("(max-width: 767px)", () => {
                // Reset to initial state
                gsap.set(words, { color: "rgba(64,64,64,0.3)" });

                // Simple auto-play animation when in view
                gsap.to(words, {
                    color: (i, target) => target.dataset.color || "#ffffff",
                    duration: 0.8,
                    stagger: 0.03,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-32 bg-black min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-neutral-800/20 to-stone-800/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
                <div ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    {/* Paragraph 1 */}
                    <p className="mb-16">
                        {["Interviews", "are", "rarely", "about", "knowing", "everything.", "They’re", "about", "staying", "clear,", "calm,", "and", "confident", "when", "it", "matters."].map((word, i) => (
                            <span key={`p1-${i}`} className="word text-neutral-700/30 inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </p>

                    {/* Paragraph 2 - "Interviu" styled with Cyan */}
                    <p>
                        <span className="word text-neutral-700/30 inline-block mr-0" data-color="#ffffff">Inter</span>
                        <span className="word text-neutral-700/30 inline-block mr-[0.25em]" data-color="#22d3ee">viu</span>
                        {["exists", "to", "help", "you", "practice", "that", "moment."].map((word, i) => (
                            <span key={`p2-${i}`} className="word text-neutral-700/30 inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
