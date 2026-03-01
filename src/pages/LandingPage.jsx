import React, { useEffect } from "react";
import NewHeroSection from "../components/landing/NewHeroSection";
import SocialProof from "../components/landing/SocialProof";
import CompanyShowcase from "../components/landing/CompanyShowcase";
import UISnapshots from "../components/landing/UISnapshots";
import RealismProof from "../components/landing/RealismProof";
import TechnicalDossier from "../components/landing/TechnicalDossier";
import RoleFocus from "../components/landing/RoleFocus";
import HowItWorks from "../components/landing/HowItWorks";
import FAQ from "../components/landing/FAQ";
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

            {/* Social Proof Strip */}
            {/* <SocialProof /> */}

            {/* Company Showcase */}
            <CompanyShowcase />

            {/* UI Snapshots (Features Section) */}
            <UISnapshots />

            {/* Realism & Quality Proof */}
            <RealismProof />

            {/* Technical Dossier */}
            <TechnicalDossier />

            {/* Two-Role Focus */}
            <RoleFocus />

            {/* How It Works */}
            <HowItWorks />

            {/* FAQ */}
            <FAQ />

            {/* Final CTA */}
            <FinalCTA />
        </div>
    );
};

export default LandingPage;
