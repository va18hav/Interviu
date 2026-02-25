import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Clock, Check, Star, MessageSquare,
    Sparkles, ShieldCheck, Mail, Send, X, ArrowRight,
    TrendingUp, Award, BarChart3, Instagram, Twitter, Linkedin
} from 'lucide-react';
import Navbar from "../components/Navbar";

const CreditsPage = () => {
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [socialsClicked, setSocialsClicked] = useState({});
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
                        setSocialsClicked(data.socials_clicked || {});
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

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setModalStep(2);
            } else {
                console.error("Failed to submit feedback");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialClick = async (platform, url) => {
        window.open(url, '_blank');

        if (socialsClicked[platform]) return; // Already claimed

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials/reward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ platform })
            });

            if (response.ok) {
                const data = await response.json();
                setCredits(data.credits);
                setSocialsClicked(data.socials_clicked || {});
            }
        } catch (error) {
            console.error("Error claiming social reward:", error);
        }
    };

    const handleCloseModal = () => {
        setShowRequestModal(false);
        setTimeout(() => {
            setModalStep(1);
            setFormData({ experience: '', features: '', willingToPay: '' });
        }, 300);
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
                                            // onClick={() => setShowRequestModal(true)}
                                            className="opacity-50 cursor-not-allowed w-full py-4 rounded-xl bg-white text-slate-900 font-black text-[12px] uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                                        >
                                            Request More Credits

                                            <ArrowRight className="w-4 h-4" />
                                        </button>

                                        <p className="mt-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-60">
                                            Coming Soon, Stay tuned!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            {modalStep === 1 && (
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
                                            onClick={handleCloseModal}
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
                                            {loading ? 'Processing...' : (
                                                <>Next <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {modalStep === 2 && (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                <Award className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Unlock Rewards</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Earn 50 Credits Per Follow</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-8 space-y-4">
                                        {[
                                            { id: 'instagram', name: 'Instagram', icon: Instagram, url: 'https://instagram.com/interviu.pro', color: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100' },
                                            { id: 'x', name: 'X (Twitter)', icon: Twitter, url: 'https://x.com/Interviu199934', color: 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100' },
                                            { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/intervyu', color: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100' }
                                        ].map(social => (
                                            <button
                                                key={social.id}
                                                onClick={() => handleSocialClick(social.id, social.url)}
                                                disabled={socialsClicked[social.id]}
                                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${socialsClicked[social.id] ? 'opacity-50 cursor-not-allowed grayscale' : social.color}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <social.icon className="w-6 h-6" />
                                                    <span className="font-black text-sm uppercase tracking-widest">Connect {social.name}</span>
                                                </div>
                                                {socialsClicked[social.id] ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                                                        <Check className="w-3 h-3" /> Claimed
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/50 px-2 py-1 rounded">
                                                        +50 Credits
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/2">
                                            Any clicks unlock credits instantly.
                                        </p>
                                        <button
                                            onClick={() => setModalStep(3)}
                                            className="py-4 px-8 rounded-xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="p-12 text-center flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xl shadow-emerald-500/10">
                                        <Check className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Rewards Deposited</h3>
                                        <p className="text-slate-500 font-medium max-w-xs mx-auto">
                                            Thank you for your feedback and connection. Your new credits have been permanently bound to your account balance.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleCloseModal}
                                        className="mt-4 px-8 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-black text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreditsPage;
