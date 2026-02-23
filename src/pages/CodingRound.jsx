import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Video, PhoneOff, Send, Layout, Code, Terminal, Play, Loader2, Volume2, VolumeX, AlertTriangle, TerminalIcon } from 'lucide-react';
import logo from '../assets/images/logo.png';
import InterviewerCard from '../components/InterviewerCard';
import UserCard from '../components/UserCard';
import StatusBox from '../components/StatusBox';
import MonacoEditorWindow from '../components/MonacoEditorWindow';


const CodingRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        role,
        firstName,
        lastName,
        ttsProvider = 'azure',
        problemDescription,
        codeContext,
        roundProblemData,
        company,
        level,
        type,
        slug, // Add slug from location state
        roundNum, // Ensure roundNum is passed
        evaluation_intelligence,
        candidate_reasoning_signals
    } = location.state || {};

    console.log('[CodingRound] Location State:', location.state);
    console.log('[CodingRound] Slug:', slug);


    // ============================================================================
    //  LOGIC & STATE
    // ============================================================================

    // UI State
    const [interviewState, setInterviewState] = useState('initializing'); // initializing, ai-speaking, user-speaking, speechEnd, processing
    const [interviewPhase, setInterviewPhase] = useState('clarification'); // clarification, implementation, review
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [sessionId, setSessionId] = useState(null); // Added session ID state
    const [initError, setInitError] = useState(false); // New: Tracks initialization failure

    // Coding State
    const [files, setFiles] = useState({
        "problem.txt": "Loading problem statement...",
        "main.js": "// Write your solution here\n"
    });
    const [activeFile, setActiveFile] = useState("problem.txt");
    const [showCode, setShowCode] = useState(true); // Default visible for coding

    const [currentAnswer, setCurrentAnswer] = useState(null); // User's transcript
    const [currentQuestion, setCurrentQuestion] = useState(null); // AI's Karaoke text

    // Refs
    const ws = useRef(null);
    const audioContext = useRef(null);
    const nextStartTimeRef = useRef(0);
    const isPlayingRef = useRef(false);

    // Karaoke Refs
    const pendingWordsRef = useRef([]);
    const rafIdRef = useRef(null);
    const displayedWordCountRef = useRef(0);
    const sequenceStartTimeRef = useRef(null);

    // Proactive Observer Refs
    const lastAiReactionTimeRef = useRef(0);

    // Timer Logic & Phase Transitions
    const transitionsTriggeredRef = useRef({ phase3: false, wrapupWarning: false, endInterview: false });
    const activeTtsSourcesRef = useRef(0);
    const phase3StartRef = useRef(null); // Track when Phase 3 starts

    // Audio Capture Refs
    const mediaStreamRef = useRef(null);
    const scriptProcessorRef = useRef(null);
    const audioInputRef = useRef(null);

    // Sync Ref with State
    const interviewStateRef = useRef(interviewState);
    useEffect(() => {
        interviewStateRef.current = interviewState;
    }, [interviewState]);

    // Timer Logic with Phase Transitions
    useEffect(() => {
        let interval;
        if (interviewState !== 'initializing' && interviewState !== 'ended' && interviewState !== 'error') {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;

                    // 1. Phase 3 Transition (Removed - handled manually by Submit)

                    // 2. Wrap-up Logic (Relative to Phase 3 Start)
                    if (interviewPhase === 'review' && phase3StartRef.current !== null) {
                        const timeInPhase3 = newTime - phase3StartRef.current;

                        // Warning at 15 mins (900s) into Phase 3
                        if (timeInPhase3 >= 900 && !transitionsTriggeredRef.current.wrapupWarning) {
                            transitionsTriggeredRef.current.wrapupWarning = true;
                            console.log('[Timer] Triggering Wrap-up Warning (15m in Phase 3)');
                            if (ws.current) {
                                ws.current.send(JSON.stringify({
                                    type: 'inject_system_message',
                                    payload: { text: "The interview is nearing the end (15 mins into review). Do not start new topics. Deep dive on current aspects or stress test existing code. You DO NOT have authority to end the interview yet. Continue probing until you receive the next system message." }
                                }));
                            }
                        }

                        // Final Wrap-up at 20 mins (1200s) into Phase 3
                        if (timeInPhase3 >= 1200 && !transitionsTriggeredRef.current.endInterview) {
                            transitionsTriggeredRef.current.endInterview = true;
                            console.log('[Timer] Triggering Final Wrap-up (20m in Phase 3)');
                            if (ws.current) {
                                ws.current.send(JSON.stringify({
                                    type: 'inject_system_message',
                                    payload: { text: "Call wrap_up_interview now." }
                                }));
                            }
                        }
                    }

                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [interviewState]);

    // Initialize Files (Construct from roundProblemData or fallback)
    useEffect(() => {
        if (roundProblemData) {
            // New Data Structure: Extract specific fields
            const { title, statement, constraints, critical_requirements, language, languages, files: preDefinedFiles } = roundProblemData;

            if (title || statement) {
                // Support both 'language' string and 'languages' array
                const displayLanguages = Array.isArray(languages) ? languages.join(', ') : (language || 'Any');

                const formatList = (items) => {
                    if (Array.isArray(items)) return items.map(i => `- ${i}`).join('\n');
                    if (typeof items === 'string' && items.trim()) return items;
                    return 'None';
                };

                const problemText = `Title: ${title || 'Untitled Problem'}
Supported Languages: ${displayLanguages}

Statement:
${statement || 'No description provided.'}

Constraints:
${formatList(constraints)}

Critical Requirements:
${formatList(critical_requirements)}
`;

                setFiles(preDefinedFiles || {
                    "problem.txt": problemText
                });
                setActiveFile("problem.txt");
                return;
            }

            // Fallback for pre-defined files in roundProblemData
            if (preDefinedFiles) {
                setFiles(preDefinedFiles);
                const first = Object.keys(preDefinedFiles)[0];
                if (first) setActiveFile(first);
                return;
            }
        }

        // 3. Static/Passed Data Fallback (Legacy / Manual)
        if (codeContext) {
            setFiles(codeContext.files || { "problem.txt": "No problem description", "main.js": "// Write your solution here\n" });
            const first = Object.keys(codeContext.files || {})[0] || "problem.txt";
            setActiveFile(first);
        }
    }, [roundProblemData, codeContext]);


    // 1. Initialize AudioContext & WebSocket on Mount
    useEffect(() => {
        // Initialize AudioContext
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000,
        });

        // WebSocket Connection
        ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

        ws.current.onopen = () => {
            console.log('[WS] Connected');

            // Construct System Prompt Context
            // Replicating logic from DesignRound.jsx to ensure all template variables are available
            const {
                role, firstName,
                level, name, type, title,
                roundKey, roundId,
                flow, persona, roundProblemData, evaluation,
                interviewContext, depthScaling, focusAspects,
                // ... other fields from location.state
            } = location.state || {};

            const sessionContext = {
                role: role || 'Software Engineer',
                firstName,
                level,
                name,
                type: 'coding', // Force type
                roundTitle: title,
                ttsProvider,

                // Spread nested objects to flatten them for template access
                ...flow,
                ...persona,
                ...roundProblemData,
                ...evaluation,

                // Explicit Aliases & Fallbacks
                domain: flow?.domain,
                location: persona?.location,
                problem_title: roundProblemData?.title || title || name,
                problem_statement: problemDescription || roundProblemData?.statement || "Solve the coding problem.",

                // Coding Specifics
                initial_files: files,

                // Pass original objects too just in case
                flow,
                persona,
                roundProblemData,
                evaluation,
                interviewContext,
                depthScaling,
                focusAspects,

                // Pass everything else as context
                ...location.state
            };

            // Send Init
            ws.current.send(JSON.stringify({
                type: 'init',
                payload: {
                    ...sessionContext,
                    ttsProvider: 'azure' // Explicitly force Azure
                }
            }));

            // Trigger STT immediately
            ws.current.send(JSON.stringify({
                type: 'start_audio'
            }));
        };

        ws.current.onmessage = async (event) => {
            try {
                let msg;
                if (event.data instanceof Blob) {
                    handleTtsChunk({ audio: await event.data.text() }); // Fallback if blob text? Unlikely
                    return;
                }

                msg = JSON.parse(event.data);

                if (msg.type === 'tts_chunk') {
                    await handleTtsChunk(msg.payload);
                }
                else if (msg.type === 'session_info') {
                    console.log(`[WS] Received session info: ${msg.payload.sessionId}`);
                    setSessionId(msg.payload.sessionId);
                }
                else if (msg.type === 'interviewer_turn') {
                    setCurrentQuestion(msg.payload.text);
                    setInterviewState('neutral');
                }
                else if (msg.type === 'stt_ready') { // or azure_ready
                    console.log('[STT] Ready - Starting Mic');
                    startAudioCapture();
                }
                else if (msg.type === 'user_transcript') {
                    if (interviewStateRef.current === 'ai-speaking' || interviewStateRef.current === 'ai-processing') {
                        return;
                    }

                    const { text, isFinal } = msg.payload;
                    setCurrentAnswer(text);
                    setInterviewState('user-speaking');
                    setIsListening(true);

                    if (isFinal) {
                        setIsListening(false);
                        setInterviewState('speechEnd');
                    }
                }
                else if (msg.type === 'user_turn_complete') {
                    console.log('[STT] User Turn Complete');
                    setIsListening(false);
                    setCurrentAnswer(null); // Added this line as per instruction
                    setInterviewState('speechEnd');
                }
                else if (msg.type === 'phase_transition') {
                    console.log(`[Phase] Transitioning to: ${msg.payload.phase}`);
                    setInterviewPhase(msg.payload.phase);

                    if (msg.payload.phase === 'implementation') {
                        setShowCode(true);
                        // Phase 2: Silent implementation phase
                        console.log('[Phase 2] Entering silent implementation phase');
                    }
                }
                else if (msg.type === 'error') {
                    console.error('[Server Error]', msg.payload.message);
                    if (interviewStateRef.current === 'initializing') {
                        setInitError(true);
                    }
                }
            } catch (err) {
                console.error('[WS] Message Error:', err);
            }
        };

        ws.current.onclose = () => {
            console.log('[WS] Disconnected');
            stopAudioCapture();
            if (interviewState !== 'ended') {
                setInterviewState('error');
            }
        };

        return () => {
            stopAudioServices();
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

    // 1.2 Initialization Timeout Watchdog
    useEffect(() => {
        let timeout;
        if (interviewState === 'initializing') {
            timeout = setTimeout(() => {
                if (interviewStateRef.current === 'initializing') {
                    console.error('[Session] Initialization timed out (25s)');
                    setInitError(true);
                }
            }, 25000);
        }
        return () => clearTimeout(timeout);
    }, [interviewState]);

    // 1.5 Audio Capture Logic (Linear16 PCM)
    const startAudioCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            if (!audioContext.current) return;
            if (audioContext.current.state === 'suspended') {
                await audioContext.current.resume();
            }

            const input = audioContext.current.createMediaStreamSource(stream);
            const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

            input.connect(processor);
            processor.connect(audioContext.current.destination);

            processor.onaudioprocess = (e) => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    const allowedStates = ['neutral', 'user-speaking'];
                    const currentState = interviewStateRef.current;

                    if (!allowedStates.includes(currentState)) {
                        return;
                    }

                    const inputData = e.inputBuffer.getChannelData(0);
                    // Downsample to Int16
                    const outputData = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        const s = Math.max(-1, Math.min(1, inputData[i]));
                        outputData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    }
                    ws.current.send(outputData.buffer);
                }
            };

            scriptProcessorRef.current = processor;
            audioInputRef.current = input;
            setIsListening(true);

        } catch (err) {
            console.error('[Audio] Capture Error:', err);
        }
    };

    const stopAudioCapture = () => {
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current.onaudioprocess = null;
        }
        if (audioInputRef.current) {
            audioInputRef.current.disconnect();
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsListening(false);
    };

    const stopAudioServices = () => {
        console.log('[Audio] Stopping all audio services...');
        stopAudioCapture();

        // Stop any currently playing TTS chunks
        if (audioContext.current) {
            try {
                // Suspending the context is faster/safer than closing it if we might need to "cleanup" multiple things
                if (audioContext.current.state !== 'closed') {
                    audioContext.current.suspend();
                }
            } catch (err) {
                console.error('[Audio] Error suspending audio context:', err);
            }
        }

        if (ws.current) {
            // Only close WS if we want to fully terminate, but for report generation we usually keep it.
            // However, the user request says cleanup STT and TTS "disconnected as soon as call is terminated".
            // Since we use the same WS for report data sometimes (history), we might just send a 'stop' signal if backend supports it.
            // But usually closing the mic and stopping the context is enough for the user's hardware/privacy.
            console.log('[WS] STT/TTS services detached from hardware.');
        }
    };


    // 2. TTS & Audio Handling
    const base64ToFloat32 = (base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768.0;
        return float32;
    };

    const handleTtsChunk = async (payload) => {
        const { audio, words } = payload;

        if (!audioContext.current) return;
        if (audioContext.current.state === 'suspended') {
            await audioContext.current.resume();
        }

        const float32 = base64ToFloat32(audio);
        const buffer = audioContext.current.createBuffer(1, float32.length, 16000);
        buffer.getChannelData(0).set(float32);

        const source = audioContext.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.current.destination);

        const currentTime = audioContext.current.currentTime;
        const startTime = Math.max(currentTime, nextStartTimeRef.current);

        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;

        activeTtsSourcesRef.current = (activeTtsSourcesRef.current || 0) + 1;

        if (!isPlayingRef.current) {
            isPlayingRef.current = true;
            setInterviewState('ai-speaking');
            setCurrentAnswer(null);
            sequenceStartTimeRef.current = startTime;
            setCurrentQuestion('');
            displayedWordCountRef.current = 0;
        } else if (payload.new_sentence) {
            sequenceStartTimeRef.current = startTime;
        }

        source.onended = () => {
            activeTtsSourcesRef.current = Math.max(0, (activeTtsSourcesRef.current || 0) - 1);
            setTimeout(() => {
                if (activeTtsSourcesRef.current === 0) {
                    const now = audioContext.current?.currentTime || 0;
                    if (now >= nextStartTimeRef.current - 0.2) {
                        console.log('[TTS] End of stream detected');
                        isPlayingRef.current = false;
                        setInterviewState('neutral');
                        setCurrentQuestion(null);
                        nextStartTimeRef.current = 0;
                        displayedWordCountRef.current = 0;
                        sequenceStartTimeRef.current = null;
                    }
                }
            }, 500);
        };

        // Queue Karaoke Words
        if (words && words.length > 0) {
            const anchorTime = sequenceStartTimeRef.current !== null ? sequenceStartTimeRef.current : startTime;
            words.forEach(w => {
                const start = w.start !== undefined ? w.start : (w.offset || 0);
                const word = w.word || w.text || '';
                const playTime = anchorTime + start;
                pendingWordsRef.current.push({ word, playTime });
            });
        }
    };

    // 3. Karaoke Loop
    useEffect(() => {
        const loop = () => {
            if (audioContext.current && isPlayingRef.current) {
                const now = audioContext.current.currentTime;
                const wordsToDisplay = [];
                while (pendingWordsRef.current.length > 0 && pendingWordsRef.current[0].playTime <= now) {
                    wordsToDisplay.push(pendingWordsRef.current.shift().word);
                }

                if (wordsToDisplay.length > 0) {
                    setCurrentQuestion(prev => {
                        let newText = prev || '';
                        let currentCount = displayedWordCountRef.current;
                        for (const word of wordsToDisplay) {
                            if (currentCount >= 20) {
                                newText = word;
                                currentCount = 1;
                            } else {
                                newText = newText ? (newText + ' ' + word) : word;
                                currentCount++;
                            }
                        }
                        displayedWordCountRef.current = currentCount;
                        return newText;
                    });
                }
            }
            rafIdRef.current = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(rafIdRef.current);
    }, []);

    // 4. Disable Audio Capture 20s After Phase 2
    useEffect(() => {
        let timer;

        if (interviewPhase === 'implementation') {
            console.log('[Phase 2] Starting 20s timer before disabling audio...');
            timer = setTimeout(() => {
                console.log('[Phase 2] 20 seconds elapsed - Disabling audio capture');
                // Stop audio capture
                if (scriptProcessorRef.current) {
                    scriptProcessorRef.current.disconnect();
                    scriptProcessorRef.current.onaudioprocess = null;
                }
                if (audioInputRef.current) {
                    audioInputRef.current.disconnect();
                }
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                    mediaStreamRef.current = null;
                }
                setIsListening(false);
            }, 20000); // 20 seconds
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [interviewPhase]);

    // ============================================================================
    // 💻 CODE HANDLING
    // ============================================================================

    const handleFileChange = (filename, content) => {
        setFiles(prev => ({ ...prev, [filename]: content }));
    };

    const handleFileCreate = (filename) => {
        if (!files[filename]) {
            setFiles(prev => ({ ...prev, [filename]: "" }));
            setActiveFile(filename);
        }
    };

    const handleFileDelete = (filename) => {
        const newFiles = { ...files };
        delete newFiles[filename];
        setFiles(newFiles);

        if (activeFile === filename) {
            const remaining = Object.keys(newFiles);
            setActiveFile(remaining.length > 0 ? remaining[0] : null);
        }
    };

    // Phase 2 Submit Handler
    const handleSubmitSolution = () => {
        if (!ws.current || interviewPhase !== 'implementation') {
            console.log('[Submit] Ignoring - not in implementation phase');
            return;
        }

        console.log('[Submit] Sending complete code solution to AI');

        // Build complete code context
        const codeContext = Object.entries(files)
            .map(([filename, content]) => `File: ${filename}\n\`\`\`\n${content}\n\`\`\``)
            .join('\n\n');

        // Send as message context
        ws.current.send(JSON.stringify({
            type: 'code_submission',
            payload: {
                files,
                codeContext,
                message: 'I\'ve completed my implementation. Here is my solution.'
            }
        }));

        console.log('[Submit] Code submission sent');

        // Transition to Phase 3
        setInterviewPhase('review');

        // Capture start time for Phase 3
        setElapsedTime(prev => {
            phase3StartRef.current = prev; // Capture current elapsed time as start
            return prev;
        });

        // Re-enable Audio
        setIsListening(true);
        startAudioCapture();
    };


    // 4. Code Execution Handling
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState(null);

    const handleRunCode = async (execOptions) => {
        // execOptions: { command, args } or undefined
        if (!activeFile && !execOptions) return;

        setIsRunning(true);
        setOutput(null);

        let language = 'javascript';
        let runArgs = [];

        if (execOptions && execOptions.command) {
            const cmd = execOptions.command.toLowerCase();
            const cmdArgs = execOptions.args || [];
            runArgs = cmdArgs;

            const cmdMap = {
                'node': 'javascript',
                'python': 'python',
                'python3': 'python',
                'java': 'java',
                'javac': 'java', // Just mapping to java runtime for now
                'go': 'go',
                'cpp': 'cpp',
                'g++': 'cpp',
                'bash': 'bash',
                'sh': 'bash'
            };

            if (cmdMap[cmd]) {
                language = cmdMap[cmd];
            } else {
                // Try to infer from command? e.g. "main.py"
                // For now, default to bash if unknown command and treat command as args?
                // Or just error? Let's treat unknown commands as bash for DevOps flexibility
                language = 'bash';
                // If it's not a known command, maybe it's a script/executable
                // Reconstruct full command line as args for bash -c?
                // Actually, piston bash executes the files. 
                // If the user types "ls -la", we want bash to run "ls -la".
                // We should pass the command + args as STDIN to bash? OR as args?
                // Piston bash treats 'files' as scripts.
                // If we want to run an interactive command, we might need to send it as stdin or a script file.
                // Simpler: If it's a known language runtime (python/node), use that.
                // If it's "bash", use bash.
                // If it's "ls", "grep" etc (which we handle in frontend), we are good.
                // If it's something else passed here, default to bash.
            }
        } else {
            // Default "Run" button behavior
            const ext = activeFile.split('.').pop().toLowerCase();
            const langMap = {
                'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript',
                'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c',
                'go': 'go', 'rs': 'rust', 'php': 'php', 'sh': 'bash'
            };
            language = langMap[ext] || 'javascript';
        }

        // Prepare ALL files for multi-file execution
        const fileList = Object.entries(files).map(([name, content]) => ({
            name,
            content
        }));

        // Sort execution order: 
        // If specific file called (e.g. python helper.py), put that first?
        // Piston executes the first file.
        let sortedFiles = [...fileList];

        // If specific file is targeted (e.g. current active file), put it first
        // If user ran "python test.py", we should put test.py first.
        let targetFile = activeFile;
        if (execOptions && execOptions.args && execOptions.args.length > 0) {
            // Check if first arg is a file
            const potentialFile = execOptions.args[0];
            if (files[potentialFile]) {
                targetFile = potentialFile;
                // Remove filename from args passed to Piston if the runtime handles it by being the first file?
                // Python: `python script.py arg1` -> script.py is first file, args are [arg1]
                runArgs = execOptions.args.slice(1);
            }
        }

        if (targetFile) {
            sortedFiles = [
                ...fileList.filter(f => f.name === targetFile),
                ...fileList.filter(f => f.name !== targetFile)
            ];
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/run-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: sortedFiles,
                    language: language,
                    args: runArgs,
                    stdin: ""
                })
            });

            const result = await response.json();

            if (result.error) {
                setOutput({ status: 'error', message: result.error });
            } else if (result.run) {
                const isError = result.run.code !== 0;
                // If signal is killed (timeout), show that
                const signal = result.run.signal;
                let message = (result.run.stdout || "") + (result.run.stderr || "");
                if (signal) message += `\n[Process killed: ${signal}]`;

                setOutput({
                    status: isError ? 'error' : 'success',
                    message: message || "No output."
                });
            } else {
                setOutput({ status: 'error', message: "Invalid response from server." });
            }

        } catch (error) {
            console.error("Run Code Error:", error);
            setOutput({ status: 'error', message: "Failed to connect to execution server." });
        } finally {
            setIsRunning(false);
        }
    };






    if (!location.state) {
        return <div className="p-8 text-center text-red-600">No interview state found. Please start from Interview Details.</div>;
    }

    // ============================================================================
    // 🖥️ RENDER (Exact Match to DesignRound)
    // ============================================================================

    // End Interview Logic
    const [isEndingInterview, setIsEndingInterview] = useState(false);

    const handleEndInterview = async () => {
        if (isEndingInterview) return;

        // IMMEDIATE CLEANUP of STT/TTS (Mic/AudioContext)
        stopAudioServices();

        setIsEndingInterview(true);

        try {
            // calculated elapsed time in minutes
            const durationInMinutes = elapsedTime / 60;

            // Criteria Check: Report generated only if Phase 1 & 2 done AND 10 mins in Phase 3
            // Phase 3 is 'review' in Coding Round
            const phase3StartTime = phase3StartRef.current;
            const timeInPhase3 = (interviewPhase === 'review' && phase3StartTime !== null)
                ? (elapsedTime - phase3StartTime)
                : 0;

            const generateReport = (interviewPhase === 'review' && timeInPhase3 >= 600); // 600s = 10m

            if (!generateReport) {
                const confirmEnd = window.confirm("You have not completed the minimum requirements for a detailed report (10 mins in Review Phase). Ending now will deduct credits but generate no report. Continue?");
                if (!confirmEnd) {
                    setIsEndingInterview(false);
                    return;
                }
            }

            // Get user ID
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) {
                console.error("User not authenticated");
                return;
            }

            // Prepare Context
            const contextData = {
                ...location.state,
                duration: durationInMinutes,
                performance_metrics: {
                    code_execution_count: 0,
                    lines_of_code: files['main.js']?.split('\n').length || 0
                }
            };

            if (generateReport) {
                // Navigate instantly, InterviewReport will handle the API call
                navigate('/report', {
                    state: {
                        ...location.state,
                        sessionId: sessionId || `session-${Date.now()}`,
                        triggeredByEndButton: true,
                        endInterviewParams: {
                            userId: userCreds.id,
                            durationInMinutes,
                            generateReport: true,
                            sessionId: sessionId || `session-${Date.now()}`,
                            history: [],
                            context: contextData
                        }
                    }
                });
            } else {
                // No report, just deduct credits in background and navigate
                fetch(`${import.meta.env.VITE_API_URL}/api/end-interview`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userCreds.id,
                        durationInMinutes,
                        generateReport: false,
                        sessionId: sessionId || `session-${Date.now()}`,
                        history: [],
                        context: contextData
                    }),
                }).catch(console.error); // Fire and forget

                navigate('/dashboard');
            }

        } catch (error) {
            console.error("Error ending interview:", error);
            navigate('/dashboard');
        } finally {
            setIsEndingInterview(false);
        }
    };

    // REMOVED LOADING OVERLAY
    // if (isEndingInterview) { ... }

    return (
        <main className="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6 pointer-events-none">
                <div className="flex items-center justify-between mx-auto max-w-8xl">
                    <div className="flex items-center bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/40 shadow-xl shadow-slate-200/50 pointer-events-auto transition-all duration-500 hover:scale-[1.02]">
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-black text-slate-900 tracking-tight">
                                {company} • {role}
                            </span>
                            <span className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-0.5">Coding Protocol</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <div className="bg-white/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/40 shadow-xl shadow-slate-200/50 flex items-center gap-3 transition-all duration-500 hover:scale-[1.02]">
                            <div className="relative">
                                <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                {isListening && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>}
                            </div>
                            <div className="font-mono text-base font-black text-slate-900 tabular-nums tracking-wider">
                                {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-0 justify-center p-4 pb-24 md:px-8">
                <div className="w-full max-w-8xl mx-auto h-full flex flex-col justify-center">
                    {interviewState === 'initializing' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold text-slate-900">Initializing Environment</h3>
                                <p className="text-slate-500 text-sm mt-2">Setting up your coding workspace...</p>
                            </div>
                        </div>
                    ) : interviewState === 'ended' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-slate-900">Interview Ended</h3>
                                <p className="text-slate-500 text-sm mt-2">Session has been terminated</p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Exit
                                </button>
                                <button
                                    onClick={() => navigate('/report', { state: location.state })}
                                    className="mt-4 ml-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                                >
                                    View Report
                                </button>
                            </div>
                        </div>
                    ) : (

                        <div className={`flex gap-4 h-full w-full ${!showCode ? 'items-stretch p-4' : 'max-h-[80vh]'}`}>
                            {/* Left Side: Video Cards */}
                            <div className={`flex gap-4 transition-all duration-500 ${!showCode ? 'flex-row w-full h-full' : 'flex-col w-[30%] min-w-[320px]'}`}>
                                {/* AI Interviewer Card */}
                                <div className={`relative flex-1 ${!showCode ? 'min-h-[400px]' : 'min-h-[220px]'}`}>
                                    <InterviewerCard interviewState={interviewState} />
                                    <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20 shadow-2xl">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">Technical Lead</p>
                                    </div>
                                </div>

                                {/* User Card */}
                                <div className={`relative flex-1 ${!showCode ? 'min-h-[400px]' : 'min-h-[220px]'}`}>
                                    <UserCard
                                        interviewState={interviewState}
                                        firstName={firstName}
                                        lastName={lastName}
                                    />
                                    <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20 shadow-2xl">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">{firstName || "Candidate"} {lastName || ""}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Code Editor (70%) */}
                            {showCode && (
                                <div className="flex-1 relative bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden border border-slate-700 animate-in fade-in slide-in-from-right duration-700 flex flex-col">
                                    <MonacoEditorWindow
                                        files={files}
                                        activeFile={activeFile}
                                        readOnly={false}
                                        onFileChange={handleFileChange}
                                        onFileCreate={handleFileCreate}
                                        onFileDelete={handleFileDelete}
                                        onActiveFileChange={setActiveFile}
                                        onRunCode={handleRunCode}
                                        isRunning={isRunning}
                                        output={output}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Status Box - Show User OR Interviewer transcript */}
                    {interviewState !== 'initializing' && interviewState !== 'ended' && interviewState !== 'speechEnd' && (
                        (interviewState === 'user-speaking' && currentAnswer && currentAnswer.trim().length > 0) ||
                        (interviewState === 'ai-speaking' && (currentQuestion || true))
                    ) && (
                            <div className="absolute bottom-32 left-0 right-0 px-8 pointer-events-none flex justify-center z-30">
                                <div className="w-full max-w-5xl pointer-events-auto">
                                    <StatusBox
                                        interviewState={interviewState}
                                        currentQuestion={currentQuestion}
                                        currentAnswer={currentAnswer}
                                    />
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 to-transparent z-40">
                <div className="max-w-xl mx-auto flex items-center justify-center gap-6 bg-white/80 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/40 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:scale-[1.02]">

                    {/* Microphone Indicator */}
                    {interviewPhase !== 'implementation' && (
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${isListening ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                            <div className="relative">
                                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                                {isListening && <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{isListening ? 'Active' : 'Muted'}</span>
                        </div>
                    )}

                    {/* Submit Button - Only in Phase 2 */}
                    {interviewPhase === 'implementation' && (
                        <button
                            onClick={handleSubmitSolution}
                            className="group relative px-10 py-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center gap-3">
                                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Deploy Solution</span>
                            </div>
                        </button>
                    )}

                    {/* Separator */}
                    <div className="w-px h-8 bg-slate-100" />

                    {/* View Controls */}
                    <button
                        onClick={() => setShowCode(!showCode)}
                        className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden transition-all duration-500 ${showCode ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-900 text-white'
                            }`}
                        title={showCode ? 'Expand View' : 'Workspace View'}
                    >
                        {showCode ? <Layout className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={handleEndInterview}
                        className="group relative flex items-center justify-start w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden transition-all duration-500 hover:w-44 hover:bg-red-600 shadow-xl"
                        title="End Interview"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center w-full px-4.5 gap-3 relative z-10">
                            <PhoneOff className="w-5 h-5 text-white flex-shrink-0 transition-transform duration-500 group-hover:rotate-[135deg]" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap">
                                Terminate Session
                            </span>
                        </div>
                    </button>

                </div>
            </div>

            {/* Premium Connection Error Modal */}
            <AnimatePresence>
                {initError && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl max-w-md w-full p-10 border border-white/40 overflow-hidden text-center"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

                            <div className="relative space-y-8">
                                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
                                    <AlertTriangle className="w-10 h-10 text-indigo-600" />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Connection Protocol Failed</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        We encountered a synchronization error with our AI interviewer.
                                        <span className="block mt-2 font-bold text-slate-900">Your credits have not been deducted.</span>
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200/50 uppercase tracking-[0.2em] text-xs"
                                    >
                                        Synchronize Again
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="w-full py-4 mt-2 text-slate-400 font-black hover:text-slate-900 transition-colors uppercase tracking-[0.2em] text-[10px]"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default CodingRound;
