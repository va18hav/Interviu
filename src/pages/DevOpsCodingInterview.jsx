import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import { Play, Terminal, LogOut, FileCode, FileJson, AlertCircle } from 'lucide-react';
import logo from "../assets/images/logo.png";

const LANGUAGE_ICONS = {
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    bash: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    json: "https://upload.wikimedia.org/wikipedia/commons/5/56/JSON_Formatter.svg",
    default: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
};

const DevOpsCodingInterview = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for Dynamic Problem
    const [problem, setProblem] = useState(null);
    const { company, role, level, type, roundNum, ...otherState } = location.state || {};

    // Multi-file state
    const [files, setFiles] = useState({});
    const [activeFile, setActiveFile] = useState(null);
    const [originalfiles, setOriginalFiles] = useState({}); // To track changes if needed

    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Question from Supabase
    useEffect(() => {
        const fetchQuestion = async () => {
            console.log("Fetching DevOps Question with state:", { company, role, roundNum });

            if (!company || !role) {
                console.warn("Missing company or role, skipping fetch.");
                return;
            }

            try {
                // Try exact match first
                let { data, error } = await supabase
                    .from('devops_questions')
                    .select('*')
                    .eq('company', company)
                    .eq('role', role)
                    .eq('round_num', roundNum)
                    .single();

                if (!data || error) {
                    // Fallback
                    const fallback = await supabase
                        .from('devops_questions')
                        .select('*')
                        .eq('company', company)
                        .eq('role', role)
                        .limit(1)
                        .single();
                    data = fallback.data;
                    error = fallback.error;
                }

                if (data) {
                    // Parse 'test_cases' which contains the file structure in DevOps context
                    // Structure expected: { "files": { "filename": "content" }, "tests": [...] }
                    let parsedData = {};
                    try {
                        parsedData = typeof data.test_cases === 'string'
                            ? JSON.parse(data.test_cases)
                            : data.test_cases;
                    } catch (e) {
                        console.error("Failed to parse test_cases JSON", e);
                    }

                    const initialFiles = parsedData.files || { 'script.py': '# No content' };
                    const fileNames = Object.keys(initialFiles);

                    setProblem({
                        title: data.title,
                        difficulty: data.difficulty,
                        description: data.description,
                        tests: parsedData.tests || [],
                        successCriteria: data.success_criteria,
                        topics: data.topics || [],
                        constraints: data.constraints || []
                    });

                    setFiles(initialFiles);
                    setOriginalFiles(initialFiles);
                    if (fileNames.length > 0) {
                        setActiveFile(fileNames[0]);
                    }
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
                    <p className="text-slate-500 font-medium">Loading DevOps challenge...</p>
                </div>
            </div>
        );
    }

    const currentProblem = problem;

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        try {
            const response = await fetch('http://localhost:5000/api/verify-devops-fix', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    files,
                    problemTitle: currentProblem.title,
                    problemDescription: currentProblem.description,
                    testCases: currentProblem.tests,
                    constraints: currentProblem.constraints
                })
            });

            const result = await response.json();

            if (result.error) {
                setOutput({ status: 'error', message: result.error });
            } else {
                setOutput({
                    status: result.status === 'success' && result.passed ? 'success' : 'error',
                    message: result.message + (result.analysis ? `\n\n>> Analysis:\n${result.analysis}` : '')
                });
            }
        } catch (err) {
            console.error(err);
            setOutput({ status: 'error', message: "Failed to connect to verification server." });
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = () => {
        navigate("/create/interview/session", {
            state: {
                ...location.state,
                codeContext: JSON.stringify(files), // Send all files
                problemDescription: currentProblem.description,
                testResults: output ? output.message : 'No tests run',
                roundType: type || 'coding',
            }
        });
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop();
        let iconSrc = LANGUAGE_ICONS.default;

        if (ext === 'py') iconSrc = LANGUAGE_ICONS.python;
        if (ext === 'js') iconSrc = LANGUAGE_ICONS.javascript;
        if (ext === 'java') iconSrc = LANGUAGE_ICONS.java;
        if (ext === 'sh') iconSrc = LANGUAGE_ICONS.bash;
        if (ext === 'json') iconSrc = LANGUAGE_ICONS.json;
        if (ext === 'cpp' || ext === 'cc') iconSrc = LANGUAGE_ICONS.cpp;

        return <img src={iconSrc} alt={ext} className="w-3.5 h-3.5 object-contain" />;
    };

    const getLanguageFromFilename = (filename) => {
        if (!filename) return 'clike';
        if (filename.endsWith('.py')) return 'python';
        if (filename.endsWith('.js')) return 'javascript';
        if (filename.endsWith('.java')) return 'java';
        if (filename.endsWith('.sh')) return 'bash';
        if (filename.endsWith('.json')) return 'json';
        return 'clike';
    };

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
                                {company || "DevOps Interview"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">Debugging & Scripting</span>
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
                                <div className="flex gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                        {currentProblem.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm">
                                <p className="whitespace-pre-wrap">{currentProblem.description}</p>
                            </div>

                            {/* DevOps Specific Constraints */}
                            {currentProblem.constraints && (
                                <div className="mt-8 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">System Constraints</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {currentProblem.constraints.map((c, i) => (
                                            <li key={i} className="text-xs text-amber-800/80 font-medium font-mono">{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-8 space-y-6">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Validation Cases</h3>
                                {currentProblem.tests && currentProblem.tests.map((test, i) => (
                                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/80 text-sm font-mono relative overflow-hidden">
                                        <div className="grid grid-cols-[80px_1fr] gap-2 mb-2">
                                            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Scenario</span>
                                            <span className="text-slate-900">{test.input}</span>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Expected</span>
                                            <span className="text-slate-700">{test.expected}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CARD: Multi-file Editor */}
                    <div className={`bg-[#1e1e1e] shadow-2xl flex flex-col overflow-hidden border border-slate-800/50 transition-all duration-300 ${isFullScreen
                        ? 'fixed inset-0 z-50 h-screen w-screen rounded-none'
                        : 'rounded-3xl relative hover:border-slate-700/50'
                        }`}>

                        {/* File Tabs & Controls Header */}
                        <div className="h-10 bg-[#252526] border-b border-[#000] flex items-center justify-between px-2 pr-4 shrink-0">
                            {/* Tabs Container */}
                            <div className="flex items-end gap-1 overflow-x-auto custom-scrollbar h-full pt-1.5 scroll-smooth">
                                {Object.keys(files).map(filename => (
                                    <button
                                        key={filename}
                                        onClick={() => setActiveFile(filename)}
                                        className={`px-3 py-1.5 text-xs font-medium flex items-center gap-2 border-t-2 transition-all h-full rounded-t-sm min-w-fit ${activeFile === filename
                                            ? 'bg-[#1e1e1e] text-slate-100 border-blue-500'
                                            : 'bg-[#2d2d2d] text-slate-400 border-transparent hover:bg-[#333] hover:text-slate-300'
                                            }`}
                                    >
                                        {getFileIcon(filename)}
                                        {filename}
                                    </button>
                                ))}
                            </div>

                            {/* Window Controls */}
                            <div className="flex items-center gap-3 pl-3 ml-2 border-l border-white/5 h-3/5">
                                <button
                                    onClick={() => setIsFullScreen(!isFullScreen)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors text-slate-400 hover:text-white"
                                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFullScreen ? "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" : "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"} />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Breadcrumb / Info Bar (Optional: previously handled editor controls, now purely info or removed if redundant)
                             Since we merged the toggle, we can might remove the old control bar or just keep it for valid file path display if needed. 
                             The user request implies "exactly at the same level", which implies merging. 
                             I will keep a thin bar for current path if desired, or just remove the old bar entirely and simplify.
                             Let's remove the old control bar to avoid duplication and clutter, as the active tab IS the indicator.
                          */}

                        {/* Code Editor */}
                        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#1e1e1e]">
                            <Editor
                                value={files[activeFile] || ''}
                                onValueChange={code => setFiles({ ...files, [activeFile]: code })}
                                highlight={code => highlight(code, languages[getLanguageFromFilename(activeFile)] || languages.clike)}
                                padding={20}
                                style={{
                                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                    fontSize: 14,
                                    backgroundColor: 'transparent',
                                    color: '#d4d4d4',
                                    minHeight: '100%'
                                }}
                                className="min-h-full"
                                textareaClassName="focus:outline-none"
                            />
                        </div>

                        {/* Terminals / Console */}
                        <div className="bg-[#1e1e1e] border-t border-white/10 flex flex-col shrink-0 h-[30%]">
                            <div className="px-4 py-1.5 bg-[#252526] flex justify-between items-center border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-3 h-3 text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Terminal</span>
                                </div>
                                {output && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${output.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {output.status === 'success' ? 'Passed' : 'Failed'}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto text-slate-300 custom-scrollbar">
                                {isRunning ? (
                                    <div className="text-yellow-500">Executing pipeline...</div>
                                ) : output ? (
                                    <pre className="whitespace-pre-wrap">{output.message}</pre>
                                ) : (
                                    <div className="text-slate-600 italic">Ready to debug...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Controls */}
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
                        verify_fix.sh
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!output || output.status !== 'success'}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all text-sm shadow-xl shadow-blue-500/20 hover:-translate-y-0.5 ${output && output.status === 'success'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                    >
                        Complete Round
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DevOpsCodingInterview;
