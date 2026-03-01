import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight, FileText, Target, ShieldAlert, Layers,
    Activity, CheckCircle2, XCircle, TrendingUp, Zap
} from 'lucide-react';

// ─── Placeholder data ────────────────────────────────────────────────────────

const report = {
    candidateName: "Candidate",
    meta: { company: "Amazon", type: "System Design", title: "Design a Global Flash Sale / Inventory System", date: "Feb 28, 2026", duration: 60 },
    verdict: { signal: "Strong Hire", confidence: 9, level: "SDE III", risk: "Low" },
    verdict_summary: "Candidate demonstrated strong systems thinking and clearly understands trade-offs at scale. A few failure mode gaps in the write path, but overall well above bar for the target level.",
    decision: {
        worked: ["Unprompted identification of write-path bottleneck in the sharding design.", "Correctly scoped the problem before jumping to architecture."],
        blocked: ["Did not address failure mode when primary replica goes down. Probed twice — no concrete answer.", "Missed the thundering herd problem in the cache invalidation path."],
        change: ["Start every system design by stating your failure assumptions, not your happy path.", "Practice articulating the latency cost of each architectural choice explicitly."]
    },
    technicalProfile: [
        { name: "Problem Decomp.", status: "Strong", desc: "Broke the problem into clear sub-systems before proposing infrastructure." },
        { name: "System Design", status: "Strong", desc: "Architecture was logically consistent and scoped for senior-level." },
        { name: "Trade-off Reasoning", status: "Strong", desc: "Articulated CAP theorem implications without prompting." },
        { name: "Failure Mode Thinking", status: "Developing", desc: "Missed primary replica failure scenario." },
        { name: "Communication", status: "Strong", desc: "Walk-through was structured and confident with concrete estimates." },
        { name: "Edge Case Handling", status: "Developing", desc: "Rate limiter corner cases (burst traffic, clock skew) underexplored." },
    ]
};

const traitBadge = (s) => {
    const l = s.toLowerCase();
    if (l === 'strong') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    if (l === 'developing') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
};

// ─── Component ───────────────────────────────────────────────────────────────

const TechnicalDossier = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
    };

    const bullets = [
        { icon: <ShieldAlert className="w-5 h-5" />, color: 'emerald', label: 'Hire or No Hire verdict', desc: 'Confidence score, level calibration, and risk assessment — not a vague percentile.' },
        { icon: <Activity className="w-5 h-5" />, color: 'indigo', label: 'Logical evidence', desc: 'What worked. What blocked you. Exact strategic pivots — named, not implied.' },
        { icon: <Layers className="w-5 h-5" />, color: 'purple', label: 'Technical calibration', desc: '6 engineering dimensions scored individually against the bar for your target level.' },
        { icon: <Target className="w-5 h-5" />, color: 'amber', label: 'Failure patterns detected', desc: 'Specific patterns the AI found — Happy Path Bias, missing multi-region awareness, etc.' },
        { icon: <Zap className="w-5 h-5" />, color: 'slate', label: 'Execution strategy', desc: 'The exact next sessions to run, in order. Not a reading list — a loop plan.' },
    ];

    const colorMap = {
        emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        slate: 'bg-white/5 text-slate-300 border border-white/10',
    };

    return (
        <section className="py-32 bg-slate-950 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
                >
                    {/* ── Left: Copy ──────────────────────────────────────── */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-8 lg:pt-6">

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Technical Dossier</span>
                        </div>

                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight tracking-tighter">
                                After every session:<br />
                                <span className="text-white/50">a verdict.</span>
                            </h2>
                            <p className="text-slate-400 text-base font-medium leading-relaxed">
                                Not just a score out of ten. Not a percentile rank.<br />
                                The same debrief a hiring committee produces after a real loop.
                            </p>
                        </div>

                        {/* Bullets referencing actual dossier sections */}
                        <div className="space-y-4">
                            {bullets.map((b, i) => (
                                <motion.div key={i} variants={itemVariants} className="flex items-start gap-4">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorMap[b.color]}`}>
                                        {b.icon}
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-sm mb-0.5">{b.label}</div>
                                        <div className="text-slate-400 text-xs font-medium leading-relaxed">{b.desc}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div variants={itemVariants}>
                            <p className="text-xl font-black text-white mb-5 leading-tight">
                                This isn't feedback.{' '}
                                <span className="text-white/50">It's intelligence.</span>
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-sm hover:bg-slate-100 transition-all group"
                            >
                                Get My Dossier Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Dossier preview card ──────────────────────── */}
                    <motion.div variants={itemVariants} className="lg:col-span-7 relative">

                        {/* Fade out at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none rounded-b-[2rem]" />

                        <div className="bg-[#F8F9FA] rounded-[2rem] overflow-hidden max-h-[800px] overflow-y-hidden shadow-2xl border border-white/5">

                            {/* Report nav bar */}
                            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Technical Dossier</span>
                            </div>

                            <div className="px-6 py-8 space-y-6">

                                {/* 1. Identification + Verdict */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm border-b-[4px] border-b-indigo-600 p-6">
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-2">{report.candidateName}</h2>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{report.meta.company}</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{report.meta.type} Round</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{report.meta.title}</p>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed italic">
                                            "{report.verdict_summary}"
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-6 flex flex-col justify-between items-center text-center">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Recommendation</span>
                                        <div>
                                            <div className="text-2xl font-black uppercase tracking-tight text-emerald-600">{report.verdict.signal}</div>
                                            <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-slate-400">Hiring Signal</div>
                                        </div>
                                        <div className="w-full">
                                            <div className="w-full h-[2px] bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(report.verdict.confidence / 10) * 100}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                    className="h-full bg-indigo-600"
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                <span>Confidence</span><span>{report.verdict.confidence}/10</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Calibration matrix */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: "Confidence", value: `${report.verdict.confidence}/10`, icon: <Target className="w-4 h-4" /> },
                                        { label: "Level", value: report.verdict.level, icon: <Layers className="w-4 h-4" /> },
                                        { label: "Risk", value: report.verdict.risk, icon: <ShieldAlert className="w-4 h-4" /> },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white p-4 rounded-[1.25rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                                                <p className="text-sm font-black uppercase tracking-tight text-slate-900">{item.value}</p>
                                            </div>
                                            <div className="hidden md:block w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">{item.icon}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* 3. Logical Evidence (compact) */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Logical Evidence</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { title: "Strengths", data: report.decision.worked, color: "emerald", icon: <CheckCircle2 className="w-4 h-4" /> },
                                            { title: "Blockers", data: report.decision.blocked, color: "rose", icon: <XCircle className="w-4 h-4" /> },
                                            { title: "Pivots", data: report.decision.change, color: "indigo", icon: <TrendingUp className="w-4 h-4" /> },
                                        ].map((col, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                                                    <span className={`text-${col.color}-600`}>{col.icon}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">{col.title}</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {col.data.map((item, idx) => (
                                                        <li key={idx} className="flex gap-2">
                                                            <span className={`w-1 h-1 rounded-full bg-${col.color}-500 mt-1.5 shrink-0`} />
                                                            <p className="text-[10px] font-medium text-slate-600 leading-relaxed">{item}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Technical Calibration dark grid */}
                                <div className="bg-slate-900 rounded-[1.5rem] p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[80px] pointer-events-none" />
                                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10 relative z-10">
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-tight text-white">Technical Calibration</h3>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Engineering Judgment</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Pass Complete</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {report.technicalProfile.map((trait, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{trait.name}</h4>
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${traitBadge(trait.status)}`}>
                                                        {trait.status}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{trait.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default TechnicalDossier;
