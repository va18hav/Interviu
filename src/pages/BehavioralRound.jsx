import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Video, PhoneOff, Send, Loader2, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import logo from '../assets/images/logo.png';
import InterviewerCard from '../components/InterviewerCard';
import UserCard from '../components/UserCard';
import StatusBox from '../components/StatusBox';

const BehavioralRound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        role,
        firstName,
        ttsProvider = 'azure',
        company,
        level,
        type,
        slug,
        roundNum,
        evaluation_intelligence,
        candidate_reasoning_signals
    } = location.state || {};

    // UI State
    const [interviewState, setInterviewState] = useState('initializing');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [sessionId, setSessionId] = useState(null);

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
                        console.log('[Timer] Triggering 30m Wrap-up Message');
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
            console.log('[WS] Connected');

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
                    setCurrentAnswer(text);
                    setInterviewState('user-speaking');
                    setIsListening(true);

                    if (isFinal) {
                        setIsListening(false);
                        setInterviewState('speechEnd');
                    }
                }
                else if (msg.type === 'user_turn_complete') {
                    setIsListening(false);
                    setCurrentAnswer(null);
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
            const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

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


    // End Interview Handling
    const [isEndingInterview, setIsEndingInterview] = useState(false);
    const handleEndInterview = async () => {
        if (isEndingInterview) return;
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
                fetch(`${import.meta.env.VITE_API_URL}/api/end-interview`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
        <main className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 px-6 py-2 pointer-events-none">
                <div className="flex items-center justify-between mx-auto max-w-8xl">
                    <div className="flex items-center bg-white/90 backdrop-blur-md px-4 py-1 rounded-full border border-gray-200 shadow-sm pointer-events-auto">
                        <img src={logo} alt="Logo" className="w-10 h-12 object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-slate-900">
                                {company} {role}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">Realtime Behavioral Round</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pointer-events-auto">
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
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
                            <div className="flex gap-4 transition-all duration-500 flex-row w-full h-full">

                                {/* Interviewer Card */}
                                <div className="relative flex-1 min-h-[250px]">
                                    <InterviewerCard
                                        interviewState={interviewState}
                                    />
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
                        </div>
                    )}

                    {/* Status Box */}
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

                    {/* Microphone Toggle */}
                    <button
                        className={`p-4 rounded-full shadow-lg transition-all duration-300 ${isListening
                            ? 'bg-green-500 text-white animate-pulse'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:scale-105'
                            }`}
                    >
                        {isListening ? <Mic className="w-6 h-6" /> : <Mic className="w-4 h-4" />}
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={handleEndInterview}
                        className="p-4 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-300"
                        title="End Interview"
                    >
                        <PhoneOff className="w-4 h-4" />
                    </button>

                </div>
            </div>
        </main>
    );
};

export default BehavioralRound;
