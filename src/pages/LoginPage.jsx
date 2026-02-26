import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, ArrowRight, Shield, Zap, Award, Lock, CheckCircle2, AlertCircle, ChevronRight, AlertTriangle, X } from 'lucide-react';
import logo from "../assets/images/logo.png"
import { sanitizeInput } from "../utils/sanitize";
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = React.useState(false); // Toggle between Login and Signup
    const [loading, setLoading] = React.useState(false);
    const [showJioAlert, setShowJioAlert] = React.useState(true); // Jio Alert State

    const [formData, setFormData] = React.useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "" // Added password
    });

    const [errors, setErrors] = React.useState({});
    const [sessionExpired, setSessionExpired] = React.useState(false);
    const [signupSuccess, setSignupSuccess] = React.useState(false);


    // Step 4 (Option C): Initialize Google Identity Services
    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.warn("VITE_GOOGLE_CLIENT_ID not found in .env. Google login may fail.");
            return;
        }

        /* global google */
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleGoogleCredentialResponse,
                ux_mode: 'popup',
                itp_support: true, // Improved support for Intelligent Tracking Prevention
            });

            // Render the official Google button into the container
            google.accounts.id.renderButton(
                document.getElementById("google-branded-button"),
                {
                    theme: "outline",
                    size: "large",
                    width: "180", // Specific width for better alignment
                    text: "signin_with",
                    shape: "pill",
                    logo_alignment: "left"
                }
            );
        }
    }, []);

    const handleGoogleCredentialResponse = async (response) => {
        setLoading(true);
        try {
            const apiRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google-id-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: response.credential })
            });

            const data = await apiRes.json();
            if (!apiRes.ok) throw new Error(data.error || "Google exchange failed");

            // Store User Data & Token (Same as standard login)
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userCredentials", JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (error) {
            console.error("Google Auth Error:", error.message);
            setErrors(prev => ({ ...prev, auth: error.message }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('expired') === 'true') {
            setSessionExpired(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
        if (errors.auth) setErrors(prev => ({ ...prev, auth: false }));
    };

    const handleGoogleLogin = () => {
        // Trigger the Google Identity Services popup
        if (typeof google !== 'undefined') {
            google.accounts.id.prompt();
        } else {
            // Fallback to managed flow if script failed to load
            window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
        }
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
            newErrors.first_name = !formData.first_name.trim();
            newErrors.last_name = !formData.last_name.trim();
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            try {
                let endpoint = isSignUp ? `${import.meta.env.VITE_API_URL}/api/auth/signup` : `${import.meta.env.VITE_API_URL}/api/auth/login`;
                const payload = isSignUp ? {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name
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

                // Store User Data & Token
                const user = data.user;
                const session = data.session;

                // Handle email confirmation UX flow
                if (isSignUp && !session) {
                    setSignupSuccess(true);
                    setLoading(false);
                    return;
                }

                const userMeta = user?.user_metadata || {};
                const safeUser = {
                    id: user.id, // Important for API calls
                    first_name: userMeta.first_name || "User",
                    last_name: userMeta.last_name || "",
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
        ? formData.first_name && formData.last_name && formData.email && formData.password
        : formData.email && formData.password;

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-200/30 blur-[120px] rounded-full orb-1 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-cyan-200/30 blur-[120px] rounded-full orb-2 pointer-events-none" />

            <div className="w-full max-w-[480px] relative z-10 auth-card">
                <div className="bg-white/70 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_48px_80px_-12px_rgba(0,0,0,0.12)]">
                    <div className="p-8 md:p-10">
                        {/* Jio Alert Banner */}
                        {/* <AnimatePresence>
                            {showJioAlert && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                                    className="bg-amber-50 border border-amber-200 rounded-2xl p-4 relative"
                                >
                                    <button
                                        onClick={() => setShowJioAlert(false)}
                                        className="absolute top-3 right-3 text-amber-500 hover:text-amber-700 hover:bg-amber-100 p-1 rounded-full transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="flex gap-3">
                                        <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                                        <div className="pr-4">
                                            <h3 className="text-amber-800 font-bold text-xs uppercase tracking-widest mb-1">Notice for Jio Users</h3>
                                            <p className="text-amber-700/80 text-[11px] leading-relaxed font-medium">
                                                We are currently experiencing connection issues with the Jio network in India. If you are unable to log in, please try switching to a different network provider or WiFi. We apologize for the inconvenience.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence> */}

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
                            <p className="text-slate-500 font-medium text-sm">
                                {isSignUp ? "Create your account" : "Welcome back to Interviu"}
                            </p>
                        </div>

                        {signupSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center text-center py-4"
                            >
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Check your email</h2>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
                                    We've sent a secure confirmation link to <br /><span className="font-bold text-slate-900">{formData.email}</span>. Click it to activate your account.
                                </p>

                                <div className="w-full flex justify-center mb-6">
                                    <button
                                        onClick={() => window.open('https://mail.google.com/mail/u/0/#search/from%3Ainterviu', '_blank')}
                                        className="w-full relative group h-[48px]"
                                    >
                                        <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                                        <div className="relative bg-white border border-slate-200 group-hover:bg-slate-50 text-slate-700 h-full rounded-full font-black text-[11px] uppercase tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-3 shadow-sm group-active:scale-[0.98]">
                                            <Mail size={16} className="text-blue-600" />
                                            Open Gmail
                                        </div>
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setSignupSuccess(false);
                                        setIsSignUp(false);
                                        setFormData(prev => ({ ...prev, password: "" }));
                                    }}
                                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isSignUp ? 'signup' : 'login'}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="space-y-5"
                                        >
                                            {isSignUp && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">First Name</label>
                                                        <div className="relative group/field">
                                                            <input
                                                                type="text"
                                                                name="first_name"
                                                                value={formData.first_name}
                                                                onChange={handleChange}
                                                                placeholder="VAIBHAV"
                                                                className={`w-full bg-slate-50 border ${errors.first_name ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 group-hover/field:border-slate-200'} rounded-2xl p-4 pl-12 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase tracking-widest`}
                                                            />
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-indigo-500 transition-colors" />
                                                        </div>
                                                        {errors.first_name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">First name is required</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Last Name</label>
                                                        <div className="relative group/field">
                                                            <input
                                                                type="text"
                                                                name="last_name"
                                                                value={formData.last_name}
                                                                onChange={handleChange}
                                                                placeholder="K"
                                                                className={`w-full bg-slate-50 border ${errors.last_name ? 'border-rose-500 ring-4 ring-rose-500/5' : 'border-slate-100 group-hover/field:border-slate-200'} rounded-2xl p-4 pl-12 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase tracking-widest`}
                                                            />
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/field:text-indigo-500 transition-colors" />
                                                        </div>
                                                        {errors.last_name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">Last name is required</p>}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className={`w-full rounded-2xl border ${errors.email ? 'border-red-200 bg-red-50/10' : 'border-slate-200/60 bg-white/50'} px-4 py-4 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all group-hover:border-slate-300`}
                                                        placeholder="vaibhav@example.com"
                                                    />
                                                    <Mail className={`absolute right-4 top-4 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-slate-300 group-hover:text-slate-400'} transition-colors`} />
                                                </div>
                                                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">Invalid email protocol</p>}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Password</label>
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

                                            {sessionExpired && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-3 text-amber-600 text-[11px] font-black uppercase tracking-wider"
                                                >
                                                    <AlertCircle size={16} />
                                                    Session Expired. Please log in again.
                                                </motion.div>
                                            )}

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
                                        </motion.div>
                                    </AnimatePresence>

                                    <div className="flex flex-row gap-3 items-center mt-6 w-full">
                                        <button
                                            type="submit"
                                            disabled={loading || !canSubmit}
                                            className="flex-1 relative group h-[40px]"
                                        >
                                            <div className="absolute inset-0 bg-indigo-600 rounded-full blur-lg opacity-10 group-hover:opacity-30 transition-opacity" />
                                            <div className="relative bg-slate-900 group-hover:bg-indigo-600 text-white px-4 h-full rounded-full font-black text-[10px] uppercase tracking-[0.1em] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 group-active:scale-[0.98]">
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {isSignUp ? "Join" : "Sign in"}
                                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </div>
                                        </button>

                                        {/* Branded Google Login Container */}
                                        <div id="google-branded-button" className="flex-1 flex justify-center items-center h-[40px]"></div>
                                    </div>
                                </form>

                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setErrors({});
                                        }}
                                        className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors py-2 px-4 rounded-full hover:bg-indigo-50"
                                    >
                                        {isSignUp ? "Already recognized? Log In" : "New candidate? Create Account"}
                                    </button>
                                </div>
                            </>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"><Shield size={12} /> Secure 256-bit</span>
                            <span className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity"><Zap size={12} /> Instant Sync</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;