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
            stopAudioCapture();
            if (ws.current) ws.current.close();
            if (audioContext.current) audioContext.current.close();
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, []);

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
        <main className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 py-2 pointer-events-none">
                <div className="flex items-center justify-between mx-auto max-w-8xl">
                    {/* Logo Badge */}
                    <div className="flex items-center bg-white/90 backdrop-blur-md px-4 py-1 rounded-full border border-gray-200 shadow-sm pointer-events-auto">
                        <img src={logo} alt="Logo" className="w-10 h-12 object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-slate-900">
                                {company} {role}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">Realtime Code Round</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pointer-events-auto">


                        {/* Timer Badge */}
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
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
                            <div className={`flex gap-4 transition-all duration-500 ${!showCode ? 'flex-row w-full h-full' : 'flex-col w-[30%] min-w-[300px]'}`}>
                                {/* AI Interviewer Card */}
                                <div className="relative flex-1 min-h-[250px]">
                                    <InterviewerCard interviewState={interviewState} />
                                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-20">
                                        <p className="text-white text-xs font-medium">AI Interviewer</p>
                                    </div>
                                </div>

                                {/* User Card */}
                                <div className="relative flex-1 min-h-[250px]">
                                    <UserCard
                                        interviewState={interviewState}
                                        firstName={firstName}
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                        <p className="text-white text-xs font-medium">{firstName || "You"}</p>
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
                        (interviewState === 'ai-speaking' && currentQuestion && currentQuestion.trim().length > 0)
                    ) && (
                            <div className="absolute bottom-24 left-0 right-0 px-4 pointer-events-none flex justify-center z-30">
                                <div className="w-full max-w-6xl pointer-events-auto">
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
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50/90 to-transparent z-40">
                <div className="max-w-2xl mx-auto flex items-center justify-center gap-6 p-1">

                    {/* Microphone - Hidden in Phase 2 */}
                    {interviewPhase !== 'implementation' && (
                        <button
                            className={`p-4 rounded-full shadow-lg transition-all duration-300 ${isListening
                                ? 'bg-green-500 text-white animate-pulse'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:scale-105'
                                }`}
                        >
                            {isListening ? <Mic className="w-6 h-6" /> : <Mic className="w-4 h-4" />}
                        </button>
                    )}

                    {/* Submit Button - Only in Phase 2 */}
                    {interviewPhase === 'implementation' && (
                        <button
                            onClick={handleSubmitSolution}
                            className="px-8 py-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center gap-3 font-semibold"
                        >
                            <Send className="w-5 h-5" />
                            Submit Solution
                        </button>
                    )}

                    {/* End Call Button */}
                    <button
                        onClick={handleEndInterview}
                        className="p-4 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300"
                        title="End Interview"
                    >
                        <PhoneOff className="w-4 h-4" />
                    </button>

                    {/* View Report Button (Only when ended, but for dev we might want to trigger it) */}
                    {/* For now, let's make the red button navigate to report if phase is review? Or just dashboard? 
                        The user asked to navigate to interview report page when interview is ended. 
                        Let's change the red button behavior to go to report if checking out.
                    */}

                    <button
                        onClick={() => setShowCode(!showCode)}
                        className={`p-4 rounded-full shadow-lg transition-all duration-300 border border-slate-200 ${showCode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                        title={showCode ? 'Hide Code' : 'Show Code'}
                    >
                        <Terminal className="w-4 h-4" />
                    </button>

                </div>
            </div>
        </main>
    );
};

export default CodingRound;
