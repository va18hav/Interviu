import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
    const navigate = useNavigate();

    const benefits = [
        "No setup required",
        "Takes 2 minutes to begin",
        "No prior prep needed",
        "Free during early access"
    ];

    return (
        <section className="py-32 bg-gray-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
            {/* Sophisticated Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

                <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-[1.1]">
                    Start your first <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        interview today.
                    </span>
                </h2>

                {/* Refined Reassurance Bullets - Minimalist */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-400">
                            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </div>
                            <span className="text-sm tracking-wide font-medium">{benefit}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="group relative px-10 py-5 bg-white text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        <span className="relative flex items-center gap-2">
                            Start Free Interview
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <p className="text-xs text-gray-500 font-medium tracking-wider uppercase opacity-80">
                        No credit card required
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
