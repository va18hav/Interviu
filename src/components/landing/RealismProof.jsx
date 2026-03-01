import React from 'react';
import { Target, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

const differentiators = [
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: 'Follows your reasoning, not a script',
        description: 'The AI reads your answer before deciding what to ask next. If you mention Redis, it asks about Redis. If you miss a failure mode, it probes it.'
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: 'Looking for the same signals your interviewer looks for',
        description: 'Identifies and surfaces specific hiring signals — reasoning depth, edge case awareness, architectural trade-offs — the same things that end up in your debrief.'
    },
];

const conversation = {
    exchanges: [
        { speaker: 'AI', text: 'Based on your design for the cache layer, what happens to consistency if a write operation fails halfway through?' },
        { speaker: 'Candidate', text: 'The secondary nodes might have stale data until the background sync finishes.' },
        { speaker: 'AI', text: 'How would you mitigate that if the client requires strict consistency for this specific workflow?' },
        { speaker: 'Candidate', text: 'I could implement a write-through policy with quorum-based acknowledgement.' },
        { speaker: 'AI', text: 'Fair. What are the latency trade-offs of that approach in a multi-region setup?' },
    ]
};

const RealismProof = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Badge + headline — full width */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-6">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Adaptive Intelligence</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-[1.05] tracking-tighter max-w-3xl">
                        It doesn't ask the next question{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-400">
                            until it understands your last answer.
                        </span>
                    </h2>
                </motion.div>

                {/* Body text left, feature cards right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-10">

                    {/* Left: body copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-lg text-slate-500 font-medium leading-relaxed"
                    >
                        Most AI interview tools have a list of questions and a timer. When the timer runs out, they move on.<br /><br />
                        Interviu doesn't move on. If you said "the secondary nodes might have stale data until the background sync finishes," it asks: "How would you mitigate that if the client requires strict consistency?"<br /><br />
                        That's not a scripted follow-up. That's your answer being used against you. In the best possible way.
                    </motion.p>

                    {/* Right: two stacked feature cards */}
                    <div className="space-y-6">
                        {differentiators.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base font-black text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Chat Simulation — full width below */}
                {/* <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-[2.5rem] bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 md:p-10 overflow-hidden"
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
                                    : 'bg-white border-slate-200 text-slate-400'}`}>
                                    {exchange.speaker === 'AI' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[55%] space-y-1.5 ${exchange.speaker === 'Candidate' ? 'text-right' : 'text-left'}`}>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                        {exchange.speaker === 'AI' ? 'Interviewer' : 'You'}
                                    </div>
                                    <div className={`rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${exchange.speaker === 'AI'
                                        ? 'bg-slate-900 text-white rounded-tl-sm'
                                        : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tr-sm'}`}>
                                        {exchange.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div> */}

            </div>
        </section>
    );
};

export default RealismProof;
