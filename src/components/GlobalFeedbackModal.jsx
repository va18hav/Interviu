import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, Send, AlertTriangle, Sparkles, Bug } from 'lucide-react';

const GlobalFeedbackModal = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [feedback, setFeedback] = useState({
        experience: '',
        features: '',
        bugs: ''
    });

    // Determine if we should hide the feedback button (e.g., in active interview rounds)
    const hideOnRoutes = [
        '/coding-round',
        '/design-round',
        '/debug-round',
        '/behavioral-round'
    ];

    // Check if current route starts with any of the hidden routes
    const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

    if (shouldHide) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!feedback.experience.trim() && !feedback.features.trim() && !feedback.bugs.trim()) {
            return;
        }

        setStatus('loading');
        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(feedback)
            });

            if (!response.ok) throw new Error('Failed to submit feedback');

            setStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
                setFeedback({ experience: '', features: '', bugs: '' });
            }, 2000);

        } catch (error) {
            console.error("Feedback submission error:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 flex items-center justify-center transition-colors group"
                aria-label="Provide Feedback"
            >
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
                <MessageSquare className="w-6 h-6 relative z-10" />
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="relative shrink-0 p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                        <Sparkles className="w-6 h-6 text-indigo-100" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight">Help Shape Interviu</h2>
                                        <p className="text-indigo-100 text-sm mt-1">We're in Early Access. Tell us what you think.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">Thank you!</h3>
                                        <p className="text-slate-500 font-medium">Your feedback is incredibly valuable to us.</p>
                                    </motion.div>
                                ) : (
                                    <form id="global-feedback-form" onSubmit={handleSubmit} className="space-y-6">

                                        {/* Experience */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4 text-indigo-500" />
                                                How was your experience today?
                                            </label>
                                            <textarea
                                                value={feedback.experience}
                                                onChange={(e) => setFeedback({ ...feedback, experience: e.target.value })}
                                                placeholder="Tell us what you loved or what felt off..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 min-h-[100px] resize-y"
                                            />
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                What features are you missing?
                                            </label>
                                            <textarea
                                                value={feedback.features}
                                                onChange={(e) => setFeedback({ ...feedback, features: e.target.value })}
                                                placeholder="E.g., System Design tools, specific interview types, resume parser..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 min-h-[100px] resize-y"
                                            />
                                        </div>

                                        {/* Bugs */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <Bug className="w-4 h-4 text-rose-500" />
                                                Did you encounter any bugs?
                                            </label>
                                            <textarea
                                                value={feedback.bugs}
                                                onChange={(e) => setFeedback({ ...feedback, bugs: e.target.value })}
                                                placeholder="Describe the issue, what happened, and where you saw it..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400 min-h-[100px] resize-y"
                                            />
                                        </div>

                                        {status === 'error' && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                Failed to submit feedback. Please try again.
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>

                            {/* Footer */}
                            {status !== 'success' && (
                                <div className="shrink-0 p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                                    {/* <p className="text-xs text-slate-400 font-medium">Responses sent directly to founders.</p> */}
                                    <button
                                        type="submit"
                                        form="global-feedback-form"
                                        disabled={status === 'loading'}
                                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {status === 'loading' ? (
                                            <span className="flex items-center gap-2 tracking-widest text-xs uppercase">
                                                Sending...
                                            </span>
                                        ) : (
                                            <>
                                                <span className="tracking-widest text-[10px] uppercase">Submit</span>
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalFeedbackModal;
