import React, { useEffect, useRef, useState } from 'react';

const InteractiveGridBackground = () => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const gridSize = 40; // Grid cell size in pixels

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Snap to grid
    const cellX = Math.floor(mousePos.x / gridSize) * gridSize;
    const cellY = Math.floor(mousePos.y / gridSize) * gridSize;

    return (
        <div ref={containerRef} className="absolute inset-0 bg-black overflow-hidden pointer-events-none z-0">
            {/* Base Grid (Faint) */}
            {/* Base Grid (Clearly Visible) */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)]"
                style={{ backgroundSize: `${gridSize}px ${gridSize}px`, opacity: 0.2 }}
            ></div>

            {/* Highlighted Cell */}
            <div
                className="absolute bg-slate-500/35 transition-transform duration-75"
                style={{
                    left: 0,
                    top: 0,
                    transform: `translate(${cellX}px, ${cellY}px)`,
                    width: gridSize - 1,
                    height: gridSize - 1,
                    boxShadow: '0 0 15px rgba(255, 255, 255, 0.05)',
                }}
            />

            {/* Soft Glow Center (Optional, for general ambient light) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
    );
};

export default InteractiveGridBackground;
