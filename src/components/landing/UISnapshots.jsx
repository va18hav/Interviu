import React from 'react';
import { Terminal, Layout, Mic, Clock, Share2, Activity, Code, MousePointer2 } from 'lucide-react';
import codingRound from '../../assets/images/UI/codinground.png';
import designRound from '../../assets/images/UI/designround.png';
import behavioralRound from '../../assets/images/UI/interview.png';

const UISnapshots = () => {
    return (
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-gray-500 uppercase bg-gray-50 rounded-full border border-gray-100">
                        Interview Types
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                        Practice Every Interview
                        <br />
                        <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                            You'll Actually Face
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Coding. System Design. Behavioral. All in one place.
                    </p>
                </div>

                <div className="space-y-24">

                    {/* 1. Coding Round - Text Left, Image Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                        <div className="lg:col-span-5 lg:pr-8">
                            <div className="h-full rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-center relative">
                                {/* Subtle differentiator - Code pattern */}
                                <div className="space-y-6 relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium w-fit">
                                        <Clock className="w-3 h-3" />
                                        Timed Environment
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                            Real-time Coding
                                        </h3>
                                        <p className="text-base text-gray-600 leading-relaxed">
                                            Full IDE with syntax highlighting and multi-language support. The AI adapts questions to your code quality and edge case handling.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">VS Code Style</span>
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">Execution Sandbox</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-7 relative">
                            {/* Editor specific glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            <div className="relative rounded-xl overflow-hidden transform group-hover:scale-[1.01] transition duration-500">
                                <div className="absolute top-0 w-full h-8 flex items-center px-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                    </div>
                                </div>
                                <img src={codingRound} alt="Real-time coding round interface" className="w-full h-auto pt-8" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Design Round - Text Left, Image Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                        <div className="lg:col-span-5 lg:pr-8">
                            <div className="h-full rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-center relative">
                                {/* Subtle differentiator - Grid pattern */}
                                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                                <div className="space-y-6 relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium w-fit">
                                        <Share2 className="w-3 h-3" />
                                        Whiteboard + Traffic Simulation
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                            System Design
                                        </h3>
                                        <p className="text-base text-gray-600 leading-relaxed">
                                            Drag-and-drop architecture canvas. Defend your choices on scaling, database sharding, and caching strategies against AI critique.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">Interactive Nodes</span>
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">Architecture Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-7 relative">
                            {/* Design specific glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-100/50 transform group-hover:scale-[1.01] transition duration-500 bg-white">
                                <img src={designRound} alt="AI design simulations interface" className="w-full h-auto" />
                            </div>
                        </div>
                    </div>

                    {/* 3. Behavioral Round - Text Left, Image Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                        <div className="lg:col-span-5 lg:pr-8">
                            <div className="h-full rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-8 flex flex-col justify-center relative">
                                {/* Subtle differentiator - Waveform hint */}
                                <div className="space-y-6 relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-medium w-fit">
                                        <Activity className="w-3 h-3" />
                                        Live Voice Latency &lt; 200ms
                                    </div>

                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                            Behavioral
                                        </h3>
                                        <p className="text-base text-gray-600 leading-relaxed">
                                            Natural voice conversations about leadership and conflict. The AI probes your STAR stories for depth and authenticity.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">Real-time STT</span>
                                        <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium rounded">Tone Analysis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-7 relative">
                            {/* Voice specific glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/5 to-rose-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                            <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-100 transform group-hover:scale-[1.01] transition duration-500 bg-white">
                                <img src={behavioralRound} alt="Immersive voice interview interface" className="w-full h-auto" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default UISnapshots;
