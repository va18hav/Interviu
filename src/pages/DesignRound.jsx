import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Video, PhoneOff, Send, Layout, FileText, Sparkles, X, Loader2 } from 'lucide-react';
import logo from '../assets/images/logo.png';
import InterviewerCard from '../components/InterviewerCard';
import UserCard from '../components/UserCard';
import StatusBox from '../components/StatusBox';
import DesignCanvasWindow from '../components/DesignCanvasWindow';

const DesignRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        role,
        firstName,
        roundProblemData,
        evaluation_intelligence,
        candidate_reasoning_signals
    } = location.state || {};

    // ============================================================================
    //  LOGIC & STATE
    // ============================================================================

    // UI State
    const [interviewState, setInterviewState] = useState('initializing'); // Start as initializing
    const [interviewPhase, setInterviewPhase] = useState('requirements'); // requirements, design, deep-dive
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [sessionId, setSessionId] = useState(null); // Added session ID state
    const [showProblem, setShowProblem] = useState(true); // Toggle for problem panel

    // Timer Logic & Phase Transitions
    const transitionsTriggeredRef = useRef({ phase3: false, wrapupWarning: false, endInterview: false });
    const phase3StartRef = useRef(null); // Track when Phase 3 starts

    useEffect(() => {
        let interval;
        if (interviewState !== 'initializing' && interviewState !== 'ended' && interviewState !== 'error') {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;

                    // 1. Phase 3 Transition (Removed - handled manually by Submit)

                    // 2. Wrap-up Logic (Relative to Phase 3 Start)
                    if (interviewPhase === 'deep-dive' && phase3StartRef.current !== null) {
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
    const [showCanvas, setShowCanvas] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null); // User's transcript
    const [currentQuestion, setCurrentQuestion] = useState(null); // AI's Karaoke text

    // Design Canvas State
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [designFiles, setDesignFiles] = useState({});

    // Refs
    const ws = useRef(null);
    const audioContext = useRef(null);
    const nextStartTimeRef = useRef(0);
    const isPlayingRef = useRef(false);

    // Karaoke Refs
    const pendingWordsRef = useRef([]); // Queue of { word, playTime }
    const rafIdRef = useRef(null);
    const displayedWordCountRef = useRef(0); // Track words on current page
    const sequenceStartTimeRef = useRef(null); // Track sequence start time

    // Proactive Design Observer Refs
    const lastAiReactionTimeRef = useRef(0);
    // Watchdog for SpeechEnd State (Stuck Prevention)
    useEffect(() => {
        let stuckTimer;
        if (interviewState === 'speechEnd') {
            stuckTimer = setTimeout(() => {
                console.warn('[Watchdog] Stuck in speechEnd for 15s. Reverting to neutral.');
                setInterviewState('neutral'); // Or 'user-speaking' / 'listening' if you want auto-listen
                // Maybe show a toast/alert?
            }, 15000);
        }
        return () => clearTimeout(stuckTimer);
    }, [interviewState]);

    // Audio Capture Refs
    const mediaStreamRef = useRef(null);
    const scriptProcessorRef = useRef(null);
    const audioInputRef = useRef(null);

    // Sync Ref with State
    const interviewStateRef = useRef(interviewState);
    useEffect(() => {
        interviewStateRef.current = interviewState;
    }, [interviewState]);

    // 1. Initialize AudioContext & WebSocket on Mount
    useEffect(() => {
        // Initialize AudioContext
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000, // Match backend/Deepgram
        });

        // WebSocket Connection
        ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

        ws.current.onopen = () => {
            console.log('[WS] Connected');

            // Construct System Prompt Context from Location State
            // Replicating logic from InterviewSession.jsx to ensure all template variables are available
            const {
                role, firstName,
                level, name, type, title,
                roundKey, roundId,
                flow, persona, roundProblemData, evaluation,
                interviewContext, depthScaling, focusAspects,
                // ... other fields from location.state
            } = location.state || {};

            const sessionContext = {
                role,
                firstName,
                level,
                name,
                type,
                roundTitle: title,

                // Spread nested objects to flatten them for template access
                ...flow,
                ...persona,
                ...roundProblemData,
                ...evaluation,

                // Explicit Aliases & Fallbacks
                domain: flow?.domain,
                location: persona?.location,
                problem_title: roundProblemData?.title || title || name,
                problem_statement: roundProblemData?.statement,

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
                    ttsProvider: 'azure' // Explicitly use Azure
                }
            }));

            // Trigger STT immediately
            ws.current.send(JSON.stringify({
                type: 'start_audio'
            }));
        };

        ws.current.onmessage = async (event) => {
            try {
                const msg = JSON.parse(event.data);

                if (msg.type === 'tts_chunk') {
                    // { audio, words, textChunk }
                    await handleTtsChunk(msg.payload);
                }
                else if (msg.type === 'session_info') {
                    console.log(`[WS] Received session info: ${msg.payload.sessionId}`);
                    setSessionId(msg.payload.sessionId);
                }
                else if (msg.type === 'interviewer_turn') {
                    // Fallback Text-Only
                    setCurrentQuestion(msg.payload.text);
                    setInterviewState('neutral');
                }
                else if (msg.type === 'stt_ready') {
                    console.log('[STT] Deepgram Ready - Starting Mic');
                    startAudioCapture();
                }
                else if (msg.type === 'user_transcript') {
                    // GUARD: Don't let late transcripts override AI speaking state
                    if (interviewStateRef.current === 'ai-speaking' || interviewStateRef.current === 'ai-processing' || interviewStateRef.current === 'speechEnd') {
                        return;
                    }

                    // Live User Feedback
                    const { text, isFinal } = msg.payload;
                    setCurrentAnswer(text);
                    setInterviewState('user-speaking');
                    setIsListening(true);

                    if (isFinal) {
                        setIsListening(false);
                        setInterviewState('speechEnd');
                    }
                }
                else if (msg.type === 'phase_transition') {
                    console.log(`[Phase] Transitioning to: ${msg.payload.phase}`);
                    setInterviewPhase(msg.payload.phase);

                    if (msg.payload.phase === 'design') {
                        setShowCanvas(true);
                        // Also ensure internal state matches if needed
                    }
                }
                else if (msg.type === 'user_turn_complete') {
                    console.log('[STT] User Turn Complete');
                    setIsListening(false);
                    // Valid state transition: User finished -> speechEnd
                    // Mic should be disabled here.
                    setInterviewState('speechEnd');
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
                // Optional: Reconnect logic could go here
                setInterviewState('error'); // Or handle gracefully
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
            // Buffer size 4096 gives ~256ms latency at 16kHz, usually fine for STT
            // Decrease to 2048 or 1024 for lower latency if needed (but more CPU)
            const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

            input.connect(processor);
            processor.connect(audioContext.current.destination);

            processor.onaudioprocess = (e) => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    // GATING: Only send audio if allowed
                    // allowed: neutral (waiting for user), user-speaking (active)
                    // blocked: initializing, ai-speaking, ai-processing, speechEnd, listening (initial startup)
                    const allowedStates = ['neutral', 'user-speaking'];
                    const currentState = interviewStateRef.current;

                    if (!allowedStates.includes(currentState)) {
                        return; // 🛑 Block audio
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
            // DO NOT set state to 'listening' here. It should remain 'initializing' or whatever it was.
            // setInterviewState('listening'); 

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

        // Log chunk stats for debugging
        console.log(`[TTS] Received chunk: ${audio.length} bytes, ${words ? words.length : 0} words`);

        if (!audioContext.current) return;
        if (audioContext.current.state === 'suspended') {
            await audioContext.current.resume();
        }

        // Decode
        const float32 = base64ToFloat32(audio);
        const buffer = audioContext.current.createBuffer(1, float32.length, 16000);
        buffer.getChannelData(0).set(float32);

        // Schedule
        const source = audioContext.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.current.destination);

        const currentTime = audioContext.current.currentTime;
        // Schedule next chunk at the end of the previous one, or now if we fell behind
        const startTime = Math.max(currentTime, nextStartTimeRef.current);

        source.start(startTime);
        nextStartTimeRef.current = startTime + buffer.duration;

        // 🔊 Track Active Source
        activeTtsSourcesRef.current = (activeTtsSourcesRef.current || 0) + 1;

        // Update State
        if (!isPlayingRef.current) {
            isPlayingRef.current = true;
            setInterviewState('ai-speaking');

            // ✅ Clear user transcript when AI starts speaking
            setCurrentAnswer(null);

            // Start of a valid sequence
            // We use the ACTUAL start time of the first chunk as the anchor
            sequenceStartTimeRef.current = startTime;

            // Clear previous texts when AI starts a new utterance sequence
            setCurrentQuestion('');
            displayedWordCountRef.current = 0;
        } else if (payload.new_sentence) {
            // 🔄 New Sentence in same stream: Reset anchor
            console.log('[TTS] New Sentence detected. Resetting anchor time.');
            sequenceStartTimeRef.current = startTime;
        }

        source.onended = () => {
            activeTtsSourcesRef.current = Math.max(0, (activeTtsSourcesRef.current || 0) - 1);

            // Check if queue is empty or if we are at the end of the stream
            // Increased timeout to 500ms to handle network jitter between chunks
            setTimeout(() => {
                // GUARD: If a new chunk arrived/started in the meantime, activeTtsSourcesRef would be > 0.
                if (activeTtsSourcesRef.current === 0) {
                    const now = audioContext.current?.currentTime || 0;
                    // Double check time just in case, but ref count is more reliable for "network holes"
                    if (now >= nextStartTimeRef.current - 0.2) { // 200ms grace
                        console.log('[TTS] End of stream detected (Sources=0)');
                        isPlayingRef.current = false;
                        setInterviewState('neutral');
                        setCurrentQuestion(null); // Clear text after speaking
                        nextStartTimeRef.current = 0; // Reset for next turn
                        displayedWordCountRef.current = 0;
                        sequenceStartTimeRef.current = null;
                    }
                }
            }, 500);
        };

        // Queue Karaoke Words
        if (words && words.length > 0) {
            // If sequenceStartTimeRef is null (shouldn't be due to order above, but safety), fallback to startTime
            const anchorTime = sequenceStartTimeRef.current !== null ? sequenceStartTimeRef.current : startTime;

            words.forEach(w => {
                // Support varied timestamp formats (Cartesia vs Azure vs Deepgram)
                // Azure/Cartesia usually provide offset relative to start of SYNTHESIS (absolute)
                const start = w.start !== undefined ? w.start : (w.offset || 0);
                // Convert from potential microseconds (if applicable) - usually seconds or milliseconds
                // Assuming `start` is in SECONDS from backend (or need conversion?)
                // Azure returns 100ns ticks. Provider converts?

                // Let's assume provider normalizes to SECONDS. If not, we might need /1000 etc.
                // Checks on w.start usually show e.g. 0.5 for 500ms.

                const word = w.word || w.text || '';

                // Absolute time when this word should appear
                // playTime = Anchor (start of First Chunk) + Word Offset (Absolute)
                const playTime = anchorTime + start;

                pendingWordsRef.current.push({ word, playTime });
            });
        }
    };

    // 3. Karaoke Loop (Visual RequestAnimationFrame)
    useEffect(() => {
        const loop = () => {
            if (audioContext.current && isPlayingRef.current) {
                const now = audioContext.current.currentTime;

                // Find all words that should be displayed by now
                const wordsToDisplay = [];
                while (pendingWordsRef.current.length > 0 && pendingWordsRef.current[0].playTime <= now) {
                    wordsToDisplay.push(pendingWordsRef.current.shift().word);
                }

                if (wordsToDisplay.length > 0) {
                    setCurrentQuestion(prev => {
                        let newText = prev || '';
                        let currentCount = displayedWordCountRef.current;

                        // Process one by one to handle pagination logic correctly
                        for (const word of wordsToDisplay) {
                            if (currentCount >= 20) {
                                // Reset for next "page"
                                newText = word;
                                currentCount = 1;
                            } else {
                                // Append with space if needed
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

        if (interviewPhase === 'design') {
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

    // Design State Refs
    const designStateRef = useRef({ components: { current: [] }, connections: { current: [] } });
    const activeTtsSourcesRef = useRef(0);

    // ============================================================================
    // 🧠 HELPER: Generate Design Context
    // ============================================================================
    const generateDesignContext = (components, connections) => {
        if (!components || components.length === 0) return "Empty Canvas";

        // Summary of components
        const componentList = components.map(c => {
            const label = c.config?.label || c.type;
            const type = c.type;
            const config = c.config ? JSON.stringify(c.config) : '';
            return `- ${label} (${type}) ${config ? `Config: ${config}` : ''}`;
        }).join('\n');

        // Summary of connections
        const connectionList = connections.map(c => {
            const sourceId = c.source || c.from;
            const targetId = c.target || c.to;

            const fromComp = components.find(x => x.id === sourceId);
            const toComp = components.find(x => x.id === targetId);

            const from = fromComp?.config?.label || fromComp?.type || "Unknown";
            const to = toComp?.config?.label || toComp?.type || "Unknown";

            return `- ${from} -> ${to} (${c.protocol || 'Default'})`;
        }).join('\n');

        return `Current Design State:\nComponents:\n${componentList}\n\nFlows:\n${connectionList}`;
    };

    // Phase 2 Submit Handler
    const handleSubmitDesign = () => {
        if (!ws.current || interviewPhase !== 'design') {
            console.log('[Submit] Ignoring - not in design phase');
            return;
        }

        console.log('[Submit] Sending complete design solution to AI');

        // Build comprehensive design context from all files
        let fullDesignContext = "";
        const allFiles = { ...designFiles };

        // Ensure the absolute latest from the active canvas is included
        // designFiles might be slightly behind if onDesignChange wasn't called for the last layout shift
        const activeFileName = Object.keys(allFiles).find(name => allFiles[name].active) || Object.keys(allFiles)[0];
        if (activeFileName && designStateRef.current) {
            allFiles[activeFileName] = {
                components: [...designStateRef.current.components.current],
                connections: [...designStateRef.current.connections.current]
            };
        }

        Object.entries(allFiles).forEach(([filename, data]) => {
            fullDesignContext += `\n### File: ${filename}\n`;
            fullDesignContext += generateDesignContext(data.components, data.connections);
            fullDesignContext += "\n---\n";
        });

        // Send as message context
        ws.current.send(JSON.stringify({
            type: 'design_submission',
            payload: {
                files: allFiles,
                designContext: fullDesignContext,
                message: 'I\'ve completed my design implementation across multiple configurations. Here is my solution.'
            }
        }));

        console.log('[Submit] Design submission sent');

        // Transition to Phase 3
        setInterviewPhase('deep-dive');

        // Capture start time for Phase 3
        setElapsedTime(prev => {
            phase3StartRef.current = prev;
            return prev;
        });

        // Re-enable Audio
        setIsListening(true);
        startAudioCapture();
    };

    // Full Screen Toggle
    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreen = () => setIsFullScreen(prev => !prev);
    // ============================================================================
    // 💬 UI RENDERING
    // ============================================================================


    // Early return if no state (preserved from original)
    if (!location.state) {
        return <div className="p-8 text-center text-red-600">No interview state found. Please start from Interview Details.</div>;
    }

    // End Interview Logic
    const [isEndingInterview, setIsEndingInterview] = useState(false);

    const handleEndInterview = async () => {
        if (isEndingInterview) return;

        // Criteria Check: Report generated only if Phase 1 & 2 done AND 10 mins in Phase 3
        // Phase 3 is 'deep-dive' in Design Round
        const phase3StartTime = phase3StartRef.current;
        const timeInPhase3 = (interviewPhase === 'deep-dive' && phase3StartTime !== null)
            ? (elapsedTime - phase3StartTime)
            : 0;

        const generateReport = (interviewPhase === 'deep-dive' && timeInPhase3 >= 600); // 600s = 10m

        if (!generateReport) {
            const confirmEnd = window.confirm("You have not completed the minimum requirements for a detailed report (10 mins in Deep Dive Phase). Ending now will deduct credits but generate no report. Continue?");
            if (!confirmEnd) {
                return;
            }
        }

        setIsEndingInterview(true);

        try {
            const durationInMinutes = elapsedTime / 60;
            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
            if (!userCreds?.id) return;

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
                            context: {
                                ...location.state,
                                duration: durationInMinutes,
                                performance_metrics: {
                                    components_created: Object.keys(designFiles).length
                                }
                            }
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
                        context: {
                            ...location.state,
                            duration: durationInMinutes,
                            performance_metrics: {
                                components_created: Object.keys(designFiles).length
                            }
                        }
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
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
                backgroundImage: 'radial-gradient(circle at center, #bfdbfe 0%, transparent 70%)'
            }}></div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 py-2 pointer-events-none">
                <div className={`flex items-center mx-auto max-w-8xl ${isFullScreen ? 'justify-end' : 'justify-between'}`}>
                    {/* Logo Badge - Hide in Full Screen */}
                    {!isFullScreen && (
                        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm pointer-events-auto">
                            <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-bold text-slate-900">
                                    {role || 'Test Interview'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">Experimental</span>
                            </div>
                        </div>
                    )}

                    {/* Timer Badge - Now on the right */}
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm pointer-events-auto flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                            {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
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
                                <h3 className="text-xl font-semibold text-slate-900">Initializing Interview</h3>
                                <p className="text-slate-500 text-sm mt-2">Please wait while we establish connection...</p>
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
                                    Exit Test
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

                        <div className={`flex gap-4 h-full w-full ${!showCanvas ? 'items-stretch p-4' : 'max-h-[80vh]'}`}>
                            {/* Left Side: Video Cards */}
                            <div className={`flex gap-4 transition-all duration-500 ${!showCanvas ? 'flex-row w-full h-full' : 'flex-col w-[30%] min-w-[300px]'}`}>
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

                            {/* Right Side: Design Canvas (70%) */}
                            {showCanvas && (
                                <div className={`transition-all duration-500 ${isFullScreen ? 'w-full h-full absolute inset-0 z-50 bg-white' : 'flex-1 relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 animate-in fade-in slide-in-from-right duration-700'}`}>
                                    <DesignCanvasWindow
                                        onDesignChange={(change) => {
                                            if (change.type === 'files_updated') {
                                                setDesignFiles(change.files);
                                            }
                                        }}
                                        onComponentSelect={setSelectedComponent}
                                        selectedComponentId={selectedComponent?.id}
                                        stateRef={designStateRef.current}
                                        interviewMode={true}
                                        isFullScreen={isFullScreen}
                                        onToggleFullScreen={toggleFullScreen}
                                        problemContent={roundProblemData ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Objective</div>
                                                    <h5 className="font-bold text-slate-900 leading-tight">
                                                        {roundProblemData.title || location.state?.title || "System Design Task"}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requirements</div>
                                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                        {roundProblemData.statement || "No description available."}
                                                    </p>
                                                </div>
                                                {roundProblemData.constraints && (
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Constraints</div>
                                                        <ul className="text-sm text-slate-600 space-y-1">
                                                            {Array.isArray(roundProblemData.constraints) ?
                                                                roundProblemData.constraints.map((c, i) => <li key={i} className="flex gap-2"><span>•</span>{c}</li>) :
                                                                <li>{roundProblemData.constraints}</li>
                                                            }
                                                        </ul>
                                                    </div>
                                                )}
                                                {roundProblemData.critical_requirements && (
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Critical Requirements</div>
                                                        <ul className="text-sm text-slate-600 space-y-1">
                                                            {Array.isArray(roundProblemData.critical_requirements) ?
                                                                roundProblemData.critical_requirements.map((r, i) => <li key={i} className="flex gap-2 font-medium text-blue-900"><span>•</span>{r}</li>) :
                                                                <li className="font-medium text-blue-900">{roundProblemData.critical_requirements}</li>
                                                            }
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
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
                                        currentQuestion={currentQuestion} // ✅ Show Karaoke Text
                                        currentAnswer={currentAnswer}
                                    />
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* Bottom Control Bar */}
            {!isFullScreen && (
                <div className="bg-white border-t border-gray-200 h-20 w-full absolute bottom-0 z-0 flex items-center justify-between px-4 md:px-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                    {/* Left: State Indicator */}
                    <div className="hidden md:flex items-center gap-4 w-1/3">
                        <div className="text-sm text-slate-500 font-medium">
                            {interviewState === 'initializing' && "Connecting..."}
                            {interviewState === 'ai-speaking' && "AI is speaking..."}
                            {interviewState === 'user-speaking' && "Listening..."}
                            {interviewState === 'speechEnd' && "Thinking..."}
                            {interviewState === 'ended' && "Session Ended"}
                        </div>
                    </div>

                    {/* Center: Controls */}
                    <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
                        {interviewState !== 'ended' && (
                            <>
                                {/* Microphone - Hidden in Phase 2 */}
                                {interviewPhase !== 'design' && (
                                    <button className={`p-3.5 rounded-full transition-all shadow-lg ${interviewState === 'user-speaking'
                                        ? 'bg-green-500 text-white animate-pulse'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent hover:border-slate-300'
                                        }`}
                                        title="Microphone"
                                    >
                                        <Mic className="w-5 h-5" />
                                    </button>
                                )}

                                {/* Submit Button - Only in Phase 2 */}
                                {interviewPhase === 'design' && (
                                    <button
                                        onClick={handleSubmitDesign}
                                        className="px-6 py-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
                                    >
                                        <Send className="w-5 h-5" />
                                        Submit Design
                                    </button>
                                )}

                                {/* Video Button */}
                                <button className="p-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all border border-transparent hover:border-slate-300" title="Video Off">
                                    <Video className="w-5 h-5" />
                                </button>

                                {/* End Call Button */}
                                <button
                                    onClick={handleEndInterview}
                                    className="p-3.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg"
                                    title="End Interview"
                                >
                                    <PhoneOff className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Right: Spacer */}
                    {/* Right: Tools */}
                    <div className="hidden md:flex justify-end gap-4 w-1/3">
                        <button
                            onClick={() => setShowCanvas(!showCanvas)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border text-sm ${showCanvas
                                ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Layout className="w-4 h-4" />
                            {showCanvas ? 'Hide Canvas' : 'Show Canvas'}
                        </button>
                    </div>
                </div>
            )}

        </main >
    );
};

export default DesignRound;
