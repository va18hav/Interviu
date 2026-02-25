import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Video, PhoneOff, Send, Loader2, Volume2, VolumeX, MessageSquare, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/logo.png';
import InterviewerCard from '../components/InterviewerCard';
import UserCard from '../components/UserCard';
import StatusBox from '../components/StatusBox';

const BehavioralRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        role,
        ttsProvider = 'azure',
        company,
        level,
        type,
        slug,
        roundNum,
        evaluation_intelligence,
        candidate_reasoning_signals
    } = location.state || {};

    // User Data from localStorage (Latest Name & Avatar)
    const [userData, setUserData] = useState(() => {
        const creds = JSON.parse(localStorage.getItem("userCredentials")) || {};
        return {
            first_name: creds.first_name || location.state?.firstName || "Candidate",
            last_name: creds.last_name || location.state?.lastName || "",
            avatar_url: creds.avatar_url || "",
            id: creds.id
        };
    });

    // UI State
    const [interviewState, setInterviewState] = useState('initializing');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [initError, setInitError] = useState(false); // New: Tracks initialization failure

    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);

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
    const activeTtsSourcesRef = useRef(0);

    // Audio Capture Refs
    const mediaStreamRef = useRef(null);
    const scriptProcessorRef = useRef(null);
    const audioInputRef = useRef(null);

    const interviewStateRef = useRef(interviewState);
    useEffect(() => {
        interviewStateRef.current = interviewState;
    }, [interviewState]);

    // Timer Logic & Phase Transitions
    const transitionsTriggeredRef = useRef({ wrapup: false });

    // Timer Logic
    useEffect(() => {
        let interval;
        if (interviewState !== 'initializing' && interviewState !== 'ended' && interviewState !== 'error') {
            interval = setInterval(() => {
                setElapsedTime(prev => {
                    const newTime = prev + 1;

                    // 30 Minute Wrap-up Trigger (1800 seconds)
                    if (newTime >= 1800 && !transitionsTriggeredRef.current.wrapup) {
                        transitionsTriggeredRef.current.wrapup = true;

                        if (ws.current) {
                            ws.current.send(JSON.stringify({
                                type: 'inject_system_message',
                                payload: { text: "The interview has reached the 30-minute mark. Please begin the final wrap-up of the interview." }
                            }));
                        }
                    }

                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [interviewState]);

    // Initialize AudioContext & WebSocket on Mount
    useEffect(() => {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 16000,
        });

        ws.current = new WebSocket(import.meta.env.VITE_WS_URL); // Using same port as CodingRound

        ws.current.onopen = () => {

            const {
                role, firstName, level, name, title,
                flow, persona, roundProblemData, evaluation,
                interviewContext, depthScaling, focusAspects
            } = location.state || {};

            const sessionContext = {
                role: role || 'Software Engineer',
                firstName,
                level,
                name,
                type: 'behavioral',
                roundTitle: title,
                ttsProvider,

                ...flow,
                ...persona,
                ...evaluation,

                domain: flow?.domain,
                location: persona?.location,

                // Pass full objects
                flow,
                persona,
                evaluation,
                interviewContext,
                depthScaling,
                focusAspects,

                ...location.state
            };

            ws.current.send(JSON.stringify({
                type: 'init',
                payload: {
                    ...sessionContext,
                    userId: userData.id,
                    firstName: userData.first_name, // Use latest from localStorage
                    ttsProvider: 'azure'
                }
            }));

            ws.current.send(JSON.stringify({
                type: 'start_audio'
            }));
        };

        ws.current.onmessage = async (event) => {
            try {
                if (event.data instanceof Blob) {
                    handleTtsChunk({ audio: await event.data.text() });
                    return;
                }

                const msg = JSON.parse(event.data);

                if (msg.type === 'tts_chunk') {
                    await handleTtsChunk(msg.payload);
                }
                else if (msg.type === 'session_info') {
                    setSessionId(msg.payload.sessionId);
                }
                else if (msg.type === 'interviewer_turn') {
                    setCurrentQuestion(msg.payload.text);
                    setInterviewState('neutral');
                }
                else if (msg.type === 'stt_ready') {
                    startAudioCapture();
                }
                else if (msg.type === 'user_transcript') {
                    if (interviewStateRef.current === 'ai-speaking' || interviewStateRef.current === 'ai-processing') return;

                    const { text, isFinal } = msg.payload;

                    // Implement Sliding Window for STT
                    const limit = window.innerWidth < 768 ? 5 : 20;
                    const words = text.split(' ');
                    const truncatedText = words.length > limit
                        ? '... ' + words.slice(-limit).join(' ')
                        : text;

                    setCurrentAnswer(truncatedText);
                    setInterviewState('user-speaking');
                    setIsListening(true);

                    if (isFinal) {
                        setIsListening(false);
                        setInterviewState('speechEnd');
                    }
                }
                else if (msg.type === 'user_turn_complete') {
                    setInterviewState('speechEnd');
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

    // Audio Capture Logic
    const startAudioCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            if (!audioContext.current) return;
            if (audioContext.current.state === 'suspended') {
                await audioContext.current.resume();
            }

            const input = audioContext.current.createMediaStreamSource(stream);
            const processor = audioContext.current.createScriptProcessor(2048, 1, 1);

            input.connect(processor);
            processor.connect(audioContext.current.destination);

            processor.onaudioprocess = (e) => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    const allowedStates = ['neutral', 'user-speaking'];
                    if (!allowedStates.includes(interviewStateRef.current)) return;

                    const inputData = e.inputBuffer.getChannelData(0);
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
        if (audioInputRef.current) audioInputRef.current.disconnect();
        if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
        setIsListening(false);
    };

    const stopAudioServices = () => {

        stopAudioCapture();

        if (audioContext.current) {
            try {
                if (audioContext.current.state !== 'closed') {
                    audioContext.current.suspend();
                }
            } catch (err) {
                console.error('[Audio] Error suspending audio context:', err);
            }
        }

        if (ws.current) {
            try {
                ws.current.close();
            } catch (e) { console.error(e); }
        }
    };

    // TTS Handling
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
        if (audioContext.current.state === 'suspended') await audioContext.current.resume();

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
                        isPlayingRef.current = false;
                        setInterviewState('neutral');
                        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                            ws.current.send(JSON.stringify({ type: 'tts_playback_done' }));
                        }
                        setCurrentQuestion(null);
                        nextStartTimeRef.current = 0;
                        displayedWordCountRef.current = 0;
                        sequenceStartTimeRef.current = null;
                    }
                }
            }, 500);
        };

        // Queue Karaoke
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

    // Karaoke Loop
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
                        const karaokeLimit = window.innerWidth < 768 ? 5 : 10;
                        for (const word of wordsToDisplay) {
                            if (currentCount >= karaokeLimit) {
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


    // End Interview Handling
    const [isEndingInterview, setIsEndingInterview] = useState(false);
    const handleEndInterview = async () => {
        if (isEndingInterview) return;

        // IMMEDIATE CLEANUP of STT/TTS (Mic/AudioContext)
        stopAudioServices();

        setIsEndingInterview(true);

        try {
            const durationInMinutes = elapsedTime / 60;

            // Check if 15 minutes required for report
            const MIN_REPORT_DURATION_SECONDS = 10; // 15 minutes
            const generateReport = elapsedTime >= MIN_REPORT_DURATION_SECONDS;

            const userCreds = JSON.parse(localStorage.getItem("userCredentials"));

            if (!userCreds?.id) return;

            // Warning message logic
            let confirmMsg = "Are you sure you want to end the interview?";
            if (!generateReport) {
                confirmMsg = "You have not completed the minimum time requirement (15 minutes) for a detailed report. Ending now will deduct credits but generate no report. Continue?";
            }

            const confirmEnd = window.confirm(confirmMsg);
            if (!confirmEnd) {
                setIsEndingInterview(false);
                return;
            }

            if (generateReport) {
                // Navigate instantly, InterviewReport will handle the API call
                navigate('/report', {
                    state: {
                        ...location.state,
                        sessionId,
                        triggeredByEndButton: true,
                        endInterviewParams: {
                            userId: userCreds.id,
                            durationInMinutes,
                            generateReport: true,
                            sessionId,
                            history: [],
                            context: location.state
                        }
                    }
                });
            } else {
                // No report, just deduct credits in background and navigate
                const token = localStorage.getItem('authToken');
                fetch(`${import.meta.env.VITE_API_URL}/api/end-interview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: userCreds.id,
                        durationInMinutes,
                        generateReport: false,
                        sessionId,
                        history: [],
                        context: location.state
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

    if (!location.state) return <div className="p-8 text-center text-red-600">No interview state found.</div>;

    return (
        <main className="h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-2 md:px-1 md:py-1 pointer-events-none">
                <div className="flex items-center justify-between mx-auto max-w-8xl">
                    <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/40 shadow-xl shadow-slate-200/50 pointer-events-auto transition-all duration-500 hover:scale-[1.02]">
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-black text-slate-900 tracking-tight">
                                {company} {role}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <div className="bg-white/80 backdrop-blur-xl px-2 py-1 md:px-3 md:py-2 rounded-2xl border border-white/40 shadow-xl shadow-slate-200/50 flex items-center gap-2 md:gap-3 transition-all duration-500 hover:scale-[1.02]">
                            <div className="relative">
                                <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                {isListening && <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>}
                            </div>
                            <div className="font-mono text-sm md:text-base font-black text-slate-900 tabular-nums tracking-wider">
                                {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Pixel Perfect Match to CodingRound (Hidden Code State) */}
            <div className="flex-1 flex flex-col relative z-0 justify-center p-4 pb-24 md:px-8">
                <div className="w-full max-w-8xl mx-auto h-full flex flex-col justify-center">

                    {interviewState === 'initializing' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-xl font-semibold text-slate-900">Initializing Environment</h3>
                                <p className="text-slate-500 text-sm mt-2">Setting up your interview environment...</p>
                            </div>
                        </div>
                    ) : interviewState === 'ended' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-slate-900">Interview Ended</h3>
                                <p className="text-slate-500 text-sm mt-2">Session has been terminated</p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 h-full w-full items-stretch p-4">
                            {/* Video Cards Container - Flex Row Full Width for Hidden Code State */}
                            <div className="flex gap-4 transition-all duration-500 flex-col md:flex-row w-full h-full">

                                {/* Interviewer Card */}
                                <div className="relative flex-1 min-h-[200px] md:min-h-[300px]">
                                    <InterviewerCard
                                        interviewState={interviewState}
                                    />
                                    <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20 shadow-2xl">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">Protocol Specialist</p>
                                    </div>
                                </div>

                                {/* User Card */}
                                <div className="relative flex-1 min-h-[300px]">
                                    <UserCard
                                        interviewState={interviewState}
                                        first_name={userData.first_name}
                                        last_name={userData.last_name}
                                        avatar_url={userData.avatar_url}
                                    />
                                    <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 z-20 shadow-2xl">
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest text-center">{userData.first_name || "Candidate"} {userData.last_name || ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Box */}
                    {interviewState !== 'initializing' && interviewState !== 'ended' && interviewState !== 'speechEnd' && (
                        (interviewState === 'user-speaking' && currentAnswer && currentAnswer.trim().length > 0) ||
                        (interviewState === 'ai-speaking' && (currentQuestion || true)) // Always show StatusBox during AI turn for better feedback
                    ) && (
                            <div className="absolute bottom-26 md:bottom-[2%] md:left-[16%] md:right-[22%] pointer-events-none flex justify-start z-60">
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
            <div className="absolute bottom-4 right-4 z-40 flex justify-end">
                <div className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-xl px-4 py-3 rounded-[2rem] border border-white/40 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:scale-[1.02]">

                    {/* Microphone Indicator */}
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${isListening ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                        <div className="relative">
                            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                            {isListening && <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest">{isListening ? 'Active' : 'Muted'}</span>
                    </div>

                    {/* Separator */}
                    <div className="w-px h-8 bg-slate-100" />

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

export default BehavioralRound;
