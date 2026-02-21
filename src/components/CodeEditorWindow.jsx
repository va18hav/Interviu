import React, { useState, useEffect } from 'react';
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
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-dark.css';

const LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', extensions: ['js', 'jsx', 'ts', 'tsx'] },
    { id: 'python', name: 'Python', extensions: ['py'] },
    { id: 'java', name: 'Java', extensions: ['java'] },
    { id: 'cpp', name: 'C++', extensions: ['cpp', 'c', 'h', 'hpp'] },
    { id: 'swift', name: 'Swift', extensions: ['swift'] },
    { id: 'scala', name: 'Scala', extensions: ['scala'] },
    { id: 'yaml', name: 'YAML', extensions: ['yaml', 'yml'] },
    { id: 'json', name: 'JSON', extensions: ['json'] }
];

const LANGUAGE_ICONS = {
    javascript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    cpp: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    swift: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    scala: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg",
    yaml: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/yaml/yaml-original.svg",
    json: "https://upload.wikimedia.org/wikipedia/commons/c/c9/JSON_vector_logo.svg"
};

import { EyeOff } from 'lucide-react';

const CodeEditorWindow = ({ files = {}, language = "javascript", readOnly = true, onClose }) => {
    // Normalizing files structure to be always an object: { filename: content }
    const fileEntries = Object.entries(files);
    const [activeFile, setActiveFile] = useState(fileEntries.length > 0 ? fileEntries[0][0] : null);

    // Update active file if files prop changes and current active is not valid
    useEffect(() => {
        const entries = Object.entries(files);
        if (entries.length > 0) {
            if (!activeFile || !files[activeFile]) {
                setActiveFile(entries[0][0]);
            }
        }
    }, [files, activeFile]);

    const currentCode = activeFile ? files[activeFile] : "";

    // Auto-detect language from extension
    const getLanguageFromFilename = (filename) => {
        if (!filename) return language;
        const ext = filename.split('.').pop().toLowerCase();
        const found = LANGUAGES.find(l => l.extensions.includes(ext));
        return found ? found.id : language;
    };

    const currentLanguage = getLanguageFromFilename(activeFile);

    // Helper to get display name
    const getLanguageDisplayName = (langId) => {
        const found = LANGUAGES.find(l => l.id === langId);
        return found ? found.name : langId.toUpperCase();
    }

    // Handle Prism language key mapping
    const getPrismLanguage = (langId) => {
        const prismLangId = langId === 'cpp' ? 'cpp' : langId;
        return languages[prismLangId] || languages[prismLangId] || languages.javascript || languages.clike;
    };

    return (
        <div className="bg-[#1e1e1e] shadow-2xl flex flex-col overflow-hidden border border-slate-800/50 rounded-3xl h-full w-full">
            {/* Editor Header */}
            <div className="h-14 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar mask-linear-fade">
                    <div className="flex gap-1.5 shrink-0 mr-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        {fileEntries.map(([filename], index) => {
                            const isActive = filename === activeFile;
                            const fileLang = getLanguageFromFilename(filename);
                            // If filename is exactly "main.js" / "main.py" etc, show the Language Name instead
                            // Otherwise show filename (for multi-file support like debug rounds)
                            const isMainFile = filename.startsWith("main.");
                            const displayLabel = isMainFile ? getLanguageDisplayName(fileLang) : filename;

                            return (
                                <button
                                    key={filename}
                                    onClick={() => setActiveFile(filename)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium whitespace-nowrap
                                        ${isActive
                                            ? 'bg-[#2a2a2a] border-white/10 text-slate-200'
                                            : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400 hover:bg-white/5'
                                        }`}
                                >
                                    {LANGUAGE_ICONS[fileLang] && (
                                        <img
                                            src={LANGUAGE_ICONS[fileLang]}
                                            alt={fileLang}
                                            className={`w-3.5 h-3.5 object-contain ${!isActive && 'opacity-50 grayscale'}`}
                                        />
                                    )}
                                    {displayLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-4 border-l border-white/5 shrink-0">
                    {/* "Read Only" removed as requested */}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors text-xs font-medium"
                            title="Hide Code Window"
                        >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#1e1e1e]">
                <Editor
                    value={currentCode}
                    onValueChange={() => { }} // Read only
                    highlight={code => highlight(code || "", getPrismLanguage(currentLanguage), currentLanguage)}
                    padding={24}
                    style={{
                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                        fontSize: 14,
                        minHeight: '100%',
                        backgroundColor: 'transparent',
                        color: '#e2e8f0',
                        lineHeight: '1.6',
                        paddingBottom: '120px' // Extra space for status box
                    }}
                    className="min-h-full"
                    textareaClassName="focus:outline-none"
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
};

export default CodeEditorWindow;
