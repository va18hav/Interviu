import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
    X, Plus, FileCode, FileJson, FileType,
    Search, Files, Settings, MoreHorizontal,
    ChevronRight, ChevronDown, Play, Terminal as TerminalIcon,
    GitBranch, Bug
} from 'lucide-react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

// Language Icons Mapping (from CodingInterview.jsx)
const LANGUAGE_ICONS = {
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    scala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
    yaml: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yaml/yaml-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    json: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg",
    typescript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    ruby: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
    php: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    csharp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
    kotlin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
    shell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    terraform: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    markdown: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg",
    apex: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg",
    dart: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
    lua: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg",
    powershell: "https://upload.wikimedia.org/wikipedia/commons/a/af/PowerShell_Core_6.0_icon.png",
    r: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg",
    objectivec: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/objectivec/objectivec-plain.svg",
    haskell: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
    perl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg",
    elixir: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg",
    clojure: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg",
    julia: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg",
    fsharp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fsharp/fsharp-original.svg",
    erlang: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/erlang/erlang-original.svg",
    lisp: "https://upload.wikimedia.org/wikipedia/commons/4/48/Lisp_logo.svg",
    prolog: "https://upload.wikimedia.org/wikipedia/commons/9/90/Prolog_logo.png",
    fortran: "https://upload.wikimedia.org/wikipedia/commons/a/af/Fortran_logo.svg",
    cobol: "https://upload.wikimedia.org/wikipedia/commons/1/18/COBOL_logo.svg",
    abap: "https://upload.wikimedia.org/wikipedia/commons/9/9d/SAP_logo.svg",
    scheme: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Scheme_logo.svg",
    racket: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Racket-logo.svg",
    solidity: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidity/solidity-original.svg"
};

const MonacoEditorWindow = ({
    files = {},
    activeFile: propActiveFile,
    onFileChange,
    onFileCreate,
    onFileDelete,
    onActiveFileChange,
    readOnly = false,
    language = "javascript",
    // New Props for Execution
    onRunCode,
    isRunning = false,
    output = null
}) => {
    // Determine initial active file
    const fileEntries = Object.entries(files);
    const [internalActiveFile, setInternalActiveFile] = useState(propActiveFile || (fileEntries.length > 0 ? fileEntries[0][0] : "main.js"));
    const activeFile = propActiveFile !== undefined ? propActiveFile : internalActiveFile;
    const activeContent = files[activeFile] || "";

    // UI State
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState({ 'src': true, 'root': true });
    const [showConsole, setShowConsole] = useState(true);
    const [activeTab, setActiveTab] = useState('TERMINAL');

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [tabSize, setTabSize] = useState(4);

    // Terminal Resizing State
    const [consoleHeight, setConsoleHeight] = useState(120);
    const [isResizing, setIsResizing] = useState(false);
    const minConsoleHeight = 100;
    const maxConsoleHeight = 600;



    // Sync external output to console
    useEffect(() => {
        if (output) {
            setShowConsole(true);
            setActiveTab('TERMINAL');
        }
    }, [output]);


    // XTerm Refs
    const terminalRef = useRef(null);
    const xtermInstance = useRef(null);
    const fitAddon = useRef(null);
    const onRunCodeRef = useRef(onRunCode);

    // Keep onRunCodeRef updated
    useEffect(() => {
        onRunCodeRef.current = onRunCode;
    }, [onRunCode]);

    // Safe Fit Function
    const performFit = React.useCallback(() => {
        if (fitAddon.current && terminalRef.current) {
            try {
                const dims = fitAddon.current.proposeDimensions();
                // dims can be undefined if element is hidden/detached
                if (dims && dims.cols && dims.cols > 20) {
                    fitAddon.current.fit();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // Handle Resize Logic
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            // Calculate new height based on mouse position relative to window bottom
            // Since the terminal is at the bottom, we can approximate or use a ref for the container
            // Simpler approach: new height = window height - mouse Y
            const newHeight = window.innerHeight - e.clientY;

            if (newHeight >= minConsoleHeight && newHeight <= maxConsoleHeight) {
                setConsoleHeight(newHeight);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            performFit(); // Fit terminal after resize
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            // Add a class to body to ensure cursor stays consistent
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, performFit]);

    // Update Terminal Font Size when changed
    useEffect(() => {
        if (xtermInstance.current) {
            // Terminal usually needs to be slightly smaller than editor code
            // But for consistency let's keep them related.
            // Original compact was 12. Let's make it fontSize - 2
            xtermInstance.current.options.fontSize = Math.max(10, fontSize - 2);
            performFit();
        }
    }, [fontSize, performFit]);

    // Initialize XTerm
    useEffect(() => {
        if (!terminalRef.current || xtermInstance.current) return;

        // Create Terminal
        const term = new Terminal({
            cursorBlink: true,
            fontSize: Math.max(10, fontSize - 2), // Init with state
            lineHeight: 1.0, // Very compact
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            // Allow transparency
            allowTransparency: true,
            theme: {
                background: '#1e1e1e',
                foreground: '#cccccc',
                cursor: '#ffffff',
                selectionBackground: '#5da5f533',
                black: '#000000',
                red: '#cd3131',
                green: '#0dbc79',
                yellow: '#e5e510',
                blue: '#2472c8',
                magenta: '#bc3fbc',
                cyan: '#11a8cd',
                white: '#e5e5e5',
                brightBlack: '#666666',
                brightRed: '#f14c4c',
                brightGreen: '#23d18b',
                brightYellow: '#f5f543',
                brightBlue: '#3b8eea',
                brightMagenta: '#d670d6',
                brightCyan: '#29b8db',
                brightWhite: '#e5e5e5'
            }
        });

        const fit = new FitAddon();
        term.loadAddon(fit);

        term.open(terminalRef.current);

        xtermInstance.current = term;
        fitAddon.current = fit;

        // Wait for fonts to load before fitting, to ensure accurate char measurement
        if (document.fonts) {
            document.fonts.ready.then(() => {
                performFit();
            });
        } else {
            setTimeout(() => {
                performFit();
            }, 100);
        }

        // Initial Fit
        performFit();

        const prompt = () => {
            term.write('\x1b[1;36mInterviu>\x1b[0m ');
        };

        // Initial Prompt (Delayed to ensure fit happens first)
        setTimeout(() => {
            prompt();
        }, 150);

        // Shell Simulation Logic
        let commandBuffer = '';

        term.onData(e => {
            switch (e) {
                case '\r': // Enter
                    term.write('\r\n');
                    processCommand(commandBuffer);
                    commandBuffer = '';
                    break;
                case '\u007F': // Backspace (DEL)
                    if (commandBuffer.length > 0) {
                        commandBuffer = commandBuffer.slice(0, -1);
                        term.write('\b \b');
                    }
                    break;
                default: // Typing
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
                        commandBuffer += e;
                        term.write(e);
                    }
            }
        });

        const processCommand = (cmd) => {
            const trimmedCmd = cmd.trim();
            if (!trimmedCmd) {
                prompt();
                return;
            }

            // Simple argument parser (handles spaces, but quotes support is minimal for now)
            // A better regex approach for quotes:
            const args = trimmedCmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
            const mainCmd = args.shift().toLowerCase();
            // Remove quotes from args if present
            const cleanArgs = args.map(arg => arg.replace(/^"|"$/g, ''));

            switch (mainCmd) {
                case 'clear':
                case 'cls':
                    term.clear();
                    prompt();
                    break;
                case 'ls':
                case 'dir':
                    // List files from props
                    const fileList = Object.keys(files).join('  ');
                    term.writeln(fileList);
                    prompt();
                    break;
                case 'cat':
                case 'type':
                    if (cleanArgs.length === 0) {
                        term.writeln('\x1b[31musage: cat <filename>\x1b[0m');
                    } else {
                        const fileName = cleanArgs[0];
                        if (files[fileName]) {
                            // Print file content (handle newlines)
                            const content = files[fileName];
                            term.write(content.replace(/\n/g, '\r\n'));
                            term.write('\r\n');
                        } else {
                            term.writeln(`\x1b[31mcat: ${fileName}: No such file or directory\x1b[0m`);
                        }
                    }
                    prompt();
                    break;
                case 'help':
                    term.writeln('Available commands: run, node, python, go, cat, ls, clear');
                    prompt();
                    break;
                default:
                    // Treat everything else as a potential system command to be handled by backend
                    // including 'node', 'python', 'bash', 'run', './script.sh'
                    if (onRunCodeRef.current) {
                        // Pass command and args to handler
                        onRunCodeRef.current({ command: mainCmd, args: cleanArgs });
                    } else {
                        term.writeln('\x1b[31mError: Execution engine not connected.\x1b[0m');
                        prompt();
                    }
            }
        };


        // Resize observer with debounce
        let resizeTimeout;
        const resizeObserver = new ResizeObserver(() => {
            // Debounce fit call slightly
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                performFit();
            }, 60);
        });
        resizeObserver.observe(terminalRef.current);

        // Polling for stability during initial animation (slide-in 700ms)
        // We poll every 100ms for 1.2 seconds to ensure we catch the final state
        const pollInterval = setInterval(() => {
            performFit();
        }, 100);

        // Stop polling after animations consistently finish
        const stopPollingTimeout = setTimeout(() => {
            clearInterval(pollInterval);
        }, 1200);

        return () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            clearInterval(pollInterval);
            clearTimeout(stopPollingTimeout);
            term.dispose();
            resizeObserver.disconnect();
            xtermInstance.current = null;
        };
    }, []); // Only run once on mount

    // Handle Output & Running State
    useEffect(() => {
        if (!xtermInstance.current) return;
        const term = xtermInstance.current;

        if (isRunning) {
            // If cursor is not at start of line (e.g. from prompt), move to next line
            if (term.buffer.active.cursorX > 0) {
                term.write('\r\n');
            }
            term.write('\x1b[33mRunning...\x1b[0m\r\n');
        } else if (output) {
            term.write('\x1b[2K\r'); // Clear current line
            const message = typeof output.message === 'string' ? output.message : JSON.stringify(output.message, null, 2);

            // Convert newlines to \r\n for xterm
            const formattedMessage = message.replace(/\n/g, '\r\n');

            if (output.status === 'error') {
                term.write(`\x1b[31m${formattedMessage}\x1b[0m\r\n`);
            } else {
                term.write(`${formattedMessage}\r\n`);
            }

            // Prompt after execution
            term.write('\r\n\x1b[1;36mInterviu>\x1b[0m ');
        }
    }, [isRunning, output]);

    // Handle Resize when toggling console
    useEffect(() => {
        if (showConsole && fitAddon.current) {
            // Small delay to allow transition/rendering
            setTimeout(() => {
                performFit();
            }, 50);
        }
    }, [showConsole, activeTab, performFit]);

    // Helpers

    // Helpers
    const getLanguageFromFilename = (filename) => {
        if (!filename) return language;
        const lowName = filename.toLowerCase();
        const ext = filename.split('.').pop().toLowerCase();

        // Specific file name matches
        if (lowName === 'dockerfile') return 'docker';
        if (lowName === 'jenkinsfile') return 'groovy';
        if (lowName === 'makefile') return 'makefile';

        const map = {
            'js': 'javascript', 'jsx': 'javascript', 'mjs': 'javascript', 'cjs': 'javascript',
            'ts': 'typescript', 'tsx': 'typescript',
            'py': 'python', 'java': 'java', 'cpp': 'cpp', 'cc': 'cpp', 'c': 'c', 'h': 'cpp', 'hpp': 'cpp',
            'json': 'json', 'html': 'html', 'css': 'css', 'scss': 'scss', 'sass': 'sass',
            'sql': 'sql', 'yaml': 'yaml', 'yml': 'yaml',
            'tf': 'terraform', 'tfvars': 'terraform',
            'rs': 'rust', 'go': 'go', 'rb': 'ruby', 'php': 'php', 'cs': 'csharp',
            'kt': 'kotlin', 'kts': 'kotlin', 'swift': 'swift', 'scala': 'scala',
            'sh': 'shell', 'bash': 'shell',
            'txt': 'plaintext', 'md': 'markdown', 'log': 'plaintext',
            'cls': 'apex', 'trigger': 'apex', 'apex': 'apex',
            'dart': 'dart', 'lua': 'lua', 'ps1': 'powershell', 'psm1': 'powershell',
            'r': 'r', 'rmd': 'r', 'rhistory': 'r',
            'm': 'objectivec', 'mm': 'objectivec',
            'hs': 'haskell', 'lhs': 'haskell',
            'pl': 'perl', 'pm': 'perl', 't': 'perl',
            'ex': 'elixir', 'exs': 'elixir',
            'clj': 'clojure', 'cljs': 'clojure', 'cljc': 'clojure', 'edn': 'clojure',
            'jl': 'julia',
            'fs': 'fsharp', 'fsi': 'fsharp', 'fsx': 'fsharp', 'fsscript': 'fsharp',
            'erl': 'erlang', 'hrl': 'erlang',
            'lisp': 'lisp', 'lsp': 'lisp', 'l': 'lisp', 'fasl': 'lisp',
            'pro': 'prolog', 'plg': 'prolog', 'prolog': 'prolog',
            'f': 'fortran', 'for': 'fortran', 'f90': 'fortran', 'f95': 'fortran',
            'cbl': 'cobol', 'cob': 'cobol', 'cpy': 'cobol',
            'abap': 'abap',
            'scm': 'scheme', 'ss': 'scheme',
            'rkt': 'racket',
            'sol': 'solidity'
        };
        return map[ext] || language;
    };

    const currentLanguage = getLanguageFromFilename(activeFile);
    const currentIcon = LANGUAGE_ICONS[currentLanguage] || LANGUAGE_ICONS.javascript;

    const handleEditorChange = (value) => {
        if (onFileChange) onFileChange(activeFile, value);
    };

    const handleFileClick = (filename) => {
        setInternalActiveFile(filename);
        if (onActiveFileChange) onActiveFileChange(filename);
    };

    const handleCreateFile = () => {
        const name = prompt("Enter new file name (e.g., helper.js):");
        if (name && onFileCreate) {
            onFileCreate(name);
            handleFileClick(name);
        }
    };

    const toggleFolder = (folder) => {
        setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    };

    // Editor Ref
    const editorRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({ ln: 1, col: 1 });

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        editor.onDidChangeCursorPosition((e) => {
            setCursorPos({ ln: e.position.lineNumber, col: e.position.column });
        });

        editor.focus();
    };

    return (
        <div className="flex h-full w-full bg-[#1e1e1e] text-[#cccccc] overflow-hidden font-sans rounded-lg relative">

            {/* Settings Modal */}
            {showSettings && (
                <div
                    className="absolute bottom-12 left-12 w-64 bg-[#252526] border border-[#454545] shadow-2xl rounded-md z-50 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#333]">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Editor Settings</span>
                        <X
                            className="w-4 h-4 cursor-pointer hover:text-white text-slate-400"
                            onClick={() => setShowSettings(false)}
                        />
                    </div>

                    {/* Font Size Control */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-slate-300">Font Size</label>
                            <span className="text-xs text-blue-400 font-mono">{fontSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="24"
                            step="1"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Tab Size Control */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-slate-300">Tab Size</label>
                        </div>
                        <div className="flex bg-[#333] rounded p-1">
                            {[2, 4].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setTabSize(size)}
                                    className={`flex-1 text-xs py-1 rounded transition-colors ${tabSize === size
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-[#444]'
                                        }`}
                                >
                                    {size} Spaces
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Activity Bar (Far Left) */}
            <div className="w-12 flex flex-col items-center py-3 bg-[#333333] shrink-0 z-20" onClick={() => setShowSettings(false)}>
                <div className="flex flex-col gap-6">
                    <ActivityItem
                        icon={Files}
                        active={sideBarVisible}
                        onClick={(e) => { e.stopPropagation(); setSideBarVisible(!sideBarVisible); }}
                        title="Explorer (Ctrl+Shift+E)"
                    />
                    {/* Run Code Button Hidden for MVP */}
                    {/* <ActivityItem
                        icon={Play}
                        title="Run Code"
                        onClick={onRunCode}
                        className="text-green-500 hover:text-green-400"
                    /> */}
                </div>
                <div className="mt-auto flex flex-col gap-6 pb-2">
                    <ActivityItem
                        icon={Settings}
                        title="Settings"
                        active={showSettings}
                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                    />
                </div>
            </div>

            {/* 2. Side Bar (Explorer) */}
            {sideBarVisible && (
                <div className="w-60 bg-[#252526] flex flex-col border-r border-[#1e1e1e] shrink-0 animate-in slide-in-from-left-5 duration-200">
                    <div className="h-9 px-4 flex items-center justify-between bg-[#252526] text-xs font-bold tracking-wide uppercase text-slate-400">
                        <span>Explorer</span>
                        <MoreHorizontal className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Project Header */}
                        <div
                            className="flex items-center gap-1 px-1 py-1 text-xs font-bold text-slate-300 cursor-pointer hover:bg-[#2a2d2e]"
                            onClick={() => toggleFolder('root')}
                        >
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${!expandedFolders['root'] ? '-rotate-90' : ''}`}
                            />
                            <span>INTERVIEW-PROJECT</span>
                        </div>

                        {/* Files List */}
                        {expandedFolders['root'] && (
                            <div className="flex flex-col">
                                {fileEntries.map(([filename]) => {
                                    const isJs = filename.endsWith('.js') || filename.endsWith('.jsx');
                                    const iconUrl = getFileIcon(filename);
                                    const isActive = filename === activeFile;

                                    return (
                                        <div
                                            key={filename}
                                            onClick={() => handleFileClick(filename)}
                                            className={`
                                                flex items-center gap-1.5 px-4 py-1 cursor-pointer text-[13px] border-l-2
                                                ${isActive
                                                    ? 'bg-[#37373d] text-white border-[#007acc]'
                                                    : 'text-slate-400 border-transparent hover:bg-[#2a2d2e] hover:text-slate-200'
                                                }
                                            `}
                                        >
                                            <img src={getFileIcon(filename)} className="w-3.5 h-3.5" alt="file" />
                                            <span className="truncate">{filename}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 3. Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">

                {/* Tabs Header */}
                <div className="h-9 bg-[#2d2d2d] flex overflow-x-auto no-scrollbar shrink-0">
                    {fileEntries.map(([filename]) => (
                        <Tab
                            key={filename}
                            filename={filename}
                            isActive={filename === activeFile}
                            onClick={() => handleFileClick(filename)}
                            onClose={(e) => {
                                e.stopPropagation();
                                if (onFileDelete) onFileDelete(filename);
                            }}
                            readOnly={readOnly}
                        />
                    ))}
                    {!readOnly && (
                        <div
                            onClick={handleCreateFile}
                            className="flex items-center justify-center w-8 h-full hover:bg-[#3e3e3e] cursor-pointer text-slate-400"
                            title="New File"
                        >
                            <Plus className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* Breadcrumbs / Toolbar */}
                <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-xs text-slate-500 border-b border-[#2d2d2d] shrink-0 gap-2">
                    <span>src</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-300">{activeFile}</span>
                </div>

                {/* Editor Surface */}
                <div className="flex-1 relative min-h-0">
                    <Editor
                        height="100%"
                        language={currentLanguage}
                        value={activeContent}
                        theme="vs-dark"
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: fontSize,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            tabSize: tabSize,
                            lineHeight: Math.floor(fontSize * 1.5), // Responsive line height
                            padding: { top: 12 },
                            smoothScrolling: true,
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on",
                            readOnly: readOnly,
                            automaticLayout: true,
                            renderLineHighlight: "all",
                            // Disable accessibility features that might show widgets
                            accessibilitySupport: 'off',
                            accessibilityPageSize: 10, // Default is 10
                            // Hide other overlays
                            lightbulb: { enabled: false },
                            quickSuggestions: { other: true, comments: false, strings: false },
                            contextmenu: true
                        }}
                    />
                </div>

                {/* Console / Terminal Pane - HIDDEN FOR MVP */}
                <div
                    className="shrink-0 border-t border-[#3e3e3e] flex flex-col relative z-20 bg-[#1e1e1e] overflow-hidden hidden"
                    style={{ height: '0px' }}
                >
                    {/* Resize Handle */}
                    {showConsole && (
                        <div
                            className="absolute top-0 left-0 right-0 h-1 bg-transparent hover:bg-blue-500/50 cursor-ns-resize z-50 transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setIsResizing(true);
                            }}
                        />
                    )}
                    {/* Header Row */}
                    <div
                        className="flex h-8 shrink-0 bg-[#1e1e1e] border-b border-[#2d2d2d] cursor-pointer hover:bg-[#252526]"
                        onClick={() => setShowConsole(!showConsole)}
                    >
                        {/* Tabs Container */}
                        <div className="flex pl-4 gap-6">
                            {['TERMINAL', 'OUTPUT', 'PROBLEMS'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (activeTab === tab) {
                                            setShowConsole(!showConsole);
                                        } else {
                                            setActiveTab(tab);
                                            setShowConsole(true);
                                        }
                                    }}
                                    className={`
                                         text-xs font-semibold h-full border-b-[1px] transition-colors focus:outline-none px-1
                                         ${activeTab === tab && showConsole
                                            ? 'text-slate-100 border-slate-100'
                                            : 'text-slate-500 border-transparent hover:text-slate-300'
                                        }
                                     `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Spacer (Click to Toggle) */}
                        <div className="flex-1 flex justify-end pr-2 items-center">
                            <div className="p-1 rounded hover:bg-[#2a2d2e]">
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${showConsole ? '' : 'rotate-180'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">


                        {/* TERMINAL (xterm.js) */}
                        <div
                            className={`absolute inset-0 bg-[#1e1e1e] ${activeTab === 'TERMINAL' ? 'z-10' : 'z-0 hidden'}`}
                        >
                            <div ref={terminalRef} className="h-full w-full" />
                        </div>

                        {/* OUTPUT */}
                        <div className={`absolute inset-0 p-2 font-mono text-xs text-slate-400 bg-[#1e1e1e] ${activeTab === 'OUTPUT' ? 'z-10' : 'z-0 hidden'}`}>
                            Program output will appear here.
                        </div>

                        {/* PROBLEMS */}
                        <div className={`absolute inset-0 p-2 font-mono text-xs text-slate-400 bg-[#1e1e1e] ${activeTab === 'PROBLEMS' ? 'z-10' : 'z-0 hidden'}`}>
                            No problems detected.
                        </div>

                    </div>
                </div>



            </div>
        </div>
    );
};

// --- Sub Components ---

const ActivityItem = ({ icon: Icon, active, onClick, className }) => (
    <div
        onClick={onClick}
        className={`
            w-12 h-12 flex items-center justify-center cursor-pointer border-l-2 transition-all
            ${active
                ? 'border-white text-white'
                : 'border-transparent text-slate-500 hover:text-white'
            }
            ${className || ''}
        `}
    >
        <Icon className="w-6 h-6" strokeWidth={1.5} />
    </div>
);

const Tab = ({ filename, isActive, onClick, onClose, readOnly }) => (
    <div
        onClick={onClick}
        className={`
            group flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] h-full cursor-pointer text-xs border-r border-[#1e1e1e] select-none
            ${isActive
                ? 'bg-[#1e1e1e] text-white border-t border-t-[#007acc]'
                : 'bg-[#2d2d2d] text-slate-400 hover:bg-[#2a2d2e]'
            }
        `}
    >
        <img src={getFileIcon(filename)} className="w-3.5 h-3.5 opacity-80" alt="icon" />
        <span className="truncate flex-1">{filename}</span>
        {!readOnly && (
            <div onClick={onClose} className={`opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#454545]`}>
                <X className="w-3 h-3" />
            </div>
        )}
    </div>
);

// Helper for Icons
const getFileIcon = (filename) => {
    if (!filename) return LANGUAGE_ICONS.javascript;
    const lowName = filename.toLowerCase();
    const ext = filename.split('.').pop().toLowerCase();

    // Specific file name matches
    if (lowName === 'dockerfile') return LANGUAGE_ICONS.docker;

    const map = {
        'js': LANGUAGE_ICONS.javascript,
        'jsx': LANGUAGE_ICONS.javascript,
        'ts': LANGUAGE_ICONS.typescript,
        'tsx': LANGUAGE_ICONS.typescript,
        'py': LANGUAGE_ICONS.python,
        'java': LANGUAGE_ICONS.java,
        'cpp': LANGUAGE_ICONS.cpp,
        'cc': LANGUAGE_ICONS.cpp,
        'c': LANGUAGE_ICONS.cpp,
        'rs': LANGUAGE_ICONS.rust,
        'go': LANGUAGE_ICONS.go,
        'rb': LANGUAGE_ICONS.ruby,
        'php': LANGUAGE_ICONS.php,
        'cs': LANGUAGE_ICONS.csharp,
        'kt': LANGUAGE_ICONS.kotlin,
        'kts': LANGUAGE_ICONS.kotlin,
        'swift': LANGUAGE_ICONS.swift,
        'scala': LANGUAGE_ICONS.scala,
        'sh': LANGUAGE_ICONS.shell,
        'bash': LANGUAGE_ICONS.shell,
        'yaml': LANGUAGE_ICONS.yaml,
        'yml': LANGUAGE_ICONS.yaml,
        'tf': LANGUAGE_ICONS.terraform,
        'tfvars': LANGUAGE_ICONS.terraform,
        'sql': LANGUAGE_ICONS.sql,
        'json': LANGUAGE_ICONS.json,
        'html': LANGUAGE_ICONS.html,
        'css': LANGUAGE_ICONS.css,
        'md': LANGUAGE_ICONS.markdown,
        'txt': LANGUAGE_ICONS.markdown, // Use markdown icon or generic file
        'log': LANGUAGE_ICONS.markdown,
        'cls': LANGUAGE_ICONS.apex, 'trigger': LANGUAGE_ICONS.apex, 'apex': LANGUAGE_ICONS.apex,
        'dart': LANGUAGE_ICONS.dart, 'lua': LANGUAGE_ICONS.lua, 'ps1': LANGUAGE_ICONS.powershell, 'psm1': LANGUAGE_ICONS.powershell,
        'r': LANGUAGE_ICONS.r, 'rmd': LANGUAGE_ICONS.r, 'rhistory': LANGUAGE_ICONS.r,
        'm': LANGUAGE_ICONS.objectivec, 'mm': LANGUAGE_ICONS.objectivec,
        'hs': LANGUAGE_ICONS.haskell, 'lhs': LANGUAGE_ICONS.haskell,
        'pl': LANGUAGE_ICONS.perl, 'pm': LANGUAGE_ICONS.perl, 't': LANGUAGE_ICONS.perl,
        'ex': LANGUAGE_ICONS.elixir, 'exs': LANGUAGE_ICONS.elixir,
        'clj': LANGUAGE_ICONS.clojure, 'cljs': LANGUAGE_ICONS.clojure, 'cljc': LANGUAGE_ICONS.clojure, 'edn': LANGUAGE_ICONS.clojure,
        'jl': LANGUAGE_ICONS.julia,
        'fs': LANGUAGE_ICONS.fsharp, 'fsi': LANGUAGE_ICONS.fsharp, 'fsx': LANGUAGE_ICONS.fsharp, 'fsscript': LANGUAGE_ICONS.fsharp,
        'erl': LANGUAGE_ICONS.erlang, 'hrl': LANGUAGE_ICONS.erlang,
        'lisp': LANGUAGE_ICONS.lisp, 'lsp': LANGUAGE_ICONS.lisp, 'l': LANGUAGE_ICONS.lisp, 'fasl': LANGUAGE_ICONS.lisp,
        'pro': LANGUAGE_ICONS.prolog, 'plg': LANGUAGE_ICONS.prolog, 'prolog': LANGUAGE_ICONS.prolog,
        'f': LANGUAGE_ICONS.fortran, 'for': LANGUAGE_ICONS.fortran, 'f90': LANGUAGE_ICONS.fortran, 'f95': LANGUAGE_ICONS.fortran,
        'cbl': LANGUAGE_ICONS.cobol, 'cob': LANGUAGE_ICONS.cobol, 'cpy': LANGUAGE_ICONS.cobol,
        'abap': LANGUAGE_ICONS.abap,
        'scm': LANGUAGE_ICONS.scheme, 'ss': LANGUAGE_ICONS.scheme,
        'rkt': LANGUAGE_ICONS.racket,
        'sol': LANGUAGE_ICONS.solidity
    };
    return map[ext] || LANGUAGE_ICONS.javascript;
};

// Alert Icon Wrapper
const AlertTriangle = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


export default MonacoEditorWindow;
