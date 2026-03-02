import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, XCircle, AlertTriangle, ArrowRight,
    BarChart3, Code, Zap, BrainCircuit, Target,
    ChevronRight, ShieldAlert, Award, TrendingUp,
    AlertOctagon, Check, Download, Share2, Loader2, Sparkles, User,
    FileText, Activity, Layers, Briefcase, Calendar, Info, Clock, CheckCircle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ShareModal from '../components/ShareModal';

const ROUND_NAMES = {
    coding: 'Coding Interview',
    debug: 'Debugging Interview',
    design: 'System Design Interview',
    behavioral: 'Behavioral Interview',
    technical: 'Technical Interview'
};

const InterviewReport = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { shortId } = useParams();
    const [loading, setLoading] = useState(true);
    const [dynamicReport, setDynamicReport] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [sharedReportData, setSharedReportData] = useState(null);
    const [shareCopied, setShareCopied] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const reportRef = useRef(null);

    const {
        id,
        sessionId,
        triggeredByEndButton,
        reportData: pastReportData,
        isPastInterview,
        completedAt,
        endInterviewParams,
        role,
        type,
        title,
        company,
        duration
    } = location.state || sharedReportData || {};

    const userCreds = JSON.parse(localStorage.getItem("userCredentials")) || {};
    const fallbackName = userCreds.first_name ? `${userCreds.first_name} ${userCreds.last_name || ''}`.trim() : "Candidate";

    const metaData = {
        title: title || endInterviewParams?.context?.title || "Interactive Simulation",
        company: company || endInterviewParams?.context?.company || "",
        type: type || endInterviewParams?.context?.type || "custom",
        duration: duration || endInterviewParams?.context?.durationInMinutes || endInterviewParams?.durationInMinutes || 0,
        role: role || endInterviewParams?.context?.role || "Software Engineer",
        date: completedAt
            ? new Date(completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Initial Placeholder / Default Structure
    const defaultData = {
        candidateName: location.state?.firstName || fallbackName,
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
        // Fetch shared report via public link
        if (shortId) {
            const fetchSharedReport = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shared-report/${shortId}`);
                    const data = await response.json();

                    if (response.ok && data) {
                        setSharedReportData({
                            id: data.id,
                            candidateName: data.candidate_name || 'Candidate',
                            reportData: data.report_data,
                            role: data.job_role || (data.type ? data.type.toUpperCase() : 'SDE'),
                            title: data.title,
                            type: data.type || 'custom',
                            company: data.company,
                            duration: data.duration_mins,
                            isPastInterview: true,
                            completedAt: data.completed_at
                        });
                        setDynamicReport(data.report_data);
                    } else {
                        console.error('[Shared Report] Error:', data.error);
                        setDynamicReport({ status: 'failed', error: "Public report not found or access denied." });
                    }
                } catch (err) {
                    console.error('[Shared Report] Fetch Error:', err);
                    setDynamicReport({ status: 'failed', error: "Failed to load shared report." });
                } finally {
                    setLoading(false);
                }
            };
            fetchSharedReport();
            return;
        }

        // If this is a past interview with pre-loaded data, skip generation
        if (isPastInterview && pastReportData) {
            setLoading(false);
            return;
        }

        if (triggeredByEndButton && endInterviewParams) {
            const generateAndFetchReport = async () => {
                try {

                    const token = localStorage.getItem('authToken');
                    if (!token) {
                        console.error('[Report] No auth token available');
                        setLoading(false);
                        return;
                    }

                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/end-interview`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(endInterviewParams)
                    });

                    const data = await response.json();
                    if (data.success && data.report) {
                        setDynamicReport(data.report);

                        // Clear the trigger and store data in history state 
                        // so a page refresh renders instantly and doesn't double-charge
                        navigate(location.pathname, {
                            replace: true,
                            state: {
                                ...location.state,
                                triggeredByEndButton: false,
                                reportData: data.report,
                                isPastInterview: true
                            }
                        });
                    } else {
                        console.error('[Report] Server Error:', data.error);
                    }
                } catch (err) {
                    console.error('[Report] Fetch Error:', err);
                } finally {
                    setLoading(false);
                }
            };
            generateAndFetchReport();
            return;
        }

        // Fallback catch-all
        setLoading(false);
    }, [shortId, sessionId, triggeredByEndButton, isPastInterview, endInterviewParams, navigate, location.pathname, pastReportData]);

    const getShareUrl = () => {
        if (!id) return '';
        const uidWithoutHyphens = id.replace(/-/g, '');
        const base = import.meta.env.VITE_APP_URL || window.location.origin;
        return `${base}/report/share/${uidWithoutHyphens}`;
    };

    const handleShare = () => {
        if (!id) return;
        setIsShareOpen(true);
    };

    const handleExportPDF = async () => {
        if (!reportRef.current) return;

        try {
            setIsExporting(true);
            const element = reportRef.current;

            const targetWidth = 1200;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            let currentY = 10; // Start with a 10mm top margin
            const marginX = 10; // 10mm side margins
            const usableWidth = pdfWidth - (marginX * 2);

            // Get all direct semantic sections inside the main reference
            const sections = Array.from(element.children);

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];

                // Generate image for each distinct section
                const dataUrl = await toPng(section, {
                    cacheBust: true,
                    backgroundColor: '#F8F9FA', // Fallback for transparent areas
                    pixelRatio: 2, // High resolution output
                    canvasWidth: targetWidth,
                    width: targetWidth,
                    style: {
                        width: `${targetWidth}px`,
                        maxWidth: 'none',
                        margin: '0',
                        padding: '40px' // Padding ensures shadow/border breathing room
                    }
                });

                const imgProps = pdf.getImageProperties(dataUrl);
                const imgHeight = (imgProps.height * usableWidth) / imgProps.width;

                // If adding this block exceeds page height, create a clean page break
                if (currentY + imgHeight > pdfHeight - 10 && currentY > 10) {
                    pdf.addPage();
                    currentY = 10; // Reset Y coordinate
                }

                pdf.addImage(dataUrl, 'PNG', marginX, currentY, usableWidth, imgHeight);
                currentY += imgHeight + 5; // 5mm spacing between sections
            }

            const safeName = (reportData?.candidateName || fallbackName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
            pdf.save(`${safeName}_Technical_Dossier.pdf`);

        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsExporting(false);
        }
    };

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
            <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-center font-inter">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md w-full space-y-12"
                >
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl scale-150 animate-pulse" />
                        <div className="relative w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center">
                            <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Quantifying Performance</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Our analytical engine is synthesizing your session data, reasoning signals, and architectural decisions into an executive technical dossier.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="h-full bg-indigo-600"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Scanning Transcript</span>
                            <span>Mapping Competencies</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { icon: <BrainCircuit className="w-4 h-4" />, label: "Signals" },
                            { icon: <ShieldAlert className="w-4 h-4" />, label: "Risks" },
                            { icon: <Target className="w-4 h-4" />, label: "Level" },
                            { icon: <Layers className="w-4 h-4" />, label: "Structure" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-100/50 shadow-sm"
                            >
                                <span className="text-indigo-600">{item.icon}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    if (reportData?.status === 'skipped' || reportData?.status === 'failed' || reportData?.error) {
        const isSkipped = reportData?.status === 'skipped' || reportData?.message?.includes('skipped');
        const title = isSkipped ? "Insufficient Signals" : "Report Generation Failed";
        const message = isSkipped
            ? "Your interview duration was too short to gather enough technical signals for a comprehensive report."
            : (reportData.error || "There was an issue generating your comprehensive feedback report. Please try again later or contact support.");
        const iconColor = isSkipped ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600";
        const borderColor = isSkipped ? "border-amber-100" : "border-rose-100";

        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className={`max-w-md w-full bg-white p-8 rounded-3xl border ${borderColor} shadow-xl space-y-6`}>
                    <div className={`w-16 h-16 ${iconColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-slate-500 mt-2">
                            {message}
                        </p>
                    </div>
                    {!shortId && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const displayName = sharedReportData?.candidateName || fallbackName || 'Candidate';

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-inter selection:bg-indigo-100 print:bg-white print:p-0">
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                reportData={reportData}
                metaData={metaData}
                candidateName={displayName}
                shareUrl={getShareUrl()}
            />
            {/* Professional Header / Navigation - HIDDEN DURING PRINTING */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 print:hidden">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        {!shortId && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-900"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                            </button>
                        )}
                        {!shortId && <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />}
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">Technical Dossier</h1>
                            </div>
                            {/* <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {sessionId || 'Internal-System-ID'}</p> */}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {shortId ? (
                            /* Public shared link view — show CTA instead of share button */
                            <a
                                href="https://interviu.pro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-black transition-all uppercase tracking-widest shadow-lg"
                            >
                                Try Interviu.pro →
                            </a>
                        ) : id && (
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest transition-colors duration-300"
                            >
                                {shareCopied ? (
                                    <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Copied!</>
                                ) : (
                                    <><Share2 className="w-3.5 h-3.5" /> Share</>
                                )}
                            </button>
                        )}
                        {/* <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-6 py-2.5 text-xs font-black text-white bg-slate-900 rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-200 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> EXPORTING...
                                </>
                            ) : (
                                <>
                                    <Download className="w-3.5 h-3.5" /> EXPORT PDF
                                </>
                            )}
                        </button> */}
                    </div>
                </div>
            </div>

            <main ref={reportRef} className="max-w-6xl mx-auto px-6 py-12 space-y-12 print:max-w-none print:w-full print:p-0 print:space-y-6">

                {/* 1. Executive Identification & Verdict Snapshot */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:space-y-6"
                >
                    {/* Identification */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 shadow-sm border-b-[4px] border-b-indigo-600 print:rounded-none print:shadow-none print:border-t-0 print:border-x-0 print:border-slate-300 print:break-inside-avoid">
                        <div className="relative flex flex-col sm:flex-row sm:items-center gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{reportData?.candidateName || displayName}</h2>
                                    <div className="flex flex-col items-start gap-4 mt-2">
                                        <div className="flex items-center gap-4">
                                            {metaData.company && (
                                                <>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                                                        {metaData.company}
                                                    </span>
                                                </>
                                            )}
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                {metaData.type === 'custom'
                                                    ? 'Custom Scenario'
                                                    : (ROUND_NAMES[metaData.type?.toLowerCase()] || 'Technical Interview')}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {metaData.title}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                <Calendar className="w-3.5 h-3.5" /> {metaData.date}
                                            </span>
                                            {metaData.duration > 0 && (
                                                <>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5" /> {metaData.duration}m
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed italic">
                                    "{reportData.verdict.summary}"
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hiring Verdict Box */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-10 shadow-sm flex flex-col justify-between items-center text-center print:rounded-none print:shadow-none print:border print:border-slate-200 print:break-inside-avoid">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recommendation</span>
                        <div className="py-6">
                            <div className={`text-4xl font-black uppercase tracking-tight ${reportData.verdict.signal.toLowerCase().includes('hire') ? 'text-emerald-600' : 'text-slate-900'}`}>
                                {reportData.verdict.signal}
                            </div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Hiring Signal Output</div>
                        </div>
                        <div className="w-full h-[2px] bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(reportData.verdict.confidence / 10) * 100}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="h-full bg-indigo-600"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* 2. Calibration & Risk Matrix */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:break-inside-avoid"
                >
                    {[
                        { label: "Confidence", value: `${reportData.verdict.confidence}/10`, icon: <Target className="w-4 h-4" /> },
                        { label: "Level Calibration", value: reportData.verdict.level, icon: <Layers className="w-4 h-4" /> },
                        { label: "Risk Assessment", value: reportData.verdict.risk, icon: <ShieldAlert className="w-4 h-4" />, highlight: true }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between print:rounded-none print:shadow-none print:border-slate-200 print:p-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                <p className={`text-xl font-black uppercase tracking-tight ${item.highlight && item.value.toLowerCase() !== 'low' ? 'text-amber-600' : 'text-slate-900'}`}>
                                    {item.value}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </motion.section>

                {/* 3. Logical Breakdown (The "Analytical" view) */}
                <section className="space-y-6 print:break-inside-avoid print:mt-8">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Logical Evidence</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
                        {[
                            { title: "Strengths (Worked)", data: reportData.decision.worked, color: "emerald", icon: <CheckCircle2 className="w-5 h-5" /> },
                            { title: "Blockers (Risks)", data: reportData.decision.blocked, color: "rose", icon: <XCircle className="w-5 h-5" /> },
                            { title: "Strategic Pivots", data: reportData.decision.change, color: "indigo", icon: <TrendingUp className="w-5 h-5" /> }
                        ].map((col, i) => (
                            <div key={i} className="space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                                    <span className={`text-${col.color}-600`}>{col.icon}</span>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{col.title}</h4>
                                </div>
                                <ul className="space-y-4">
                                    {col.data.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 group">
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${col.color}-500 mt-2 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity`} />
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Technical Judgment Grid */}
                <section className="space-y-8 bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden print:bg-white print:text-slate-900 print:rounded-none print:p-0 print:mt-12 print:break-inside-avoid print:border-t print:border-slate-300 print:pt-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none print:hidden" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-white/10 print:border-slate-200 print:pb-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black uppercase tracking-tight print:text-slate-900">Technical Calibration</h3>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest print:text-slate-500">Engineering Judgment & Core Signals</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl print:bg-transparent print:border-slate-200">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse print:hidden" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 print:text-slate-600">Analytical Pass Complete</span>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 print:pt-6 print:grid-cols-3">
                        {reportData.technicalProfile.map((trait, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between group print:bg-white print:border-slate-200 print:rounded-none tracking-normal">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-indigo-400 transition-colors print:text-slate-900">{trait.name}</h4>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${trait.status.toLowerCase() === 'strong' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 print:border-emerald-200 print:text-emerald-700' :
                                            trait.status.toLowerCase() === 'developing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 print:border-amber-200 print:text-amber-700' :
                                                'bg-rose-500/10 border-rose-500/20 text-rose-400 print:border-rose-200 print:text-rose-700'
                                            }`}>
                                            {trait.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed print:text-slate-600">{trait.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Round Specific Insights */}
                <section className="bg-white rounded-[2rem] border border-slate-100 p-8 sm:p-12 shadow-sm space-y-10 print:break-inside-avoid print:mt-12 print:border-t-0 print:border-x-0 print:border-b-4 print:border-b-indigo-600 print:rounded-none print:shadow-none print:px-0 print:pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">{reportData.roundInsight.type} Insight</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Deep-dive Performance Metrics</p>
                        </div>
                        <div className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.1em] border ${getStatusColor(reportData.roundInsight.score)}`}>
                            {reportData.roundInsight.score} Performance
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:grid-cols-2 print:gap-8">
                        <div className="space-y-6">
                            <p className="text-base font-medium text-slate-700 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-2">
                                "{reportData.roundInsight.summary}"
                            </p>
                        </div>
                        <div className="grid gap-6">
                            {reportData.roundInsight.breakdown.map((item, i) => (
                                <div key={i} className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-900">{item.category}</span>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Failure Patterns & Readiness */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 print:grid-cols-3 print:gap-8 print:break-inside-avoid print:pt-8">
                    {/* Failure Patterns */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <AlertOctagon className="w-5 h-5 text-rose-600" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Detected Failure Patterns</h3>
                        </div>
                        <div className="grid gap-4">
                            {reportData.failurePatterns.map((pattern, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm border-l-[4px] border-l-rose-500 hover:shadow-lg hover:shadow-rose-500/5 transition-all print:shadow-none print:rounded-none print:border-y-0 print:border-r-0 print:bg-rose-50/30">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-2">{pattern.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{pattern.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Readiness Map */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Readiness Map</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Qualified For</p>
                                <div className="space-y-2">
                                    {reportData.readinessMap.ready.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold ml-2">
                                            <Check className="w-3.5 h-3.5" />
                                            <span className="text-[11px] uppercase tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 border-t border-slate-200 pt-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Requires Calibration</p>
                                <div className="space-y-2">
                                    {reportData.readinessMap.needsWork.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-600 font-bold ml-2">
                                            <Info className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-[11px] uppercase tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Actionable Improvement & Strategy */}
                <section className="pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-12 print:grid-cols-2 print:gap-8 print:break-inside-avoid print:mt-8">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Priority Improvements</h3>
                        </div>
                        <div className="space-y-6">
                            {reportData.improvementPlan.map((plan, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 text-slate-900 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        0{i + 1}
                                    </div>
                                    <p className="text-slate-700 font-bold leading-relaxed pt-1.5">{plan}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Execution Strategy</h3>
                        </div>
                        <div className="grid gap-3">
                            {reportData.nextStrategy.map((step, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-default">
                                    <span className="text-sm font-black uppercase tracking-widest text-slate-900">{step.action}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="pt-24 pb-8 flex flex-col items-center gap-4 text-slate-400">
                    <div className="w-12 h-1 bg-slate-200 rounded-full" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Intervyu Technical Dossier • {reportData.date}</p>
                </footer>
            </main>
        </div>
    );
};

export default InterviewReport;
