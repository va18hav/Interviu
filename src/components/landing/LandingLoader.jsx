import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const LandingLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const pathRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        const path = pathRef.current;
        const length = path.getTotalLength();

        // Initial setup
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });
        gsap.set(textRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.9
        });

        const tl = gsap.timeline({
            onComplete: onComplete
        });

        // Animation Sequence
        tl.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.inOut" // Non-linear flow
        })
            .to(path, {
                opacity: 0,
                duration: 0.3,
                ease: "power3.out"
            })
            .to(textRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=0.2") // Overlap slightly
            .to({}, { duration: 0.5 }) // Short hold
            .to(textRef.current, {
                scale: 250, // Massive zoom "unmask"
                duration: 1.5,
                ease: "power4.inOut",
                force3D: true
            })
            .to(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut"
            }, "-=1") // Start fade closer to the end of zoom (last 1 second)
            .to({}, { duration: 0.1 }); // Safety buffer to prevent flash on unmount

        return () => tl.kill();
    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden">
            <div className="w-full relative h-32 flex items-center justify-center">

                {/* Pulse Line SVG */}
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    {/* Animated Pulse Path (Silver) */}
                    <path
                        ref={pathRef}
                        d="M0,50 L300,50 L320,20 L340,80 L360,50 L440,50 L460,10 L480,90 L500,50 L600,50 L620,30 L640,70 L660,50 L1000,50"
                        fill="none"
                        stroke="#5ecef1ff" // Slate-300 (Silver)
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(226, 232, 240, 0.4))' }}
                    />
                </svg>

                {/* Interviu Text */}
                <h1
                    ref={textRef}
                    className="relative z-10 text-5xl md:text-7xl lg:text-9xl font-extrabold text-white tracking-tighter opacity-0"
                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                >
                    Inter<span className='text-cyan-400'>viu</span>
                </h1>
            </div>
        </div>
    );
};

export default LandingLoader;
