import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, ArrowLeft, Code2, Cpu, Brain, Bug, Terminal,
    Clock, Users, Star, Sparkles, CheckCircle2, X,
    Loader2, MessageSquare, BarChart3, Layers, Zap
} from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';
import bot from '../assets/images/bot.png';
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
            className="min-h-[48px] flex flex-wrap gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 cursor-text transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg animate-fade-in-up">
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
    <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                {interview.icon_url || interview.icon_link ? (
                    <img src={interview.icon_url || interview.icon_link} alt="" className="w-6 h-6 object-contain" />
                ) : (
                    <Code2 className="w-5 h-5 text-slate-400" />
                )}
            </div>
            <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{interview.role}</h4>
                <p className="text-xs text-slate-400 font-medium capitalize">{interview.company || ''} · {interview.level}</p>
            </div>
            <div className="ml-auto shrink-0 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-yellow-600">4.8</span>
            </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{interview.total_duration || '45 min'}</span>
            </div>
            <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>1.2k took this</span>
            </div>
        </div>
    </div>
);

// ─── Slide 1: Welcome ─────────────────────────────────────────────────────────────
const SlideWelcome = ({ onNext, onSkip }) => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8 relative">
        {/* Ambient bg blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[300px] bg-gradient-to-b from-cyan-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Logo hero */}
        <div className="relative mb-6 animate-fade-in-up">
            <img
                src={fullLogo}
                alt="Interviu"
                className="h-12 md:h-20 object-contain mx-auto"
            />
            {/* Subtle glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-20 rounded-full bg-cyan-400/15 blur-3xl" />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed block mt-2">Interv<span className="text-slate-500 font-bold">iu</span></span>
        </div>

        <div className="space-y-3 max-w-sm px-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                A <span className="text-slate-800 font-semibold">realistic interview simulation</span> platform.<br className="hidden md:block" />
                <span className="md:hidden"> </span>Face a real AI interviewer — not a coach — across every round type that matters.
            </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {[
                { icon: Brain, label: 'AI Interviewer' },
                { icon: BarChart3, label: 'In-depth Reports' },
                { icon: Layers, label: '5+ Round Types' },
                { icon: Zap, label: 'Instant Results' },
            ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Icon className="w-3.5 h-3.5 text-cyan-500" />
                    {label}
                </div>
            ))}
        </div>

        <div className="flex flex-col items-center gap-3 mt-8 w-full max-w-xs animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <button
                onClick={onNext}
                className="w-full py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 group"
            >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Skip for now
            </button>
        </div>
    </div>
);

// ─── Slide 2: Features Showcase ──────────────────────────────────────────────────────────
// ─── Slide 2: Company Simulations ──────────────────────────────────────────────────────────
// ─── Slide 2: Company Simulations ──────────────────────────────────────────────────────────
const SlideCompanyFeatures = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="px-4 md:px-6 pt-6 pb-2 text-center mt-2 md:mt-0">
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Practice with Top Companies
            </h2>
            <p className="text-base text-slate-500 mt-2 max-w-lg mx-auto">
                Target specific companies tailored to your role and level.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-4 flex items-center justify-center">
            <div className="group relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-5 md:p-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Company Simulations</h3>
                    <p className="text-base text-slate-500 mb-6 leading-relaxed max-w-lg">
                        Targeted questions from top tech companies (Google, Amazon, etc.) tailored to specific roles/levels.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                        <img src={uiCompanyInterviews} alt="Company Interviews" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
                onClick={onNext}
                className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md group"
            >
                Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);

// ─── Slide 3: Custom Scenarios ──────────────────────────────────────────────────────────
// ─── Slide 3: Custom Scenarios ──────────────────────────────────────────────────────────
const SlideCustomFeatures = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
        <div className="px-4 md:px-6 pt-6 pb-2 text-center mt-2 md:mt-0">
            <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Build Custom Scenarios
            </h2>
            <p className="text-base text-slate-500 mt-2 max-w-lg mx-auto">
                Create unique interview situations based on any job description.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 py-4 flex items-center justify-center">
            <div className="group relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-5 md:p-8">
                    <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-8 h-8 text-violet-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Custom Scenarios</h3>
                    <p className="text-base text-slate-500 mb-6 leading-relaxed max-w-lg">
                        Paste a job description or define a specific scenario, and our AI will generate a unique interview instantly.
                    </p>
                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md">
                        <img src={uiCustomInterviews} alt="Custom Interviews" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
                onClick={onNext}
                className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md group"
            >
                Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);

// ─── Slide 3: Round Types (2-column grid) ────────────────────────────────────────────
const SlideRoundTypes = ({ onNext, onBack }) => {
    const rounds = [
        {
            icon: Code2,
            name: 'Coding',
            tag: 'Code real features',
            color: 'bg-violet-50 border-violet-100',
            iconColor: 'text-violet-500',
            desc: 'Live in-browser IDE. Solve problems under time pressure while the AI watches.',
            img: uiCoding,
        },
        {
            icon: Layers,
            name: 'System Design',
            tag: 'Design real systems',
            color: 'bg-emerald-50 border-emerald-100',
            iconColor: 'text-emerald-500',
            desc: 'Design scalable systems on a live canvas as the AI probes every decision.',
            img: uiDesign,
        },
        {
            icon: Bug,
            name: 'Debug',
            tag: 'Fix buggy files',
            color: 'bg-red-50 border-red-100',
            iconColor: 'text-red-500',
            desc: 'Multi-file debugging under time pressure. Narrate your thought process as you go.',
            img: uiDebug,
        },
        {
            icon: MessageSquare,
            name: 'Behavioral',
            tag: 'Soft Skills',
            color: 'bg-blue-50 border-blue-100',
            iconColor: 'text-blue-500',
            desc: 'Leadership, conflict & impact questions. The AI probes every answer for depth.',
            img: uiInterview,
        }
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 px-4 py-5">
            <div className="text-center mb-4">
                <p className="text-xs font-bold tracking-widest text-cyan-500 uppercase mb-1">Interview Types</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Every Round Type,<br /><span className="text-slate-400">One Platform</span>
                </h2>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto no-scrollbar">
                {rounds.map(({ icon: Icon, name, tag, color, iconColor, desc, img }, i) => (
                    <div
                        key={name}
                        className={`rounded-2xl border ${color} overflow-hidden flex flex-col animate-fade-in-up`}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        {/* Screenshot */}
                        <div className="w-full aspect-video bg-slate-100 overflow-hidden">
                            <img src={img} alt={name} className="w-full h-full object-cover object-top" />
                        </div>
                        {/* Info */}
                        <div className="flex items-start gap-2 p-3">
                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 leading-tight">{name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{tag}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={onNext}
                    className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                    Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

// ─── Slide 3: Report Showcase ────────────────────────────────────────────────────
const SlideReport = ({ onNext, onBack }) => (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-5">
        <div className="text-center mb-4">
            <p className="text-xs font-bold tracking-widest text-cyan-500 uppercase mb-1">After Every Session</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Know Exactly <span className="text-slate-400">Where You Stand</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">Every interview ends with a deep, scored breakdown</p>
        </div>

        {/* Report screenshot */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 min-h-0">
            <img
                src={uiReport}
                alt="Interview Report"
                className="w-full h-full object-cover object-top"
            />
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-3 gap-2 mt-4">
            {[
                { icon: BarChart3, label: 'Hiring Signal', color: 'text-cyan-500' },
                { icon: Brain, label: 'Technical Depth', color: 'text-violet-500' },
                { icon: Zap, label: 'Action Plan', color: 'text-emerald-500' },
            ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight">{label}</span>
                </div>
            ))}
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
                onClick={onNext}
                className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md group"
            >
                Set Up Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
);


// ─── Slide 4: Profile + Live Preview ───────────────────────────────────────────
const SlideProfile = ({ onBack, onNextSlide }) => {
    const [role, setRole] = useState('');
    const [level, setLevel] = useState('');
    const [skills, setSkills] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
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
                return `http://localhost:5000/api/onboarding-interviews?${params.toString()}`;
            };

            let res = await fetch(buildUrl(currentRole, currentLevel, currentSkills));
            let data = await res.json();

            // Fallback logic: if skills provided but no results, try without skills
            if ((!data.interviews || data.interviews.length === 0) && currentSkills.length > 0) {
                const fallbackRes = await fetch(buildUrl(currentRole, currentLevel, [])); // logic: retry without skills
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

    // Debounced fetch trigger for skills (immediate for role/level)
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

    const handleSubmit = () => {
        const formData = {
            role: sanitizeInput(role),
            experience_level: sanitizeInput(level),
            skills: sanitizeInput(skills.join(', '))
        };
        onNextSlide(formData, interviews);
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-100 text-cyan-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3 h-3" />
                    Your Gateway to the First Interview
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Find Your Perfect First Interview
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    We'll surface the best matches as you fill in your preferences
                </p>
            </div>

            {/* Body: two-column on md+ */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                    {/* Left: Form */}
                    <div className="px-4 md:px-5 py-5 space-y-5">
                        {/* Role */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Target Role
                            </label>
                            <div className="flex gap-2">
                                {['SDE', 'DevOps / SRE'].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => handleRoleChange(r)}
                                        className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${role === r
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        {r === 'SDE' ? (
                                            <span className="flex items-center justify-center gap-1.5">
                                                <Code2 className="w-4 h-4" /> SDE
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1.5">
                                                <Terminal className="w-4 h-4" /> DevOps / SRE
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Experience Level
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: 'Junior', sub: '0–2 yrs' },
                                    { label: 'Mid-Level', sub: '3–5 yrs' },
                                    { label: 'Senior', sub: '5+ yrs' },
                                ].map(({ label, sub }) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => handleLevelChange(label)}
                                        disabled={!role}
                                        className={`flex-1 min-w-[80px] py-2.5 px-2 rounded-xl border text-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${level === label
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="text-xs font-bold">{label}</div>
                                        <div className={`text-[10px] mt-0.5 ${level === label ? 'text-slate-300' : 'text-slate-400'}`}>{sub}</div>
                                    </button>
                                ))}
                            </div>
                            {!role && (
                                <p className="text-[11px] text-slate-400 mt-1.5 pl-1">Select a role first</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Skills / Tech Stack
                                <span className="ml-1.5 text-slate-300 normal-case font-normal">(Press Enter or , to add)</span>
                            </label>
                            <SkillTagInput
                                tags={skills}
                                onChange={handleSkillsChange}
                            />
                            {skills.length > 0 && (
                                <p className="text-[11px] text-cyan-500 mt-1.5 pl-1 font-medium">
                                    ✓ Finding interviews matching {skills.length} skill{skills.length > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Live Preview */}
                    <div className="px-4 md:px-5 py-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {!role ? (
                                        "Select your details to see tailored interviews"
                                    ) : (
                                        <>
                                            Interviews tailored to your{' '}
                                            <span className="text-slate-800">
                                                {[
                                                    'role',
                                                    level && 'level',
                                                    skills.length > 0 && !isFallback && 'skills'
                                                ].filter(Boolean).join(
                                                    (skills.length > 0 && !isFallback && level) ? ', ' : ' and '
                                                ).replace(/, ([^,]*)$/, ' and $1')}
                                            </span>
                                        </>
                                    )}
                                </p>
                                {isFallback && (
                                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">
                                        No exact skill matches found — displaying filtering by role & level instead.
                                    </p>
                                )}
                            </div>
                            {fetchLoading && (
                                <div className="flex items-center gap-1.5 text-xs text-cyan-500 font-medium">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Fetching…
                                </div>
                            )}
                        </div>

                        {/* States */}
                        {!hasFetched && !role ? (
                            /* Placeholder state */
                            <div className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                                    <Sparkles className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-sm font-semibold text-slate-400">Select a role to see<br />matching interviews</p>
                            </div>
                        ) : fetchLoading ? (
                            /* Loading skeletons */
                            <div className="space-y-3">
                                <InterviewCardSkeleton />
                                <InterviewCardSkeleton />
                            </div>
                        ) : interviews.length > 0 ? (
                            /* Interview cards */
                            <div className="space-y-3">
                                {interviews.map((interview) => (
                                    <InterviewCard key={interview.id} interview={interview} />
                                ))}
                                <p className="text-xs text-slate-400 text-center pt-1">
                                    {skills.length > 0 ? `Sorted by best skill match` : `Most recent for your role`}
                                </p>
                            </div>
                        ) : (
                            /* No results */
                            <div className="flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                                    <Cpu className="w-5 h-5 text-slate-400" />
                                </div>
                                <p className="text-sm font-semibold text-slate-400">No matches found</p>
                                <p className="text-xs text-slate-300 mt-1">Try different skills or level</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!role || !level}
                    className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 group"
                >
                    Next
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

// ─── Slide 5: Credits + Recommended Interviews ─────────────────────────────────
const SlideFinal = ({ onBack, onComplete, loading, profileData, skillInterviews }) => {
    const navigate = useNavigate();
    const [displayInterviews, setDisplayInterviews] = useState(skillInterviews || []);
    const [isFallback, setIsFallback] = useState(false);
    const [fallbackLoading, setFallbackLoading] = useState(false);

    // If skill-matched interviews are empty, fetch fallback (role + level only)
    useEffect(() => {
        if (!skillInterviews || skillInterviews.length === 0) {
            if (!profileData?.role) return;
            setFallbackLoading(true);
            const type = profileData.role === 'SDE' ? 'sde' : 'devops';
            const levelMap = { 'Junior': 'junior', 'Mid-Level': 'intermediate', 'Senior': 'senior' };
            const level = levelMap[profileData.experience_level] || '';
            const url = `http://localhost:5000/api/onboarding-interviews?type=${type}${level ? `&level=${level}` : ''}`;
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
        // Complete onboarding first, then navigate
        onComplete().then(() => {
            navigate(`/dashboard/interview-details/${id}`);
        }).catch(() => {
            navigate(`/dashboard/interview-details/${id}`);
        });
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100 shrink-0">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    <Zap className="w-3 h-3" />
                    You're all set!
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Ready to Start Interviewing
                </h2>
                <p className="text-xs text-slate-400 mt-1">Here's what you get from day one</p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Credits Banner - Subtle & Premium (Compact) */}
                <div className="mx-6 mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden group hover:border-slate-200 transition-colors">
                    <div className="relative flex items-center gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                            <Zap className="w-6 h-6 text-slate-900" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-base font-bold text-slate-900">Your Free Plan</h3>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                                        Starter
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">500</span>
                                        <span className="text-slate-500 text-xs font-medium">credits</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {[
                                    '500 minutes of mock interviews for free',
                                    'Detailed reports',
                                    'All interview types'
                                ].map((label) => (
                                    <div key={label} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Interviews */}
                <div className="px-5 pb-5 mt-5">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {isFallback ? 'Recommended for Your Level' : 'Your Matched Interviews'}
                        </p>
                        {isFallback && (
                            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-semibold px-2.5 py-0.5 rounded-full">
                                Based on experience
                            </span>
                        )}
                    </div>

                    {isFallback && (
                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                            No exact skill matches found — here are interviews tailored to your experience level to get you started.
                        </p>
                    )}

                    {fallbackLoading ? (
                        <div className="space-y-3">
                            <InterviewCardSkeleton />
                            <InterviewCardSkeleton />
                        </div>
                    ) : displayInterviews.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {displayInterviews.map((interview) => (
                                <div key={interview.id} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 transition-all group">
                                    <div className="flex items-start gap-3 mb-3">
                                        {interview.icon_link ? (
                                            <img src={interview.icon_link} alt={interview.company} className="w-10 h-10 object-contain rounded-xl bg-white p-1.5 border border-slate-100 shadow-sm" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                <Code2 className="w-5 h-5 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <p className="text-sm font-bold text-slate-900 truncate mb-0.5">{interview.company}</p>
                                            <p className="text-xs text-slate-500 truncate">{interview.role}</p>
                                        </div>
                                        {interview._matchCount > 0 && (
                                            <span className="shrink-0 text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                                                {interview._matchCount} match
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 capitalize">
                                            {interview.level}
                                        </span>
                                        <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            {interview.total_duration} min
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleViewInterview(interview.id)}
                                        className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        Start Interview
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed border-slate-200 text-center px-4">
                            <p className="text-sm font-semibold text-slate-400">No interviews yet</p>
                            <p className="text-xs text-slate-300 mt-0.5">Explore all on the dashboard</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                    onClick={onComplete}
                    disabled={loading}
                    className="w-auto px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 group"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Setting up…</>
                    ) : (
                        <><CheckCircle2 className="w-4 h-4" /> Complete Setup</>
                    )}
                </button>
            </div>
        </div>
    );
};

// ─── Progress Dots ─────────────────────────────────────────────────────────────
const ProgressDots = ({ total, current }) => (
    <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
            <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i === current
                    ? 'w-5 h-1.5 bg-slate-900'
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
            await fetch('http://localhost:5000/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const response = await fetch('http://localhost:5000/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

            {/* Card */}
            <div
                className="relative z-10 w-full max-w-[95vw] sm:max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-premium-card"
                style={{ maxHeight: 'min(90vh, 720px)' }}
            >
                {/* Top bar: progress + step counter */}
                <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
                    <ProgressDots total={TOTAL_SLIDES} current={currentSlide} />
                    <span className="text-xs font-medium text-slate-400">
                        {currentSlide + 1} / {TOTAL_SLIDES}
                    </span>
                </div>

                {/* Slide container */}
                <div
                    key={animKey}
                    className="flex-1 flex flex-col min-h-0 overflow-hidden"
                    style={{
                        animation: `${slideDir === 'right' ? 'slideInFromRight' : 'slideInFromLeft'} 0.35s cubic-bezier(0.16, 1, 0.3, 1) both`
                    }}
                >
                    {slides[currentSlide]}
                </div>
            </div>

            {/* Bot — fixed to bottom-right of the screen, visible across all slides */}
            <div
                className="hidden lg:block absolute bottom-[-10%] right-[2%] z-20 pointer-events-none select-none"
                style={{ animation: 'floatY 3s ease-in-out infinite' }}
            >
                <div className="relative">
                    <img
                        src={bot}
                        alt="AI Interviewer"
                        className="hidden lg:block w-20 md:w-72 object-contain drop-shadow-2xl"
                    />
                    {/* Glow under bot */}
                    <div className="hidden lg:block absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-5 rounded-full bg-cyan-400/30 blur-xl pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
