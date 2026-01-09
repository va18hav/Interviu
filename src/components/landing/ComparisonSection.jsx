import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Brain, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ComparisonSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const words = textRef.current.querySelectorAll('.word');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                end: "bottom 50%",
                scrub: 0.5,
            }
        });

        tl.to(words, {
            color: "#ffffff",
            duration: 0.1,
            stagger: 0.1,
            ease: "none"
        });

        return () => {
            if (tl.scrollTrigger) tl.scrollTrigger.kill();
            tl.kill();
        };
    }, []);

    // Helper to render text with icons embedded
    const renderParagraph = (text, icon = null) => {
        return (
            <p className="mb-12 last:mb-0">
                {text.split(' ').map((word, i) => (
                    <span key={i} className="word text-slate-800 transition-colors duration-200 inline-block mr-[0.3em]">
                        {word}
                    </span>
                ))}
                {icon && (
                    <span className="word text-slate-800 inline-block align-middle ml-1">
                        {icon}
                    </span>
                )}
            </p>
        );
    };

    return (
        <section ref={containerRef} className="relative py-32 bg-black min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-neutral-800/20 to-stone-800/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
                <div ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                    {/* Paragraph 1 */}
                    <p className="mb-16">
                        {["Interviews", "are", "rarely", "about", "knowing", "everything.", "They’re", "about", "staying", "clear,", "calm,", "and", "confident", "when", "it", "matters."].map((word, i) => (
                            <span key={`p1-${i}`} className="word text-neutral-700/10 inline-block mr-[0.25em]">
                                {word}
                            </span>
                        ))}
                    </p>

                    {/* Paragraph 2 */}
                    <p>
                        {["Interviu", "exists", "to", "help", "you", "practice", "that", "moment."].map((word, i) => (
                            <span key={`p2-${i}`} className="word text-neutral-700/10 inline-block mr-[0.25em]">
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
