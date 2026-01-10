import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { User, Mail, Save, ArrowLeft, Loader2, Shield, Lock, Briefcase, GraduationCap, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login");
                return;
            }

            // Fetch profile data from 'profiles' table
            const { data: profile } = await supabase
                .from('profiles')
                .select('role, experience_level, skills')
                .eq('id', user.id)
                .single();

            setFormData({
                firstName: user.user_metadata.first_name || "",
                lastName: user.user_metadata.last_name || "",
                email: user.email,
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
            // 1. Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                },
            });

            if (authError) throw authError;

            // 2. Update Profiles Table
            const { data: { user } } = await supabase.auth.getUser();
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    role: formData.role,
                    experience_level: formData.experience_level,
                    skills: formData.skills
                })
                .eq('id', user.id);

            if (profileError) throw profileError;
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
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword,
            });

            if (error) throw error;
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                        <p className="text-slate-400 text-sm">Manage your account information</p>
                    </div>
                </div>

                {/* Message Banner */}
                {message && (
                    <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Personal Info Card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-500 cursor-not-allowed pl-10"
                                    />
                                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Shield className="w-3 h-3" /> Email cannot be changed
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Professional Profile Card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Professional Profile</h3>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            {/* Role */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Target Role</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all pl-10"
                                    />
                                    <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Experience Level</label>
                                <div className="relative">
                                    <select
                                        value={formData.experience_level}
                                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all pl-10 appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Level</option>
                                        <option value="Junior">Junior (0-2 years)</option>
                                        <option value="Mid">Mid-Level (3-5 years)</option>
                                        <option value="Senior">Senior (5-8 years)</option>
                                        <option value="Lead">Lead / Architect (8+ years)</option>
                                    </select>
                                    <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Top Skills</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        placeholder="React, Node.js, Python..."
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all pl-10"
                                    />
                                    <Code className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Security</h3>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold text-sm hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
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
