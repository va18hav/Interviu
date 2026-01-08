import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Star, CheckCircle, Brain, Code, MessageSquare, Terminal, ChevronRight, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import TechInterviews from './TechInterviews';
import { supabase } from '../supabaseClient';

const InterviewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const interview = TechInterviews.find(i => i.id === parseInt(id));

    if (!interview) {
        return <div className="text-white">Interview not found</div>;
    }

    const [completedRounds, setCompletedRounds] = React.useState({});
    const [progress, setProgress] = React.useState(0);
    const [currentScore, setCurrentScore] = React.useState(0);
    const [showDetailsPopup, setShowDetailsPopup] = React.useState(false);

    React.useEffect(() => {
        const fetchCompletedRounds = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user || !interview) return;

                const { data, error } = await supabase
                    .from('interviews')
                    .select('feedback_data, score') // Fetch score column as well
                    .eq('user_id', user.id)
                    .eq('role', interview.role);

                if (error) throw error;

                const map = {};
                let completedCount = 0;
                let totalScore = 0;

                if (data) {
                    data.forEach(entry => {
                        const feedback = entry.feedback_data;
                        if (feedback && feedback.roundKey) {
                            // Prevent cross-talk between companies with same role name
                            if (feedback.company && feedback.company !== interview.company) {
                                return;
                            }
                            map[feedback.roundKey] = { ...feedback, dbScore: parseFloat(entry.score) || 0 };
                            completedCount++;
                            // Safely handle score addition
                            const score = parseFloat(entry.score) || 0; // Use entry.score directly from DB column if available, or parse it
                            totalScore += score;
                        }
                    });
                }
                setCompletedRounds(map);

                // Calculate Progress and Score
                let roundsCount = 0;
                if (interview.rounds) {
                    if (interview.rounds.aptitude) roundsCount++;
                    if (interview.rounds.techRoundOne) roundsCount++;
                    if (interview.rounds.techRoundTwo) roundsCount++;
                    if (interview.rounds.techRoundThree) roundsCount++;
                    if (interview.rounds.behavioral) roundsCount++;
                } else {
                    roundsCount = 5; // Fallback
                }

                const newProgress = roundsCount > 0 ? Math.round((completedCount / roundsCount) * 100) : 0;
                setProgress(newProgress);

                // Calculate Average Score (out of 10)
                // Assuming entry.score is out of 100 or 10. Let's assume 100 for now and normalize to 10 if needed, or if it's already 10.
                // If your backend returns score out of 100:
                const avgScore = completedCount > 0 ? (totalScore / completedCount) : 0;
                // Adjust based on your score scale. If score is 0-100, divide by 10 to show X/10.
                // Assuming score is 0-100
                setCurrentScore((avgScore / 10).toFixed(1));

            } catch (err) {
                console.error("Error fetching completed rounds:", err);
            }
        };
        fetchCompletedRounds();
    }, [id, interview]);

    // Helper for company colors
    const getCompanyColor = (company) => {
        const colors = {
            'Google': 'cyan',
            'Amazon': 'blue',
            'Meta': 'purple',
            'Netflix': 'red',
            'Microsoft': 'green'
        };
        return colors[company] || 'cyan';
    };

    const colorKey = getCompanyColor(interview.company);
    const colorClasses = {
        cyan: { bg: "from-cyan-500/20 to-cyan-600/20", border: "border-cyan-500/20", text: "text-cyan-400", accent: "from-cyan-500 to-cyan-600" },
        blue: { bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/20", text: "text-blue-400", accent: "from-blue-500 to-blue-600" },
        purple: { bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/20", text: "text-purple-400", accent: "from-purple-500 to-purple-600" },
        pink: { bg: "from-pink-500/20 to-pink-600/20", border: "border-pink-500/20", text: "text-pink-400", accent: "from-pink-500 to-pink-600" },
        green: { bg: "from-green-500/20 to-green-600/20", border: "border-green-500/20", text: "text-green-400", accent: "from-green-500 to-green-600" },
        orange: { bg: "from-orange-500/20 to-orange-600/20", border: "border-orange-500/20", text: "text-orange-400", accent: "from-orange-500 to-orange-600" }
    };
    const colors = colorClasses[colorKey];

    // Use data from TechInterviews for rounds if available, else hardcode fallback (or map it)
    // The previous file hardcoded rounds. TechInterviews has explicit rounds.
    // Let's map TechInterviews rounds to the UI structure if possible, 
    // but the UI expects specific Icons.

    // Mapping TechInterviews.rounds to UI structure
    const roundsList = [];
    if (interview.rounds) {
        if (interview.rounds.techRoundOne) roundsList.push({
            id: 1,
            key: 'techRoundOne',
            title: interview.rounds.techRoundOne.title,
            type: interview.rounds.techRoundOne.focus.join(','),
            duration: `${interview.rounds.techRoundOne.duration}`,
            icon: Code,
            desc: interview.rounds.techRoundOne.overview
        });
        if (interview.rounds.techRoundTwo) roundsList.push({
            id: 2,
            key: 'techRoundTwo',
            title: interview.rounds.techRoundTwo.title,
            type: interview.rounds.techRoundTwo.focus.join(','),
            duration: `${interview.rounds.techRoundTwo.duration}`,
            icon: Code,
            desc: interview.rounds.techRoundTwo.overview
        });
        if (interview.rounds.techRoundThree) roundsList.push({
            id: 3,
            key: 'techRoundThree',
            title: interview.rounds.techRoundThree.title,
            type: interview.rounds.techRoundThree.focus.join(','),
            duration: `${interview.rounds.techRoundThree.duration}`,
            icon: Code,
            desc: interview.rounds.techRoundThree.overview
        });
        if (interview.rounds.behavioral) roundsList.push({
            id: 4,
            key: 'behavioral',
            title: interview.rounds.behavioral.title,
            type: interview.companyTraits.behavioralFocus,
            duration: `${interview.rounds.behavioral.duration}`,
            icon: MessageSquare,
            desc: interview.rounds.behavioral.overview
        });
    }

    // Fallback if no rounds in data
    const rounds = roundsList.length > 0 ? roundsList : [];


    async function startRound(roundKey) {
        // --- CHECK CREDITS START ---
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('credits')
                    .eq('id', user.id)
                    .single();

                if (!profile || profile.credits < 5) {
                    alert("You need at least 5 credits to start an interview!");
                    return;
                }
            }
        } catch (error) {
            console.error("Error checking credits:", error);
            // Optionally handle error, maybe proceed or block
        }
        // --- CHECK CREDITS END ---

        sessionStorage.removeItem("interviewEnded");

        const selectedRound = interview.rounds[roundKey];

        navigate("/dashboard/interview", {
            state: {
                role: interview.role,
                icon: interview.icon,
                name: `${interview.company} ${interview.role}`,
                level: interview.level,
                company: interview.company,
                length: selectedRound ? selectedRound.duration : interview.totalDuration,
                customInterview: false,
                roundKey: roundKey,
                questionPool: selectedRound ? selectedRound.questions : [],
                focus: selectedRound ? selectedRound.focus : [],
                type: selectedRound ? selectedRound.type : 'technical'

            }
        });
    }

    async function resetProgress() {
        if (!confirm("Are you sure you want to reset your progress? This will delete all your interview history and feedback for this role.")) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // We need to find the IDs to delete. 
            // We can re-use the fetch logic's existing state or fetch again.
            // Let's fetch IDs to be safe.
            const { data: existingInterviews } = await supabase
                .from('interviews')
                .select('id, feedback_data')
                .eq('user_id', user.id)
                .eq('role', interview.role);

            if (existingInterviews && existingInterviews.length > 0) {
                const idsToDelete = [];
                existingInterviews.forEach(entry => {
                    const fb = entry.feedback_data;
                    if (fb && fb.company === interview.company) {
                        idsToDelete.push(entry.id);
                    }
                });

                if (idsToDelete.length > 0) {
                    const { error } = await supabase
                        .from('interviews')
                        .delete()
                        .in('id', idsToDelete);

                    if (error) throw error;

                    // Reset local state
                    setCompletedRounds({});
                    setProgress(0);
                    setCurrentScore(0);
                }
            }
        } catch (error) {
            console.error("Error resetting progress:", error);
            alert("Failed to reset progress.");
        }
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header & Back Button */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Interviews</span>
                    </button>

                    {progress > 0 && (
                        <button
                            onClick={resetProgress}
                            className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center gap-2"
                        >
                            Reset Progress
                        </button>
                    )}
                </div>

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl border border-white/10 p-8 md:px-8 md:py-6">
                    <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${colors.bg} rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50`} />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                        <div className="flex items-start gap-6">
                            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center p-2 backdrop-blur-md shadow-2xl shadow-${colorKey}-500/10`}>
                                <img src={interview.icon} alt={interview.company} className="w-full h-full object-contain" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{interview.company} {interview.role}</h1>
                                <div className="flex items-center gap-4 text-slate-400">
                                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{interview.totalDuration}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">{interview.level}</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 items-center justify-center'>
                            <div className="w-[200px] flex flex-col gap-2 p-3 rounded-lg bg-slate-800/30">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-400">Progress</span>
                                    <span className="text-sm font-medium text-cyan-400">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                                    <div
                                        className={`bg-${colors.accent.split(' ')[0].replace('from-', '')} h-1.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                            {progress > 0 && <div className="w-[200px] flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                                <span className="text-sm text-slate-400">Current Score</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                                    <span className="text-sm font-medium text-white">{currentScore}/10</span>
                                </div>
                            </div>}
                            {progress > 0 && <button
                                onClick={() => setShowDetailsPopup(true)}
                                className="w-[200px] flex items-center justify-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:text-blue-300 transition-colors cursor-pointer">
                                View Details
                            </button>}

                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Left Column: Details & Skills */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Role Overview Card */}
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 space-y-4 h-full">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                    Role Overview
                                </h2>
                                <p className="text-slate-400 leading-relaxed text-base">
                                    {interview.overview}
                                </p>
                            </div>

                            {/* Skills Card */}
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 space-y-4 h-full">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                    Required Skills
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {(interview.skills || ['Data Structures', 'Algorithms', 'System Design']).map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm hover:border-slate-600 transition-colors cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rounds Section */}
                        <div className="space-y-6 pt-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className={`w-1 h-6 rounded-full bg-gradient-to-b ${colors.accent}`} />
                                Interview Rounds ({rounds.length})
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rounds.map((round) => (
                                    <div key={round.id} className="relative group p-4 rounded-xl border border-slate-800 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col h-full">
                                        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-slate-800/30 rounded-full blur-[40px]" />

                                        <div className="relative z-10 flex flex-col items-start gap-2 flex-grow">
                                            <div className="w-full flex items-center justify-between gap-4 mb-4">
                                                <div className={`w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700/50 transition-all shadow-inner`}>
                                                    <round.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-800">
                                                    {round.duration}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{round.title}</h3>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {round.type.split(',').map((t, i) => (
                                                    <span key={i} className="text-[10px] font-medium text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                                {round.desc}
                                            </p>
                                        </div>
                                        <div className="relative z-10 flex gap-3 w-full mt-auto pt-2">
                                            <button
                                                onClick={() => startRound(round.key)}
                                                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm border border-slate-700/50">
                                                {completedRounds[round.key] ? "Retry" : "Start Round"}
                                            </button>
                                            {completedRounds[round.key] && (
                                                <button
                                                    onClick={() => navigate('/dashboard/interview/feedback', { state: completedRounds[round.key] })}
                                                    className={`flex-1 px-4 py-2 rounded-xl bg-slate-800/50 border ${colors.border} ${colors.text} font-semibold hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center gap-2 text-sm group/btn`}>
                                                    View Details
                                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Completed Rounds Details Popup */}
            {showDetailsPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h2 className="text-xl font-bold text-white">Completed Rounds</h2>
                            <button
                                onClick={() => setShowDetailsPopup(false)}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {rounds.filter(r => completedRounds[r.key]).map((round) => {
                                const details = completedRounds[round.key];
                                // Use dbScore from our map modification, or fallback to parsing if present, or 0.
                                // If details.overallScore is available from feedback_data, we can use that if normalized.
                                // However, let's use the DB score we specifically fetched and stored.
                                // Note: details.dbScore was added in our modified map logic.
                                const score = details.dbScore !== undefined ? details.dbScore : 0;

                                return (
                                    <div key={round.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400`}>
                                                <round.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-white">{round.title}</h3>
                                                <p className="text-xs text-slate-400">{new Date(details.timestamp || Date.now()).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-bold ${score >= 8 ? 'text-green-400' :
                                                score >= 5 ? 'text-cyan-400' :
                                                    'text-yellow-400'
                                                }`}>
                                                {score}/10
                                            </span>
                                            <p className="text-xs text-slate-500">Score</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewDetails;
