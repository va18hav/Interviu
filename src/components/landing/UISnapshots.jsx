import React from 'react';
import { Terminal, Layout, Mic, Clock, Share2, Activity, Code, MousePointer2, ChevronRight, Layers, Bot, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import codingRound from '../../assets/images/UI/codinground.png';
import designRound from '../../assets/images/UI/designround.png';
import behavioralRound from '../../assets/images/UI/interview.png';

const UISnapshots = () => {
    const snapshots = [
        {
            id: 'coding',
            tag: 'Execution Sandbox',
            tagIcon: <Terminal />,
            title: 'Technical Assessment',
            description: 'A full IDE with multi-language support. The AI evaluates not just the solution, but your algorithmic efficiency and edge case handling.',
            features: ['VS Code Style Interface', 'Language-Aware Evaluation', 'Real-time Complexity Analysis'],
            image: codingRound,
            color: 'blue'
        },
        {
            id: 'design',
            tag: 'Architecture Canvas',
            tagIcon: <Layers />,
            title: 'System Design',
            description: 'An interactive canvas to architect distributed systems. Defend your choices on scaling, sharding, and latency against expert-level critique.',
            features: ['Live Infrastructure Review', 'Node-Based Logic', 'Failure Mode Scenarios'],
            image: designRound,
            color: 'indigo'
        },
        {
            id: 'behavioral',
            tag: 'Natural Dialogue',
            tagIcon: <Mic />,
            title: 'Executive Behavioral',
            description: 'Voice-based leadership simulations. The AI probes your narratives for senior-level hiring signals and leadership principles.',
            features: ['STAR Method Probing', 'Acoustic Tone Analysis', 'Leadership Alignment'],
            image: behavioralRound,
            color: 'slate'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
    };

    return (
        <section className="bg-white py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-3xl mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Technical Evaluation Suites</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 leading-tight tracking-tighter">
                        Calibrated for the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                            Entire Hiring Loop.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                        Standardized interview formats reimagined with adaptive AI to ensure your preparation matches the rigor of top-tier organizations.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-40"
                >
                    {snapshots.map((snap, idx) => (
                        <motion.div
                            key={snap.id}
                            variants={sectionVariants}
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                                }`}
                        >
                            <div className={`lg:col-span-5 space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                        {React.cloneElement(snap.tagIcon, { className: "w-3.5 h-3.5" })}
                                        <span>{snap.tag}</span>
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">
                                        {snap.title}
                                    </h3>

                                    <p className="text-base text-slate-500 font-medium leading-relaxed">
                                        {snap.description}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {snap.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3 text-slate-900">
                                            <div className="w-1 h-1 rounded-full bg-indigo-600" />
                                            <span className="text-[11px] font-black uppercase tracking-widest">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4">
                                    <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] group">
                                        View Documentation
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            <div className={`lg:col-span-7 relative group ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/5 to-blue-500/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                                <div className="relative rounded-2xl border border-slate-100 bg-white shadow-2xl p-2 group-hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden">
                                    <div className="absolute top-0 w-full h-10 flex items-center px-6">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        </div>
                                    </div>
                                    <img
                                        src={snap.image}
                                        alt={snap.title}
                                        className="w-full h-auto rounded-xl mt-8 transform group-hover:scale-[1.02] transition-transform duration-1000"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default UISnapshots;
