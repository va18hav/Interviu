import React from 'react';
import { Terminal, Layers, Mic, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import codingRound from '../../assets/images/UI/codinground.png';
import designRound from '../../assets/images/UI/designround.png';
import behavioralRound from '../../assets/images/UI/interview.png';

const snapshots = [
    {
        id: 'coding',
        label: 'CODING ROUND',
        tagIcon: <Terminal />,
        title: 'The problems aren\'t LeetCode.',
        description: 'You\'re given a production-level feature to implement — the kind of thing that actually ships at the company you\'re targeting. The AI probes your solution the way a bar-raiser would: edge cases, failure modes, complexity trade-offs. Not "is your code correct." But "would this survive production."',
        features: [
            'Implements real features, not algorithm puzzles',
            'Probed for production thinking: concurrency, failure handling, latency',
            'Hiring signal tracked: do you think like a senior engineer or a student?',
        ],
        image: codingRound,
    },
    {
        id: 'design',
        label: 'SYSTEM DESIGN ROUND',
        tagIcon: <Layers />,
        title: 'Design it. Then defend it.',
        description: 'Build your architecture on an interactive canvas. Then the AI starts asking the questions a senior staff engineer would ask. Why did you choose Kafka over SQS? What happens to your write path when the primary goes down? You don\'t just draw the diagram. You have to own it.',
        features: [
            'Full architecture canvas with real infrastructure components',
            'Defended against staff-engineer-level critique in real time',
            'Failure mode scenarios: what breaks, when, and what you do about it',
        ],
        image: designRound,
    },
    {
        id: 'behavioral',
        label: 'BEHAVIORAL ROUND',
        tagIcon: <Mic />,
        title: 'The bar raiser is listening for something specific.',
        description: 'Amazon\'s bar raiser isn\'t just checking if you "have leadership experience." They\'re listening for Ownership, Bias for Action, Disagree and Commit — specific signals in specific stories. The AI knows what they\'re looking for. It will probe until it finds it — or until your time runs out.',
        features: [
            'Voice-based session — answer the way you would in a real interview',
            'Probed with STAR-method follow-ups: Situation, but also "what did YOU do?"',
            'Every Leadership Principle mapped and scored against your answers',
        ],
        image: behavioralRound,
    }
];

const UISnapshots = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
    };

    return (
        <section className="bg-white py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="max-w-4xl mb-32">
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
                        Three types of sessions.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
                            One verdict at the end.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                        Each session is a phase of a real onsite loop. Complete a full programme and walk away knowing exactly where you stand.
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
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-center`}
                        >
                            <div className={`lg:col-span-5 space-y-8 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                        {React.cloneElement(snap.tagIcon, { className: "w-3.5 h-3.5" })}
                                        <span>{snap.label}</span>
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
                                        <div key={fIdx} className="flex items-start gap-3 text-slate-900">
                                            <div className="w-1 h-1 rounded-full bg-indigo-600 mt-2 shrink-0" />
                                            <span className="text-sm font-semibold text-slate-700 leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
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
