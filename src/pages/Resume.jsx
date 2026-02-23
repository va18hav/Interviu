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
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ResumeHero from '../components/ResumeHero';
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
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));

            if (userCreds?.id) {
                setUser(userCreds);

                // Fetch past resumes
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resume-analyses?userId=${userCreds.id}`);
                const data = await response.json();

                if (response.ok) {
                    setPastResumes(data || []);
                } else {
                    console.error('Error fetching resumes:', data.error);
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze-resume`, {
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

            // Save to Backend
            if (user?.id) {
                try {
                    const saveResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/resume-analyses`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            jobRole: jobRole,
                            fileName: resume.name,
                            atsScore: analysis.atsScore,
                            analysisResult: analysis
                        })
                    });

                    const savedData = await saveResponse.json();

                    if (!saveResponse.ok) {
                        console.error('Error saving analysis:', savedData.error);
                    } else {
                        setPastResumes([savedData, ...pastResumes]);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resume-analyses/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                console.error("Error deleting analysis:", data.error);
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
            <div className='min-h-screen bg-[#fafafa] selection:bg-indigo-500/30 overflow-x-hidden relative'>
                {/* Cinematic Background Orbs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-3xl opacity-50" />
                </div>

                <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 relative z-10'>

                    {/* Hero Section */}
                    <ResumeHero onButtonClick={() => setAtsPopupEnabled(true)} buttonText="Check Resume Score" />

                    {/* Past Resume Cards Section */}
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Archive Protocol</p>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Previous Scans</h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastResumes.length > 0 ? (
                                pastResumes.map((item, index) => (
                                    <motion.div
                                        key={item.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.05 }}
                                        className="group relative rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-md overflow-hidden hover:border-indigo-400/50 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-1 will-change-transform"
                                    >
                                        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-500/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />

                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                        {item.job_role}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                        <FileIcon className="w-3.5 h-3.5" />
                                                        <span className="truncate max-w-[150px]">{item.file_name}</span>
                                                    </div>
                                                </div>

                                                <div className="shrink-0">
                                                    {item.ats_score && (
                                                        <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${item.ats_score >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' :
                                                            item.ats_score >= 60 ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' :
                                                                'bg-rose-50 text-rose-600 border border-rose-100/50'
                                                            }`}>
                                                            {item.ats_score}
                                                            <span className="text-[8px] absolute -bottom-1 -right-1 bg-white border border-inherit px-1 rounded-sm">%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                                <button
                                                    onClick={() => {
                                                        setAnalysisResult(item.analysis_result);
                                                        setAtsPopupEnabled(true);
                                                    }}
                                                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-all group/btn"
                                                >
                                                    View Protocol
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>

                                                <button
                                                    className='text-xs font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors p-2'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(item.id);
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6">
                                        <FilePlus className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Zero Data Detected</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium">Initialize your first scan to populate this archive protocol.</p>
                                </div>
                            )}
                        </div>
                    </div>




                    <AnimatePresence>
                        {atsPopupEnabled && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className={`w-full ${analysisResult ? 'max-w-6xl' : 'max-w-3xl'} bg-white/95 backdrop-blur-lg rounded-[3rem] shadow-[0_40px_100px_-12px_rgba(0,0,0,0.25)] border border-white/60 overflow-hidden flex flex-col max-h-[90vh] relative will-change-transform`}
                                >
                                    {/* Modal Header */}
                                    <div className="px-8 md:px-12 py-8 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 bg-white/50 backdrop-blur-xl">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                                {analysisResult ? <BarChart3 className="w-7 h-7" /> : <Upload className="w-7 h-7" />}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                                    {analysisResult ? 'Analysis Protocol' : 'Initialize Analysis'}
                                                </h2>
                                                <p className="text-xs text-indigo-600 font-black uppercase tracking-[0.2em]">
                                                    {analysisResult ? 'Automated Diagnostic Suite v2.0' : 'Secure Document Uplink'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAtsPopupEnabled(false);
                                                setAnalysisResult(null);
                                            }}
                                            className="w-12 h-12 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center group/close"
                                        >
                                            <X className="w-6 h-6 group-hover/close:rotate-90 transition-transform" />
                                        </button>
                                    </div>

                                    {/* Modal Content */}
                                    {analysisResult ? (
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                                                {/* Left Column: Scores & Metrics */}
                                                <div className="lg:col-span-4 space-y-10">
                                                    {/* Cinematic Score Ring */}
                                                    <div className="relative aspect-square w-full max-w-[280px] mx-auto group">
                                                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                                                            <circle
                                                                cx="50%" cy="50%" r="44%"
                                                                stroke="currentColor" strokeWidth="6" fill="none"
                                                                className="text-slate-50"
                                                            />
                                                            <motion.circle
                                                                cx="50%" cy="50%" r="44%"
                                                                stroke="currentColor" strokeWidth="8" fill="none"
                                                                initial={{ strokeDasharray: "277", strokeDashoffset: "277" }}
                                                                animate={{ strokeDashoffset: 277 - (277 * analysisResult.atsScore / 100) }}
                                                                transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                                                                className={`${analysisResult.atsScore >= 80 ? 'text-emerald-500' : analysisResult.atsScore >= 60 ? 'text-indigo-600' : 'text-rose-500'}`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <motion.span
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.8 }}
                                                                className={`text-7xl font-black tracking-tighter ${analysisResult.atsScore >= 80 ? 'text-emerald-600' : analysisResult.atsScore >= 60 ? 'text-indigo-600' : 'text-rose-600'}`}
                                                            >
                                                                {analysisResult.atsScore}
                                                            </motion.span>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] -mt-1">Compatibility %</span>
                                                        </div>
                                                    </div>

                                                    {/* Metrics breakdown */}
                                                    <div className="space-y-6">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Sub-Metric Diagnostics</p>
                                                        <div className="grid gap-6">
                                                            {[
                                                                { label: 'Keyword Density', value: analysisResult.keywordMatch, color: 'bg-indigo-600' },
                                                                { label: 'Structural Format', value: analysisResult.formatting, color: 'bg-cyan-500' },
                                                                { label: 'Domain Authority', value: analysisResult.experience, color: 'bg-emerald-500' },
                                                                { label: 'Competency Mapping', value: analysisResult.skills, color: 'bg-purple-500' }
                                                            ].map((stat, i) => (
                                                                <div key={i} className="space-y-2">
                                                                    <div className="flex justify-between items-end">
                                                                        <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{stat.label}</span>
                                                                        <span className="text-xs font-black text-slate-900">{stat.value}%</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${stat.value}%` }}
                                                                            transition={{ duration: 1.5, ease: "circOut", delay: 1 + (i * 0.1) }}
                                                                            className={`h-full rounded-full ${stat.color}`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Column: Insights & Content */}
                                                <div className="lg:col-span-8 space-y-12">
                                                    {/* Strategy Section */}
                                                    <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none" />
                                                        <div className="flex items-center gap-4 mb-6 relative z-10">
                                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                                <Sparkles size={20} />
                                                            </div>
                                                            <h3 className="text-xl font-black text-white tracking-tight">AI Enhancement Strategy</h3>
                                                        </div>
                                                        <p className="text-slate-300 leading-relaxed font-medium relative z-10">
                                                            {analysisResult.recommendations}
                                                        </p>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-8">
                                                        {/* Strengths */}
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 border-b border-emerald-100 pb-4">
                                                                <ThumbsUp className="w-5 h-5 text-emerald-500" />
                                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Protocol Strengths</h3>
                                                            </div>
                                                            <ul className="space-y-4">
                                                                {(analysisResult.strengths || []).map((item, i) => (
                                                                    <li key={i} className="flex gap-3 items-start group">
                                                                        <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                                            <Check size={12} strokeWidth={4} />
                                                                        </div>
                                                                        <span className="text-sm font-medium text-slate-600 leading-snug">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        {/* Improvements */}
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
                                                                <ArrowDown className="w-5 h-5 text-amber-500" />
                                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Optimization Needed</h3>
                                                            </div>
                                                            <ul className="space-y-4">
                                                                {(analysisResult.improvements || []).map((item, i) => (
                                                                    <li key={i} className="flex gap-3 items-start group">
                                                                        <div className="w-5 h-5 rounded-md bg-amber-50 flex items-center justify-center text-amber-600 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                                                            <AlertCircle size={12} strokeWidth={3} />
                                                                        </div>
                                                                        <span className="text-sm font-medium text-slate-600 leading-snug">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Missing Keywords */}
                                                    {analysisResult.missingKeywords?.length > 0 && (
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
                                                                <Target className="w-5 h-5 text-rose-500" />
                                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Target Keywords Missing</h3>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {analysisResult.missingKeywords.map((tag, i) => (
                                                                    <span key={i} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 transition-all cursor-default">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16 bg-white shrink-0">
                                            <div className="max-w-3xl mx-auto space-y-12">
                                                {/* Form Inputs */}
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-3 relative" ref={dropdownRef}>
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Target Designation</label>
                                                        <div
                                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-black text-slate-900 focus:outline-none cursor-pointer hover:bg-white hover:border-indigo-600 transition-all flex items-center justify-between"
                                                        >
                                                            <span className={jobRole ? "text-slate-900" : "text-slate-400"}>
                                                                {jobRole || "SELECT ROLE..."}
                                                            </span>
                                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                        </div>
                                                        <AnimatePresence>
                                                            {isDropdownOpen && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 10 }}
                                                                    className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-2xl overflow-hidden max-h-60 flex flex-col"
                                                                >
                                                                    <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                                                                        <div className="relative">
                                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                            <input
                                                                                type="text"
                                                                                value={searchTerm}
                                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                                placeholder="SEARCH PROTOCOLS..."
                                                                                className="w-full rounded-xl bg-white border-none pl-10 pr-4 py-2.5 text-xs font-black text-slate-900 uppercase tracking-widest focus:outline-none"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="overflow-y-auto custom-scrollbar">
                                                                        {filteredRoles.map((role) => (
                                                                            <button
                                                                                key={role}
                                                                                onClick={() => handleRoleSelect(role)}
                                                                                className="w-full text-left px-5 py-3 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors"
                                                                            >
                                                                                {role}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Project Metadata <span className="text-slate-300 font-medium lowercase">(optional)</span></label>
                                                        <textarea
                                                            value={jobDescription}
                                                            onChange={(e) => setJobDescription(e.target.value)}
                                                            rows={1}
                                                            placeholder="PASTE JOB DESCRIPTION..."
                                                            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all min-h-[56px]"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Upload Area */}
                                                {!resume ? (
                                                    <label className="relative flex flex-col items-center justify-center w-full h-80 rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-600 transition-all cursor-pointer group">
                                                        <div className="flex flex-col items-center gap-6 text-center">
                                                            <div className="w-24 h-24 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-indigo-500/10 transition-all duration-500">
                                                                <Upload className="w-10 h-10 text-indigo-600" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-xl font-black text-slate-900 tracking-tight">Deployment Input</p>
                                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">PDF / DOCX protocol only • Standard 10MB</p>
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
                                                    <div className="w-full h-96 rounded-[3rem] border border-slate-200 bg-slate-50 overflow-hidden flex flex-col shadow-inner relative">
                                                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                                    <FileText className="w-6 h-6" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px]">{resume.name}</p>
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(resume.size / 1024 / 1024).toFixed(2)} MEGABYTES</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    clearResume();
                                                                }}
                                                                className="w-10 h-10 rounded-full hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all flex items-center justify-center group/del"
                                                            >
                                                                <X className="w-5 h-5 group-hover/del:scale-110" />
                                                            </button>
                                                        </div>
                                                        <div className="flex-1 bg-slate-100 relative overflow-hidden">
                                                            {resumePreviewUrl ? (
                                                                <iframe
                                                                    src={resumePreviewUrl}
                                                                    className="w-full h-full"
                                                                    title="Protocol Preview"
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 flex-col gap-4">
                                                                    <FileIcon className="w-16 h-16 opacity-30" />
                                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Visualizer Unavailable</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Modal Footer */}
                                    <div className="px-8 md:px-12 py-8 bg-slate-50 flex justify-end gap-6 sticky bottom-0 z-20 border-t border-slate-200/50">
                                        <button
                                            onClick={() => {
                                                setAtsPopupEnabled(false);
                                                setAnalysisResult(null);
                                            }}
                                            className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors"
                                        >
                                            {analysisResult ? 'Dismiss' : 'Cancel Uplink'}
                                        </button>
                                        <button
                                            onClick={analysisResult ? () => setAnalysisResult(null) : handleAnalyzeResume}
                                            disabled={!analysisResult && (!resume || !jobRole || isAnalyzing)}
                                            className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center gap-3 ${analysisResult
                                                ? 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:shadow-lg'
                                                : isAnalyzing
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-500/20 active:translate-y-0.5'
                                                }`}
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    <span>Diagnostic In Progress...</span>
                                                </>
                                            ) : analysisResult ? (
                                                <>
                                                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>Analyze New Protocol</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 className="w-3.5 h-3.5" />
                                                    <span>Initialize Diagnostic</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </main>
            </div>
        </>
    );
};

export default Resume;