import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Files, FileText, Layout, ChevronRight, MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import SystemDesignCanvas from './SystemDesignCanvas';

const DesignCanvasWindow = ({
    onDesignChange,
    onComponentSelect,
    selectedComponentId,
    stateRef,
    initialFiles = {
        "architecture.design": { components: [], connections: [] }
    },
    interviewMode = false,
    problemContent = null,
    isFullScreen = false,
    onToggleFullScreen
}) => {
    const [files, setFiles] = useState(initialFiles);
    const [activeFile, setActiveFile] = useState(Object.keys(initialFiles)[0]);
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [showProblem, setShowProblem] = useState(false); // Default closed

    // Sync stateRef to the active file's data
    // SystemDesignCanvas already populates stateRef via its props
    // but we need to ensure the parent can access ALL files if needed.
    // For now, let's keep the parent updated with the full files object.
    useEffect(() => {
        if (onDesignChange) {
            onDesignChange({
                type: 'files_updated',
                files: files,
                activeFile: activeFile
            });
        }
    }, [files, activeFile]);

    const handleDesignChange = (change) => {
        // Update the current file's data in our state
        // SystemDesignCanvas modifies components/connections internally
        // We need a way to get the latest state from SystemDesignCanvas.
        // Option A: Lift components/connections state to DesignCanvasWindow.
        // Option B: SystemDesignCanvas notifies on every change.

        // SystemDesignCanvas already has onDesignChange. We can wrap it.
        if (onDesignChange) {
            onDesignChange(change);
        }
    };

    // This is a bit tricky: SystemDesignCanvas manages its own internal state for performance.
    // When switching tabs, we need to SAVE the current state of the canvas into our 'files' object
    // and then LOAD the new file's data.

    const handleTabSwitch = (filename) => {
        if (filename === activeFile) return;

        // Save current canvas state to files
        // We use stateRef to get the absolute latest from SystemDesignCanvas
        if (stateRef?.components?.current) {
            setFiles(prev => ({
                ...prev,
                [activeFile]: {
                    components: [...stateRef.components.current],
                    connections: [...stateRef.connections.current]
                }
            }));
        }

        setActiveFile(filename);
    };

    const handleCreateFile = () => {
        const name = prompt("Enter new design name (e.g., database.design):");
        if (name) {
            const fileName = name.endsWith('.design') ? name : `${name}.design`;
            if (files[fileName]) {
                alert("File already exists");
                return;
            }

            // Save current before switching
            if (stateRef?.components?.current) {
                setFiles(prev => ({
                    ...prev,
                    [activeFile]: {
                        components: [...stateRef.components.current],
                        connections: [...stateRef.connections.current]
                    },
                    [fileName]: { components: [], connections: [] }
                }));
            } else {
                setFiles(prev => ({
                    ...prev,
                    [fileName]: { components: [], connections: [] }
                }));
            }
            setActiveFile(fileName);
        }
    };

    const handleDeleteFile = (e, filename) => {
        e.stopPropagation();
        if (Object.keys(files).length <= 1) return;

        const newFiles = { ...files };
        delete newFiles[filename];
        setFiles(newFiles);

        if (activeFile === filename) {
            setActiveFile(Object.keys(newFiles)[0]);
        }
    };

    return (
        <div className="flex h-full w-full bg-[#f8fafc] text-[#334155] overflow-hidden font-sans rounded-lg relative border border-slate-200 shadow-xl">
            {/* 1. Activity Bar (Far Left) - Matching Monaco style */}
            <div className="hidden md:flex w-12 flex-col items-center py-3 bg-[#e2e8f0] shrink-0 z-20 border-r border-slate-300">
                <div className="flex flex-col gap-6">
                    <div
                        onClick={() => {
                            setSideBarVisible(!sideBarVisible);
                            setShowProblem(false);
                        }}
                        className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all rounded-lg mx-auto ${sideBarVisible ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                        title="Explorer"
                    >
                        <Files className="w-5 h-5" />
                    </div>

                    {/* Problem Brief Toggle */}
                    {problemContent && (
                        <div
                            onClick={() => {
                                setShowProblem(!showProblem);
                                setSideBarVisible(false);
                            }}
                            className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all rounded-lg mx-auto ${showProblem ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                            title="Problem Brief"
                        >
                            <FileText className="w-5 h-5" />
                        </div>
                    )}

                    {/* Full Screen Toggle */}
                    {onToggleFullScreen && (
                        <div
                            onClick={onToggleFullScreen}
                            className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all rounded-lg mx-auto ${isFullScreen ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                        >
                            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Explorer Sidebar */}
            {sideBarVisible && (
                <div className="w-60 bg-[#f1f5f9] flex flex-col border-r border-slate-300 shrink-0 animate-in slide-in-from-left-2 duration-200">
                    <div className="h-9 px-4 flex items-center justify-between border-b border-slate-300 bg-[#f1f5f9] text-[10px] font-bold tracking-wider uppercase text-slate-500">
                        <span>Explorer</span>
                        <MoreHorizontal className="w-4 h-4 hover:text-slate-900 cursor-pointer" />
                    </div>

                    <div className="flex-1 overflow-y-auto pt-2">
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3 rotate-90" />
                            DESIGN-PROJECT
                        </div>
                        {Object.keys(files).map(filename => (
                            <div
                                key={filename}
                                onClick={() => handleTabSwitch(filename)}
                                className={`flex items-center gap-2 px-6 py-1.5 cursor-pointer text-sm transition-colors ${activeFile === filename ? 'bg-white text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-200'}`}
                            >
                                <Layout className="w-3.5 h-3.5 opacity-70" />
                                <span className="truncate">{filename}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Problem Brief Sidebar */}
            {showProblem && problemContent && (
                <div className="w-80 bg-white flex flex-col border-r border-slate-300 shrink-0 animate-in slide-in-from-left-2 duration-200">
                    <div className="h-9 px-4 flex items-center justify-between border-b border-slate-100 bg-white text-[10px] font-bold tracking-wider uppercase text-slate-500">
                        <span>Problem Brief</span>
                        <X
                            className="w-4 h-4 hover:text-slate-900 cursor-pointer"
                            onClick={() => setShowProblem(false)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {problemContent}
                    </div>
                </div>
            )}

            {/* 3. Main Canvas Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Tabs Header */}
                <div className="h-10 bg-[#e2e8f0] flex overflow-x-auto no-scrollbar shrink-0 border-b border-slate-300">
                    {Object.keys(files).map(filename => (
                        <div
                            key={filename}
                            onClick={() => handleTabSwitch(filename)}
                            className={`group flex items-center gap-2 px-4 min-w-[140px] max-w-[220px] h-full cursor-pointer text-xs border-r border-slate-300 select-none transition-all relative ${activeFile === filename ? 'bg-white text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            {activeFile === filename && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />}
                            <Layout className={`w-3.5 h-3.5 ${activeFile === filename ? 'text-blue-500' : 'text-slate-400 opacity-70'}`} />
                            <span className="truncate flex-1">{filename}</span>
                            {Object.keys(files).length > 1 && (
                                <div
                                    onClick={(e) => handleDeleteFile(e, filename)}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    ))}
                    <div
                        onClick={handleCreateFile}
                        className="flex items-center justify-center w-10 h-full hover:bg-slate-300 cursor-pointer text-slate-500 transition-colors"
                        title="New Design"
                    >
                        <Plus className="w-4 h-4" />
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="h-7 bg-white flex items-center px-4 text-[10px] text-slate-400 border-b border-slate-100 shrink-0 gap-2 uppercase tracking-tight">
                    <span className="hover:text-slate-600 cursor-pointer">Project</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span className="text-slate-600 font-semibold">{activeFile}</span>
                </div>

                {/* Canvas Surface */}
                <div className="flex-1 relative min-h-0">
                    <SystemDesignCanvas
                        key={activeFile} // Crucial for full reset
                        onDesignChange={handleDesignChange}
                        onComponentSelect={onComponentSelect}
                        selectedComponentId={selectedComponentId}
                        stateRef={stateRef}
                        initialData={files[activeFile]}
                        interviewMode={interviewMode}
                        isFullScreen={isFullScreen}
                    />
                </div>
            </div>
        </div>
    );
};

export default DesignCanvasWindow;
