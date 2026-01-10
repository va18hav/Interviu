import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowRight, Briefcase, Code, GraduationCap, X, Check } from 'lucide-react';
import LandingLoader from '../components/landing/LandingLoader';

const Onboarding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: '',
        experience_level: '',
        skills: ''
    });

    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            // Update onboarding_completed to true even if skipped
            const { error } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('email', userCredentials.email);

            if (error) {
                console.warn("Could not update profile (skip):", error.message);
                // Proceed anyway content-wise
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            navigate('/dashboard');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    role: formData.role,
                    experience_level: formData.experience_level,
                    skills: formData.skills, // Assuming text or array
                    onboarding_completed: true
                })
                .eq('email', userCredentials.email);

            if (error) {
                console.warn("Could not update profile:", error.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-10 space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Welcome to Inter<span className="text-cyan-400">vyu</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Let's personalize your interview experience.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-cyan-400" />
                                Target Role <span className="text-slate-500 text-xs">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Senior React Developer"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            />
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-purple-400" />
                                Experience Level <span className="text-slate-500 text-xs">(Optional)</span>
                            </label>
                            <select
                                name="experience_level"
                                value={formData.experience_level}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Select your experience</option>
                                <option value="Junior">Junior (0-2 years)</option>
                                <option value="Mid">Mid-Level (3-5 years)</option>
                                <option value="Senior">Senior (5-8 years)</option>
                                <option value="Lead">Lead / Architect (8+ years)</option>
                            </select>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Code className="w-4 h-4 text-green-400" />
                                Top Skills <span className="text-slate-500 text-xs">(Optional, comma separated)</span>
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, System Design"
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse md:flex-row items-center gap-4 mt-10">
                        <button
                            onClick={handleSkip}
                            disabled={loading}
                            className="w-full md:w-auto px-8 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                        >
                            Skip for now
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full md:flex-1 py-3.5 rounded-xl font-semibold text-black bg-white hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
                        >
                            {loading ? (
                                <span>Saving...</span>
                            ) : (
                                <>
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Onboarding;
