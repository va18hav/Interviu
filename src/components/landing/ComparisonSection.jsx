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
            const paragraphs = textRef.current.querySelectorAll('p');

            // --- Desktop Animation (Scrub based - High Fidelity) ---
            mm.add("(min-width: 768px)", () => {
                // Reset to desktop initial state
                gsap.set(paragraphs, { opacity: 1, y: 0 }); // Ensure paragraphs are visible
                gsap.set(words, { color: "rgba(220, 220, 220, 0.3)", opacity: 1, display: "inline-block" });

                gsap.to(words, {
                    color: (i, target) => target.dataset.color || "#09090b", // slate-950/black
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

            // --- Mobile Animation (Line-by-line Fade In - No ScrollTrigger per word) ---
            mm.add("(max-width: 767px)", () => {
                // Reset to mobile initial state
                gsap.set(words, { color: (i, target) => target.dataset.color || "#ffffff", opacity: 1 }); // Words are fully colored already
                gsap.set(paragraphs, { opacity: 0, y: 20 }); // Animate entire paragraphs instead

                // Animate paragraphs one by one
                gsap.to(paragraphs, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="hidden md:block relative py-16 bg-white min-h-[50vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-slate-200/50 to-gray-200/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
                <div ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    {/* Paragraph 1 */}
                    <p className="mb-16">
                        {["Interviews", "are", "rarely", "about", "knowing", "everything.", "They’re", "about", "staying", "clear,", "calm,", "and", "confident", "when", "it", "matters."].map((word, i) => (
                            <span key={`p1-${i}`} className="word inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </p>

                    {/* Paragraph 2 - "Interviu" styled with Cyan */}
                    <p>
                        <span className="word inline-block mr-0" data-color="#09090b">Inter</span>
                        <span className="word inline-block mr-[0.25em]" data-color="#22d3ee">viu</span>
                        {["exists", "to", "help", "you", "practice", "that", "moment."].map((word, i) => (
                            <span key={`p2-${i}`} className="word inline-block mr-[0.25em]">
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
