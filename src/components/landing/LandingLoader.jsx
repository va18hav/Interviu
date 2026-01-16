import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const LandingLoader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useLayoutEffect(() => {
        // Initial setup
        gsap.set(textRef.current, {
            opacity: 0,
            y: 20,
            scale: 0.9
        });

        const tl = gsap.timeline({
            onComplete: onComplete
        });

        // Animation Sequence
        tl.to(textRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)"
        })
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
        <div ref={containerRef} className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden">
            <div className="w-full relative h-32 flex items-center justify-center">
                {/* Interviu Text */}
                <h1
                    ref={textRef}
                    className="relative z-10 text-5xl md:text-7xl lg:text-9xl font-extrabold text-black tracking-tighter opacity-0"
                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                >
                    Inter<span className='text-cyan-400'>viu</span>
                </h1>
            </div>
        </div>
    );
};

export default LandingLoader;
