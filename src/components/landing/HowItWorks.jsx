import React from 'react';
import { Target, Mic, FileText, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            icon: <Target className="w-6 h-6" />,
            title: 'Configure Domain',
            description: 'Select your target engineering vertical and seniority level to calibrate the session\'s rigor.'
        },
        {
            number: '02',
            icon: <PlayCircle className="w-6 h-6" />,
            title: "Simulated Deployment",
            description: 'Engage in a live technical session where the AI reviewer probes for executive hiring signals.'
        },
        {
            number: '03',
            icon: <FileText className="w-6 h-6" />,
            title: 'Synthesized Feedback',
            description: 'Receive an exhaustive performance audit with transcript-level insights and domain next steps.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Connection Line (Desktop) */}
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-[70%] h-px bg-slate-200 hidden lg:block" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Execution Protocol</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 tracking-tighter leading-tight">
                        A Frictionless Data-Driven <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                            Path to Mastery.
                        </span>
                    </h2>
                </div>

                {/* Steps Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={stepVariants}
                            className="relative group"
                        >
                            {/* Step Card */}
                            <div className="h-full bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:border-indigo-100 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 group-hover:-translate-y-2">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-4xl font-black text-slate-100 group-hover:text-indigo-50/50 transition-colors">
                                            {step.number}
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
                                            {step.icon}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-950 mb-3 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Arrow (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-1/2 -right-6 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                                        <ChevronRight className="w-5 h-5 text-slate-300" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Trust Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center"
                >
                    <button className="px-10 py-5 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-slate-900/20 active:scale-95">
                        Initiate First Session
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
