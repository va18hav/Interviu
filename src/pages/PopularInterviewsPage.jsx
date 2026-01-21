import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Star, Clock, ChevronRight, TrendingUp, Filter } from 'lucide-react';
import Navbar from "../components/Navbar";
import PopularInterviewsHero from "../components/PopularInterviewsHero";
import { supabase } from "../supabaseClient";

const PopularInterviewsPage = () => {
    const navigate = useNavigate();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [roleFilter, setRoleFilter] = useState('All');
    const [companyFilter, setCompanyFilter] = useState('All');
    const [levelFilter, setLevelFilter] = useState('All');

    // Defines the broader role categories for the UI filter
    const ROLE_CATEGORIES = ['Software Engineering', 'AI/ML', 'Data', 'Cloud', 'Product Management', 'Other'];

    // Defines exact filtering options for companies and levels derived from data
    const [uniqueCompanies, setUniqueCompanies] = useState([]);
    const [uniqueLevels, setUniqueLevels] = useState([]);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('popular_interviews')
                    .select('*');

                if (error) throw error;

                if (data) {
                    const companies = [...new Set(data.map(item => item.company))].sort();
                    const levels = [...new Set(data.map(item => item.level))].sort();

                    setUniqueCompanies(companies);
                    setUniqueLevels(levels);

                    const sortedData = data.sort((a, b) => {
                        const getPriority = (role) => {
                            const r = role.toLowerCase();
                            // 1. SDE Roles
                            if (r.includes('software engineer') || r.includes('sde') || r.includes('developer') || r.includes('frontend') || r.includes('backend') || r.includes('full stack') || r.includes('ios') || r.includes('android')) return 1;
                            // 2. AI/ML Roles
                            if (r.includes('ai') || r.includes('machine learning') || r.includes('ml') || r.includes('deep learning') || r.includes('vision') || r.includes('nlp')) return 2;
                            // 3. Data Roles
                            if (r.includes('data')) return 3;
                            // 4. Others
                            return 4;
                        };

                        const priorityA = getPriority(a.role);
                        const priorityB = getPriority(b.role);

                        if (priorityA !== priorityB) {
                            return priorityA - priorityB;
                        }
                        return a.company.localeCompare(b.company);
                    });
                    setInterviews(sortedData);
                }
            } catch (error) {
                console.error("Error fetching popular interviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    // Helper to determine the category of a role
    const getRoleCategory = (roleName) => {
        const r = roleName.toLowerCase();
        if (r.includes('software engineer') || r.includes('sde') || r.includes('developer') || r.includes('frontend') || r.includes('backend') || r.includes('full stack') || r.includes('ios') || r.includes('android')) return 'Software Engineering';
        if (r.includes('ai') || r.includes('machine learning') || r.includes('ml') || r.includes('deep learning') || r.includes('vision') || r.includes('nlp')) return 'AI/ML';
        if (r.includes('data')) return 'Data';
        if (r.includes('cloud') || r.includes('devops') || r.includes('sre') || r.includes('solutions architect') || r.includes('azure')) return 'Cloud';
        if (r.includes('product') || r.includes('manager')) return 'Product Management';
        return 'Other';
    };

    // Filter Logic
    const filteredInterviews = interviews.filter(interview => {
        const category = getRoleCategory(interview.role);

        // Filter by Category if not 'All'
        const roleMatch = roleFilter === 'All' || category === roleFilter;

        const companyMatch = companyFilter === 'All' || interview.company === companyFilter;
        const levelMatch = levelFilter === 'All' || interview.level === levelFilter;
        return roleMatch && companyMatch && levelMatch;
    });

    // Helper for company colors
    const getCompanyColor = (company) => {
        const colors = {
            'Google': 'cyan',
            'Amazon': 'blue',
            'Meta': 'purple',
            'Netflix': 'red',
            'Microsoft': 'green',
            'Apple': 'cyan',
            'Nvidia': 'green'
        };
        return colors[company] || 'cyan';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">


                {/* Hero Banner */}
                <PopularInterviewsHero />

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Popular Interviews</h1>
                            <p className="text-slate-500 mt-1">Explore trending interview templates used by the community</p>
                        </div>
                    </div>
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 text-sm">
                            <Filter className="w-4 h-4" />
                            <span className="font-medium">Filters:</span>
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="All">All Roles</option>
                            {ROLE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="All">All Companies</option>
                            {uniqueCompanies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="All">All Levels</option>
                            {uniqueLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>

                        {(roleFilter !== 'All' || companyFilter !== 'All' || levelFilter !== 'All') && (
                            <button
                                onClick={() => {
                                    setRoleFilter('All');
                                    setCompanyFilter('All');
                                    setLevelFilter('All');
                                }}
                                className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline px-2"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => {
                            const colorKey = getCompanyColor(interview.company);

                            const colorClasses = {
                                cyan: { bg: "from-cyan-50 to-cyan-100", border: "border-cyan-200", text: "text-cyan-600", accent: "from-cyan-500 to-cyan-600" },
                                blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-600", accent: "from-blue-500 to-blue-600" },
                                purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-600", accent: "from-purple-500 to-purple-600" },
                                pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-600", accent: "from-pink-500 to-pink-600" },
                                green: { bg: "from-green-50 to-green-100", border: "border-green-200", text: "text-green-600", accent: "from-green-500 to-green-600" },
                                orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-600", accent: "from-orange-500 to-orange-600" },
                                red: { bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-600", accent: "from-red-500 to-red-600" }
                            };
                            const colors = colorClasses[colorKey] || colorClasses.cyan;

                            return (
                                <div
                                    key={interview.id}
                                    className="relative group rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col shadow-sm"
                                >
                                    <div className={`absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br ${colors.bg} rounded-full blur-[60px] opacity-60 -translate-y-1/2 translate-x-1/2`} />
                                    <div className="p-6 space-y-4 flex-1">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <img src={interview.icon_url} alt="" className="w-10 h-10 object-contain" />
                                        </div>

                                        {/* Header */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors mb-1">
                                                {interview.role}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className={`px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium`}>
                                                    {interview.company}
                                                </span>
                                                <span>•</span>
                                                <span>{interview.level}</span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-600">1.2k</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm text-slate-600">4.8</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-600">{interview.total_duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="p-4 pt-0">
                                        <button
                                            onClick={() => navigate(`/dashboard/interview-details/${interview.id}`)}
                                            className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-cyan-700 hover:border-cyan-200 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                                            View More
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
                                <TrendingUp className="w-10 h-10 mb-4 opacity-50" />
                                <p className="text-lg font-medium">No interviews found</p>
                                <p className="text-sm">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PopularInterviewsPage;
