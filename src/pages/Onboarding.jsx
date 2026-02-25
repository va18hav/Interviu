import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, ArrowLeft, Code2, Cpu, Brain, Bug, Terminal,
    Clock, Users, Star, Sparkles, CheckCircle2, X,
    Loader2, MessageSquare, BarChart3, Layers, Zap, Camera
} from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';
import bot from '../assets/images/bot.png';
import ImageCropper from '../components/ImageCropper';
import fullLogo from '../assets/images/logo.png';
import uiInterview from '../assets/images/UI/interview.png';
import uiCoding from '../assets/images/UI/codinground.png';
import uiReport from '../assets/images/UI/report.png';
import uiDebug from '../assets/images/UI/debuground.png';
import uiDesign from '../assets/images/UI/designround.png';
import uiCompanyInterviews from '../assets/images/UI/company-specific-interviews.png';
import uiCustomInterviews from '../assets/images/UI/custom-interviews.png';

// ─── Skill Tag Input ───────────────────────────────────────────────────────────
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
            className="min-h-[52px] flex flex-wrap gap-2 items-center bg-white border border-slate-100 rounded-xl px-4 py-2 cursor-text transition-all focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-600/5"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
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

// ─── Interview Preview Card (skeleton variant) ─────────────────────────────────
const InterviewCardSkeleton = () => (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded-lg w-2/3" />
                <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
            </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-lg w-full mb-2" />
        <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
    </div>
);

// ─── Interview Preview Card ────────────────────────────────────────────────────
const InterviewCard = ({ interview }) => (
    <div className="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-all duration-300 group shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-50 flex items-center justify-center shrink-0">
                {interview.icon_url || interview.icon_link ? (
                    <img src={interview.icon_url || interview.icon_link} alt="" className="w-6 h-6 object-contain transition-all" />
                ) : (
                    <Code2 className="w-4 h-4 text-slate-300" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate">{interview.company}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{interview.role} · {interview.level}</p>
            </div>
        </div>
    </div>
);

// ─── Slide 1: Welcome (The Initiation) ─────────────────────────────────────────────────────────────
const SlideWelcome = ({ onNext }) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12 relative overflow-hidden">
        {/* Cinematic Backdrop Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8"
        >
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center p-4">
                <img
                    src={fullLogo}
                    alt="Interviu"
                    className="w-20 h-24 object-contain"
                />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Interviu
            </h1>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 max-w-sm"
        >
            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed">
                Ace your technical interviews with <span className="text-slate-900 font-bold">AI simulations</span>.
                Experience senior-level probing across every critical domain.
            </p>
        </motion.div>

        {/* Technical Signals */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mt-10"
        >
            {[
                { icon: Brain, label: 'AI Interviewer' },
                { icon: BarChart3, label: 'Instant Reports' },
                { icon: Layers, label: 'Multi-Round' },
                { icon: Zap, label: 'Real-time Feedback' },
            ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-2 rounded-xl">
                    <Icon className="w-3 h-3 text-indigo-600" />
                    {label}
                </div>
            ))}
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 w-full max-w-xs"
        >
            <button
                onClick={onNext}
                className="w-full py-4 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
            >
                Get Started
                <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    </div>
);

// ─── Slide 2: Features Showcase ──────────────────────────────────────────────────────────
// ─── Slide 2: Company Simulations ──────────────────────────────────────────────────────────
// ─── Slide 2: Company Simulations (Technical Benchmarking) ──────────────────────────────────────────────────────────
const SlideCompanyFeatures = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Top Company <span className="text-indigo-600">Interviews</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg">
                Practice with interview questions curated from top tech companies like Google, Amazon, and Meta.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4">
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden group shadow-sm">
                <div className="relative p-6 md:p-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                        <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-4 w-full">
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl shadow-indigo-500/10">
                            <img src={uiCompanyInterviews} alt="Company Interviews" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
            >
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
                onClick={onNext}
                className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
            >
                Next Step <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// ─── Slide 3: Custom Scenarios ──────────────────────────────────────────────────────────
// ─── Slide 3: Custom Scenarios (Spec-Based Injection) ──────────────────────────────────────────────────────────
const SlideCustomFeatures = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Custom <span className="text-indigo-600">Scenarios</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg">
                Create unique interview sessions by providing your own job descriptions or specific technical topics.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4">
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden group shadow-sm">
                <div className="relative p-6 md:p-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 border border-slate-100">
                        <Zap className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-4 w-full">
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl shadow-indigo-500/10">
                            <img src={uiCustomInterviews} alt="Custom Interviews" className="w-full h-auto object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
            >
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
                onClick={onNext}
                className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
            >
                Explore Rounds <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

// ─── Slide 4: Round Types (Technical Catalog) ────────────────────────────────────────────
const SlideRoundTypes = ({ onNext, onBack }) => {
    const rounds = [
        {
            icon: Code2,
            name: 'Coding',
            tag: 'Full-Stack Logic',
            color: 'bg-indigo-50/30 border-slate-100',
            iconColor: 'text-indigo-600',
            desc: 'Live evaluation of algorithmic speed and secondary reasoning.',
            img: uiCoding,
        },
        {
            icon: Layers,
            name: 'Architecture',
            tag: 'System Design',
            color: 'bg-indigo-50/30 border-slate-100',
            iconColor: 'text-indigo-600',
            desc: 'Canvas-based probing of consistency models and trade-offs.',
            img: uiDesign,
        },
        {
            icon: Bug,
            name: 'Debugging',
            tag: 'Production Repair',
            color: 'bg-indigo-50/30 border-slate-100',
            iconColor: 'text-indigo-600',
            desc: 'Multi-file incident response and systemic root-cause analysis.',
            img: uiDebug,
        },
        {
            icon: MessageSquare,
            name: 'Behavioral',
            tag: 'Leadership & Impact',
            color: 'bg-indigo-50/30 border-slate-100',
            iconColor: 'text-indigo-600',
            desc: 'High-stakes conflict resolution and architectural leadership.',
            img: uiInterview,
        }
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="px-8 pt-8 pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Interview <span className="text-indigo-600">Types</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                    Master every stage of the technical hiring process.
                </p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 py-4 overflow-y-auto no-scrollbar">
                {rounds.map(({ icon: Icon, name, tag, color, iconColor, desc, img }, i) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`rounded-2xl border ${color} overflow-hidden flex flex-col group hover:border-indigo-200 transition-all`}
                    >
                        <div className="w-full h-32 bg-white overflow-hidden border-b border-slate-100">
                            <img src={img} alt={name} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105" />
                        </div>
                        <div className="flex items-start gap-3 p-4">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">{name}</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{tag}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
                >
                    Show Reports <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// ─── Slide 5: Analytical Dossier (Report Showcase) ────────────────────────────────────────────────────
const SlideReport = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="px-8 pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                Detailed <span className="text-indigo-600">Reports</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-lg">
                Know exactly where you stand with a deep breakdown of your performance after every session.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-indigo-500/10 bg-slate-50 min-h-0 group">
                <img
                    src={uiReport}
                    alt="Interview Report"
                    className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 px-8 mt-4">
            {[
                { icon: BarChart3, label: 'Hiring Signal', color: 'text-indigo-600' },
                { icon: Brain, label: 'Technical Depth', color: 'text-indigo-600' },
                { icon: Zap, label: 'Action Plan', color: 'text-indigo-600' },
            ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 text-center">{label}</span>
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
            >
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <button
                onClick={onNext}
                className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
            >
                Set Up Profile <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);


// ─── Slide 6: Protocol Selection (Profile + Live Preview) ───────────────────────────────────────────
const SlideProfile = ({ onBack, onNextSlide }) => {
    const [role, setRole] = useState('');
    const [level, setLevel] = useState('');
    const [skills, setSkills] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(() => {
        const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
        const url = userCreds?.avatarUrl || userCreds?.avatar_url || '';
        return (url !== 'null' && url !== 'undefined') ? url : '';
    });
    const [uploading, setUploading] = useState(false);
    const debounceRef = useRef(null);

    // Level → DB level mapping
    const levelMap = { 'Junior': 'entry', 'Mid-Level': 'intermediate', 'Senior': 'senior' };

    const fetchInterviews = useCallback(async (currentRole, currentLevel, currentSkills) => {
        if (!currentRole) {
            setInterviews([]);
            return;
        }
        setFetchLoading(true);
        setHasFetched(true);
        setIsFallback(false);
        try {
            const buildUrl = (r, l, s) => {
                const params = new URLSearchParams();
                params.set('type', r === 'SDE' ? 'sde' : 'devops');
                if (l && levelMap[l]) params.set('level', levelMap[l]);
                if (s && s.length > 0) params.set('skills', s.join(','));
                return `${import.meta.env.VITE_API_URL}/api/onboarding-interviews?${params.toString()}`;
            };

            let res = await fetch(buildUrl(currentRole, currentLevel, currentSkills));
            let data = await res.json();

            // Fallback logic: if skills provided but no results, try without skills
            if ((!data.interviews || data.interviews.length === 0) && currentSkills.length > 0) {
                const fallbackRes = await fetch(buildUrl(currentRole, currentLevel, []));
                const fallbackData = await fallbackRes.json();
                if (fallbackData.interviews?.length > 0) {
                    setInterviews(fallbackData.interviews);
                    setIsFallback(true);
                } else {
                    setInterviews([]);
                }
            } else {
                setInterviews(data.interviews || []);
            }
        } catch (err) {
            console.error('[OnboardingPreview] Network error:', err);
            setInterviews([]);
        } finally {
            setFetchLoading(false);
        }
    }, []);

    const debouncedFetch = useCallback((r, l, s) => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchInterviews(r, l, s), 400);
    }, [fetchInterviews]);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        fetchInterviews(newRole, level, skills);
    };

    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        fetchInterviews(role, newLevel, skills);
    };

    const handleSkillsChange = (newSkills) => {
        setSkills(newSkills);
        debouncedFetch(role, level, newSkills);
    };

    useEffect(() => {
        return () => clearTimeout(debounceRef.current);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (!userCreds?.id) return;

                const token = localStorage.getItem('authToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile?userId=${userCreds.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) return;
                const profile = await response.json();

                if (profile?.avatar_url) {
                    setAvatarUrl(profile.avatar_url);
                    // Update localStorage so other tabs/components see the fresh avatar
                    const updatedCreds = { ...userCreds, avatar_url: profile.avatar_url, avatarUrl: profile.avatar_url };
                    localStorage.setItem("userCredentials", JSON.stringify(updatedCreds));
                }
            } catch (error) {
                console.error("[Onboarding] Error fetching profile avatar:", error);
            }
        };
        fetchProfile();
    }, []);

    const [tempImage, setTempImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);

        // Clear input value so same file can be selected again
        e.target.value = '';
    };

    const onCropComplete = async (croppedBlob) => {
        setShowCropper(false);
        try {
            setUploading(true);
            const token = localStorage.getItem('authToken');

            const formData = new FormData();
            formData.append('avatar', croppedBlob, 'avatar.png');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to upload avatar");

            const publicUrl = data.publicUrl;
            setAvatarUrl(publicUrl);

            // Update localStorage
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            const updatedCreds = { ...userCreds, avatar_url: publicUrl };
            localStorage.setItem("userCredentials", JSON.stringify(updatedCreds));

        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        const formData = {
            role: sanitizeInput(role),
            experience_level: sanitizeInput(level),
            skills: sanitizeInput(skills.join(', ')),
            avatar_url: avatarUrl
        };
        onNextSlide(formData, interviews);
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            <div className="px-8 pt-8 pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Profile <span className="text-indigo-600">Setup</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium max-w-lg">
                    Tell us about your target role and stack to find the perfect interview matches.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                    {/* Left: Form */}
                    <div className="px-8 py-6 space-y-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative w-24 h-24">
                                <div className="w-full h-full rounded-[2.5rem] bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
                                    {avatarUrl && avatarUrl !== 'null' && avatarUrl !== 'undefined' ? (
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                setAvatarUrl('');
                                            }}
                                        />
                                    ) : (
                                        <Users className="w-10 h-10" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center border-4 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">
                                Target Role
                            </label>
                            <div className="flex gap-3">
                                {['SDE', 'DevOps / SRE'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => handleRoleChange(r)}
                                        className={`flex-1 py-4 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest border transition-all duration-300 ${role === r
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">
                                Experience Level
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Junior', 'Mid-Level', 'Senior'].map((label) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => handleLevelChange(label)}
                                        disabled={!role}
                                        className={`flex-1 min-w-[100px] py-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-20 ${level === label
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">
                                Skills & Tech Stack
                            </label>
                            <SkillTagInput
                                tags={skills}
                                onChange={handleSkillsChange}
                            />
                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="px-8 py-6 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                {!role ? 'Recommended Interviews' : `Interviews tailored to ${role}${level ? ` · ${level}` : ''}${skills.length > 0 ? ` · ${skills[0]}${skills.length > 1 ? ` +${skills.length - 1}` : ''}` : ''}`}
                            </span>
                            {fetchLoading && (
                                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                            )}
                        </div>

                        {!hasFetched && !role ? (
                            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-slate-200 text-center px-6">
                                <Sparkles className="w-6 h-6 text-slate-300 mb-4" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Select details to see<br />matching interviews</p>
                            </div>
                        ) : fetchLoading ? (
                            <div className="space-y-4">
                                <InterviewCardSkeleton />
                                <InterviewCardSkeleton />
                            </div>
                        ) : interviews.length > 0 ? (
                            <div className="space-y-3">
                                {interviews.slice(0, 4).map((interview) => (
                                    <InterviewCard key={interview.id} interview={interview} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-slate-200 text-center px-6">
                                <Cpu className="w-6 h-6 text-slate-300 mb-4" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">No interviews found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!role || !level}
                    className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black disabled:opacity-30 transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
                >
                    Save & Next <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Image Cropper Modal */}
            <AnimatePresence>
                {showCropper && (
                    <ImageCropper
                        image={tempImage}
                        onCropComplete={onCropComplete}
                        onCancel={() => setShowCropper(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Slide 7: Protocol Activation (Final) ─────────────────────────────────
const SlideFinal = ({ onBack, onComplete, loading, profileData, skillInterviews }) => {
    const navigate = useNavigate();
    const [displayInterviews, setDisplayInterviews] = useState(skillInterviews || []);
    const [isFallback, setIsFallback] = useState(false);
    const [fallbackLoading, setFallbackLoading] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const scrollRef = useRef(null);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Enable button if user scrolls down at least 100px or reaches near bottom
        if (scrollTop > 100 || scrollTop + clientHeight >= scrollHeight - 20) {
            setHasScrolled(true);
        }
    };

    useEffect(() => {
        if (!skillInterviews || skillInterviews.length === 0) {
            if (!profileData?.role) return;
            setFallbackLoading(true);
            const type = profileData.role === 'SDE' ? 'sde' : 'devops';
            const levelMap = { 'Junior': 'junior', 'Mid-Level': 'intermediate', 'Senior': 'senior' };
            const level = levelMap[profileData.experience_level] || '';
            const url = `${import.meta.env.VITE_API_URL}/api/onboarding-interviews?type=${type}${level ? `&level=${level}` : ''}`;
            fetch(url)
                .then(r => r.json())
                .then(data => {
                    setDisplayInterviews(data.interviews || []);
                    setIsFallback(true);
                })
                .catch(console.error)
                .finally(() => setFallbackLoading(false));
        } else {
            setDisplayInterviews(skillInterviews);
        }
    }, [skillInterviews, profileData]);

    const handleViewInterview = (id) => {
        onComplete().then(() => {
            navigate(`/dashboard/interview-details/${id}`);
        }).catch(() => {
            navigate(`/dashboard/interview-details/${id}`);
        });
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            <div className="px-8 pt-8 pb-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4">
                    <Zap className="w-3 h-3" />
                    You're all set!
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Ready to <span className="text-indigo-600">Start</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium max-w-lg">
                    Your profile is ready. We've added 300 free credits to your account to get you started.
                </p>
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto no-scrollbar"
            >
                {/* Credits Grant - Premium Activation Treatment */}
                <div className="mx-8 mt-4 p-8 rounded-2xl bg-slate-900 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000" />

                    <div className="relative flex items-center gap-8">
                        <div className="shrink-0 w-20 h-20 rounded-2xl bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 shadow-inner">
                            <Zap className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Early Access</h3>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[8px] font-bold uppercase tracking-widest border border-indigo-500/30">
                                        Free Allocaation
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-black text-white tracking-tighter">300</div>
                                    <div className="text-indigo-300/60 text-[9px] font-bold uppercase tracking-widest mt-1">Free Credits</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-white/5">
                                {[
                                    '300 minutes of interviews',
                                    'Full performance reports',
                                    'Access to all rounds'
                                ].map((label) => (
                                    <div key={label} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Matches */}
                <div className="px-8 pb-8 mt-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            Recommended for you
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {fallbackLoading ? (
                        <div className="grid grid-cols-2 gap-4">
                            <InterviewCardSkeleton />
                            <InterviewCardSkeleton />
                        </div>
                    ) : displayInterviews.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {displayInterviews.slice(0, 4).map((interview) => (
                                <div key={interview.id} className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-all group relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-50 flex items-center justify-center p-2">
                                            {interview.icon_link ? (
                                                <img src={interview.icon_link} alt="" className="w-full h-full object-contain transition-all" />
                                            ) : (
                                                <Code2 className="w-5 h-5 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest truncate mb-1">{interview.company}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{interview.role}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleViewInterview(interview.id)}
                                        className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-900 bg-slate-50 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Start Interview
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Loading recommendations...</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-8 py-6 border-t border-slate-100 bg-slate-50/30">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <div className="flex flex-col items-end gap-2">
                    <button
                        onClick={() => onComplete()}
                        disabled={loading || !hasScrolled}
                        className="px-8 py-3.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-black disabled:opacity-30 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
                    >
                        {loading ? (
                            <>Loading...</>
                        ) : (
                            <>GO TO DASHBOARD <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                    {!hasScrolled && !loading && (
                        <span className="text-[10px] font-bold text-indigo-600 animate-pulse uppercase tracking-widest">
                            Scroll down to see your path
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Progress Dots ─────────────────────────────────────────────────────────────
const ProgressDots = ({ total, current }) => (
    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`rounded-full transition-all duration-500 ${i === current
                    ? 'w-6 h-1.5 bg-indigo-600'
                    : i < current
                        ? 'w-1.5 h-1.5 bg-slate-400'
                        : 'w-1.5 h-1.5 bg-slate-200'
                    }`}
            />
        ))}
    </div>
);

// ─── Main Onboarding Component ─────────────────────────────────────────────────
const Onboarding = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideDir, setSlideDir] = useState('right'); // 'right' = going forward
    const [animKey, setAnimKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [finalInterviews, setFinalInterviews] = useState([]);
    const TOTAL_SLIDES = 7;

    const goTo = (index) => {
        setSlideDir(index > currentSlide ? 'right' : 'left');
        setAnimKey(k => k + 1);
        setCurrentSlide(index);
    };

    const next = () => { if (currentSlide < TOTAL_SLIDES - 1) goTo(currentSlide + 1); };
    const back = () => { if (currentSlide > 0) goTo(currentSlide - 1); };

    // Called by SlideProfile when user clicks Next — saves their choices and advances to SlideFinal
    const handleProfileNext = (formData, interviews) => {
        setProfileData(formData);
        setFinalInterviews(interviews || []);
        goTo(6);
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            const userCredentials = JSON.parse(localStorage.getItem('userCredentials'));
            if (!userCredentials?.id) return;
            const token = localStorage.getItem('authToken');
            await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userCredentials.id, onboardingData: { onboarding_completed: true } })
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            onComplete?.();
        }
    };

    const handleComplete = async (formData) => {
        // SlideFinal calls onComplete() with no args — use saved profileData state
        const dataToSave = formData || profileData || {};
        setLoading(true);
        try {
            const userCredentials = JSON.parse(localStorage.getItem('userCredentials'));
            if (!userCredentials?.id) return;
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userCredentials.id, onboardingData: dataToSave })
            });
            if (!response.ok) throw new Error('Failed to update profile');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            onComplete?.();
        }
    };

    const slides = [
        <SlideWelcome key="welcome" onNext={next} onSkip={handleSkip} />,
        <SlideCompanyFeatures key="company" onNext={next} onBack={back} />,
        <SlideCustomFeatures key="custom" onNext={next} onBack={back} />,
        <SlideRoundTypes key="roundTypes" onNext={next} onBack={back} />,
        <SlideReport key="report" onNext={next} onBack={back} />,
        <SlideProfile key="profile" onBack={back} onNextSlide={handleProfileNext} />,
        <SlideFinal
            key="final"
            onBack={back}
            onComplete={handleComplete}
            loading={loading}
            profileData={profileData}
            skillInterviews={finalInterviews}
        />,
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Scrim */}
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />
            </AnimatePresence>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative z-10 w-full max-w-[95vw] sm:max-w-3xl bg-white rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-slate-100/10 overflow-hidden flex flex-col"
                style={{ maxHeight: 'min(90vh, 720px)' }}
            >
                {/* Top bar: progress + step counter */}
                <div className="flex items-center justify-between px-8 pt-6 pb-2 shrink-0">
                    <ProgressDots total={TOTAL_SLIDES} current={currentSlide} />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step</span>
                        <span className="text-xs font-black text-slate-900">
                            {String(currentSlide + 1).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Slide container */}
                <div
                    key={animKey}
                    className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: slideDir === 'right' ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: slideDir === 'right' ? -20 : 20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {slides[currentSlide]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Bot — fixed to bottom-right of the screen, visible across all slides */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:block absolute bottom-[-5%] right-[2%] z-20 pointer-events-none select-none"
                style={{ animation: 'floatY 4s ease-in-out infinite' }}
            >
                <div className="relative">
                    <img
                        src={bot}
                        alt="AI Interviewer"
                        className="w-20 md:w-64 mix-blend-luminosity"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
