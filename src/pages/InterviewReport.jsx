import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CheckCircle2, XCircle, AlertTriangle, ArrowRight,
    BarChart3, Code, Zap, BrainCircuit, Target,
    ChevronRight, ShieldAlert, Award, TrendingUp,
    AlertOctagon, Check, Download, Share2, Loader2, Sparkles, User
} from 'lucide-react';

const InterviewReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [dynamicReport, setDynamicReport] = useState(null);
    const ws = useRef(null);

    const { sessionId, triggeredByEndButton, reportData: pastReportData, isPastInterview, completedAt } = location.state || {};

    // Initial Placeholder / Default Structure
    const defaultData = {
        candidateName: location.state?.firstName || "Candidate",
        role: location.state?.role || "Software Engineer",
        date: completedAt
            ? new Date(completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        verdict: {
            signal: "Analyzing...",
            confidence: 0,
            level: "Analyzing...",
            risk: "Analyzing...",
            summary: "Generating your comprehensive performance report..."
        },
        decision: {
            worked: ["Analyzing...", "Analyzing...", "Analyzing..."],
            blocked: ["Analyzing...", "Analyzing...", "Analyzing..."],
            change: ["Analyzing...", "Analyzing...", "Analyzing..."]
        },
        technicalProfile: [],
        roundInsight: {
            type: location.state?.type || "Interview Round",
            score: "Analyzing",
            summary: "Generating insights...",
            breakdown: []
        },
        failurePatterns: [],
        readinessMap: {
            ready: [],
            needsWork: []
        },
        improvementPlan: [],
        nextStrategy: []
    };

    const reportData = isPastInterview && pastReportData ? pastReportData : (dynamicReport || defaultData);

    useEffect(() => {
        // If this is a past interview with pre-loaded data, skip WebSocket entirely
        if (isPastInterview) {
            setLoading(false);
            return;
        }

        if (!sessionId) {
            setLoading(false);
            return;
        }

        console.log(`[Report] Connecting for session: ${sessionId}`);
        ws.current = new WebSocket('ws://localhost:8081');

        ws.current.onopen = () => {
            console.log('[Report] WebSocket Connected');
            // Reconnect to existing session
            ws.current.send(JSON.stringify({
                type: 'reconnect',
                payload: { sessionId }
            }));

            // Trigger report generation if we just ended the round
            if (triggeredByEndButton) {
                ws.current.send(JSON.stringify({
                    type: 'generate_report'
                }));
            }
        };

        ws.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                console.log(`[Report] Received ${msg.type}`);

                if (msg.type === 'report_generated') {
                    setDynamicReport(msg.payload);
                    setLoading(false);
                } else if (msg.type === 'error') {
                    console.error('[Report] Server Error:', msg.payload.message);
                    setLoading(false);
                }
            } catch (err) {
                console.error('[Report] Parse Error:', err);
            }
        };

        ws.current.onclose = () => {
            console.log('[Report] WebSocket Disconnected');
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, [sessionId, triggeredByEndButton, isPastInterview]);

    // Helper for Status Colors
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'strong': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
            case 'developing': return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'weak': return 'text-rose-700 bg-rose-50 border-rose-200';
            default: return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-white p-8 rounded-3xl border border-blue-50 shadow-xl">
                        <Sparkles className="w-16 h-16 text-blue-600 animate-bounce mx-auto" />
                    </div>
                </div>
                <div className="max-w-md space-y-4">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Generating Your Report</h2>
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Claude is analyzing your performance, reasoning signals, and architectural decisions to build a comprehensive feedback report.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-8">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                </div>

                {/* Micro-insights while loading */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                    {[
                        { icon: <BrainCircuit className="w-5 h-5" />, text: "Analyzing Reasoning Signals" },
                        { icon: <Target className="w-5 h-5" />, text: "Calibrating Level Fit" },
                        { icon: <ShieldAlert className="w-5 h-5" />, text: "Detecting Failure Patterns" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 150}ms` }}>
                            <div className="text-blue-600">{item.icon}</div>
                            <span className="text-sm font-medium text-slate-600">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            {/* Header / Actions */}
            <div className="max-w-7xl mx-auto sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XCircle className="w-6 h-6 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">Interview Report</h1>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{reportData.roundInsight.type}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

                {/* 1. Hiring Readiness Snapshot */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Hiring Verdict</h2>
                            <p className="text-slate-500 mt-1">Snapshot of candidate readiness</p>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                {reportData.verdict.signal}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Signal Card */}
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:border-blue-200 transition-all">
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Verdict</span>
                            <div className="mt-2 text-2xl font-bold text-slate-900">{reportData.verdict.signal}</div>
                            <div className="h-1 w-full bg-gray-100 rounded-full mt-4 overflow-hidden">
                                <div className="h-full bg-blue-600 w-[75%] rounded-full"></div>
                            </div>
                        </div>

                        {/* Confidence */}
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-blue-200 transition-all">
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Confidence</span>
                            <div className="mt-2 text-2xl font-bold text-slate-900">{reportData.verdict.confidence}/10</div>
                        </div>

                        {/* Level */}
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-blue-200 transition-all">
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Level Fit</span>
                            <div className="mt-2 text-2xl font-bold text-slate-900">{reportData.verdict.level}</div>
                        </div>

                        {/* Risk */}
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-blue-200 transition-all">
                            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Risk Profile</span>
                            <div className="mt-2 text-2xl font-bold text-amber-600">{reportData.verdict.risk}</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-medium text-slate-700 leading-relaxed">
                        "{reportData.verdict.summary}"
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 2. Decision Explanation */}
                <section className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900">Decision Logic</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-emerald-700 mb-4">
                                <CheckCircle2 className="w-5 h-5" /> What Worked
                            </h4>
                            <ul className="space-y-3">
                                {reportData.decision.worked.map((item, i) => (
                                    <li key={i} className="text-slate-600 text-sm leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-rose-700 mb-4">
                                <XCircle className="w-5 h-5" /> What Blocked
                            </h4>
                            <ul className="space-y-3">
                                {reportData.decision.blocked.map((item, i) => (
                                    <li key={i} className="text-slate-600 text-sm leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-blue-700 mb-4">
                                <TrendingUp className="w-5 h-5" /> Pivot Point
                            </h4>
                            <ul className="space-y-3">
                                {reportData.decision.change.map((item, i) => (
                                    <li key={i} className="text-slate-600 text-sm leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 3. Technical Judgment Profile */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Engineering Judgment</h3>
                        <span className="text-sm text-slate-400">Core Signals</span>
                    </div>

                    <div className="grid gap-4">
                        {reportData.technicalProfile.map((trait, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                <div className="space-y-1">
                                    <div className="font-semibold text-slate-900">{trait.name}</div>
                                    <div className="text-sm text-slate-500">{trait.desc}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(trait.status)}`}>
                                    {trait.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 4. Round Insight (Single) */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">{reportData.roundInsight.type} Insight</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(reportData.roundInsight.score)}`}>
                            {reportData.roundInsight.score} Performance
                        </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-6">
                        <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4 py-1 bg-slate-50 rounded-r-lg">
                            "{reportData.roundInsight.summary}"
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {reportData.roundInsight.breakdown.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-700 text-sm">{item.category}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-snug">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Failure Pattern Detection (Hero Section) */}
                <section className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 space-y-8 overflow-hidden relative">
                    <div className="absolute -top-10 hidden md:block right-0 p-12 opacity-10 pointer-events-none">
                        <ShieldAlert className="w-64 h-64 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <AlertOctagon className="w-6 h-6 text-rose-400" />
                            </div>
                            <h3 className="text-2xl font-bold">Detected Failure Patterns</h3>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reportData.failurePatterns.map((pattern, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                    <div className="font-semibold text-rose-300 mb-2">{pattern.title}</div>
                                    <div className="text-sm text-slate-300 leading-relaxed">{pattern.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Interview Readiness Map */}
                <section className="grid md:grid-cols-2 gap-12 pt-8">
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-6">
                            <Target className="w-5 h-5 text-emerald-600" /> Ready For
                        </h3>
                        <ul className="space-y-4">
                            {reportData.readinessMap.ready.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 font-medium text-sm">
                                    <Check className="w-5 h-5 text-emerald-600" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                            <Zap className="w-5 h-5 text-amber-500" /> Needs Work
                        </h3>
                        <ul className="space-y-4">
                            {reportData.readinessMap.needsWork.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 text-slate-600 font-medium text-sm">
                                    <span className="w-2 h-2 rounded-full bg-amber-400" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 7 & 8. Improvement Plan & Next Steps */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Priority Improvements */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Priority Fixes (Max 3)</h3>
                        <div className="space-y-4">
                            {reportData.improvementPlan.map((plan, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-700 font-medium pt-1">{plan}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Next Strategy */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Next Strategy</h3>
                        <div className="space-y-3">
                            {reportData.nextStrategy.map((step, i) => (
                                <div key={i} className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-default">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-700 font-medium text-sm">{step.action}</span>
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="pt-12 pb-8 flex justify-center text-slate-400 text-sm font-medium">
                    Intervyu.ai Confidential Report • Generated {reportData.date}
                </div>

            </div>
        </div>
    );
};

export default InterviewReport;
