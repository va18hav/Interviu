import { useLocation } from "react-router-dom"
import React from "react"
import { supabase } from "../supabaseClient"
import Vapi from "@vapi-ai/web"
import { useNavigate } from "react-router-dom"
import logo from "../assets/images/logo.png"

const InterviewSession = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { role, name, company, level, duration, questionPool } = location.state || {};
    const focus = role;
    const [userCredentials, setUserCredentials] = React.useState(JSON.parse(localStorage.getItem("userCredentials")));
    const { firstName, lastName, email } = userCredentials || {};
    const [interviewState, setInterviewState] = React.useState('initializing')
    const [currentQuestion, setCurrentQuestion] = React.useState(null)
    const [currentAnswer, setCurrentAnswer] = React.useState(null)
    const [transcriptArray, setTranscriptArray] = React.useState([])
    const [formattedTranscript, setFormattedTranscript] = React.useState([])
    const [feedbackData, setFeedbackData] = React.useState(null)
    const interviewEnded = React.useRef(false)
    const vapi = React.useRef(null)

    React.useEffect(() => {

        const isEnded = sessionStorage.getItem("interviewEnded") === "true"

        if (isEnded) {
            setInterviewState("ended")
            const savedFeedback = JSON.parse(sessionStorage.getItem("feedbackData"))
            if (savedFeedback) {
                setFeedbackData(savedFeedback)
            }

            interviewEnded.current = true
        }

        else if (!isEnded) {
            console.log("useEffect starting - initializing Vapi")

            vapi.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)
            console.log("Vapi instance created:", vapi.current)

            const assistantOverrides = {
                recordingEnabled: false,
                variableValues: {
                    firstName: firstName,
                    role: role,
                    level: level,
                    company: company,
                    name: name,
                    duration: duration,
                    questionPool: questionPool

                },
            };

            vapi.current.start("b8483ed5-2f95-4f92-b5ea-69051eee5acf", assistantOverrides)
            console.log("Vapi call started")

            const speechStartHandler = () => {
                console.log("✅ Speech start event fired")
                setInterviewState("ai-speaking")
                setCurrentAnswer(null)
            }

            const speechEndHandler = () => {
                console.log("✅ Speech end event fired")
                setInterviewState("user-speaking")
                setCurrentQuestion(null)
            }

            const messageHandler = (message) => {
                console.log("✅ Message received:", message.type, message.role)

                if (message.role === "assistant" && message.type === "transcript") {
                    setCurrentQuestion(message.transcript)
                }

                if (message.role === "user" && message.type === "transcript") {
                    setCurrentAnswer(message.transcript)
                }

                if (message.transcriptType === "final" && message.type === "transcript") {
                    setTranscriptArray((prevTranscripts) => [...prevTranscripts, { role: message.role, transcript: message.transcript }])
                    console.log("Transcript array:", transcriptArray)
                }

            }

            const callEndHandler = () => {
                console.log("✅ Call ended")
                setInterviewState("ending")
            }

            const errorHandler = (e) => {
                console.error("❌ Vapi error:", e)
            }

            vapi.current.on("speech-start", speechStartHandler)
            vapi.current.on("speech-end", speechEndHandler)
            vapi.current.on("message", messageHandler)
            vapi.current.on("call-end", callEndHandler)
            vapi.current.on("error", errorHandler)

            console.log("✅ All event listeners attached")

            return () => {
                console.log("🧹 Cleanup function running")
                vapi.current?.off("speech-start", speechStartHandler)
                vapi.current?.off("speech-end", speechEndHandler)
                vapi.current?.off("message", messageHandler)
                vapi.current?.off("call-end", callEndHandler)
                vapi.current?.off("error", errorHandler)
                vapi.current?.stop()
            }

        }
    }


        , [])



    async function generateFeedback(formattedTranscriptText) {
        try {
            console.log("Sending transcript to backend...")
            const response = await fetch('https://intervyu.onrender.com/api/generate-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formattedTranscript: formattedTranscriptText,
                    role: role,
                    level: level,
                    focus: focus
                })
            })

            const feedback = await response.json()
            console.log("Feedback received from backend:", feedback)
            return feedback
        } catch (error) {
            console.error('Error fetching feedback:', error)
            return null
        }
    }

    async function handleLeave() {
        if (!vapi.current) return

        setInterviewState("ending")

        // Stop the call
        vapi.current.stop()

        interviewEnded.current = true
        sessionStorage.setItem("interviewEnded", "true")

        console.log("Transcript array:", transcriptArray)

        // Format the transcript
        const formattedTranscriptText = transcriptArray
            .map(item => `${item.role.toUpperCase()}: ${item.transcript}`)
            .join("\n");

        console.log("Formatted transcript:", formattedTranscriptText)

        // Call backend API to generate feedback
        const feedback = await generateFeedback(formattedTranscriptText)
        console.log("Feedback received:", feedback)

        // Check if feedback was successfully generated
        if (feedback) {
            setFeedbackData(feedback)
            sessionStorage.setItem("feedbackData", JSON.stringify(feedback))
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    // Extract score from feedback string or default to random for demo
                    // (Ideally your backend returns a structured JSON with a 'score' field)

                    const newInterview = {
                        user_id: user.id,
                        role: role || "General",
                        date: new Date().toLocaleDateString(),
                        duration: length || "15 min",
                        score: feedback.overallScore, // Replace with feedback.score if available
                        feedback_data: feedback, // Storing the full JSON
                        created_at: new Date().toISOString()
                    };
                    const { error } = await supabase
                        .from('interviews')
                        .insert([newInterview]);
                    if (error) throw error;
                    console.log("Interview saved to Supabase!");
                }
            } catch (err) {
                console.error("Failed to save interview:", err);
            }
            // --- NEW SUPABASE CODE ENDS HERE ---
            setInterviewState("ended");

        }

        else {
            console.error("Failed to generate feedback")
            setInterviewState("ended") // Still change state even if feedback failed
        }
    }

    function getFeedback() {
        console.log("Navigating to feedback page with data:", feedbackData)
        navigate("/dashboard/stored-interview/feedback", {
            state: {
                role,
                level,
                focus,
                feedbackData
            }
        })
    }


    const isListening = interviewState === "user-speaking"

    // Add keyframes to the document
    React.useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

    const slideUpStyle = {
        animation: "slideUp 0.8s ease-out forwards"
    };

    const LoadingCards = () => (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Outer Ring */}
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
                    {/* Center Dot */}
                    <div className="absolute inset-0 m-auto w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Connecting to Interview...</h3>
                    <p className="text-slate-400 text-sm">Reviewing your profile and setting up the environment</p>
                </div>
            </div>
        </div>
    );

    const FeedbackLoadingCards = () => (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Outer Ring */}
                    <div className="w-24 h-24 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
                    {/* Center Dot */}
                    <div className="absolute inset-0 m-auto w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Generating Feedback...</h3>
                    <p className="text-slate-400 text-sm">Reviewing your interview and generating feedback</p>
                </div>
            </div>
        </div>
    );

    const FeedbackGeneratedCards = () => (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
            <div className="flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">Feedback Generated</h3>
                    <p className="text-slate-400 text-sm">Please check your feedback to view the detailed insights of your interview</p>
                </div>
            </div>
        </div>
    );

    return (
        <main className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-10 flex flex-col relative overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-950/40 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl"></div>

                {/* Animated dot grid pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
            </div>

            {/* Header */}
            <header className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-shrink-0 relative z-10">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">

                            <img src={logo} alt="Logo" className="w-15 h-15" />

                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                {role} <span className="text-blue-300">Interview</span>
                            </h2>
                        </div>
                        {interviewState !== "ended" && <button
                            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
                            onClick={handleLeave}
                        >
                            <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Leave Interview
                        </button>}

                        {interviewState === "ended" && <button
                            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-400 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
                            onClick={getFeedback}
                        >
                            <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Get Feedback
                        </button>}
                    </div>
                </div>
            </header>

            {/* Cards - Horizontal Layout */}
            <div className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-1 min-h-0 relative z-10">
                {interviewState === "initializing" ? (
                    <LoadingCards />
                )
                    : interviewState === "ending" ? (
                        <FeedbackLoadingCards />
                    ) : interviewState === "ended" ? (
                        <FeedbackGeneratedCards />
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full" style={slideUpStyle}>
                            {/* AI Interviewer Card */}
                            <div
                                className={`group flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl transition-all duration-500 h-full relative overflow-hidden ${interviewState === "ai-speaking"
                                    ? "border-2 border-cyan-400/60 ring-4 ring-cyan-400/30 shadow-cyan-500/50"
                                    : "border border-white/20 hover:border-white/40"
                                    }`}
                            >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${interviewState === "ai-speaking" ? "opacity-100 animate-pulse" : ""
                                    }`}></div>

                                <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8 h-full relative z-10">
                                    <div className="relative">
                                        {/* Animated rings */}
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-20 blur-xl ${interviewState === "ai-speaking" ? "animate-ping" : ""
                                            }`}></div>
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-10 ${interviewState === "ai-speaking" ? "animate-pulse" : ""
                                            }`} style={{ transform: "scale(1.2)" }}></div>

                                        <div className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                            {/* Inner glow */}
                                            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                                            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        {interviewState === "ai-speaking" && (
                                            <div className="absolute bottom-2 right-2 bg-green-400 h-7 w-7 rounded-full border-4 border-slate-900 shadow-lg shadow-green-500/50 animate-pulse">
                                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">AI Interviewer</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-400/30">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                            <p className="text-xs sm:text-sm text-cyan-200 font-medium">Virtual Assistant</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Card */}
                            <div
                                className={`group flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl transition-all duration-500 h-full relative overflow-hidden ${interviewState === "user-speaking"
                                    ? "border-2 border-green-400/60 ring-4 ring-green-400/30 shadow-green-500/50"
                                    : "border border-white/20 hover:border-white/40"
                                    }`}
                            >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${interviewState === "user-speaking" ? "opacity-100 animate-pulse" : ""
                                    }`}></div>

                                <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-8 h-full relative z-10">
                                    <div className="relative">
                                        {/* Animated rings */}
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 opacity-20 blur-xl ${interviewState === "user-speaking" ? "animate-ping" : ""
                                            }`}></div>
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 opacity-10 ${interviewState === "user-speaking" ? "animate-pulse" : ""
                                            }`} style={{ transform: "scale(1.2)" }}></div>

                                        <div className="relative bg-gradient-to-br from-slate-400 via-slate-600 to-slate-800 h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 rounded-full shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                            {/* Inner glow */}
                                            <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                                            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-white relative z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        {interviewState === "user-speaking" && (
                                            <div className="absolute bottom-2 right-2 bg-green-400 h-7 w-7 rounded-full border-4 border-slate-900 shadow-lg shadow-green-500/50 animate-pulse">
                                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">You</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-500/20 rounded-full border border-slate-400/30">
                                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                                            <p className="text-xs sm:text-sm text-slate-200 font-medium">{firstName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {/* Status Textbox */}
            <div className="max-w-7xl mx-auto w-full flex-shrink-0 relative z-10">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="flex-shrink-0 relative">
                                    {interviewState === "initializing" && (
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-3 shadow-lg shadow-purple-500/30 animate-pulse">
                                                <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </div>
                                            <div className="absolute inset-0 bg-purple-400/30 rounded-2xl blur-xl animate-pulse"></div>
                                        </div>
                                    )}
                                    {interviewState === "ai-speaking" && (
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-3 shadow-lg shadow-cyan-500/30">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                </svg>
                                            </div>
                                            <div className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-xl"></div>
                                        </div>
                                    )}
                                    {interviewState === "user-speaking" && (
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-3 shadow-lg shadow-green-500/30">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                </svg>
                                            </div>
                                            <div className="absolute inset-0 bg-green-400/30 rounded-2xl blur-xl"></div>
                                        </div>
                                    )}
                                    {interviewState === "ending" || interviewState === "ended" && (
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl p-3 shadow-lg">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base sm:text-lg font-semibold text-white">
                                        {interviewState === "initializing" && "Please wait while we prepare your interview"}
                                        {interviewState === "ai-speaking" && (currentQuestion || "Interviewer speaking...")}
                                        {interviewState === "user-speaking" && (currentAnswer || "Listening… You can speak now.")}
                                        {interviewState === "ending" && "Ending interview…"}
                                        {interviewState === "ended" && "Interview ended"}
                                    </p>
                                    <span className="text-xs text-slate-400 font-medium">
                                        {interviewState === "initializing" && "Setting up your session"}
                                        {interviewState === "ai-speaking" && "AI is responding"}
                                        {interviewState === "user-speaking" && "Microphone active"}
                                        {interviewState === "ending" && "Wrapping up"}
                                        {interviewState === "ended" && "Get your feedback"}
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced audio visualizer - moved to right, only for AI speaking */}
                            {interviewState === "ai-speaking" && (
                                <div className="flex-shrink-0 hidden lg:block">
                                    <div className="flex gap-1.5 items-end h-12">
                                        {[0, 150, 300, 450, 600, 150, 400, 200, 500, 100, 350, 250, 200, 350, 100, 450].map((delay, i) => {
                                            // Generate random heights for more natural variation
                                            const randomHeight = 16 + Math.floor(Math.random() * 40);
                                            return (
                                                <div
                                                    key={i}
                                                    className="w-1.5 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full transition-all duration-300 animate-pulse"
                                                    style={{
                                                        animationDelay: `${delay}ms`,
                                                        height: `${randomHeight}px`
                                                    }}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default InterviewSession
