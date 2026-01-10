import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FogBackground = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // Elements to animate
        const layers = Array.from(containerRef.current.querySelectorAll('.fog-layer'));

        // Mouse Parallax Logic
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5);
            const yPos = (clientY / window.innerHeight - 0.5);

            layers.forEach((layer, i) => {
                // Different depth for each layer
                const depth = (i + 1) * 30;

                gsap.to(layer, {
                    x: xPos * depth,
                    y: yPos * depth,
                    duration: 1.5,
                    ease: "power2.out"
                });
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Continuous Organic Drift
        layers.forEach((layer, i) => {
            // Randomize duration and movement slightly
            const duration = 20 + Math.random() * 10;
            const yMove = 30 + Math.random() * 30;
            const xMove = 20 + Math.random() * 20;

            // Float animation
            gsap.to(layer, {
                y: `+=${yMove}`,
                x: `+=${xMove}`,
                rotation: Math.random() * 10 - 5,
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });

        // Scroll Parallax (Drift upward on scroll)
        gsap.to(layers, {
            y: (i) => `-=${(i + 1) * 100}`, // Faster layers move more
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            ScrollTrigger.getAll().forEach(t => t.kill());
            gsap.killTweensOf(layers);
        };
    }, []);



    const baseStyle = "absolute rounded-[50%] filter blur-[100px] fog-layer will-change-transform";

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
            {/* Layer 1: Core Glow - Wider Oval */}
            <div
                className={`${baseStyle} w-[60vw] h-[35vw] bg-white`}
                style={{ opacity: 0.05, filter: 'blur(120px)' }}
            />

            {/* Layer 2: Soft Diffuse - Large Circular wash */}
            <div
                className={`${baseStyle} w-[55vw] h-[55vw] bg-slate-100`}
                style={{ opacity: 0.04, filter: 'blur(160px)' }}
            />

            {/* Layer 3: Horizontal Stretch */}
            <div
                className={`${baseStyle} w-[70vw] h-[30vw] translate-y-[10%] bg-white`}
                style={{ opacity: 0.04, filter: 'blur(140px)' }}
            />

            {/* Layer 4: Vertical Element for asymmetry */}
            <div
                className={`${baseStyle} w-[30vw] h-[50vw] -translate-x-[15%] bg-slate-50`}
                style={{ opacity: 0.03, filter: 'blur(130px)' }}
            />
        </div>
    );
};

export default FogBackground;
