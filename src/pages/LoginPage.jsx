import React from "react"
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, ArrowRight, Shield, Zap, Award, Lock } from 'lucide-react';
import logo from "../assets/images/logo.png"
import { supabase } from "../supabaseClient"

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = React.useState(true); // Toggle between Login and Signup
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
                let data, error;

                if (isSignUp) {
                    // --- SIGN UP ---
                    const result = await supabase.auth.signUp({
                        email: formData.email,
                        password: formData.password,
                        options: {
                            data: {
                                first_name: formData.firstName,
                                last_name: formData.lastName,
                            },
                        },
                    });
                    data = result.data;
                    error = result.error;
                } else {
                    // --- SIGN IN ---
                    const result = await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.password,
                    });
                    data = result.data;
                    error = result.error;
                }

                if (error) throw error;

                console.log("Auth successful:", data);

                // TEMPORARY: Keep saving to localStorage so the rest of your app keeps working!
                // We will remove this later when we update Dashboard to use Supabase directly.
                const userMeta = data.user.user_metadata || {};
                const safeUser = {
                    firstName: userMeta.first_name || "User",
                    lastName: userMeta.last_name || "",
                    email: data.user.email
                };
                localStorage.setItem("userCredentials", JSON.stringify(safeUser));

                navigate('/dashboard');

            } catch (error) {
                console.error("Auth Error:", error.message);
                setErrors(prev => ({ ...prev, auth: error.message }));
            }
        }
        setLoading(false);
    }

    // Checking submit validity
    const canSubmit = isSignUp
        ? formData.firstName && formData.lastName && formData.email && formData.password
        : formData.email && formData.password;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">

                {/* Left Side - Branding & Info */}
                <div className="hidden lg:flex flex-col justify-center p-12 space-y-8">
                    <div className="flex items-center gap-3 mb-8">
                        <img src={logo} alt="Logo" className="w-15 h-15 rounded-xl" />
                        <div>
                            <h1 className="text-2xl font-extrabold text-white">Inter<span className="text-cyan-400">vyu</span></h1>
                            <p className="text-sm text-slate-400">Practice Smarter, Land Faster</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            {isSignUp ? "Join the Revolution" : "Welcome Back"}
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {isSignUp
                                ? "Start your journey to interview mastery today."
                                : "Resume your practice and track your progress."}
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                            <div className="p-8 lg:p-10 space-y-8">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold text-white">{isSignUp ? "Create Account" : "Sign In"}</h2>
                                    <p className="text-slate-400">
                                        {isSignUp ? "Enter your details to get started" : "Enter your email and password"}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Name Fields (Sign Up Only) */}
                                    {isSignUp && (
                                        <div className="flex items-center gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent outline-none transition-all"
                                        />
                                        {errors.email && <p className="text-xs text-red-400">Invalid email address</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/40 focus:border-transparent outline-none transition-all"
                                            />
                                            <Lock className="absolute right-4 top-3.5 w-5 h-5 text-slate-500" />
                                        </div>
                                        {errors.password && <p className="text-xs text-red-400">Password must be at least 6 characters</p>}
                                    </div>

                                    {/* General Error */}
                                    {errors.auth && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                                            {errors.auth}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !canSubmit}
                                        className="w-full relative px-8 py-4 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:scale-105" />
                                        <span className="relative text-white flex items-center justify-center gap-2">
                                            {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        </span>
                                    </button>

                                    {/* Toggle Switch */}
                                    <div className="text-center">
                                        <button
                                            onClick={() => {
                                                setIsSignUp(!isSignUp);
                                                setErrors({});
                                            }}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;