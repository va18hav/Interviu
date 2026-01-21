import React from 'react';
import Navbar from '../components/Navbar';
import {
    FileText,
    Search,
    Sparkles,
    FilePlus,
    Upload,
    Target,
    ArrowRight,
    CheckCircle,
    BarChart3,
    Wand2,
    X,
    FileIcon,
    Trash,
    Trash2,
    AlertCircle,
    Check,
    Briefcase,
    Loader2,
    ThumbsUp,
    ArrowDown,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ResumeHero from '../components/ResumeHero';
import { supabase } from '../supabaseClient';
import { sanitizeInput } from '../utils/sanitize';

const TECH_ROLES = [
    "AI Ethics Researcher",
    "AI Research Scientist",
    "Android Developer",
    "Application Security Engineer",
    "AR/VR Developer",
    "Artificial Intelligence Engineer",
    "Automation Engineer",
    "Backend Developer",
    "Big Data Engineer",
    "Bioinformatics Scientist",
    "Blockchain Developer",
    "Business Analyst",
    "Business Intelligence Analyst",
    "Business Intelligence Developer",
    "Business Systems Analyst",
    "Chief Information Officer (CIO)",
    "Chief Technology Officer (CTO)",
    "Cloud Architect",
    "Cloud Consultant",
    "Cloud Engineer",
    "Cloud Security Engineer",
    "Computer Vision Engineer",
    "Cybersecurity Analyst",
    "Cybersecurity Consultant",
    "Cybersecurity Engineer",
    "Data Analyst",
    "Data Architect",
    "Data Engineer",
    "Data Privacy Officer",
    "Data Scientist",
    "Data Warehouse Architect",
    "Database Administrator (DBA)",
    "Database Developer",
    "DevOps Engineer",
    "DevSecOps Engineer",
    "Digital Marketing Specialist",
    "Director of Engineering",
    "E-commerce Specialist",
    "Embedded Software Engineer",
    "Embedded Systems Engineer",
    "Enterprise Architect",
    "ERP Consultant",
    "Frontend Developer",
    "Full Stack Developer",
    "Game Designer",
    "Game Developer",
    "Geospatial Developer",
    "Growth Hacker",
    "Hardware Engineer",
    "Help Desk Support",
    "Information Security Analyst",
    "Information Security Manager",
    "iOS Developer",
    "IT Auditor",
    "IT Consultant",
    "IT Director",
    "IT Manager",
    "IT Project Manager",
    "IT Support Specialist",
    "Java Developer",
    "Junior Software Engineer",
    "Lead Software Engineer",
    "Linux Administrator",
    "Machine Learning Engineer",
    "Machine Learning Ops (MLOps) Engineer",
    "Mainframe Developer",
    "Mobile App Developer",
    "Mobile Developer (Android)",
    "Mobile Developer (iOS)",
    "Multimedia Artist/Animator",
    "Natural Language Processing Engineer",
    "Network Administrator",
    "Network Architect",
    "Network Engineer",
    "Network Security Engineer",
    "Penetration Tester",
    "Platform Engineer",
    "Principal Software Engineer",
    "Product Designer",
    "Product Manager",
    "Product Owner",
    "Python Developer",
    "QA Automation Engineer",
    "QA Engineer",
    "Quality Assurance Analyst",
    "Quantum Computing Researcher",
    "React Developer",
    "Release Engineer",
    "Robotics Engineer",
    "Robotics Software Engineer",
    "Sales Engineer",
    "Salesforce Administrator",
    "Salesforce Developer",
    "Scrum Master",
    "Security Analyst",
    "Security Architect",
    "Senior Software Engineer",
    "SEO Specialist",
    "Site Reliability Engineer (SRE)",
    "Software Architect",
    "Software Development Engineer in Test (SDET)",
    "Software Engineer",
    "Solutions Architect",
    "Staff Software Engineer",
    "System Administrator",
    "Systems Analyst",
    "Technical Lead",
    "Technical Program Manager",
    "Technical Recruiter",
    "Technical Support Engineer",
    "Technical Writer",
    "Telecommunications Engineer",
    "UI Designer",
    "UI/UX Designer",
    "UX Designer",
    "UX Researcher",
    "Video Game Producer",
    "Virtual Reality Developer",
    "VoIP Engineer",
    "Web Administrator",
    "Web Designer",
    "Web Developer",
    "WordPress Developer"
];

const Resume = () => {
    const navigate = useNavigate();
    const [atsPopupEnabled, setAtsPopupEnabled] = useState(false);
    const [resume, setResume] = useState(null);
    const [resumePreviewUrl, setResumePreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [pastResumes, setPastResumes] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfileAndResumes();
    }, []);

    async function getProfileAndResumes() {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);

                // Fetch past resumes
                const { data, error } = await supabase
                    .from('resume_analyses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching resumes:', error);
                } else {
                    setPastResumes(data || []);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    // New State for Job Role and Description
    const [jobRole, setJobRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Filter roles
    const filteredRoles = TECH_ROLES.filter(role =>
        role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle role selection
    const handleRoleSelect = (role) => {
        setJobRole(role);
        setIsDropdownOpen(false);
        setSearchTerm("");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    function handleResumeChange(event) {
        const file = event.target.files[0];
        if (file) {
            setResume(file);
            console.log(file);

            // Create preview URL for PDF
            if (file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                setResumePreviewUrl(url);
            } else {
                setResumePreviewUrl(null);
            }
        }
    };

    async function handleAnalyzeResume() {
        if (!resume) {
            // Trigger file input if no resume selected
            fileInputRef.current?.click();
            return;
        }
        const reader = new FileReader();

        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1]; // Remove data:application/pdf;base64,

            const response = await fetch('http://localhost:5000/api/analyze-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdfBase64: base64,
                    jobRole: sanitizeInput(jobRole),
                    jobDescription: sanitizeInput(jobDescription)
                })
            });

            let analysis = await response.json();

            // Handle case where backend returns a stringified JSON
            if (typeof analysis === 'string') {
                try {
                    analysis = JSON.parse(analysis);
                } catch (e) {
                    console.error("Error parsing analysis JSON:", e);
                }
            }

            setAnalysisResult(analysis);
            setIsAnalyzing(false);

            // Save to Supabase
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('resume_analyses')
                        .insert([
                            {
                                user_id: user.id,
                                job_role: jobRole,
                                file_name: resume.name,
                                ats_score: analysis.atsScore,
                                analysis_result: analysis
                            }
                        ])
                        .select();

                    if (error) {
                        console.error('Error saving analysis:', error);
                    } else if (data) {
                        setPastResumes([data[0], ...pastResumes]);
                    }
                } catch (err) {
                    console.error('Error saving to DB:', err);
                }
            }

            console.log(analysis);
        };
        setIsAnalyzing(true);
        reader.readAsDataURL(resume);
    }

    function clearResume() {
        setResume(null);
        setResumePreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this analysis?")) return;

        try {
            const { error } = await supabase
                .from('resume_analyses')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Error deleting analysis:", error);
                alert("Failed to delete analysis.");
            } else {
                setPastResumes(prev => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error("Error deleting:", err);
            alert("An error occurred.");
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                        <p className="text-slate-400 text-sm">Loading...</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-gray-50 selection:bg-blue-500/30'>
                <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24'>

                    {/* Hero Section */}
                    <ResumeHero onButtonClick={() => setAtsPopupEnabled(true)} buttonText="Check Resume Score" />

                    {/* Past Resume Cards Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-blue-600" />
                            Past Analysis
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastResumes.length > 0 ? (
                                pastResumes.map((item, index) => (
                                    <div key={item.id || index} className="group relative rounded-2xl border border-gray-200 bg-white overflow-hidden hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md">
                                        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {item.job_role}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm text-slate-500">
                                                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <FileIcon className="w-4 h-4" />
                                                        <span className="truncate max-w-[120px]">{item.file_name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center">
                                                    {item.ats_score && (
                                                        <span className={`text-xs font-bold px-4 py-2 rounded-lg ${item.ats_score >= 80 ? 'bg-green-50 text-green-700 border border-green-100' :
                                                            item.ats_score >= 60 ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                                'bg-amber-50 text-amber-700 border border-amber-100'
                                                            }`}>
                                                            {item.ats_score}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <button
                                                    onClick={() => {
                                                        setAnalysisResult(item.analysis_result);
                                                        setAtsPopupEnabled(true);
                                                    }}
                                                    className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors z-20"
                                                >
                                                    View Details
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>

                                                <button className='cursor-pointer text-sm font-medium text-slate-400 hover:text-red-600 rounded-sm p-2 z-20' onClick={() => handleDelete(item.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-slate-900 mb-1">No Past Analyses</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto text-sm">Upload a resume to get your first analysis!</p>
                                </div>
                            )}
                        </div>
                    </div>




                    {atsPopupEnabled && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                            <div className={`animate-scale-up w-full ${analysisResult ? 'max-w-5xl' : 'max-w-2xl'} bg-gray-50 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-500`}>
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between sticky top-0 z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {analysisResult ? 'Resume Analysis Report' : 'New Resume Analysis'}
                                            </h2>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {analysisResult ? 'Automated ATS Scanning & Feedback' : 'Upload your resume for detailed insights'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setAtsPopupEnabled(false);
                                            setAnalysisResult(null);
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                {analysisResult ? (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                                            {/* Sidebar - Score & Quick Stats */}
                                            <div className="lg:col-span-1 space-y-6">
                                                {/* Overall Score */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">ATS Compatibility Score</p>

                                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                                        <svg className="w-full h-full transform -rotate-90">
                                                            <circle
                                                                cx="96"
                                                                cy="96"
                                                                r="88"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                className="text-slate-100"
                                                            />
                                                            <circle
                                                                cx="96"
                                                                cy="96"
                                                                r="88"
                                                                stroke="currentColor"
                                                                strokeWidth="12"
                                                                fill="none"
                                                                strokeDasharray={`${2 * Math.PI * 88}`}
                                                                strokeDashoffset={`${2 * Math.PI * 88 * (1 - analysisResult.atsScore / 100)}`}
                                                                className={`${analysisResult.atsScore >= 80 ? 'text-emerald-500' : analysisResult.atsScore >= 60 ? 'text-blue-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <span className={`text-5xl font-bold tracking-tighter ${analysisResult.atsScore >= 80 ? 'text-emerald-700' : analysisResult.atsScore >= 60 ? 'text-blue-700' : 'text-amber-700'}`}>
                                                                {analysisResult.atsScore}
                                                            </span>
                                                            <span className="text-sm font-medium text-slate-400 mt-1">out of 100</span>
                                                        </div>
                                                    </div>

                                                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${analysisResult.atsScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        analysisResult.atsScore >= 60 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-100'
                                                        }`}>
                                                        {analysisResult.atsScore >= 80 ? 'Excellent Match' : analysisResult.atsScore >= 60 ? 'Good Match' : 'Needs Improvement'}
                                                    </div>
                                                </div>

                                                {/* Key Metrics */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                                                    <h3 className="font-bold text-slate-900 text-sm">Category Breakdown</h3>
                                                    <div className="space-y-4">
                                                        {[
                                                            { label: 'Keywords', value: analysisResult.keywordMatch, color: 'text-purple-600', bg: 'bg-purple-50' },
                                                            { label: 'Formatting', value: analysisResult.formatting, color: 'text-pink-600', bg: 'bg-pink-50' },
                                                            { label: 'Experience', value: analysisResult.experience, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                                                            { label: 'Skills', value: analysisResult.skills, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                                        ].map((stat, i) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center font-bold text-xs`}>
                                                                        {stat.value}%
                                                                    </div>
                                                                    <span className="text-sm text-slate-600 font-medium">{stat.label}</span>
                                                                </div>
                                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${stat.color.replace('text', 'bg')}`}
                                                                        style={{ width: `${stat.value}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Main Content - Findings */}
                                            <div className="lg:col-span-2 space-y-6">

                                                {/* Recommendations / Summary */}
                                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Sparkles className="w-5 h-5 text-blue-600" />
                                                        <h3 className="font-bold text-slate-900">AI Enhancement Strategy</h3>
                                                    </div>
                                                    <div className="prose prose-slate prose-sm max-w-none">
                                                        <p className="text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                                            {analysisResult.recommendations || "No specific recommendations available. Process more resumes to get better insights."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Strengths */}
                                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <ThumbsUp className="w-5 h-5 text-emerald-600" />
                                                            <h3 className="font-bold text-slate-900">Key Strengths</h3>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {(analysisResult.strengths || []).map((strength, i) => (
                                                                <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                                    <span className="leading-relaxed">{strength}</span>
                                                                </li>
                                                            ))}
                                                            {(!analysisResult.strengths || analysisResult.strengths.length === 0) && (
                                                                <li className="text-slate-400 text-sm italic">No strengths identified.</li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {/* Improvements */}
                                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <ArrowDown className="w-5 h-5 text-amber-600" />
                                                            <h3 className="font-bold text-slate-900">Areas for Improvement</h3>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {(analysisResult.improvements || []).map((improvement, i) => (
                                                                <li key={i} className="flex gap-3 text-sm text-slate-600 items-start">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                                                    <span className="leading-relaxed">{improvement}</span>
                                                                </li>
                                                            ))}
                                                            {(!analysisResult.improvements || analysisResult.improvements.length === 0) && (
                                                                <li className="text-slate-400 text-sm italic">No improvements suggested.</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Missing Keywords */}
                                                {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <Target className="w-5 h-5 text-red-500" />
                                                            <h3 className="font-bold text-slate-900">Missing Keywords</h3>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {analysisResult.missingKeywords.map((keyword, i) => (
                                                                <span key={i} className="px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
                                                                    {keyword}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <p className="mt-3 text-xs text-slate-400">
                                                            Running these keywords through your resume could significantly improve ATS detection rates.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Footer */}
                                        <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10">
                                            <button
                                                onClick={() => setAnalysisResult(null)}
                                                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                            >
                                                Analyze Another Resume
                                            </button>
                                            <button
                                                onClick={() => setAtsPopupEnabled(false)}
                                                className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all shadow-sm"
                                            >
                                                Close Report
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 overflow-y-auto custom-scrollbar bg-white h-full">
                                        <div className="max-w-2xl mx-auto space-y-8">

                                            {/* Dropdown & Description */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Job Role */}
                                                <div className="space-y-2 relative" ref={dropdownRef}>
                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                                        Target Job Role
                                                        <span className="text-red-500 text-xs">*</span>
                                                    </label>

                                                    <div
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none cursor-pointer hover:border-blue-500 hover:ring-1 hover:ring-blue-200 transition-all flex items-center justify-between"
                                                    >
                                                        <span className={jobRole ? "text-slate-900 font-medium" : "text-slate-400"}>
                                                            {jobRole || "Select a role..."}
                                                        </span>
                                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </div>

                                                    {isDropdownOpen && (
                                                        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden max-h-60 flex flex-col animate-fade-in-up">
                                                            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                                                                <div className="relative">
                                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                                    <input
                                                                        type="text"
                                                                        value={searchTerm}
                                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                                        placeholder="Search roles..."
                                                                        autoFocus
                                                                        className="w-full rounded-lg bg-gray-50 border-none pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="overflow-y-auto max-h-48 custom-scrollbar">
                                                                {filteredRoles.length > 0 ? (
                                                                    filteredRoles.map((role) => (
                                                                        <button
                                                                            key={role}
                                                                            onClick={() => handleRoleSelect(role)}
                                                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0"
                                                                        >
                                                                            {role}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-4 py-3 text-sm text-slate-400 text-center italic">
                                                                        No roles found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Job Description */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <FileText className="w-4 h-4 text-slate-400" />
                                                        Job Description
                                                        <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                                                    </label>
                                                    <textarea
                                                        value={jobDescription}
                                                        onChange={(e) => setJobDescription(e.target.value)}
                                                        rows={1}
                                                        placeholder="Paste job description for better analysis..."
                                                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all shadow-sm min-h-[48px]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Upload Zone */}
                                            {!resume ? (
                                                <label className="relative flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-blue-50/30 hover:border-blue-400 transition-all cursor-pointer group overflow-hidden">
                                                    <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/30 transition-colors duration-300" />
                                                    <div className="relative flex flex-col items-center gap-4 text-center p-8">
                                                        <div className="w-20 h-20 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:border-blue-300 group-hover:shadow-md transition-all">
                                                            <Upload className="w-8 h-8 text-blue-500" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-lg font-semibold text-slate-900">
                                                                Click to upload or drag & drop
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                Supported formats: PDF, DOCX (Max 10MB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.docx,.doc"
                                                        onChange={handleResumeChange}
                                                    />
                                                </label>
                                            ) : (
                                                <div className="w-full h-96 rounded-xl border border-gray-200 bg-slate-100 overflow-hidden flex flex-col shadow-inner">
                                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm z-10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                                                                <FileIcon className="w-5 h-5" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{resume.name}</p>
                                                                <p className="text-xs text-slate-500">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={clearResume}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 bg-slate-200 mt-0 relative">
                                                        {resumePreviewUrl ? (
                                                            <iframe
                                                                src={resumePreviewUrl}
                                                                className="w-full h-full"
                                                                title="Resume Preview"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
                                                                <FileText className="w-12 h-12 opacity-50" />
                                                                <p>Preview not available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => setAtsPopupEnabled(false)}
                                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAnalyzeResume}
                                                    disabled={!resume || !jobRole || isAnalyzing}
                                                    className={`px-8 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 ${(!resume || !jobRole || isAnalyzing) ? 'opacity-50 cursor-not-allowed transform-none shadow-none text-slate-200 bg-slate-400' : ''}`}
                                                >
                                                    {isAnalyzing ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Analyzing...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Sparkles className="w-4 h-4 text-yellow-300" />
                                                            Run Analysis
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default Resume;