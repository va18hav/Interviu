import React from "react"
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Mail, ArrowRight, Shield, Zap, Award, Lock } from 'lucide-react';
import logo from "../assets/images/logo.png"
import { supabase } from "../supabaseClient"

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

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;
        } catch (error) {
            console.error("Google Auth Error:", error.message);
            setErrors(prev => ({ ...prev, auth: error.message }));
            setLoading(false);
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md relative z-10">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                    <div className="p-8 md:p-10 space-y-8">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full" />
                                        <img src={logo} alt="Logo" className="w-12 h-12 relative z-10" />
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-slate-900">Inter<span className="text-cyan-600">viu</span></h1>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Practice Smarter, Interview Better</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-5">
                                {/* Name Fields (Sign Up Only) */}
                                {isSignUp && (
                                    <div className="flex items-center gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                                placeholder="Vaibhav"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                                placeholder="K"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="vaibhav@example.com"
                                        />
                                        <Mail className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 font-medium">Invalid email address</p>}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="••••••••"
                                        />
                                        {!formData.password && <Lock className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />}
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 font-medium">Password must be at least 6 characters</p>}
                                </div>

                                {/* General Error */}
                                {errors.auth && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                                        {errors.auth}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !canSubmit}
                                    className="w-full relative bg-slate-900 hover:bg-slate-800 text-white px-4 py-3.5 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5"
                                >
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
                                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                </button>

                                <div className="flex items-center gap-4 my-4">
                                    <div className="h-px bg-slate-200 flex-1" />
                                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">OR</span>
                                    <div className="h-px bg-slate-200 flex-1" />
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full relative px-4 py-3.5 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm hover:shadow-md"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>

                                {/* Toggle Switch */}
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => {
                                            setIsSignUp(!isSignUp);
                                            setErrors({});
                                        }}
                                        className="text-sm text-slate-500 hover:text-cyan-600 font-medium transition-colors"
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
    );
};

export default LoginPage;