import React, { useState, useEffect } from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import LandingLoader from '../components/landing/LandingLoader';
import FAQSection from '../components/landing/FAQSection';
import VideoSection from '../components/landing/VideoSection';

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            // Prevent scrolling interactions but keep window scrollbar visible
            const preventDefault = (e) => {
                e.preventDefault();
            };

            const preventDefaultForScrollKeys = (e) => {
                const keys = ['Space', 'PageUp', 'PageDown', 'End', 'Home', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
                if (keys.includes(e.code)) {
                    e.preventDefault();
                }
            };

            window.scrollTo(0, 0); // Ensure we start at the top

            // Modern Chrome requires { passive: false } when preventing default
            window.addEventListener('wheel', preventDefault, { passive: false });
            window.addEventListener('touchmove', preventDefault, { passive: false });
            window.addEventListener('keydown', preventDefaultForScrollKeys, false);

            return () => {
                window.removeEventListener('wheel', preventDefault);
                window.removeEventListener('touchmove', preventDefault);
                window.removeEventListener('keydown', preventDefaultForScrollKeys);
            };
        }
    }, [isLoading]);

    return (
        <div className="bg-white min-h-screen">
            {isLoading && <LandingLoader onComplete={() => setIsLoading(false)} />}

            <HeroSection />
            <VideoSection />
            <FeaturesSection />
            <WorkflowSection />
            <ComparisonSection />
            <FAQSection />
        </div>
    );
};

export default LandingPage;
