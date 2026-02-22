import React, { useState, useEffect } from "react";

import { User, Mail, Save, ArrowLeft, Loader2, Shield, Lock, Briefcase, GraduationCap, Code, Layers, Zap, X, Terminal, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../utils/sanitize";

// ─── Skill Tag Input (replicated from onboarding) ───────────────────────────
const SkillTagInput = ({ tags, onChange }) => {
    const [input, setInput] = React.useState('');
    const inputRef = React.useRef(null);

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
        if (e.key === 'Enter' || e.key == ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div
            className="min-h-[48px] flex flex-wrap gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 cursor-text transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        className="text-slate-400 hover:text-white transition-colors ml-0.5"
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
                placeholder={tags.length === 0 ? "e.g. React, Node.js, Docker…" : "Add more…"}
                className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none border-none"
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile?userId=${userCreds.id}`);
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

            // Update Backend
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
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

            // Note: We are not updating First/Last name on backend auth in this step as it requires Auth Admin.
            // But we can update local storage to reflect changes immediately in UI
            const updatedCreds = { ...userCreds, firstName: formData.firstName, lastName: formData.lastName };
            localStorage.setItem("userCredentials", JSON.stringify(updatedCreds));

            setMessage({ type: "success", text: "Profile updated successfully!" });
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
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                        <p className="text-slate-500 text-sm">Manage your account information</p>
                    </div>
                </div>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                    {/* Unified Profile Form */}
                    <form onSubmit={handleProfileUpdate} className="p-8 space-y-8">

                        {/* Section 1: Personal Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed pl-10"
                                        />
                                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Shield className="w-3 h-3" /> Email cannot be changed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Professional Profile */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-600">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">Professional Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Target Role</label>
                                    <div className="flex gap-3">
                                        {['SDE', 'DevOps / SRE'].map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: r })}
                                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${formData.role === r
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {r === 'SDE' ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Code2 className="w-4 h-4" /> SDE
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Terminal className="w-4 h-4" /> DevOps / SRE
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Experience Level</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { label: 'Junior', sub: '0–2 yrs', db: 'Junior' },
                                            { label: 'Mid-Level', sub: '3–5 yrs', db: 'Mid-Level' },
                                            { label: 'Senior', sub: '5+ yrs', db: 'Senior' },
                                        ].map(({ label, sub, db }) => (
                                            <button
                                                key={label}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, experience_level: db })}
                                                className={`flex-1 min-w-[120px] py-3 px-3 rounded-xl border text-center transition-all duration-200 ${formData.experience_level === db
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="text-sm font-bold">{label}</div>
                                                <div className={`text-[11px] mt-0.5 ${formData.experience_level === db ? 'text-slate-300' : 'text-slate-400'}`}>{sub}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700 block mb-2">Top Skills</label>
                                    <SkillTagInput
                                        tags={formData.skills.split(',').map(s => s.trim()).filter(Boolean)}
                                        onChange={(newTags) => setFormData({ ...formData, skills: newTags.join(', ') })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Profile Changes
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="h-px bg-slate-100 mx-8" />

                    {/* Section 3: Security */}
                    <div className="p-8 pt-6 space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Security</h3>
                        </div>

                        <form onSubmit={handlePasswordUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
