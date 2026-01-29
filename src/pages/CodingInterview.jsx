import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-scala';
import 'prismjs/themes/prism-dark.css';
import { Play, CheckCircle, Terminal, Laptop, LogOut } from 'lucide-react';
import logo from "../assets/images/logo.png";

const INITIAL_CODE = {
    javascript: `function solve(arr) {
   // Your code here
   return arr;
 }`,
    python: `def solve(arr):
   # Your code here
   return arr`,
    java: `class Solution {
     public int[] solve(int[] arr) {
         // Your code here
         return arr;
     }
 }`,
    cpp: `class Solution {
  public:
      vector<int> solve(vector<int>& arr) {
          // Your code here
          return arr;
      }
  };`,
    swift: `func solve(_ arr: [Int]) -> [Int] {
     // Your code here
     return arr
 }`,
    scala: `object Solution {
    def solve(arr: Array[Int]): Array[Int] = {
        // Your code here
        arr
    }
}`
};


const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'swift', name: 'Swift' },
    { id: 'scala', name: 'Scala' }
];

const LANGUAGE_ICONS = {
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    scala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg"
};

// Mock Problem Data Removed


// State for Dynamic Problem
const CodingInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for Dynamic Problem
    const [problem, setProblem] = useState(null);
    const { company, role, level, type, roundNum, ...otherState } = location.state || {}; // Ensure roundNum is passed

    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(INITIAL_CODE[language]);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Update code when language changes
    useEffect(() => {
        // Only reset if it's the initial load or explicit change, careful not to overwrite fetched code
        // For simplistic behavior, just mapping template:
        setCode(INITIAL_CODE[language]);
    }, [language]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Question from Supabase
    // Fetch Question from Supabase
    useEffect(() => {
        const fetchQuestion = async () => {
            console.log("Fetching Question with state:", { company, role, roundNum });

            if (!company || !role) {
                console.warn("Missing company or role, skipping fetch.");
                return;
            }

            try {
                // Try exact match first
                let { data, error } = await supabase
                    .from('sde_questions')
                    .select('*')
                    .eq('company', company)
                    .eq('role', role)
                    .eq('round_num', roundNum)
                    .single();

                console.log("Exact Match Result:", { data, error });

                // If not found, try lazy match (any question for this role)
                if (!data || error) {
                    console.warn("Exact round match not found, trying fallback...");
                    const fallback = await supabase
                        .from('sde_questions')
                        .select('*')
                        .eq('company', company)
                        .eq('role', role)
                        .limit(1)
                        .single();

                    data = fallback.data;
                    error = fallback.error;
                    console.log("Fallback Result:", { data, error });
                }

                if (error) {
                    console.error("Error fetching question:", error);
                    // Fallback mock if not found (optional, or handle error UI)
                }

                if (data) {
                    console.log("Question Data Found:", data);
                    setProblem({
                        title: data.title,
                        difficulty: data.difficulty,
                        description: data.description,
                        testCases: Array.isArray(data.test_cases) ? data.test_cases : JSON.parse(data.test_cases || '[]'),
                        language: data.language ? (data.language.toLowerCase() === 'c++' ? 'cpp' : data.language.toLowerCase()) : 'javascript',
                        initialCode: data.initial_code || '', // If you have it, else use template
                        followupPrompts: data.followup_voice_prompts,
                        successCriteria: data.success_criteria,
                        topics: data.topics || [],
                        constraints: data.constraints || []
                    });

                    // Set language and code
                    const rawLang = data.language ? data.language.toLowerCase() : 'javascript';
                    const lang = rawLang === 'c++' ? 'cpp' : rawLang;
                    setLanguage(lang);
                    // If DB has specific initial code, use it, else default template
                    // For now, using template as DB didn't show initial_code col in user prompt, but we can default to template
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchQuestion();
    }, [company, role, roundNum]);

    // Loading State
    if (!problem) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading challenge...</p>
                </div>
            </div>
        );
    }

    const currentProblem = problem;

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const response = await fetch('http://localhost:5000/api/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    language,
                    problemTitle: currentProblem.title,
                    problemDescription: currentProblem.description,
                    testCases: currentProblem.testCases,
                    constraints: currentProblem.constraints
                })
            });

            const data = await response.json();

            if (data.error) {
                setOutput({
                    status: 'error',
                    message: `Error: ${data.error}`
                });
            } else {
                setOutput({
                    status: data.passed ? 'success' : 'error',
                    message: `> Analysis: ${data.analysis}\n\n${data.message}\n\nTest Results:\n${data.testResults.map(t => `${t.passed ? '✅' : '❌'} Input: ${t.input} | Expected: ${t.expected} | Actual: ${t.actual}`).join('\n')}`
                });
            }
        } catch (err) {
            console.error("Run Code Error:", err);
            setOutput({
                status: 'error',
                message: "Failed to connect to the code execution server."
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = () => {
        navigate("/create/interview/session", {
            state: {
                ...location.state,
                codeContext: code,
                problemDescription: currentProblem.description,
                testResults: output ? output.message : 'No tests run',
                roundType: type || 'coding',
            }
        });
    };

    const currentLanguage = LANGUAGES.find(lang => lang.id === language);

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col font-sans overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
                backgroundImage: 'radial-gradient(circle at center, #bfdbfe 0%, transparent 70%)'
            }}></div>

            {/* Header */}
            <header className="flex-none h-16 px-6 py-4 z-10">
                <div className="flex items-center justify-between max-w-8xl mx-auto h-full">
                    {/* Logo Badge */}
                    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                        <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-slate-900">
                                {role || "Coding Interview"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">Interview Session</span>
                        </div>
                    </div>

                    {/* Timer Badge */}
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                            {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Areas */}
            <div className="flex-1 flex flex-col relative z-20 p-4 md:px-6 min-h-0">

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full w-full max-w-[1600px] mx-auto min-h-0">

                    {/* LEFT CARD: Problem Description */}
                    <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative transition-all duration-300 ${isFullScreen ? 'hidden' : 'flex'}`}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                            <div className="flex flex-col gap-1 min-w-0 pr-4">
                                <h2 className="text-lg font-bold text-slate-900 truncate">{currentProblem.title}</h2>
                                {currentProblem.topics && currentProblem.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {currentProblem.topics.map((topic, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 self-start mt-1">
                                {currentProblem.difficulty}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm">
                                <p className="whitespace-pre-wrap">{currentProblem.description}</p>
                            </div>

                            {/* Constraints */}
                            {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                                <div className="mt-8 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Constraints</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {currentProblem.constraints.map((constraint, i) => (
                                            <li key={i} className="text-xs text-amber-800/80 font-medium font-mono">
                                                {constraint}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 space-y-6">
                                {currentProblem.testCases.map((tc, i) => (
                                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 text-sm font-mono relative overflow-hidden">
                                        <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
                                            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Input</span>
                                            <span className="text-slate-900">{tc.input}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Output</span>
                                            <span className="text-emerald-600 font-semibold">{tc.expected}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: Code Editor */}
                    <div className={`bg-[#1e1e1e] shadow-2xl flex flex-col overflow-hidden border border-slate-800/50 transition-all duration-300 ${isFullScreen
                        ? 'fixed inset-0 z-50 h-screen w-screen rounded-none'
                        : 'rounded-3xl relative hover:border-slate-700/50'
                        }`}>
                        {/* Editor Header */}
                        <div className="h-14 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                </div>

                                {/* Language Dropdown */}
                                <div className="relative">
                                    <img
                                        src={LANGUAGE_ICONS[language]}
                                        alt={language}
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain"
                                    />
                                    {company && company !== 'General' ? (
                                        <div className="bg-[#2a2a2a] text-xs text-slate-300 font-medium pl-9 pr-4 py-1.5 rounded-lg border border-white/10 select-none cursor-default">
                                            {LANGUAGES.find(lang => lang.id === language)?.name}
                                        </div>
                                    ) : (
                                        <>
                                            <select
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                className="bg-[#2a2a2a] text-xs text-slate-300 font-medium pl-9 py-1.5 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer hover:bg-[#333]"
                                            >
                                                {LANGUAGES.map(lang => (
                                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isFullScreen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                            <Editor
                                value={code}
                                onValueChange={code => setCode(code)}
                                highlight={code => {
                                    // Map our IDs to Prism IDs
                                    const prismLangId = language === 'cpp' ? 'cpp' : language;
                                    const grammar = languages[prismLangId] || languages.javascript || languages.clike;
                                    return highlight(code || "", grammar, prismLangId);
                                }}
                                padding={24}
                                style={{
                                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                    fontSize: 14,
                                    minHeight: '100%',
                                    backgroundColor: 'transparent',
                                    color: '#e2e8f0',
                                    lineHeight: '1.6'
                                }}
                                className="min-h-full"
                                textareaClassName="focus:outline-none"
                            />
                        </div>

                        {/* Console Overlay (Bottom) */}
                        <div className="bg-[#151515] border-t border-white/5 flex flex-col shrink-0 max-h-[35%]">
                            <div className="px-4 py-2 bg-[#1a1a1a] flex justify-between items-center border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Console</span>
                                </div>
                                {output && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${output.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {output.status === 'success' ? 'Passed' : 'Failed'}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto text-slate-400 custom-scrollbar min-h-[80px]">
                                {isRunning ? (
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                                        Running tests...
                                    </div>
                                ) : output ? (
                                    <pre className={`whitespace-pre-wrap ${output.status === 'success' ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
                                        {output.message}
                                    </pre>
                                ) : (
                                    <span className="text-slate-700 italic">Output will appear here...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="flex-none bg-white border-t border-gray-100 h-20 w-full z-50 flex items-center justify-between px-8 shadow-[0_-4px_30px_-15px_rgba(0,0,0,0.1)]">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-2 md:px-6 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all border border-red-200/60 text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span className='hidden md:inline-block'>Leave</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold transition-all border border-slate-200/60 text-sm disabled:opacity-50"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Run<span className='hidden md:inline-block'>Code</span>
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!output || output.status !== 'success'} // Only enable if passed
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 ${output && output.status === 'success'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        Start Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodingInterview;
