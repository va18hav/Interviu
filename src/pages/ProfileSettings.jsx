import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { User, Mail, Save, ArrowLeft, Loader2, Shield, Lock, Briefcase, GraduationCap, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sanitizeInput } from "../utils/sanitize";

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
            // 1. Update Auth Metadata (Frontend - Secure by GoTrue limits)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    first_name: sanitizeInput(formData.firstName),
                    last_name: sanitizeInput(formData.lastName),
                },
            });

            if (authError) throw authError;

            // 2. Update Profiles Table (Backend - Secure 'credits')
            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    updates: {
                        role: sanitizeInput(formData.role),
                        experience_level: sanitizeInput(formData.experience_level),
                        skills: sanitizeInput(formData.skills)
                    }
                })
            });

            if (!response.ok) throw new Error("Failed to update profile details");

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
                                    <label className="text-sm font-medium text-slate-700">Target Role</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="e.g. Senior Frontend Engineer"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all pl-10 placeholder:text-slate-400"
                                        />
                                        <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Experience Level</label>
                                    <div className="relative">
                                        <select
                                            value={formData.experience_level}
                                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all pl-10 appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Level</option>
                                            <option value="Junior">Junior (0-2 years)</option>
                                            <option value="Mid">Mid-Level (3-5 years)</option>
                                            <option value="Senior">Senior (5-8 years)</option>
                                            <option value="Lead">Lead / Architect (8+ years)</option>
                                        </select>
                                        <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Top Skills</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.skills}
                                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                            placeholder="React, Node.js, Python..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all pl-10 placeholder:text-slate-400"
                                        />
                                        <Code className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    </div>
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
