import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, ArrowRight, Shield, Zap, Award, Lock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import logo from "../assets/images/logo.png"
import { sanitizeInput } from "../utils/sanitize";
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = React.useState(false); // Toggle between Login and Signup
    const [loading, setLoading] = React.useState(false);

    const [formData, setFormData] = React.useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "" // Added password
    });

    const [errors, setErrors] = React.useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
        if (errors.auth) setErrors(prev => ({ ...prev, auth: false }));
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Validation
        const newErrors = {
            email: !formData.email.trim() || !validateEmail(formData.email),
            password: formData.password.length < 6,
        };

        // Name validation only for Sign Up
        if (isSignUp) {
            newErrors.firstName = !formData.firstName.trim();
            newErrors.lastName = !formData.lastName.trim();
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            try {
                let endpoint = isSignUp ? `${import.meta.env.VITE_API_URL}/api/auth/signup` : `${import.meta.env.VITE_API_URL}/api/auth/login`;
                const payload = isSignUp ? {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName
                } : {
                    email: formData.email,
                    password: formData.password
                };

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Authentication failed");
                }

                console.log("Auth successful:", data);

                // Store User Data & Token
                const user = data.user;
                const session = data.session;

                const userMeta = user?.user_metadata || {};
                const safeUser = {
                    id: user.id, // Important for API calls
                    firstName: userMeta.first_name || "User",
                    lastName: userMeta.last_name || "",
                    email: user.email
                };

                localStorage.setItem("userCredentials", JSON.stringify(safeUser));
                if (session) {
                    localStorage.setItem("authToken", session.access_token);
                }

                navigate('/dashboard');

            } catch (error) {
                console.error("Auth Error:", error.message);
                setErrors(prev => ({ ...prev, auth: error.message }));
            }
        }
        setLoading(false);
    }

    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".auth-card", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                delay: 0.2
            });

            // Animated background orbs
            gsap.to(".orb-1", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "none"
            });
            gsap.to(".orb-2", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "none"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Checking submit validity
    const canSubmit = isSignUp
        ? formData.firstName && formData.lastName && formData.email && formData.password
        : formData.email && formData.password;

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-200/30 blur-[120px] rounded-full orb-1 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-200/30 blur-[120px] rounded-full orb-2 pointer-events-none" />

            <div className="w-full max-w-[480px] relative z-10 auth-card">
                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.12)]">
                    <div className="p-8 md:p-10">
                        {/* Branding */}
                        <div className="flex flex-col items-center mb-10">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative mb-2"
                            >
                                <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full" />
                                <img src={logo} alt="Logo" className="w-16 h-20 relative z-10 drop-shadow-2xl" />
                            </motion.div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Interviu</h1>
                            {isSignUp ? "Create your professional signature" : "Welcome back to the terminal"}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isSignUp ? 'signup' : 'login'}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "circOut" }}
                                className="space-y-5"
                            >
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {isSignUp && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all group-hover:border-slate-300"
                                                        placeholder="Vaibhav"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        className="w-full rounded-2xl border border-slate-200/60 bg-white/50 px-4 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all group-hover:border-slate-300"
                                                        placeholder="K"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Protocol Address</label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full rounded-2xl border ${errors.email ? 'border-red-200 bg-red-50/10' : 'border-slate-200/60 bg-white/50'} px-4 py-4 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all group-hover:border-slate-300`}
                                                placeholder="name@example.com"
                                            />
                                            <Mail className={`absolute right-4 top-4 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-slate-300 group-hover:text-slate-400'} transition-colors`} />
                                        </div>
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">Invalid email protocol</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Secure Credential</label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full rounded-2xl border ${errors.password ? 'border-red-200 bg-red-50/10' : 'border-slate-200/60 bg-white/50'} px-4 py-4 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all group-hover:border-slate-300`}
                                                placeholder="••••••••"
                                            />
                                            <Lock className={`absolute right-4 top-4 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-slate-300 group-hover:text-slate-400'} transition-colors`} />
                                        </div>
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">Minimum 6 characters required</p>}
                                    </div>

                                    {errors.auth && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3 text-red-600 text-[11px] font-black uppercase tracking-wider"
                                        >
                                            <AlertCircle size={16} />
                                            {errors.auth}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !canSubmit}
                                        className="w-full relative group"
                                    >
                                        <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative bg-slate-900 group-hover:bg-indigo-600 text-white px-4 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 group-active:scale-[0.98]">
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                                                </div>
                                            ) : (
                                                <>
                                                    {isSignUp ? "Authorize Account" : "Access Terminal"}
                                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-100" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="bg-white/80 backdrop-blur-sm px-4 text-slate-400 font-bold uppercase tracking-widest text-[9px]">Protocol Linkage</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] group shadow-sm"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm font-bold text-slate-700">Continue with Google Service</span>
                                </button>

                                <div className="text-center">
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setErrors({});
                                        }}
                                        className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors py-2 px-4 rounded-full hover:bg-indigo-50"
                                    >
                                        {isSignUp ? "Already recognized? Log In" : "New candidate? Initialize Session"}
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"><Shield size={12} /> Secure 256-bit</span>
                    <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"><Zap size={12} /> Instant Sync</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;