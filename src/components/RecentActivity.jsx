import React, { useEffect, useState } from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (!userCreds?.id) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/completed-interviews/curated?userId=${userCreds.id}`);
                if (response.ok) {
                    const data = await response.json();

                    // Transform data to match UI needs
                    const formattedData = data.slice(0, 3).map(item => ({
                        id: item.id,
                        title: `${item.company || 'Tech'} ${item.type.toUpperCase()} Mock Interview`,
                        score: item.score || 0,
                        // Generate tags based on score or type if not present in DB, simplistic for now
                        tags: item.score >= 8 ? ["STRONG TECHNICAL"] : ["NEEDS IMPROVEMENT"],
                        tagColors: item.score >= 8 ? ["text-green-600 bg-green-50"] : ["text-yellow-600 bg-yellow-50"],
                        time: new Date(item.completed_at).toLocaleDateString(),
                        rawDate: new Date(item.completed_at),
                        reportData: item.report_data,
                        originalItem: item
                    }));
                    setActivities(formattedData);
                }
            } catch (error) {
                console.error("Failed to fetch recent activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return (
            <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm h-full flex items-center justify-center p-10">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-20 w-full bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            {/* Subtle Textured Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            <div className="relative z-10 px-8 py-10 md:px-12 space-y-6 flex-1 flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>

                {/* Activity List */}
                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <div
                                key={activity.id}
                                onClick={() => navigate(`/report`, {
                                    state: {
                                        isPastInterview: true,
                                        reportData: activity.reportData,
                                        completedAt: activity.originalItem.completed_at,
                                        type: activity.originalItem.type,
                                        role: activity.originalItem.job_role || activity.originalItem.title || 'Candidate',
                                        firstName: 'Candidate'
                                    }
                                })}
                                className="group p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-2xl font-bold ${activity.score >= 7 ? 'text-green-600' : 'text-gray-900'}`}>{activity.score}</span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-black transition-colors">
                                                    {activity.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{activity.time}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500 text-sm">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No recent interviews</p>
                        </div>
                    )}
                </div>

                {/* Footer Link */}
                <button
                    onClick={() => navigate('/dashboard/all-previous-interviews')}
                    className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                    View Full History →
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;
