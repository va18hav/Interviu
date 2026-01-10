import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Sparkles, Plus, Clock, TrendingUp, Award, Target, ChevronRight,
    Calendar, Star, Users, Code, Briefcase, Brain, Loader2, Zap, ArrowRight
} from 'lucide-react';
import logo from "../assets/images/logo.png";
import bot from "../assets/images/bot.png";
import resumebanner from '../assets/images/resumebanner.png';
import techbanner from '../assets/images/techbanner.png';
import google from "../assets/images/google.png";
import amazon from "../assets/images/amazon.png";
import meta from "../assets/images/meta.png";

// Mock Data
const MOCK_USER = {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@example.com"
};

const MOCK_CREDITS = 42;

const MOCK_PAST_INTERVIEWS = [
    {
        id: 1,
        role: "Senior Frontend Engineer",
        company: "Google",
        date: "2024-03-15",
        duration: "45m",
        score: 85,
    },
    {
        id: 2,
        role: "Backend Developer",
        company: "Amazon",
        date: "2024-03-10",
        duration: "38m",
        score: 72,
    },
    {
        id: 3,
        role: "Full Stack Engineer",
        company: "Meta",
        date: "2024-03-05",
        duration: "52m",
        score: 92,
    }
];

const MOCK_POPULAR_INTERVIEWS = [
    {
        id: 101,
        company: "Google",
        role: "Software Engineer",
        level: "L4",
        totalDuration: "45m",
        icon: google
    },
    {
        id: 102,
        company: "Amazon",
        role: "SDE II",
        level: "L5",
        totalDuration: "60m",
        icon: amazon
    },
    {
        id: 103,
        company: "Meta",
        role: "Product Engineer",
        level: "E4",
        totalDuration: "50m",
        icon: meta
    }
];

// --- High Contrast Components with Subtle White Gradients ---

const NavbarHC = ({ credits }) => {
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const userCredentials = MOCK_USER;

    return (
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50 mt-0 rounded-b-2xl w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center">
                            <img src={logo} alt="Logo" className="w-15 h-15 filter grayscale brightness-200" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-white">Inter<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">viu</span></h1>
                            <p className="hidden md:block text-xs text-neutral-400">Practice Smarter</p>
                        </div>
                    </div>

                    {/* Desktop Nav-bar */}
                    <div className='flex items-center gap-4 hidden md:flex'>
                        <Link to="/dashboard" className='text-white text-sm hover:text-neutral-300 transition-colors cursor-pointer'>Dashboard</Link>
                        <Link to="/create" className='text-white text-sm hover:text-neutral-300 transition-colors cursor-pointer'>Create</Link>
                        <Link to="/dashboard/all-popular-interviews" className='text-white text-sm hover:text-neutral-300 transition-colors cursor-pointer'>Interviews</Link>
                        <Link to="/resume" className='text-white text-sm hover:text-neutral-300 transition-colors cursor-pointer'>Resume</Link>
                    </div>

                    {/* Mobile Nav-bar */}
                    {showMobileMenu ? (<p onClick={() => setShowMobileMenu(false)} className='text-white cursor-pointer'>Close</p>)
                        : (<div onClick={() => setShowMobileMenu(true)} className="md:hidden flex flex-col justify-center gap-0.5 py-2">
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                        </div>)}

                    {/* Mobile Menu */}
                    {showMobileMenu && <div className="absolute top-18 right-3 lg:top-20 lg:right-20 bg-neutral-900 border-white/10 text-neutral-400 rounded-lg py-5 px-10 flex flex-col items-center gap-4 z-50 shadow-2xl border">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center text-xl text-black font-semibold shadow-lg">
                            {userCredentials?.firstName?.charAt(0).toUpperCase() + userCredentials?.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col items-start gap-4'>
                            <Link to="/dashboard" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-neutral-300 cursor-pointer'>Dashboard</Link>
                            <Link to="/create" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-neutral-300 cursor-pointer'>Create</Link>
                            <Link to="/dashboard/all-previous-interviews" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-neutral-300 cursor-pointer'>Interviews</Link>
                            <Link to="/resume" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-neutral-300 cursor-pointer'>Resume</Link>
                        </div>
                    </div>}

                    {/* User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4">
                            <div className="flex items-center gap-2 mr-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                                <Zap className="w-4 h-4 text-white fill-white" />
                                <span className="text-sm font-bold text-white tabular-nums">{credits}</span>
                                <span className="text-xs text-neutral-400 font-medium">credits</span>
                            </div>
                            <button onClick={() => setShowProfile(prev => !prev)} className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center text-black font-semibold shadow-lg hover:scale-105 transition-transform">
                                {showProfile ? "X" : userCredentials?.firstName?.charAt(0).toUpperCase()}
                            </button>
                        </div>
                    </div>

                    {showProfile && <div className="absolute top-20 right-5 lg:top-20 lg:right-20 bg-neutral-900 border-white/10 text-neutral-400 rounded-lg p-4 flex flex-col items-center gap-2 z-50 shadow-2xl border">
                        <div className="w-15 h-15 rounded-full bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center text-3xl text-black font-semibold shadow-lg">
                            {userCredentials?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-white font-medium">{userCredentials?.firstName + " " + userCredentials?.lastName}</p>
                        <button
                            className="w-full py-2 px-4 rounded-lg bg-white border border-white text-black hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            Log out
                        </button>
                        <button
                            className="w-full py-2 px-4 rounded-lg bg-black border border-white/20 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors mt-2"
                        >
                            Profile Settings
                        </button>
                    </div>}
                </div>
            </div>
        </header >
    )
}

const DashboardBannerHC = () => {
    const navigate = useNavigate()
    return (
        <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black to-black" />

            {/* Subtle White Glows - Replaces Colored Blurs */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 px-6 md:px-8 lg:px-16 py-6 md:py-6 lg:py-18 flex items-center justify-between">
                {/* Grayscale Bot */}
                <img src={bot} alt="" className="hidden lg:block absolute -bottom-27 -right-10 w-100 -rotate-[20deg] hover:scale-105 transition-all duration-300 filter brightness-125 contrast-125 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" />

                <div className="max-w-2xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <span className="text-white font-medium tracking-wide">AI-Powered Practice</span>
                    </div>

                    <h2 className="font-sans leading-[1.0] text-4xl md:text-5xl font-bold text-white leading-tight">
                        Ready to Ace Your
                        <br />
                        <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent pb-1">
                            Next Interview?
                        </span>
                    </h2>

                    <p className="font-space text-sm lg:text-lg text-neutral-400 leading-relaxed">
                        Practice with AI-generated interviews tailored to your specific role and company. Get instant feedback to land your dream job.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/create')}
                            className="group relative px-5 md:px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] bg-white text-black hover:scale-[1.02]">
                            <span className="relative flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Start Practice
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/dashboard/all-popular-interviews')}
                            className="hidden md:block px-8 py-4 rounded-2xl font-semibold text-base border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                            View All Interviews
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PopularInterviewsBannerHC = () => {
    const navigate = useNavigate()
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-black border border-white/10 backdrop-blur-sm'>
            {/* Background decoration - White Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-white/5 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col gap-1 items-start z-10 px-8 py-15 lg:px-16 lg:py-20 max-w-4xl space-y-8">

                    <h1 className='font-space text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight'>
                        Top Tech
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-600">
                            Interview Simulations
                        </span>
                    </h1>

                    <p className='font-space text-md lg:text-lg text-neutral-400 max-w-sm lg:max-w-xl leading-relaxed'>
                        Practice for top tech companies. Choose from our most popular and realistic interview simulations.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="bg-white/10 border border-white/20 px-8 py-4 rounded-lg text-white hover:bg-white hover:text-black font-medium text-sm flex items-center gap-1 transition-all">
                        Explore All
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div
                    className="hidden md:block relative z-20"
                >
                    <img
                        src={techbanner}
                        alt="Resume Banner"
                        className="mt-15 md:w-70 lg:w-150 object-cover filter brightness-125 contrast-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    />
                </div>
            </div>
        </div>
    )
}

const ResumeHeroHC = ({ onButtonClick }) => {
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-black border border-white/10 backdrop-blur-sm'>
            {/* Background decoration - Subtle White */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-white/10 via-white/5 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col gap-1 items-start z-10 px-8 py-20 lg:px-16 lg:py-28 max-w-4xl space-y-8">

                    <h1 className='font-space text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight'>
                        Craft a Resume that <br />
                        {/* Subtle White Gradient Text */}
                        <span className='bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent pb-1'>
                            Gets You Hired
                        </span>
                    </h1>

                    <p className='font-space text-md lg:text-lg text-neutral-400 max-w-sm lg:max-w-xl leading-relaxed'>
                        Our AI doesn't just score you—it gives you a line-by-line roadmap to beat the ATS and impress recruiters.
                    </p>

                    <button
                        onClick={onButtonClick}
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-white to-neutral-300 border border-white hover:scale-[1.02] transition-all z-20 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Check Score
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="hidden md:block relative z-20">
                    <img
                        src={resumebanner}
                        alt="Resume Banner"
                        className="md:w-70 lg:w-100 object-cover filter grayscale brightness-125 contrast-125 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    />
                </div>
            </div>
        </div>
    )
}

const DashboardBlack = () => {
    const navigate = useNavigate()
    const pastInterviews = MOCK_PAST_INTERVIEWS;

    return (
        <div className="min-h-screen bg-black">

            {/* Header */}
            <NavbarHC credits={MOCK_CREDITS} />

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

                {/* Hero Banner */}
                <DashboardBannerHC />

                {/* Past Interviews Section */}
                {pastInterviews.length > 0 ? (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Clock className="w-6 h-6 text-neutral-300" />
                                    Recent Interviews
                                </h3>
                                <p className="text-neutral-400 text-sm mt-1">Your practice history and performance</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/all-previous-interviews')}
                                className="text-white hover:text-neutral-300 font-medium text-sm flex items-center gap-1 transition-colors">
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastInterviews.slice(0, 3).map((interview) => (
                                <div
                                    key={interview.id}
                                    className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-black overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer shadow-lg"
                                >
                                    {/* Card White Gradient Glow */}
                                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-white/10 transition-colors" />

                                    <div className="p-6 space-y-4 relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                                                    {interview.role}
                                                </h4>
                                                <p className="text-sm text-neutral-400 flex items-center gap-1 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {interview.date}
                                                </p>
                                            </div>
                                            {/* Score Badge */}
                                            <div className={`px-3 py-1 rounded-lg border border-white/20 bg-white/5`}>
                                                <span className={`text-sm font-bold text-white`}>
                                                    {interview.score}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-neutral-500" />
                                                <span className="text-sm text-neutral-400">{interview.duration}</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center justify-between px-0.5">
                                            <button
                                                className="cursor-pointer py-2.5 px-6 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-sm font-medium flex items-center justify-center gap-2">
                                                View Details
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <button
                                                className="cursor-pointer py-2.5 px-6 rounded-lg border border-white/10 text-neutral-500 hover:bg-red-900/50 hover:text-white hover:border-red-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="text-center py-10 rounded-2xl border border-white/10">
                        <p className="text-slate-400 mb-2">No interviews yet.</p>
                        <p className="text-sm text-slate-500">Create your first interview to get started!</p>
                    </div>
                )}

                {/* Popular Interviews Section */}
                <section className="space-y-6">
                    <PopularInterviewsBannerHC />
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-neutral-300" />
                                Popular Interviews
                            </h3>
                            <p className="text-neutral-400 text-sm mt-1">Most practiced by the community</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_POPULAR_INTERVIEWS.map((interview) => {
                            return (
                                <div
                                    key={interview.id}
                                    className="relative group rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-black overflow-hidden hover:border-white/30 transition-all duration-300 cursor-pointer shadow-lg"
                                >
                                    {/* Card Background Gradients - White/Blue tint removed, replaced with White/Gray */}
                                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                                    <div className="p-6 space-y-4 relative z-10">
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                            <img src={interview.icon} alt="" className="w-10 h-10 filter grayscale brightness-150 contrast-125" />
                                        </div>

                                        {/* Header */}
                                        <div>
                                            <h4 className="text-lg font-semibold text-white group-hover:text-white transition-colors mb-1">
                                                {interview.company} {interview.role}
                                            </h4>
                                            <p className="text-sm text-neutral-300">{interview.level}</p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4 text-neutral-500" />
                                                <span className="text-sm text-neutral-400">1.2k</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-white fill-white" />
                                                <span className="text-sm text-neutral-400">4.8</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-neutral-500" />
                                                <span className="text-sm text-neutral-400">{interview.totalDuration}</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <button
                                            className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all text-sm font-medium flex items-center justify-center gap-2">
                                            View Details
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </section>
                <ResumeHeroHC onButtonClick={() => navigate('/resume')} />

            </main>
        </div>
    );
};

export default DashboardBlack;
