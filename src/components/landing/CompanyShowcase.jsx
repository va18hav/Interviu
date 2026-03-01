import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import googleLogo from '../../assets/images/google.png';
import metaLogo from '../../assets/images/meta.png';
import amazonLogo from '../../assets/images/amazon.png';
import microsoftLogo from '../../assets/images/microsoft.png';
import netflixLogo from '../../assets/images/netflix.png';
import appleLogo from '../../assets/images/apple.png';

const CompanyShowcase = () => {
    const navigate = useNavigate();

    const companies = [
        { logo: metaLogo, name: 'Meta' },
        { logo: amazonLogo, name: 'Amazon' },
        { logo: appleLogo, name: 'Apple' },
        { logo: netflixLogo, name: 'Netflix' },
        { logo: googleLogo, name: 'Google' },
        { logo: microsoftLogo, name: 'Microsoft' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const logoVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="py-24 bg-white border-y border-slate-50">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Targeted Benchmarks</span>
                        </motion.div>

                        <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter leading-tight">
                            40+ full onsite loops.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                                Top companies. Every level. Every round.
                            </span>
                        </h2>
                    </div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] group shrink-0"
                    >
                        View Full Library
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Logo Cloud */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            variants={logoVariants}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/dashboard/all-popular-interviews')}
                            className="group relative h-24 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-center p-6 cursor-pointer hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                        >
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-8 md:h-10 object-contain opacity-80 group-hover:opacity-100 transition-all duration-500"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Insight */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-slate-500 text-sm font-medium leading-relaxed max-w-xl"
                >
                    Not practice questions. Full loops: coding, debug, system design, and behavioral —
                    calibrated to the exact bar of the company you're targeting.
                </motion.p>
            </div>
        </section>
    );
};

export default CompanyShowcase;
