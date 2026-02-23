import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Clock, Check, Star, MessageSquare,
    Sparkles, ShieldCheck, Mail, Send, X, ArrowRight,
    TrendingUp, Award, BarChart3
} from 'lucide-react';
import Navbar from "../components/Navbar";

const CreditsPage = () => {
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        experience: '',
        features: '',
        willingToPay: ''
    });

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (userCreds?.id) {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits?userId=${userCreds.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setCredits(data.credits);
                    }
                }
            } catch (error) {
                console.error("Error fetching credits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCredits();
    }, []);

    const handleRequestSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call for feedback collection
        setTimeout(() => {
            setLoading(false);
            setFormSubmitted(true);
            setTimeout(() => {
                setShowRequestModal(false);
                setFormSubmitted(false);
                setFormData({ experience: '', features: '', willingToPay: '' });
            }, 3000);
        }, 1500);
    };


    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar credits={credits} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero section */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] blur-[100px] opacity-[0.03] pointer-events-none" />

                    <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Early Access Phase
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                    Credits & <span className="text-indigo-600">Usage</span>
                                </h1>
                                <p className="text-slate-500 font-medium text-lg max-w-xl">
                                    During our Early Access phase, credits are granted for free to help you sharpen your technical skills. Your feedback sessions directly influence our protocol development.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                        Fair Usage Policy
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                        Reward Scaling
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-[400px]">
                                <div className="relative p-8 rounded-3xl bg-slate-900 shadow-2xl overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-1000" />

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                                <Zap className="w-6 h-6 text-white fill-white" />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Current Balance</span>
                                                <div className="text-5xl font-black text-white tabular-nums tracking-tighter mt-1">
                                                    {loading ? '...' : credits}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setShowRequestModal(true)}
                                            className="w-full py-4 rounded-xl bg-white text-slate-900 font-black text-[12px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            Request More Credits
                                            <ArrowRight className="w-4 h-4" />
                                        </button>

                                        <p className="mt-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                            Refills based on feedback contribution
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: Sparkles,
                            title: 'How it works',
                            desc: 'Use credits to start specialized interview rounds. Each session consumes a fixed amount of units.',
                            color: 'text-amber-500'
                        },
                        {
                            icon: Award,
                            title: 'Earning More',
                            desc: 'Complete surveys, report bugs, and share detailed feedback to earn additional calibration units.',
                            color: 'text-indigo-500'
                        },
                        {
                            icon: BarChart3,
                            title: 'Future Launch',
                            desc: 'Early adopters will receive special legacy status and permanent boosters upon public release.',
                            color: 'text-emerald-500'
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-50`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">{item.title}</h3>
                            <p className="text-slate-500 text-xs font-medium leading-relaxed uppercase tracking-tight">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </main>

            {/* Request Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowRequestModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            {!formSubmitted ? (
                                <form onSubmit={handleRequestSubmit}>
                                    <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Request Refill</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Early Access Feedback Form</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowRequestModal(false)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How has your experience been so far?</label>
                                            <textarea
                                                required
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                placeholder="TELL US ABOUT THE REALISM AND QUALITY..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase min-h-[100px]"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What features would you like to see next?</label>
                                            <textarea
                                                required
                                                value={formData.features}
                                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                                placeholder="E.G. MORE COMPANIES, TEAM COLLAB..."
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Would you be willing to pay for credits after launch?</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Definitely', 'Probably', 'Maybe', 'Not interested'].map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, willingToPay: option })}
                                                        className={`py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.willingToPay === option
                                                            ? 'bg-slate-900 text-white border-slate-900'
                                                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                                            }`}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={loading || !formData.willingToPay}
                                            className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-30"
                                        >
                                            {loading ? 'Transmitting...' : (
                                                <>Send Feedback & Request <Send className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-12 text-center flex flex-col items-center gap-6"
                                >
                                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xl shadow-emerald-500/10">
                                        <Send className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Transmission Received</h3>
                                        <p className="text-slate-500 font-medium max-w-xs">
                                            Your feedback has been logged. Our systems will reviewed your request for additional units.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreditsPage;
