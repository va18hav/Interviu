import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-40 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-950 to-slate-950 pointer-events-none opacity-60" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

            {/* Floating Depth Particles */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-[80px]"
            />
            <motion.div
                animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-indigo-500/20 rounded-full blur-[100px]"
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.95]"
                >
                    You'll find out more in one session
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/40">
                        than in a month of practice.
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 text-lg font-medium mb-12 leading-relaxed"
                >
                    First round is free. No credit card. Takes 60 minutes.
                    <br />
                    Most engineers wish they'd done this sooner.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
                    className="flex flex-col items-center gap-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.03, x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/login')}
                        className="group relative px-12 py-6 bg-white text-slate-950 font-black text-sm rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 inline-flex items-center gap-3"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="relative">Start My First Loop Free</span>
                        <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform relative" />
                    </motion.button>

                    <p className="text-[11px] text-slate-600 font-medium tracking-wide">
                        300 free credits on sign up · No credit card required · Cancel any time
                    </p>
                </motion.div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </section>
    );
};

export default FinalCTA;
