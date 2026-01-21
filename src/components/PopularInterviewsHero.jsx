import React from 'react';
import { Sparkles } from 'lucide-react';
import googleLogo from '../assets/images/google.png';
import metaLogo from '../assets/images/meta.png';
import amazonLogo from '../assets/images/amazon.png';
import microsoftLogo from '../assets/images/microsoft.png';
import netflixLogo from '../assets/images/netflix.png';
import appleLogo from '../assets/images/apple.png';

// Fallback or external URL for the 7th icon (Nvidia)
const nvidiaLogo = "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg";

const logos = [
    googleLogo,
    metaLogo,
    amazonLogo,
    microsoftLogo,
    netflixLogo,
    appleLogo,
    nvidiaLogo
];

const Hexagon = ({ logo, className }) => (
    <div className={`relative w-20 h-24 md:w-24 md:h-28 flex items-center justify-center transition-transform hover:scale-110 hover:z-10 duration-300 group drop-shadow-xl ${className}`}>
        {/* Hexagon Shape Background */}
        <div
            className="absolute inset-0 bg-white group-hover:from-cyan-50 group-hover:to-cyan-100 transition-all duration-300"
            style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
        />
        {/* Inner Content */}
        <div className="relative z-10 w-15 h-15 md:w-15 md:h-15 flex items-center justify-center p-3 bg-white rounded-full">
            <img src={logo} alt="Tech Giant" className="w-full h-full object-contain" />
        </div>
    </div>
);

const PopularInterviewsHero = () => {
    return (
        <div className="relative w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm mb-10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-12 md:px-16 gap-12">

                {/* Left Content */}
                <div className="max-w-2xl text-start lg:text-left space-y-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tighter">
                        Top Tech <br className="hidden lg:block" />
                        <span className="text-5xl md:text-6xl bg-gradient-to-r from-gray-700 via-gray-500 to-gray-800 bg-clip-text text-transparent tracking-tighter">
                            Interview Simulations
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Master the most sought-after interview questions from industry giants. Practice with realistic AI scenarios tailored to each company's style.
                    </p>
                </div>

                {/* Right Content - Honeycomb Layout */}
                <div className="relative flex flex-col gap-2 items-center">
                    {/* Row 1 (2 items) */}
                    <div className="flex gap-2 mb-[-24px] md:mb-[-28px]"> {/* Negative margin to nest hexes */}
                        <Hexagon logo={logos[0]} />
                        <Hexagon logo={logos[1]} />
                    </div>

                    {/* Row 2 (3 items) */}
                    <div className="flex gap-2 mb-[-24px] md:mb-[-28px]">
                        <Hexagon logo={logos[2]} />
                        <Hexagon logo={logos[3]} />
                        <Hexagon logo={logos[4]} />
                    </div>

                    {/* Row 3 (2 items) */}
                    <div className="flex gap-2">
                        <Hexagon logo={logos[5]} />
                        <Hexagon logo={logos[6]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularInterviewsHero;
