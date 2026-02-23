import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Save, ArrowLeft, Loader2, Shield, Lock,
    Briefcase, GraduationCap, Code, Layers, Zap, X,
    Terminal, Code2, Sparkles, ShieldCheck, CheckCircle2,
    Settings, Camera, KeyRound, UserCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../utils/sanitize";

// ─── Skill Tag Input (Standardized with Onboarding) ───────────────────────────
const SkillTagInput = ({ tags, onChange }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    const addTag = (value) => {
        const trimmed = value.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput('');
    };

    const removeTag = (tag) => {
        onChange(tags.filter(t => t !== tag));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div
            className="min-h-[52px] flex flex-wrap gap-2 items-center bg-white border border-slate-100 rounded-xl px-4 py-2 cursor-text transition-all focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5 shadow-sm"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (input.trim()) addTag(input); }}
                placeholder={tags.length === 0 ? "ADD TECHNICAL STACK..." : ""}
                className="flex-1 min-w-[120px] bg-transparent text-xs font-bold text-slate-700 placeholder:text-slate-300 outline-none border-none uppercase tracking-widest"
            />
        </div>
    );
};

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        experience_level: "",
        skills: ""
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
            setLoading(true);
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));

            if (!userCreds?.id) {
                navigate("/login");
                return;
            }

            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile?userId=${userCreds.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const profile = await response.json();

            setFormData({
                firstName: userCreds.firstName || "",
                lastName: userCreds.lastName || "",
                email: userCreds.email,
                role: profile?.role || "",
                experience_level: profile?.experience_level || "",
                skills: profile?.skills || ""
            });
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) throw new Error("User not found");

            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userCreds.id,
                    updates: {
                        role: sanitizeInput(formData.role),
                        experience_level: sanitizeInput(formData.experience_level),
                        skills: sanitizeInput(formData.skills)
                    }
                })
            });

            if (!response.ok) throw new Error("Failed to update profile details");

            const updatedCreds = { ...userCreds, firstName: formData.firstName, lastName: formData.lastName };
            localStorage.setItem("userCredentials", JSON.stringify(updatedCreds));

            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    password: passwordData.newPassword
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update password");
            }

            setMessage({ type: "success", text: "Password updated successfully!" });
            setPasswordData({ newPassword: "", confirmPassword: "" });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Protocol</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Cinematic Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-6 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest mb-1.5">
                                <Settings className="w-3 h-3" />
                                Account Protocol
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Profile <span className="text-indigo-600">Settings</span>
                            </h1>
                        </div>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-xl ${message.type === 'success'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    : 'bg-rose-50 border-rose-100 text-rose-700'
                                    }`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                <span className="text-xs font-bold uppercase tracking-widest">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Avatar & Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6 lg:sticky lg:top-24 self-start"
                    >
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />

                            <div className="relative">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="w-full h-full rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-2xl relative z-10">
                                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center border-4 border-white shadow-lg transform translate-x-1 translate-y-1 hover:scale-110 transition-transform z-20">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 truncate">{formData.firstName} {formData.lastName}</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{formData.role || 'Unspecified Role'}</p>

                                <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-lg font-black text-slate-900 tracking-tighter">12</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Interviews</div>
                                    </div>
                                    <div className="text-center border-l border-slate-50">
                                        <div className="text-lg font-black text-slate-900 tracking-tighter">8.4</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Score</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] -mr-16 -mt-16" />
                            <div className="relative flex items-center gap-4 mb-4">
                                <Zap className="w-5 h-5 text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Usage Limits</span>
                            </div>
                            <h3 className="text-lg font-bold mb-2 tracking-tight">Active Credits</h3>
                            <div className="text-4xl font-black tracking-tighter mb-4 text-indigo-400">500</div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '65%' }}
                                    className="h-full bg-indigo-500 rounded-full"
                                />
                            </div>
                            <p className="text-[9px] font-bold text-indigo-300/60 uppercase tracking-widest mt-4">Early Access Allocation</p>
                        </div>
                    </motion.div>

                    {/* Right Columns: Main Settings */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Personal & Professional Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <form onSubmit={handleProfileUpdate}>
                                <div className="p-8 md:p-10 space-y-12">

                                    {/* Personal Info Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-inner">
                                                <UserCircle className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Personal Identification</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">First Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all uppercase tracking-widest"
                                                />
                                            </div>
                                            <div className="space-y-3 md:col-span-2 relative">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Signature</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pl-12 text-xs font-bold text-slate-400 cursor-not-allowed uppercase tracking-widest"
                                                    />
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 opacity-60" />
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                    <Lock className="w-2.5 h-2.5" /> Immutable Verification Required to Modify
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Profile Section */}
                                    <div className="space-y-8 pt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-inner">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Professional Configuration</h3>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Role</label>
                                                <div className="flex gap-4">
                                                    {['SDE', 'DevOps / SRE'].map(r => (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, role: r })}
                                                            className={`flex-1 py-4 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all duration-300 ${formData.role === r
                                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 shadow-sm'
                                                                }`}
                                                        >
                                                            <span className="flex items-center justify-center gap-3">
                                                                {r === 'SDE' ? <Code2 className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                                                                {r}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience Protocol</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {[
                                                        { label: 'Junior', sub: '0–2 yrs', db: 'Junior' },
                                                        { label: 'Mid-Level', sub: '3–5 yrs', db: 'Mid-Level' },
                                                        { label: 'Senior', sub: '5+ yrs', db: 'Senior' },
                                                    ].map(({ label, sub, db }) => (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, experience_level: db })}
                                                            className={`flex-1 min-w-[120px] py-3.5 px-3 rounded-xl border text-center transition-all duration-300 ${formData.experience_level === db
                                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                                                }`}
                                                        >
                                                            <div className="text-[11px] font-black uppercase tracking-widest">{label}</div>
                                                            <div className={`text-[9px] font-bold uppercase tracking-tight mt-0.5 ${formData.experience_level === db ? 'text-indigo-300' : 'text-slate-300'}`}>{sub}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Technical Stack</label>
                                                <SkillTagInput
                                                    tags={formData.skills.split(',').map(s => s.trim()).filter(Boolean)}
                                                    onChange={(newTags) => setFormData({ ...formData, skills: newTags.join(', ') })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-10 py-4 rounded-xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl disabled:opacity-30"
                                    >
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Initialize Updates
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                        {/* Security Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="p-8 md:p-10">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100 shadow-inner">
                                        <KeyRound className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Security Credentials</h3>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">New Passcode</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirm Passcode</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving || !passwordData.newPassword}
                                            className="px-10 py-4 rounded-xl bg-white border border-slate-100 text-slate-900 font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-xl disabled:opacity-30"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                            Update Security Vault
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
