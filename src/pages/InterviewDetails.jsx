import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Brain, Code, MessageSquare, Terminal, ChevronRight, X, Loader2, Bug, Database, CodeXml, Layers, Sparkles, Target, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';

const InterviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type'); // 'sde' or 'devops'

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    const [completedRounds, setCompletedRounds] = useState({});
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [ttsProvider, setTtsProvider] = useState('azure');

    useEffect(() => {
        const fetchInterviewDetails = async () => {
            try {
                if (!id) return;
                setCompletedRounds({});

                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));

                const [detailsRes, progressRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/interviews/${id}?type=${type || 'sde'}`),
                    userCreds?.id ? fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/curated?userId=${userCreds.id}&interviewId=${id}`) : Promise.resolve({ ok: false })
                ]);

                const [detailsData, progressData] = await Promise.all([
                    detailsRes.json(),
                    progressRes.ok ? progressRes.json() : Promise.resolve([])
                ]);

                if (!detailsRes.ok) throw new Error(detailsData.error || 'Interview not found');

                setInterview({
                    ...detailsData,
                    icon_url: detailsData.icon_link
                });

                if (progressData.length > 0) {
                    const completedMap = {};
                    progressData.forEach(item => {
                        if (item.round_id && !completedMap[item.round_id]) {
                            completedMap[item.round_id] = item;
                        }
                    });
                    setCompletedRounds(completedMap);
                }
            } catch (err) {
                console.error("Error fetching interview details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviewDetails();
    }, [id, type]);

    const getCompanyColor = (company) => {
        const colors = {
            'Google': 'cyan',
            'Amazon': 'amber',
            'Meta': 'blue',
            'Netflix': 'red',
            'Microsoft': 'sky',
            'Apple': 'slate',
            'Nvidia': 'emerald',
            'OpenAI': 'indigo'
        };
        return colors[company] || 'indigo';
    };

    const progress = React.useMemo(() => {
        if (!interview || !interview.rounds || interview.rounds.length === 0) return 0;
        const totalRounds = interview.rounds.length;
        const completedCount = Object.keys(completedRounds).length;
        return Math.round((completedCount / totalRounds) * 100);
    }, [interview, completedRounds]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Prepping your session...</p>
                </motion.div>
            </div>
        );
    }

    if (!interview) {
        return <div className="text-slate-900 min-h-screen flex items-center justify-center">Interview not found</div>;
    }

    const colorKey = getCompanyColor(interview.company);
    const colorClasses = {
        cyan: { bg: "bg-cyan-50", text: "text-cyan-600", accent: "from-cyan-500 to-cyan-600", border: "border-cyan-100", light: "bg-cyan-50/50", glow: "shadow-cyan-200" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", accent: "from-amber-500 to-amber-600", border: "border-amber-100", light: "bg-amber-50/50", glow: "shadow-amber-200" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", accent: "from-blue-500 to-blue-600", border: "border-blue-100", light: "bg-blue-50/50", glow: "shadow-blue-200" },
        red: { bg: "bg-red-50", text: "text-red-600", accent: "from-red-500 to-red-600", border: "border-red-100", light: "bg-red-50/50", glow: "shadow-red-200" },
        sky: { bg: "bg-sky-50", text: "text-sky-600", accent: "from-sky-500 to-sky-600", border: "border-sky-100", light: "bg-sky-50/50", glow: "shadow-sky-200" },
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", accent: "from-emerald-500 to-emerald-600", border: "border-emerald-100", light: "bg-emerald-50/50", glow: "shadow-emerald-200" },
        indigo: { bg: "bg-indigo-50", text: "text-indigo-600", accent: "from-indigo-500 to-indigo-600", border: "border-indigo-100", light: "bg-indigo-50/50", glow: "shadow-indigo-200" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", accent: "from-slate-600 to-slate-800", border: "border-slate-200", light: "bg-slate-50/50", glow: "shadow-slate-200" }
    };
    const colors = colorClasses[colorKey] || colorClasses.indigo;

    const rounds = (interview.rounds || []).map((round, index) => ({
        ...round,
        id: index + 1,
        icon: round.type === 'behavioral' ? MessageSquare : round.type === 'debug' ? Bug : round.type === 'design' ? Database : CodeXml,
        roundNum: index + 1
    }));

    const handleLaunchRound = async (round, index) => {
        const commonState = {
            role: interview.role,
            icon: interview.icon_url,
            name: `${interview.role}`,
            level: interview.level,
            company: interview.company,
            customInterview: false,
            roundKey: `${interview.id}-round-${index + 1}`,
            roundId: round.id,
            type: round.type,
            title: round.title,
            description: round.overview,
            flow: round.flow,
            persona: round.persona,
            roundProblemData: round.problem,
            evaluation: round.evaluation,
            evaluation_intelligence: round.evaluation_intelligence,
            candidate_reasoning_signals: round.candidate_reasoning_signals,
            roundNum: index + 1,
            ttsProvider: ttsProvider,
            slug: round.slug || round.questionSlug
        };

        // Mobile Restriction for Design Round
        if (round.type === 'design' && window.innerWidth < 1024) {
            alert('The Design Canvas requires a larger screen (Desktop) for the best experience. Please switch to a desktop device to start this round.');
            return;
        }

        try {
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/start-interview`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userCreds.id, context: commonState }),
            });

            if (response.status === 403) {
                setShowCreditModal(true);
                return;
            }

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const pathMap = {
                'coding': '/coding-round',
                'coding-algo': '/coding-round',
                'coding-dsa': '/coding-round',
                'debugging': '/debug-round',
                'debug': '/debug-round',
                'design': '/design-round',
                'behavioral': '/behavioral-round'
            };

            navigate(pathMap[round.type] || '/behavioral-round', { state: commonState });

        } catch (error) {
            console.error("Error starting Round:", error);
        }
    };

    const CreditWarningModal = () => (
        <AnimatePresence>
            {showCreditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreditModal(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                        <div className="relative flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center rotate-3 transform hover:rotate-0 transition-transform duration-300">
                                <Sparkles className="w-10 h-10 text-amber-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-slate-900">Credit Limit Reached</h3>
                                <p className="text-slate-500 leading-relaxed px-4">
                                    Unlock your full potential. You need <span className="text-slate-900 font-bold">5 credits</span> to initialize this production-grade session.
                                </p>
                            </div>
                            <div className="w-full flex flex-col gap-3 pt-4">
                                <button
                                    onClick={() => navigate('/credits')}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-lg hover:shadow-indigo-200/50"
                                >
                                    Refill Credits
                                </button>
                                <button
                                    onClick={() => setShowCreditModal(false)}
                                    className="w-full py-4 text-slate-500 font-medium hover:text-slate-900 transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="min-h-screen bg-white font-inter">
            <Navbar />
            <CreditWarningModal />

            {/* Back Navigation */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-medium py-2"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Catalog</span>
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-12">

                {/* Modern Hero Section */}
                <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl shadow-indigo-100/50 group">
                    {/* Animated Abstract Backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-black pointer-events-none" />
                    <div
                        className="absolute inset-0 opacity-30 animate-pulse-slow blur-3xl transition-opacity duration-1000"
                        style={{ background: 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.4), transparent)' }}
                    />

                    <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col lg:flex-row items-center lg:items-center gap-6"
                            >
                                <div className="relative group/logo w-24 h-24 sm:w-28 sm:h-28">
                                    <div className={`absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700`} />
                                    <div className="relative w-full h-full bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center transform group-hover/logo:-rotate-2 transition-transform duration-500">
                                        <img src={interview.icon_url} alt={interview.company} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-lg shadow-lg">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <div className="h-[1px] w-6 bg-indigo-500/50 hidden lg:block" />
                                        <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-xs">{interview.company}</span>
                                    </div>
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                                        {interview.role}
                                    </h1>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
                            >
                                <span className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white font-medium text-sm">
                                    <Clock className="w-4 h-4 text-indigo-400" /> {interview.total_duration}m Total
                                </span>
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-indigo-100 font-bold text-sm bg-indigo-500/20 border border-indigo-500/30`}>
                                    <Target className="w-4 h-4" /> {interview.level}
                                </span>
                                <span className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white font-medium text-sm">
                                    <Layers className="w-4 h-4 text-indigo-400" /> {rounds.length} Rounds
                                </span>
                            </motion.div>
                        </div>

                        {/* Progress Master Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full lg:w-80 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8 space-y-6 shadow-2xl"
                        >
                            <div className="flex items-baseline justify-between">
                                <h3 className="text-white font-bold text-xl">Progress</h3>
                                <span className="text-indigo-400 font-black text-3xl">{progress}%</span>
                            </div>

                            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span>{Object.keys(completedRounds).length} Completed</span>
                                <span className="text-indigo-300">{rounds.length - Object.keys(completedRounds).length} Remaining</span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Panel: Info & Rounds */}
                    <div className="lg:col-span-2 space-y-12">

                        <section className="grid grid-cols-1 gap-6">
                            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 hover:bg-white hover:border-indigo-100 transition-all duration-500">
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Program Intent</h3>
                                <p className="text-slate-500 leading-relaxed text-sm lg:text-base">
                                    {interview.overview}
                                </p>
                            </div>
                        </section>

                        {/* Rounds Roadmap */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Interview Roadmap</h2>
                                <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{rounds.length} Steps</div>
                            </div>

                            <div className="space-y-6">
                                {rounds.map((round, idx) => {
                                    const completion = completedRounds[round.id];
                                    const isLocked = idx > 0 && !completedRounds[rounds[idx - 1].id]; // Optional strict progression logic?

                                    return (
                                        <motion.div
                                            key={round.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="group relative flex items-stretch gap-6"
                                        >
                                            {/* Vertical Connector */}
                                            {idx !== rounds.length - 1 && (
                                                <div className="absolute left-7 top-14 bottom-0 w-1 bg-slate-100 z-0 group-hover:bg-indigo-50 transition-colors" />
                                            )}

                                            {/* Round Number/Icon */}
                                            <div className="relative z-10 shrink-0">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${completion ? 'bg-indigo-600 shadow-indigo-200' : 'bg-white border-2 border-slate-100 group-hover:border-indigo-200 group-hover:shadow-lg'}`}>
                                                    {completion ? (
                                                        <CheckCircle className="w-7 h-7 text-white" />
                                                    ) : (
                                                        <round.icon className={`w-6 h-6 ${colors.text}`} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Round Card Body */}
                                            <div className="flex-1 pb-8">
                                                <div className={`p-6 sm:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-500 group-hover:-translate-y-1`}>
                                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md">Phase {idx + 1}</span>
                                                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                                    <Clock className="w-3.5 h-3.5" /> {round.duration}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                                                                {round.title}
                                                            </h3>
                                                        </div>

                                                        {completion && (
                                                            <div className="bg-indigo-600 rounded-2xl px-5 py-3 text-center min-w-[100px] shadow-lg shadow-indigo-100">
                                                                <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Performance</p>
                                                                <p className="text-2xl font-black text-white">{completion.score}<span className="text-xs opacity-60 ml-0.5">/10</span></p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-2xl">
                                                        {round.overview}
                                                    </p>

                                                    <div className="flex flex-wrap gap-3">
                                                        {completion ? (
                                                            <>
                                                                <button
                                                                    onClick={() => navigate('/report', {
                                                                        state: {
                                                                            isPastInterview: true,
                                                                            reportData: completion.report_data,
                                                                            completedAt: completion.completed_at,
                                                                            type: round.type,
                                                                            role: interview.role,
                                                                            firstName: 'Candidate'
                                                                        }
                                                                    })}
                                                                    className="flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl bg-slate-50 text-slate-900 font-bold hover:bg-slate-100 transition-all text-sm shadow-sm flex items-center justify-center gap-2"
                                                                >
                                                                    Analyze Results
                                                                </button>
                                                                <button
                                                                    onClick={() => handleLaunchRound(round, idx)}
                                                                    className="flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                                                >
                                                                    Re-attempt Round
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleLaunchRound(round, idx)}
                                                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-black transition-all text-sm shadow-xl shadow-slate-200 hover:shadow-indigo-200/50 flex items-center justify-center gap-3 uppercase tracking-widest"
                                                            >
                                                                Initialize Phase
                                                                <ChevronRight className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Right Panel: Side Stats / Quick Action */}
                    <aside className="space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-violet-500 to-indigo-600 text-white space-y-6 shadow-2xl shadow-indigo-100">
                                <Zap className="w-10 h-10 text-yellow-500" />
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-black leading-tight uppercase tracking-tight">Key Competencies</h4>
                                    <p className="text-indigo-100/80 text-sm leading-relaxed">
                                        This session evaluates your mastery over the following technical domains and soft skills.
                                    </p>
                                </div>
                                <div className="h-[1px] bg-white/10" />
                                <div className="flex flex-wrap gap-2">
                                    {(interview.skills || ['Core Fundamentals', 'Scalability', 'Precision']).map((skill, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold text-white hover:bg-white/20 transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default InterviewDetails;
