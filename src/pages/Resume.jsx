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
    Trash2,
    AlertCircle,
    Check,
    Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import ResumeHero from '../components/ResumeHero';
import resumeats from '../assets/images/resumeats.png';

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
                body: JSON.stringify({ pdfBase64: base64, jobRole, jobDescription })
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



    return (
        <div className='min-h-screen bg-black selection:bg-cyan-500/30'>
            <Navbar />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24'>

                {/* Hero Section */}
                <ResumeHero />

                {/* Features Section 1 - Get ATS Score (Left Text, Right Image) */}
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                Get ATS Score
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                Upload your resume to check its compatibility with Applicant Tracking Systems and get a detailed score.
                            </p>
                        </div>
                        <ul className="space-y-3">
                            {['ATS Optimization', 'Smart Analysis', 'Instant Feedback'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-blue-400" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setAtsPopupEnabled(true)} className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500/90 to-blue-500/90 border border-blue-500/30 hover:opacity-90 transition-all">
                            Check Score
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>


                        {atsPopupEnabled && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 animate-fade-in">
                                <div className={`animate-scale-up w-full ${analysisResult ? 'max-w-4xl' : 'max-w-xl'} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500`}>
                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <BarChart3 className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white">
                                                {analysisResult ? 'Analysis Results' : 'ATS Analysis'}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAtsPopupEnabled(false);
                                                setAnalysisResult(null);
                                            }}
                                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    {analysisResult ? (
                                        <div className="p-0 flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar">
                                            {/* Score Header */}
                                            <div className="bg-slate-950/50 p-8 border-b border-slate-800">
                                                <div className="flex flex-col md:flex-row items-center gap-8">
                                                    <div className="relative group">
                                                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity" />
                                                        <div className="relative w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center shadow-2xl">
                                                            <div className="text-center">
                                                                <span className="text-4xl font-bold text-white block">{analysisResult.atsScore}</span>
                                                                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">ATS Score</span>
                                                            </div>
                                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                                <circle
                                                                    cx="50"
                                                                    cy="50"
                                                                    r="46"
                                                                    fill="none"
                                                                    stroke="#1e293b"
                                                                    strokeWidth="4"
                                                                />
                                                                <circle
                                                                    cx="50"
                                                                    cy="50"
                                                                    r="46"
                                                                    fill="none"
                                                                    stroke="#3b82f6"
                                                                    strokeWidth="4"
                                                                    strokeDasharray={`${2 * Math.PI * 46}`}
                                                                    strokeDashoffset={`${2 * Math.PI * 46 * (1 - analysisResult.atsScore / 100)}`}
                                                                    className="transition-all duration-1000 ease-out"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                                                        {[
                                                            { label: 'Keywords', value: analysisResult.keywordMatch, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                                                            { label: 'Formatting', value: analysisResult.formatting, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                                                            { label: 'Experience', value: analysisResult.experience, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                                            { label: 'Skills', value: analysisResult.skills, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                                        ].map((stat, i) => (
                                                            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center hover:border-slate-700 transition-colors">
                                                                <div className={`mb-2 mx-auto w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center font-bold`}>
                                                                    {stat.value}%
                                                                </div>
                                                                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 grid gap-8">
                                                {/* Recommendations */}
                                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                                                        AI Recommendation
                                                    </h3>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        {analysisResult.recommendations || "No recommendations available."}
                                                    </p>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    {/* Strengths */}
                                                    <div className="space-y-4">
                                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-green-400" />
                                                            </div>
                                                            Strengths
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {(analysisResult.strengths || []).map((strength, i) => (
                                                                <div key={i} className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                                                                    <p className="text-sm text-slate-300">{strength}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Improvements */}
                                                    <div className="space-y-4">
                                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                                            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">
                                                                <AlertCircle className="w-3 h-3 text-amber-400" />
                                                            </div>
                                                            Improvements Needed
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {(analysisResult.improvements || []).map((improvement, i) => (
                                                                <div key={i} className="flex items-start gap-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                                                    <p className="text-sm text-slate-300">{improvement}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Missing Keywords */}
                                                {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                                                            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                                                                <Target className="w-3 h-3 text-red-400" />
                                                            </div>
                                                            Missing Keywords
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(analysisResult.missingKeywords || []).map((keyword, i) => (
                                                                <div key={i} className="px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium">
                                                                    {keyword}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3 sticky bottom-0">
                                                <button
                                                    onClick={() => setAnalysisResult(null)}
                                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Analyze Another
                                                </button>
                                                <button
                                                    onClick={() => setAtsPopupEnabled(false)}
                                                    className="px-6 py-2 rounded-lg bg-slate-800 text-white font-medium text-sm hover:bg-slate-700 transition-colors"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                            <div className="text-center space-y-2 mb-8">
                                                <h3 className="text-lg font-medium text-white">Upload your Resume</h3>
                                                <p className="text-slate-400 text-sm">Upload your resume (PDF or DOCX) to get a detailed compatibility score and improvement suggestions.</p>
                                            </div>

                                            <div className="space-y-6 mb-8">
                                                {/* Job Role Dropdown */}
                                                <div className="space-y-2 relative" ref={dropdownRef}>
                                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                                        <Briefcase className="w-4 h-4 text-blue-400" />
                                                        Job Role
                                                        <span className="text-red-400 text-xs">*</span>
                                                    </label>

                                                    <div
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="w-full rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-white focus:outline-none cursor-pointer hover:border-slate-600 flex items-center justify-between"
                                                    >
                                                        <span className={jobRole ? "text-white" : "text-slate-500"}>
                                                            {jobRole || "Select a role..."}
                                                        </span>
                                                        <svg className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>

                                                    {isDropdownOpen && (
                                                        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden max-h-60 flex flex-col">
                                                            <div className="p-2 border-b border-slate-700 sticky top-0 bg-slate-900">
                                                                <input
                                                                    type="text"
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                    placeholder="Search roles..."
                                                                    autoFocus
                                                                    className="w-full rounded-lg bg-slate-800 border-none px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>
                                                            <div className="overflow-y-auto max-h-48 custom-scrollbar">
                                                                {filteredRoles.length > 0 ? (
                                                                    filteredRoles.map((role) => (
                                                                        <button
                                                                            key={role}
                                                                            onClick={() => handleRoleSelect(role)}
                                                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                                                                        >
                                                                            {role}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                                        No roles found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Job Description */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                                        <FileText className="w-4 h-4 text-blue-400" />
                                                        Job Description
                                                        <span className="text-slate-500 text-xs">(Entering job description will get you more accurate results)</span>
                                                    </label>
                                                    <textarea
                                                        value={jobDescription}
                                                        onChange={(e) => setJobDescription(e.target.value)}
                                                        rows={3}
                                                        placeholder="Paste the job description for better analysis..."
                                                        className="w-full resize-none rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-slate-600"
                                                    />
                                                </div>
                                            </div>

                                            {!resume ? (
                                                <label className="relative flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-blue-500/50 transition-all cursor-pointer group overflow-hidden">
                                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative flex flex-col items-center gap-4 text-center p-6">
                                                        <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/30 transition-all shadow-xl">
                                                            <Upload className="w-8 h-8 text-blue-400" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium text-white">
                                                                <span className="text-blue-400">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                PDF, DOCX up to 10MB
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
                                                <div className="w-full h-96 rounded-2xl border border-slate-700 bg-slate-800/50 overflow-hidden flex flex-col">
                                                    <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-900/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                                                                <FileIcon className="w-4 h-4" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-sm font-medium text-white truncate max-w-[200px]">{resume.name}</p>
                                                                <p className="text-xs text-slate-500">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={clearResume}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 bg-slate-900 relative">
                                                        {resumePreviewUrl ? (
                                                            <iframe
                                                                src={resumePreviewUrl}
                                                                className="w-full h-full"
                                                                title="Resume Preview"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-2">
                                                                <FileText className="w-12 h-12 opacity-50" />
                                                                <p>Preview not available</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-8 flex justify-end gap-3">
                                                <button
                                                    onClick={() => setAtsPopupEnabled(false)}
                                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleAnalyzeResume}
                                                    disabled={!resume || !jobRole || isAnalyzing}
                                                    className={`px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 ${(!resume || !jobRole || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    {isAnalyzing ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            <span>Analyzing...</span>
                                                        </div>
                                                    ) : (
                                                        'Analyze Resume'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {/* End Content */}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-xl group hover:border-blue-500/30 transition-colors duration-500">
                            <img src={resumeats} alt="" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                {/* Features Section 2 - Improve Resume (Right Text, Left Image) */}
                {/* <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                Improve Resume
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                Let our AI analyze and suggest improvements to make your resume stand out to recruiters.
                            </p>
                        </div>
                        <ul className="space-y-3">
                            {['AI Analysis', 'Improve Formatting', 'Content Suggestions'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-purple-400" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500/90 to-pink-500/90 border border-purple-500/30 hover:opacity-90 transition-all">
                            Enhance Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-xl group hover:border-purple-500/30 transition-colors duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />
                            </div>
                            <div className="absolute inset-x-8 inset-y-8 border border-slate-800 rounded-xl bg-slate-900/50 p-6 flex flex-col gap-4">
                                <div className="h-8 w-1/3 bg-slate-800 rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-4 pt-4">
                                    <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse delay-75" />
                                    <div className="h-4 w-5/6 bg-slate-800/50 rounded animate-pulse delay-100" />
                                    <div className="h-4 w-4/6 bg-slate-800/50 rounded animate-pulse delay-150" />
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800/50" />
                                        <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800/50" />
                                    </div>
                                </div>
                                <div className="absolute -right-4 top-12 px-6 py-3 rounded-xl bg-slate-900 border border-purple-500/30 shadow-2xl transform rotate-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                        <span className="text-purple-400 font-bold">AI Enhanced</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Features Section 3 - Create New (Left Text, Right Image) */}
                {/* <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                Create New
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                Start from scratch with our professional templates designed to pass ATS filters.
                            </p>
                        </div>
                        <ul className="space-y-3">
                            {['Professional Templates', 'Drag & Drop Builder', 'Export to PDF'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-cyan-400" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500/90 to-teal-500/90 border border-cyan-500/30 hover:opacity-90 transition-all">
                            Start Building
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-xl group hover:border-cyan-500/30 transition-colors duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
                            </div>
                            <div className="absolute inset-x-8 inset-y-8 border border-slate-800 rounded-xl bg-slate-900/50 p-6 flex flex-col gap-4">
                                <div className="h-8 w-1/3 bg-slate-800 rounded-lg animate-pulse" />
                                <div className="flex-1 space-y-4 pt-4">
                                    <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse delay-75" />
                                    <div className="h-4 w-5/6 bg-slate-800/50 rounded animate-pulse delay-100" />
                                    <div className="h-4 w-4/6 bg-slate-800/50 rounded animate-pulse delay-150" />
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800/50" />
                                        <div className="h-24 bg-slate-800/30 rounded-lg border border-slate-800/50" />
                                    </div>
                                </div>
                                <div className="absolute -right-4 top-12 px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-2xl transform rotate-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                        <span className="text-cyan-400 font-bold">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </main>
        </div>
    );
};

export default Resume;