import React from 'react';
import { Target, Mic, FileText } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: <Target className="w-8 h-8" />,
            title: 'Pick your interview',
            description: 'Select company + role + level, or create a custom interview. This sets the expectation.',
            bgColor: 'bg-white',
            iconColor: 'text-gray-900',
            borderColor: 'border-gray-300'
        },
        {
            number: '02',
            icon: <Mic className="w-8 h-8" />,
            title: "Start a live session",
            description: 'The interviewer adapts, interrupts, and challenges you in real time. Just like the real thing.',
            bgColor: 'bg-white',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-400 ring-1 ring-blue-50'
        },
        {
            number: '03',
            icon: <FileText className="w-8 h-8" />,
            title: 'Know exactly what to improve',
            description: 'Get an instant performance report with transcript analysis and actionable next steps.',
            bgColor: 'bg-white',
            iconColor: 'text-gray-900',
            borderColor: 'border-gray-300'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-600">
                        Get started in three simple steps
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`${step.bgColor} rounded-2xl p-8 border ${step.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 group`}
                        >
                            {/* Number and Icon */}
                            <div className="flex items-start justify-between mb-6">
                                <span className="text-5xl font-bold text-black">
                                    {step.number}
                                </span>
                                <div className={step.iconColor}>
                                    {step.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-black mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
