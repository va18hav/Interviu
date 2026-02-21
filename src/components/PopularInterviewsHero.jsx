import React from 'react';
import { Sparkles } from 'lucide-react';
import googleLogo from '../assets/images/google.png';
import metaLogo from '../assets/images/meta.png';
import amazonLogo from '../assets/images/amazon.png';
import microsoftLogo from '../assets/images/microsoft.png';
import netflixLogo from '../assets/images/netflix.png';
import appleLogo from '../assets/images/apple.png';

// Fallback or external URL for the 7th icon (Nvidia)
const nvidiaLogo = "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg";

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
    <div className={`relative w-20 h-24 md:w-24 md:h-28 flex items-center justify-center transition-transform hover:scale-110 hover:z-10 duration-300 group drop-shadow-sm ${className}`}>
        {/* Hexagon Shape Background */}
        <div
            className="absolute inset-0 bg-white border border-gray-100 group-hover:bg-gray-50 transition-all duration-300 shadow-sm"
            style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
        />
        {/* Inner Content */}
        <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-3">
            <img src={logo} alt="Tech Giant" className="w-full h-full object-contain filter grayscale-20 group-hover:grayscale-0 transition-all duration-300" />
        </div>
    </div>
);

const PopularInterviewsHero = () => {
    return (
        <div className="relative w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300 mb-10">
            {/* Subtle Textured Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            {/* Very Subtle Gradient Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-60 pointer-events-none" />


            <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between px-8 py-12 md:px-16 gap-12">

                {/* Left Content */}
                <div className="max-w-2xl text-start lg:text-left space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Top Tech <br className="hidden lg:block" />
                        <span className="text-gray-400 font-bold tracking-tighter">
                            Interview Simulations
                        </span>
                    </h1>

                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Master the most sought-after interview questions from industry giants. Practice with realistic AI scenarios tailored to each company's style.
                    </p>
                </div>

                {/* Right Content - Honeycomb Layout */}
                <div className="relative flex flex-col items-center">
                    {/* Row 1 (2 items) */}
                    <div className="flex mb-[-20px] md:mb-[-24px]"> {/* Negative margin to nest hexes */}
                        <Hexagon logo={logos[0]} />
                        <Hexagon logo={logos[1]} />
                    </div>

                    {/* Row 2 (3 items) */}
                    <div className="flex mb-[-20px] md:mb-[-24px]">
                        <Hexagon logo={logos[2]} />
                        <Hexagon logo={logos[3]} />
                        <Hexagon logo={logos[4]} />
                    </div>

                    {/* Row 3 (2 items) */}
                    <div className="flex">
                        <Hexagon logo={logos[5]} />
                        <Hexagon logo={logos[6]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularInterviewsHero;
