import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Star, Clock, ChevronRight, TrendingUp, Filter, Layers } from 'lucide-react';
import Navbar from "../components/Navbar";
import PopularInterviewsHero from "../components/PopularInterviewsHero";

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
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interviews`);
                const allData = await response.json();

                if (!response.ok) throw new Error(allData.error || "Failed to fetch interviews");

                if (allData.length > 0) {
                    // Normalize data: map icon_link to icon_url
                    const normalizedData = allData.map(item => ({
                        ...item,
                        icon_url: item.icon_link
                    }));

                    const companies = [...new Set(normalizedData.map(item => item.company))].sort();
                    const levels = [...new Set(normalizedData.map(item => item.level))].sort();

                    setUniqueCompanies(companies);
                    setUniqueLevels(levels);

                    const sortedData = normalizedData.sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
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
                            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Popular Interviews</h1>
                            <p className="text-gray-500 mt-1 font-medium">Explore trending interview simulations</p>
                        </div>
                    </div>
                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-500 text-sm font-medium shadow-sm">
                            <Filter className="w-4 h-4" />
                            <span>Filters:</span>
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 shadow-sm"
                        >
                            <option value="All">All Roles</option>
                            {ROLE_CATEGORIES.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 shadow-sm"
                        >
                            <option value="All">All Companies</option>
                            {uniqueCompanies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 shadow-sm"
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
                                className="text-sm text-gray-500 hover:text-gray-900 font-medium px-2 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => {
                            return (
                                <div
                                    key={interview.id}
                                    className="relative group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col p-6 space-y-5"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                                <img src={interview.icon_url} alt="" className="w-8 h-8 object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-1">
                                                    {interview.company} - {interview.role}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 font-medium">
                                                    <span>{interview.level}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 py-4 border-t border-gray-50 mt-auto">
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="w-4 h-4 text-cyan-500" />
                                            <span className="text-sm text-gray-600 font-medium">{interview.rounds?.length || 0} Rounds</span>
                                        </div>
                                        {/* <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm text-gray-600 font-medium">4.8</span>
                                        </div> */}
                                        <div className="flex items-center gap-1.5 ml-auto">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600 font-medium">{interview.total_duration} minutes</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => navigate(`/dashboard/interview-details/${interview.id}?type=${interview.type}`)}
                                        className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:border-gray-200">
                                        View Details
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500">
                                <TrendingUp className="w-10 h-10 mb-4 opacity-50 text-gray-400" />
                                <p className="text-lg font-bold text-gray-900">No interviews found</p>
                                <p className="text-sm font-medium mt-1">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PopularInterviewsPage;
