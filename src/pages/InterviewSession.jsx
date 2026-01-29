import { useLocation } from "react-router-dom"
import React from "react"
import { supabase } from "../supabaseClient"
import Vapi from "@vapi-ai/web"
import { useNavigate } from "react-router-dom"
import logo from "../assets/images/logo.png"
import InterviewerCard from "../components/InterviewerCard"
import UserCard from "../components/UserCard"
import LoadingState from "../components/LoadingState"
import StatusBox from "../components/StatusBox"
import { Mic, Video, PhoneOff, Settings } from "lucide-react"


// Helper for credit deduction - defined outside component to be accessible everywhere
// Helper for credit deduction - MOVED TO BACKEND
const deductCredits = async (durationSeconds, userId) => {
  try {
    if (!userId) return;
    await fetch('http://localhost:5000/api/deduct-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, durationSeconds })
    });
  } catch (err) {
    console.error("Failed to deduct credits:", err);
  }
}

const InterviewSession = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const customInterview = location.state.customInterview
  const [userCredentials, setUserCredentials] = React.useState(JSON.parse(localStorage.getItem("userCredentials")));
  const { firstName, lastName, email } = userCredentials || {};
  const [interviewState, setInterviewState] = React.useState('initializing')
  const [currentQuestion, setCurrentQuestion] = React.useState(null)
  const [currentAnswer, setCurrentAnswer] = React.useState(null)
  const [transcriptArray, setTranscriptArray] = React.useState([])
  const [formattedTranscript, setFormattedTranscript] = React.useState([])
  const [feedbackData, setFeedbackData] = React.useState(null)
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [isTimerActive, setIsTimerActive] = React.useState(false)
  const [wrapUpMessageSent, setWrapUpMessageSent] = React.useState(false)
  const interviewEnded = React.useRef(false)
  const elapsedTimeRef = React.useRef(0) // Ref to access latest elapsed time in callbacks
  const vapi = React.useRef(null)

  // Orchestration State
  const currentProblemIndex = React.useRef(0);
  const isStressTestPhase = React.useRef(false);
  const hasWrappedUp = React.useRef(false);

  // Track triggered milestones to prevent duplicate sends
  const triggeredMilestones = React.useRef(new Set())

  // FIXED DURATION: 20 minutes
  const INTERVIEW_DURATION_MINUTES = 20;
  const INTERVIEW_DURATION_SECONDS = INTERVIEW_DURATION_MINUTES * 60; // 1200 seconds
  const WRAP_UP_TIME_SECONDS = 19 * 60; // 19 minutes = 1140 seconds

  // Consolidated destructuring for both interview types
  const {
    role,
    icon,
    level,
    focus,
    length,
    description,
    name,
    company,
    type,
    title,
    welcomeMessage,
    roundKey,
    roundId,
    roundIntent,
    skillsEvaluated,
    difficultyBand,
    acceptableProblemTypes,
    interviewerFocus,
    antiPatternsToWatch,
    followUpGuidelines,
    evaluationSignals,
    interviewerPersonality,
    commonFailureReasons,
    filter_type,
    // New Orchestration Fields
    depthLevel,
    // problemQueue removed
    stressTestPrompt,
    focusAspects,
    // Coding Round Context
    codeContext,
    problemDescription,
    testResults,
    // Additional Context
    interviewContext,
    depthScaling,
    flow,
    evaluation
  } = location.state || {}

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

      // Initialize Vapi Instance
      vapi.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)
      console.log("Vapi instance created")

      // Define Overrides
      // Construct the System Prompt using the utility
      const promptContext = {
        company,
        role,
        level,
        name,
        type,
        firstName,
        roundTitle: title,
        roundIntent,
        interviewerPersonality,
        skillsEvaluated,
        difficultyBand,
        acceptableProblemTypes,
        interviewerFocus,
        antiPatternsToWatch,
        followUpGuidelines, // This will now contain voice_prompts for coding rounds if passed
        commonFailureReasons: location.state?.commonFailureReasons,
        focus,
        filter_type,
        // Passthrough extended context
        depthLevel,
        interviewContext: interviewContext || description, // Fallback to description
        depthScaling,
        stressTestPrompt,
        focusAspects,
        evaluationSignals,
        flow,
        evaluation,
        // Coding Round Context
        codeContext,
        problemDescription,
        testResults
      };

      const initAndStartVapi = async () => {
        let systemPrompt;
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            alert("Please log in to start the interview.");
            navigate("/login");
            return;
          }

          console.log("Fetching secure system prompt from backend...");
          const res = await fetch('http://localhost:5000/api/start-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, context: promptContext })
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to start interview");
          }

          const data = await res.json();
          systemPrompt = data.systemPrompt;
          console.log("System Prompt fetched successfully");

        } catch (error) {
          console.error("Critical Error starting interview:", error);
          alert(error.message);
          navigate("/dashboard");
          return;
        }

        console.log("Starting Vapi with transient assistant config...");

        // Define Handlers
        // ... (handlers need to be defined here or be accessible) 
        // Note: Handlers use specific references, so defining them inside this scope is fine
        // BUT the original code defined handlers outside the async block. 
        // To minimize diff, I will define handlers *outside* this specific async block but call start *inside*.

        startVapiCall(systemPrompt);
      };

      // Define Handlers
      const callStartHandler = () => {
        console.log("✅ Call started");
        setInterviewState("ai-speaking");
      };

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
        // Transcript Handling
        if (message.type === "transcript") {
          if (message.role === "assistant") {
            setCurrentQuestion(message.transcript)
          } else if (message.role === "user") {
            setCurrentAnswer(message.transcript)
          }
          if (message.transcriptType === "final") {
            setTranscriptArray((prev) => [...prev, { role: message.role, transcript: message.transcript }])
          }
        }
      }

      const toolCallHandler = (message) => {
        if (message.type === 'tool-calls') {
          const toolCalls = message.toolCallList;
          if (toolCalls && toolCalls.length > 0) {
            const firstTool = toolCalls[0];
            const name = firstTool.function.name;
            const currentElapsedSeconds = elapsedTimeRef.current; // accurate seconds

            console.log(`Tool '${name}' intercepted. Elapsed: ${currentElapsedSeconds}s`);

            if (name === 'wrap_up_interview') {
              // 19 minutes = 1140 seconds
              const MIN_TIME_SECONDS = 1140;

              if (currentElapsedSeconds < MIN_TIME_SECONDS) {
                console.log("Blocking early wrap-up.");
                vapi.current.send({
                  type: 'add-message',
                  message: {
                    role: 'system',
                    content: "SYSTEM: DO NOT STOP YET. You are ending the interview too early. Continue technical probing."
                  },
                });
              } else {
                console.log("Allowing wrap-up.");
                // We allow the tool call to proceed (which stops the call if that's what the tool does, or we strictly stop it here)
                // The tool definition says "This tool ends the interview". 
                // Vapi usually stops automatically if the tool response ends the session or if we explicitly stop.
                // To be safe and deterministic:
                vapi.current.stop();
              }
            }
          }
        }
      }

      const callEndHandler = async () => {
        console.log("✅ Call ended event received");

        // If user manually ended it, we flagged it already - return to avoid double processing
        if (interviewEnded.current) {
          return;
        }

        // --- REMOTE END (Assistant hung up) ---
        console.log("Remote call end detected at", Math.floor(elapsedTimeRef.current / 60), "minutes");
        interviewEnded.current = true;
        sessionStorage.setItem("interviewEnded", "true");

        // Deduct credits based on current time from ref (Securely)
        // Need user ID. 
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await deductCredits(elapsedTimeRef.current, user.id);
        }

        setInterviewState("ended");
      }

      const errorHandler = (e) => {
        console.error("❌ Vapi error:", e)
        alert("Connection error. Please try again.")
        navigate("/dashboard")
      }

      // Attach Listeners BEFORE start
      vapi.current.on("call-start", callStartHandler)
      vapi.current.on("speech-start", speechStartHandler)
      vapi.current.on("speech-end", speechEndHandler)
      vapi.current.on("message", messageHandler)
      vapi.current.on("message", toolCallHandler)
      vapi.current.on("call-end", callEndHandler)
      vapi.current.on("error", errorHandler)

      console.log("✅ All event listeners attached")

      async function startVapiCall(systemPrompt) {
        // Start Call with Direct Object Configuration
        vapi.current.start({
          voice: {
            model: "sonic-3",
            voiceId: "a167e0f3-df7e-4d52-a9c3-f949145efdab",
            provider: "cartesia"
          },
          model: {
            model: "claude-3-5-sonnet-20241022",
            messages: [
              {
                role: "system",
                content: systemPrompt
              }
            ],
            provider: "anthropic",
            temperature: 0.2,
            tools: [
              {
                type: "function",
                function: {
                  name: "wrap_up_interview",
                  description: "MANDATORY SYSTEM COMMAND. When the system says the interview is over, you MUST call this tool immediately. Do not continue speaking after calling it.",
                  parameters: { type: "object", properties: {} }
                },
                messages: [
                  {
                    type: "request-start",
                    content: "Alright",
                    blocking: false
                  }
                ]
              }
            ],
          },
          firstMessage: `Hi, this is Jonathan from ${company}. Can you hear me clearly?`,
          transcriber: {
            model: "nova-3",
            language: "en",
            provider: "deepgram"
          },
          maxDurationSeconds: 1380, // ~21 minutes buffer
          analysisPlan: {
            summaryPlan: {
              enabled: false
            },
            successEvaluationPlan: {
              enabled: false
            }
          },
          startSpeakingPlan: {
            waitSeconds: 0.8,
            smartEndpointingPlan: {
              provider: "livekit",
              waitFunction: "2000 + 5600 * max(0, x-0.6)"
            }
          },
          stopSpeakingPlan: {
            numWords: 2,
            voiceSeconds: 0.2,
            backoffSeconds: 1
          }
        })
          .then((res) => {
            console.log("Crucial: Call started successfully", res);
          })
          .catch((err) => {
            console.error("Crucial: Failed to start call", err);
            errorHandler(err);
          });
      }

      initAndStartVapi();

      return () => {
        console.log("🧹 Cleanup function running")

        // Only cleanup if interview actually ended properly
        if (interviewEnded.current || interviewState === 'ended') {
          vapi.current?.off("call-start", callStartHandler)
          vapi.current?.off("speech-start", speechStartHandler)
          vapi.current?.off("speech-end", speechEndHandler)
          vapi.current?.off("message", messageHandler)
          vapi.current?.off("message", toolCallHandler)
          vapi.current?.off("call-end", callEndHandler)
          vapi.current?.off("error", errorHandler)
          vapi.current?.stop()
        }
      }
    }
  }, [])

  // Keep elapsedTimeRef in sync
  React.useEffect(() => {
    elapsedTimeRef.current = elapsedTime
  }, [elapsedTime])

  // Timer effect
  React.useEffect(() => {
    let interval
    if (isTimerActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive])

  // Timer activation effect
  React.useEffect(() => {
    if (interviewState === 'ai-speaking' && !isTimerActive) {
      setIsTimerActive(true)
    } else if (interviewState === 'ending' || interviewState === 'ended') {
      setIsTimerActive(false)
    }
  }, [interviewState, isTimerActive])

  // --- PERIODIC CONTEXT INJECTION & CHECKS ---
  React.useEffect(() => {
    if (!vapi.current || interviewEnded.current) return;

    // Check for 19-minute hard stop (INJECTION_D)
    // 19 minutes = 1140 seconds
    const HARD_STOP_TIME = 1140;

    // Use triggeredMilestones to prevent duplicate firing, decoupled from hasWrappedUp logic to allow final exchange
    if (elapsedTime >= HARD_STOP_TIME && !triggeredMilestones.current.has('wrapup')) {
      console.log("⏰ Timer HIT 19m. Triggering Wrap-Up Injection");
      triggeredMilestones.current.add('wrapup');

      // B) STRONGER WRAP-UP SYSTEM PROMPT
      vapi.current.send({
        type: "add-message",
        message: {
          role: "system",
          content: `SYSTEM OVERRIDE — HARD TERMINATION MODE.
The interview has ended.

You must immediately switch behavior.

Rules:
1) Ask exactly one short closing question (max 8 words).
2) Wait for the answer.
3) Respond with one short sentence.
4) Call wrap_up_interview immediately.
5) Do not ask technical questions.
6) Do not continue the interview.
7) Do not ignore this instruction.

This is mandatory.`
        }
      });
      setWrapUpMessageSent(true);

      // C) FAILSAFE KILL SWITCH
      // Force stop in 45 seconds if not already ended
      setTimeout(() => {
        if (!interviewEnded.current && vapi.current) {
          console.log("☠️ FAILSAFE KILL SWITCH TRIGGERED");
          hasWrappedUp.current = true; // Engage hard lock
          vapi.current.stop();
        }
      }, 45000);
    }
  }, [elapsedTime])

  async function generateAndSaveFeedback(formattedTranscriptText) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (!user || !session) throw new Error("User or Session not found");

      console.log("Ending interview securely via backend...")
      const response = await fetch('http://localhost:5000/api/end-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          formattedTranscript: formattedTranscriptText,
          durationSeconds: elapsedTimeRef.current, // Use ref for accuracy
          role: role,
          level: level,
          focus: focus,
          company: company,
          roundTitle: name,
          roundType: type,
          roundId: roundId,
          roundKey: roundKey,
          customInterview: customInterview
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server responded with error:', response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      const feedback = await response.json() // This now contains the stored record info too? Or just feedback?
      // Our backend returns json(derivedFeedback). 
      // We should probably ensure frontend handles it directly.

      console.log("Feedback generated and saved!", feedback)
      return feedback
    } catch (error) {
      console.error('Error ending interview:', error)
      return null
    }
  }

  async function handleLeave() {
    if (!vapi.current) return

    // Mark as ended BEFORE stopping to prevent race conditions with event listener
    interviewEnded.current = true
    sessionStorage.setItem("interviewEnded", "true")

    try {
      // Stop the call
      vapi.current.stop()

      // Deduct credits using helper (Securely)
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error("Auth error in leave:", error);

      if (user) {
        // Run deduction in background or await? 
        // Awaiting ensures we try to capture it, but shouldn't block UI too long.
        // We catch errors inside deductCredits so it is safe.
        await deductCredits(elapsedTimeRef.current, user.id);
      }
    } catch (err) {
      console.error("Error during leave sequence:", err);
    } finally {
      // Always transition to ended state
      setInterviewState("ended")
      setIsTimerActive(false) // Explicitly stop timer
    }
  }

  async function getFeedback() {
    setInterviewState("ending"); // Show "Generating Feedback" loader

    try {
      // Format the transcript
      const formattedTranscriptText = transcriptArray
        .map(item => `${item.role.toUpperCase()}: ${item.transcript}`)
        .join("\n");

      if (!formattedTranscriptText.trim()) {
        console.warn("Transcript is empty, cannot generate feedback.");
        setInterviewState("ended");
        alert("Not enough conversation data to generate feedback.");
        return;
      }

      console.log("Formatted transcript:", formattedTranscriptText)

      // Call secure backend API
      const feedback = await generateAndSaveFeedback(formattedTranscriptText)
      console.log("Feedback received:", feedback)

      // Check if feedback was successfully generated
      if (feedback) {
        setFeedbackData(feedback)
        sessionStorage.setItem("feedbackData", JSON.stringify(feedback))

        // No need to insert into Supabase manually anymore, backend did it.

        // Add metadata for feedback page display
        const feedbackWithMetadata = {
          ...feedback,
          role: role || "General",
          level: level || "Mid-Level",
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          duration: `${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s`,
          company: company,
          roundType: type,
          customInterview: customInterview
        };

        navigate("/create/interview/id:/feedback", {
          state: feedbackWithMetadata
        })

      } else {
        console.error("Failed to generate feedback")
        setInterviewState("ended")
        alert("Could not generate feedback. Please try again.");
      }
    } catch (err) {
      console.error("Error in getFeedback:", err);
      setInterviewState("ended");
      alert(`An error occurred while generating feedback: ${err.message || "Unknown error"}`);
    }
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

  // Minimum 10 minutes for feedback
  const isEligibleForFeedback = elapsedTime > 300;

  const FeedbackGeneratedCards = () => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            {isEligibleForFeedback ? "Interview Ended" : "Cannot Generate Feedback"}
          </h3>
          <p className="text-slate-500 text-sm">
            {isEligibleForFeedback
              ? "Click 'Get Feedback' to generate your detailed performance report"
              : "The interview duration was too short to generate meaningful feedback."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background - Optional Subtle Grain or mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40" style={{
        backgroundImage: 'radial-gradient(circle at center, #bfdbfe 0%, transparent 70%)'
      }}></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 pointer-events-none">
        <div className="flex items-center justify-between max-w-8xl mx-auto">
          {/* Logo Badge */}
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 shadow-sm pointer-events-auto">
            <img src={(!customInterview ? icon : logo)} alt="Logo" className="w-5 h-5 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-900">
                {role}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Interview Session</span>
            </div>
          </div>

          {/* Timer Badge */}
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200 shadow-sm pointer-events-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <div className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
              {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <div className="flex-1 flex flex-col relative z-0 justify-center p-4 pb-24 md:px-8">
        <div className="w-full max-w-8xl mx-auto h-full flex flex-col justify-center">
          {interviewState === "initializing" ? (
            <div className="flex items-center justify-center h-full">
              <LoadingState
                header="Initializing Interview"
                description="Please wait while we establish connection..."
                color="blue" />
            </div>
          ) : interviewState === "ending" ? (
            <div className="flex items-center justify-center h-full">
              <LoadingState
                header="Generating Feedback"
                description="Reviewing your interview and generating feedback"
                color="green" />
            </div>
          ) : interviewState === "ended" ? (
            <div className="flex-1 flex items-center justify-center z-20 relative">
              <FeedbackGeneratedCards />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-h-[80vh] w-full" style={slideUpStyle}>
              {/* AI Interviewer Card */}
              <div className="relative h-full w-full min-h-[300px] md:min-h-0">
                <InterviewerCard interviewState={interviewState} />
                {/* Name Tag Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-20">
                  <p className="text-white text-xs font-medium">AI Interviewer</p>
                </div>
              </div>

              {/* User Card */}
              <div className="relative h-full w-full min-h-[300px] md:min-h-0">
                <UserCard
                  interviewState={interviewState}
                  firstName={firstName}
                />
                {/* Name Tag Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-20">
                  <p className="text-white text-xs font-medium">{firstName || "You"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Caption Box - Floating */}
          {interviewState !== "ending" && interviewState !== "ended" && interviewState !== "initializing" && (
            <div className="absolute bottom-24 left-0 right-0 px-4 pointer-events-none flex justify-center z-10">
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

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 h-20 w-full absolute bottom-0 z-50 flex items-center justify-between px-4 md:px-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">

        {/* Left: Settings / Info Placeholder */}
        <div className="hidden md:flex items-center gap-4 w-1/3">
          <div className="text-sm text-slate-500 font-medium">
            {interviewState === "initializing" && "Connecting..."}
            {interviewState === "ai-speaking" && "AI is speaking..."}
            {interviewState === "user-speaking" && "Listening..."}
            {interviewState === "ended" && "Session Ended"}
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
          {interviewState !== "ended" && interviewState !== "ending" && (
            <>
              {/* Fake Mute Button */}
              <button className="p-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all border border-transparent hover:border-slate-300" title="Mute">
                <Mic className="w-5 h-5" />
              </button>

              {/* Fake Video Button */}
              <button className="p-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all border border-transparent hover:border-slate-300" title="Video Off">
                <Video className="w-5 h-5" />
              </button>

              {/* End Call Button */}
              <button
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-105"
                onClick={handleLeave}
              >
                <PhoneOff className="w-5 h-5" />
                <span className="hidden sm:inline">End Call</span>
              </button>

              {/* Settings - Fake */}
              <button className="hidden sm:block p-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all border border-transparent hover:border-slate-300" title="Settings">
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Ended Actions */}
          {interviewState === "ended" && (
            <>
              {isEligibleForFeedback ? (
                <button
                  className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                  onClick={getFeedback}
                >
                  View Report
                </button>
              ) : (
                <button
                  className="px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-semibold flex items-center gap-2 transition-all hover:scale-105"
                  onClick={() => navigate('/dashboard')}
                >
                  Return to Dashboard
                </button>
              )}
            </>
          )}
        </div>

        {/* Right: Empty for balance or future features */}
        <div className="hidden md:flex items-center justify-end w-1/3">
          {/* Could put debug info here or connection quality */}
        </div>
      </div>
    </main>
  )
}

export default InterviewSession