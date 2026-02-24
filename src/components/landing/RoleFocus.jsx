import React from 'react';
import {
    Code2,
    Server,
    CheckCircle2,
    ArrowRight,
    Terminal,
    Database,
    Cpu,
    Layers,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RoleFocus = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'sde',
            icon: <Code2 />,
            title: 'Software Engineering',
            subtitle: 'Applications & Infrastructure',
            description: 'Master the technical competencies for L3-L6 roles. Focus on high-level architecture, low-level design, and algorithmic efficiency.',
            features: [
                'System Architecture (HLD/LLD)',
                'Scalable Schema Design',
                'Algorithmic Problem Solving',
                'Senior Behavioral Signals'
            ],
            color: "indigo"
        },
        {
            id: 'devops',
            icon: <Server />,
            title: 'Systems & Reliability',
            subtitle: 'Infrastructure & DevOps',
            description: 'Navigate production-grade scaling challenges, Kubernetes orchestration, and complex incident response workflows.',
            features: [
                'Cloud Native Infrastructure',
                'Distributed Systems Reliability',
                'Incident Root Cause Analysis',
                'CI/CD & Observability'
            ],
            color: "blue"
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

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="max-w-3xl mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6"
                    >
                        <span>Targeted Preparation</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-6 leading-tight tracking-tighter">
                        Available Engineering Domains
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl leading-relaxed font-medium">
                        Select a specialized track calibrated to the specific expectations of top-tier engineering organizations.
                    </p>
                </div>

                {/* Roles Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {roles.map((role) => (
                        <motion.div
                            key={role.id}
                            variants={cardVariants}
                            className="group relative rounded-[2.5rem] bg-white border border-slate-300 shadow-lg p-1 hover:border-indigo-100 transition-all duration-500"
                        >
                            <div className="relative h-full bg-slate-50/30 rounded-[2.3rem] p-10 flex flex-col overflow-hidden transition-all duration-500 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-500/5">

                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                            {React.cloneElement(role.icon, { className: "w-7 h-7" })}
                                        </div>
                                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest py-2 px-4 rounded-full bg-indigo-50 border border-indigo-100">
                                            Active Simulation
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
                                        {role.title}
                                    </h3>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                        {role.subtitle}
                                    </p>

                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
                                        {role.description}
                                    </p>

                                    <div className="space-y-4 mb-10">
                                        {role.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <span className="font-bold text-xs uppercase tracking-wide">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.15em] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 group/btn"
                                    >
                                        Initiate Track
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
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
                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">
                        New Engineering Verticals Coming Soon, Stay Tuned!
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default RoleFocus;
