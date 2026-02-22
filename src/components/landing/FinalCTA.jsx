import React from 'react';
import { ArrowRight, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FinalCTA = () => {
    const navigate = useNavigate();

    const benefits = [
        "Executive Review Framework",
        "Senior Engineering Benchmarks",
        "Domain-Specific Calibration",
        "Zero-Latency Adaptive Feedback"
    ];

    return (
        <section className="py-40 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-950 to-slate-950 pointer-events-none opacity-60"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>

            {/* Floating Depth Particles (Subtle) */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px]"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-[100px]"
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-12 backdrop-blur-sm"
                >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secure Access Protocols Ready</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.95]"
                >
                    Elevate Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                        Technical Logic.
                    </span>
                </motion.h2>

                {/* Professional Reassurance Bullets */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-x-10 gap-y-6 mb-16"
                >
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 text-slate-400">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Check className="w-3 h-3 text-indigo-400" strokeWidth={3} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">{benefit}</span>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
                    className="flex flex-col items-center gap-8"
                >
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="group relative px-12 py-6 bg-white text-slate-950 font-black text-xs uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-2xl shadow-indigo-500/10"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        <span className="relative flex items-center gap-3">
                            Initiate Core Session
                            <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>

                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] opacity-60">
                        Early Access Authorization: Phase 02
                    </p>
                </motion.div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        </section>
    );
};

export default FinalCTA;
