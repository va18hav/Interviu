import React, { useEffect } from "react";
import NewHeroSection from "../components/landing/NewHeroSection";
import CompanyShowcase from "../components/landing/CompanyShowcase";
import RealismProof from "../components/landing/RealismProof";
import UISnapshots from "../components/landing/UISnapshots";

import RoleFocus from "../components/landing/RoleFocus";
import HowItWorks from "../components/landing/HowItWorks";
import FinalCTA from "../components/landing/FinalCTA";

const LandingPage = () => {
    useEffect(() => {
        // Prevent scroll restoration on page load
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Scroll to top on mount
        window.scrollTo(0, 0);

        // Re-enable scroll after a brief delay
        const timer = setTimeout(() => {
            document.body.style.overflow = 'unset';
        }, 100);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Navigation */}
            <NewHeroSection />

            {/* Company Showcase */}
            <CompanyShowcase />

            {/* UI Snapshots (New Features Section) */}
            <UISnapshots />

            {/* Realism & Quality Proof */}
            <RealismProof />

            {/* Two-Role Focus */}
            <RoleFocus />

            {/* How It Works */}
            <HowItWorks />

            {/* Final CTA */}
            <FinalCTA />
        </div>
    );
};

export default LandingPage;
