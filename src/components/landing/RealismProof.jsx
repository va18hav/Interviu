import React from 'react';
import { Target, MessageSquare, ShieldCheck, Zap, ChevronRight, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const RealismProof = () => {
    const differentiators = [
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: 'Dynamic Evaluation',
            description: 'The AI adapts in real-time based on your technical depth, precisely mimicking a senior engineer\'s evaluation process.'
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: 'Hiring Signal Probing',
            description: 'Identifies and probes for specific hiring signals—reasoning, edge case awareness, and architectural trade-offs.'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Adaptive Calibration',
            description: 'Automatically calibrates the session complexity based on your performance to stay in the zone of optimal preparation.'
        }
    ];

    const conversation = {
        exchanges: [
            {
                speaker: 'AI',
                text: 'Based on your design for the cache layer, what happens to consistency if a write operation fails halfway through?'
            },
            {
                speaker: 'Candidate',
                text: 'The secondary nodes might have stale data until the background sync finishes.'
            },
            {
                speaker: 'AI',
                text: 'How would you mitigate that if the client requires strict consistency for this specific workflow?'
            },
            {
                speaker: 'Candidate',
                text: 'I could implement a write-through policy with quorum-based acknowledgement.'
            },
            {
                speaker: 'AI',
                text: 'Fair. What are the latency trade-offs of that approach in a multi-region setup?'
            }
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="max-w-3xl mb-24 text-center lg:text-left mx-auto lg:mx-0">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Adaptive Intelligence</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-6 leading-[1.05] tracking-tighter">
                        Evaluation That Goes <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
                            Beyond the Surface.
                        </span>
                    </h2>

                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                        Traditional practice is scripted. Intervyiu uses proprietary technical signals to probe your systems thinking and architecture reasoning in real-time.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Chat Simulation Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 relative rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-10 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

                        <div className="relative space-y-6">
                            {conversation.exchanges.map((exchange, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2 }}
                                    className={`flex gap-4 ${exchange.speaker === 'Candidate' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${exchange.speaker === 'AI'
                                            ? 'bg-slate-900 border-slate-800 text-white'
                                            : 'bg-white border-slate-200 text-slate-400'
                                        }`}>
                                        {exchange.speaker === 'AI' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>

                                    <div className={`max-w-[85%] space-y-1.5 ${exchange.speaker === 'Candidate' ? 'text-right' : 'text-left'}`}>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                            {exchange.speaker === 'AI' ? 'Interviewer' : 'You'}
                                        </div>
                                        <div className={`rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${exchange.speaker === 'AI'
                                                ? 'bg-slate-900 text-white rounded-tl-sm'
                                                : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tr-sm'
                                            }`}>
                                            {exchange.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Feature Cards Column */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-5 space-y-6"
                    >
                        {differentiators.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div variants={itemVariants} className="pt-4">
                            <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:gap-4 transition-all group">
                                Explore Methodology
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default RealismProof;
