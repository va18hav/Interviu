import React, { useEffect, useRef } from 'react';
import { Brain, Zap, Target, Mic } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const RealismProof = () => {
    const chatContainerRef = useRef(null);

    const differentiators = [
        {
            icon: <Brain className="w-7 h-7" />,
            title: 'Dynamic, Not Scripted',
            description: 'No pre-defined questions. The AI adapts in real-time based on your answers, just like a real senior engineer would.'
        },
        {
            icon: <Zap className="w-7 h-7" />,
            title: 'Probes Your Reasoning',
            description: 'Asks "Why?", "What if?", and challenges your assumptions. It doesn\'t just check answers—it tests your thinking process.'
        },
        {
            icon: <Target className="w-7 h-7" />,
            title: 'Adapts Difficulty',
            description: 'Automatically adjusts complexity based on your performance. Struggling? It helps. Crushing it? It goes deeper.'
        }
    ];

    const conversation = {
        exchanges: [
            {
                speaker: 'AI',
                text: 'What\'s the time complexity of your solution when the input array is already sorted?'
            },
            {
                speaker: 'Candidate',
                text: 'It would still be O(n log n) because of the sorting step.'
            },
            {
                speaker: 'AI',
                text: 'Right. But can you optimize for that case? What if 90% of your inputs are already sorted in production?'
            },
            {
                speaker: 'Candidate',
                text: 'I could add a check to see if it\'s sorted first, then skip the sort.'
            },
            {
                speaker: 'AI',
                text: 'How would you implement that check without making it O(n) every time?'
            }
        ]
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            const bubbles = chatContainerRef.current.querySelectorAll('.chat-bubble-animate');

            bubbles.forEach((bubble) => {
                gsap.from(bubble, {
                    scrollTrigger: {
                        trigger: bubble,
                        start: 'top 99%',
                        toggleActions: 'play none none none',
                    },
                    opacity: 0,
                    y: 30,
                    scale: 0.9,
                    duration: 2.5,
                    ease: 'back.out(1.7)',
                });
            });
        }, chatContainerRef);

        return () => ctx.revert(); // Cleanup GSAP context
    }, []);

    return (
        <section className="py-32 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Message */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tighter">
                        Real Conversations,
                        <br />
                        <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                            Not Scripted Q&A
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        The AI doesn't follow a script. It probes your reasoning, challenges assumptions, and adapts based on your answers—just like a real interviewer.
                    </p>
                </div>

                {/* Conversation + Cards Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-stretch">
                    {/* Chat-style Conversation */}
                    <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/30 opacity-60"></div>

                        <div className="relative p-8" ref={chatContainerRef}>
                            {/* Chat-style Conversation */}
                            <div className="space-y-4">
                                {conversation.exchanges.map((exchange, exchangeIdx) => (
                                    <div
                                        key={exchangeIdx}
                                        className={`chat-bubble-animate flex gap-3 ${exchange.speaker === 'Candidate' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {/* Mic Icon - Left side for AI */}
                                        {exchange.speaker === 'AI' && (
                                            <div className="flex-shrink-0 mt-1">
                                                <Mic className="w-4 h-4 text-blue-500" />
                                            </div>
                                        )}

                                        <div className={`max-w-[85%]`}>
                                            {/* Speaker Label */}
                                            <div className={`text-xs font-semibold mb-1 ${exchange.speaker === 'AI'
                                                ? 'text-blue-700'
                                                : 'text-green-700 text-right'
                                                }`}>
                                                {exchange.speaker === 'AI' ? 'Interviewer' : 'Candidate'}
                                            </div>

                                            {/* Message Bubble */}
                                            <div className={`rounded-2xl px-4 py-3 ${exchange.speaker === 'AI'
                                                ? 'bg-blue-50 text-blue-900 border border-blue-100 rounded-tl-sm'
                                                : 'bg-green-50 text-green-900 border border-green-100 rounded-tr-sm'
                                                }`}>
                                                <p className="text-sm leading-relaxed">
                                                    {exchange.text}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Mic Icon - Right side for Candidate */}
                                        {exchange.speaker === 'Candidate' && (
                                            <div className="flex-shrink-0 mt-1">
                                                <Mic className="w-4 h-4 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Differentiators Cards - Stacked */}
                    <div className="space-y-6 h-full">
                        {differentiators.map((item, index) => (
                            <div
                                key={index}
                                className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {/* Subtle texture */}
                                <div className="absolute inset-0 bg-[radial-gradient(#f3f4f6_1px,transparent_1px)] [background-size:16px_16px] opacity-0 group-hover:opacity-30 transition-opacity"></div>

                                <div className="relative py-14 px-6">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                                            {item.icon}
                                        </div>

                                        <div className="flex-1">
                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">
                                                {item.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RealismProof;
