import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const testimonials = [
    {
        name: 'Arjun S.',
        target: 'Targeting Amazon SDE III',
        quote: 'The Distributed Rate Limiter round caught a concurrency bug in my fallback logic I\'d never have spotted on my own.',
        verdict: 'STRONG HIRE',
        verdictColor: 'emerald',
    },
    {
        name: 'Priya M.',
        target: 'Google L5 prep',
        quote: 'I\'ve done mock interviews with humans. This was the only one that told me specifically what signals I missed.',
        verdict: 'HIRE',
        verdictColor: 'blue',
    },
    {
        name: 'Kevin L.',
        target: 'Targeting Meta E5',
        quote: 'Phase 4 — the debug round — was harder than anything in my actual Meta loop. That\'s exactly what I needed.',
        verdict: 'STRONG HIRE',
        verdictColor: 'emerald',
    },
];

const SocialProof = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-slate-950 py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">What engineers say after a full loop</h2>
                </motion.div>

                {/* 3 Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4 hover:border-slate-700 transition-all"
                        >
                            <p className="text-slate-300 font-medium leading-relaxed text-sm flex-1">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <div>
                                    <div className="text-white font-black text-sm">{t.name}</div>
                                    <div className="text-slate-500 text-[11px] font-medium">{t.target}</div>
                                </div>
                                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${t.verdictColor === 'emerald'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                    }`}>
                                    {t.verdict}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Social count + CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <p className="text-slate-500 text-sm font-medium">
                        <span className="text-white font-black">847</span> engineers have completed a full loop this month
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 font-black text-sm hover:bg-slate-100 transition-all group"
                    >
                        See My Gaps For Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default SocialProof;
