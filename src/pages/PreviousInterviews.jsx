import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ChevronRight, Trash2, Loader2, Clock as ClockIcon } from 'lucide-react';
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";

const PreviousInterviews = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [interviews, setInterviews] = React.useState([]);

    React.useEffect(() => {
        fetchInterviews();
    }, []);

    async function fetchInterviews() {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('interviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                // Filter out popular interviews (those with roundKey or roundId)
                const customInterviews = data.filter(interview =>
                    !interview.feedback_data?.roundKey && !interview.feedback_data?.roundId
                );
                setInterviews(customInterviews);
            }

        } catch (error) {
            console.error("Error fetching interviews:", error.message);
        } finally {
            setLoading(false);
        }
    }

    async function deleteInterview(id, e) {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this interview record?")) return;

        try {
            setInterviews(prev => prev.filter(i => i.id !== id));
            const { error } = await supabase
                .from('interviews')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting:", error.message);
            fetchInterviews();
        }
    }

    function viewInterview(interview) {
        navigate("/dashboard/feedback", { state: interview.feedback_data });
    }

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-cyan-600";
        return "text-amber-600";
    };

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-green-50 border-green-200";
        if (score >= 60) return "bg-cyan-50 border-cyan-200";
        return "bg-amber-50 border-amber-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Previous Interviews</h1>
                        <p className="text-slate-500 mt-1">Review your practice history and track your progress</p>
                    </div>
                </div>

                {interviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {interviews.map((interview) => (
                            <div
                                key={interview.id}
                                onClick={() => viewInterview(interview)}
                                className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-cyan-200 transition-all duration-300 cursor-pointer relative py-3 overflow-hidden"
                            >
                                <div className="p-6 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                                                {interview.role}
                                            </h4>
                                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(interview.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg border ${getScoreBg(interview.score)}`}>
                                            <span className={`text-sm font-bold ${getScoreColor(interview.score)}`}>
                                                {interview.score}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-500">{interview.duration}</span>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white via-white to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between border-t border-slate-100">
                                        <span className="text-cyan-600 text-sm font-bold flex items-center gap-1">
                                            View Details <ChevronRight className="w-4 h-4" />
                                        </span>
                                        <button
                                            onClick={(e) => deleteInterview(interview.id, e)}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                                            title="Delete Interview"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4 border border-slate-100">
                            <Clock className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No interviews found</h3>
                        <p className="text-slate-500 mb-6">You haven't completed any practice interviews yet.</p>
                        <button
                            onClick={() => navigate('/create')}
                            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors shadow-lg shadow-slate-900/20"
                        >
                            Start New Interview
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PreviousInterviews;
