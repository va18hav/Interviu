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
import { getSystemPrompt, getDrillDeeperPrompt, getNextProblemJuniorPrompt } from "../utils/prompts/index"

// Helper for credit deduction - defined outside component to be accessible everywhere
const deductCredits = async (durationSeconds) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const durationInMinutes = Math.ceil(durationSeconds / 60);
      const creditCost = durationInMinutes > 0 ? durationInMinutes : 1; // Minimum 1 credit

      // Fetch current credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newBalance = Math.max(0, profile.credits - creditCost);

        // Update credits in database
        await supabase
          .from('profiles')
          .update({ credits: newBalance })
          .eq('id', user.id);

        console.log(`Deducted ${creditCost} credits for ${durationInMinutes} min. New balance: ${newBalance}`);
      }
    }
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
    stressTestPrompt
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
        followUpGuidelines,
        commonFailureReasons: location.state?.commonFailureReasons, // Ensure we pass this if available
        focus,
        filter_type,
        // Pass orchestration initial state to prompt
        depthLevel,
        // problemQueue removed
        stressTestPrompt,
        evaluationSignals
      };

      const systemPrompt = getSystemPrompt(promptContext);
      console.log("System Prompt:", systemPrompt);

      console.log("Starting Vapi with transient assistant config...");

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
        console.log("✅ Message received:", message.type, message.role)

        if (message.role === "assistant" && message.type === "transcript") {
          setCurrentQuestion(message.transcript)
        }

        if (message.role === "user" && message.type === "transcript") {
          setCurrentAnswer(message.transcript)
        }

        if (message.transcriptType === "final" && message.type === "transcript") {
          setTranscriptArray((prevTranscripts) => [...prevTranscripts, { role: message.role, transcript: message.transcript }])
        }
      }

      // Tool Call Interception Handler
      const toolCallHandler = (message) => {
        if (message.type === 'tool-calls') {
          const toolCalls = message.toolCallList;
          if (toolCalls && toolCalls.length > 0) {
            const firstTool = toolCalls[0];
            const name = firstTool.function.name;
            const currentElapsedMinutes = elapsedTimeRef.current / 60;

            console.log(`Tool '${name}' intercepted. Elapsed: ${currentElapsedMinutes.toFixed(2)} mins`);

            if (name === 'signal_problem_end') {
              handleSignalProblemEnd(currentElapsedMinutes);
            } else if (name === 'wrap_up_interview') {
              // Only allow if injection D has authorized it (implicitly via time or prompt)
              // But we force injection D at 19m. 
              // If AI calls it early without permission, we block it.
              if (currentElapsedMinutes < 18.83 && !hasWrappedUp.current) {
                console.log("Blocking early wrap-up.");
                vapi.current.send({
                  type: 'add-message',
                  message: {
                    role: 'system',
                    content: "SYSTEM: ALARM. You are ending the interview too early. YOU STILL HAVE TIME. Drill Deeper"
                  },
                });
              } else {
                console.log("Allowing wrap-up.");
                vapi.current.stop();
              }
            }
          }
        }
      }

      const handleSignalProblemEnd = (minutes) => {
        // INJECTION_D Logic (Signal & Time > 19m)
        // Hard stop at 19 minutes for all levels
        if (minutes >= 19.0) {
          sendInjection("D");
          return;
        }

        const levelKey = level?.toLowerCase() || '';
        const isJunior = levelKey.includes('entry') || levelKey.includes('junior');

        if (isJunior) {
          // Junior Logic: 2 Problems (0-10m, 10-19m)
          if (minutes < 10.0) {
            // Problem 1 should last until 10m
            sendInjection("DRILL_DEEPER");
          } else {
            // After 10m, check if we need to move to Problem 2
            if (currentProblemIndex.current === 0) {
              currentProblemIndex.current = 1;
              sendInjection("NEXT_PROBLEM_JUNIOR");
            } else {
              // Already on Problem 2 (or later), keep drilling until 19m
              sendInjection("DRILL_DEEPER");
            }
          }
        } else {
          // Intermediate / Senior Logic
          // Single Problem for entire duration (0-19m)
          // Always drill deeper if signal comes early
          sendInjection("DRILL_DEEPER");
        }
      };

      const sendInjection = (type) => {
        let content = "";

        if (type === "DRILL_DEEPER") {
          content = getDrillDeeperPrompt(promptContext);
        } else if (type === "NEXT_PROBLEM_JUNIOR") {
          content = getNextProblemJuniorPrompt(promptContext);
        } else if (type === "D") {
          hasWrappedUp.current = true;
          content = `SYSTEM: INTERVIEW OVER. Stop technical probing. Politely inform the candidate we are out of time. Ask for one final question. Answer briefly, then call 'wrap_up_interview' to end the session.`;
        }

        if (content) {
          console.log(`Injecting System Prompt [${type}]`);
          vapi.current.send({
            type: 'add-message',
            message: { role: 'system', content }
          });
        }
      };

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

        // Deduct credits based on current time from ref
        await deductCredits(elapsedTimeRef.current);

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

      // Start Call with Direct Object Configuration
      vapi.current.start({
        voice: {
          model: "sonic-3",
          voiceId: "a167e0f3-df7e-4d52-a9c3-f949145efdab",
          provider: "cartesia"
        },
        model: {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: systemPrompt
            }
          ],
          provider: "openai",
          temperature: 0.2,
          tools: [
            {
              type: "function",
              function: {
                name: "signal_problem_end",
                description: "Call this tool when you have reached the target depth for the current aspect and are ready to transition.",
                parameters: { type: "object", properties: {} }
              },
              messages: [
                {
                  type: "request-start",
                  content: "Okay",
                  blocking: false
                }
              ]
            },
            {
              type: "function",
              function: {
                name: "wrap_up_interview",
                description: "Call this tool ONLY when instructed by the system to end the interview session.",
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
          model: "nova-2",
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
          waitSeconds: 1.0,
          smartEndpointingPlan: {
            provider: "livekit",
            waitFunction: "1800 + 5500 * max(0, x-0.5)"
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
    } else if (interviewState === 'ending') {
      setIsTimerActive(false)
    }
  }, [interviewState, isTimerActive])

  // --- PERIODIC CONTEXT INJECTION & CHECKS ---
  React.useEffect(() => {
    if (!vapi.current || interviewEnded.current) return;

    // Check for 19-minute hard stop (INJECTION_D)
    // 19 minutes = 1140 seconds
    const HARD_STOP_TIME = 1140;

    if (elapsedTime === HARD_STOP_TIME && !hasWrappedUp.current) {
      console.log("⏰ Timer HIT 19m. Triggering INJECTION_D");
      hasWrappedUp.current = true;
      vapi.current.send({
        type: "add-message",
        message: {
          role: "system",
          content: `SYSTEM: INTERVIEW OVER. Stop technical probing. Politely inform the candidate we are out of time. Ask for one final question. Answer briefly, then call 'wrap_up_interview' to end the session.`
        }
      });
      setWrapUpMessageSent(true);
    }
  }, [elapsedTime])

  async function generateFeedback(formattedTranscriptText) {
    try {
      console.log("Sending transcript to backend...")
      const response = await fetch('http://localhost:5000/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formattedTranscript: formattedTranscriptText,
          role: role,
          level: level,
          focus: focus,
          company: company,
          roundTitle: name, // Using 'name' from location.state as roundTitle
          roundType: type
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server responded with error:', response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }

      const feedback = await response.json()

      // Basic validation of feedback structure
      if (!feedback || typeof feedback !== 'object' || !feedback.overallScore) {
        console.error("Invalid feedback format received:", feedback);
        throw new Error("Invalid feedback format received");
      }

      console.log("Feedback received from backend:", feedback)
      return feedback
    } catch (error) {
      console.error('Error fetching feedback:', error)
      return null
    }
  }

  async function handleLeave() {
    if (!vapi.current) return

    // Mark as ended BEFORE stopping to prevent race conditions with event listener
    interviewEnded.current = true
    sessionStorage.setItem("interviewEnded", "true")

    // Stop the call
    vapi.current.stop()

    // Deduct credits using helper
    await deductCredits(elapsedTime);

    setInterviewState("ended")
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

      // Call backend API to generate feedback
      const feedback = await generateFeedback(formattedTranscriptText)
      console.log("Feedback received:", feedback)

      // Check if feedback was successfully generated
      if (feedback) {
        setFeedbackData(feedback)
        sessionStorage.setItem("feedbackData", JSON.stringify(feedback))

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const newInterview = {
            user_id: user.id,
            role: role || "General",
            date: new Date().toLocaleDateString(),
            duration: `${INTERVIEW_DURATION_MINUTES} min`,
            score: feedback.overallScore,
            feedback_data: feedback,
            created_at: new Date().toISOString()
          };

          // Add round identifier to feedback data for future retrieval
          if (roundId || roundKey) {
            feedback.roundKey = roundKey || roundId;
          }
          if (company) {
            feedback.company = company;
          }

          // Delete existing attempt for this round if exists (Retry logic)
          if ((roundId || roundKey) && company) {
            const rKey = roundKey || roundId;

            // Fetch all interviews for this user and role first to filter safely
            const { data: existingInterviews } = await supabase
              .from('interviews')
              .select('id, feedback_data')
              .eq('user_id', user.id)
              .eq('role', role);

            if (existingInterviews && existingInterviews.length > 0) {
              const idsToDelete = [];
              existingInterviews.forEach(interview => {
                const fb = interview.feedback_data;
                if (fb && fb.roundKey === rKey && fb.company === company) {
                  idsToDelete.push(interview.id);
                }
              });

              if (idsToDelete.length > 0) {
                console.log("Deleting previous attempts:", idsToDelete);
                await supabase
                  .from('interviews')
                  .delete()
                  .in('id', idsToDelete);
              }
            }
          }

          const { error } = await supabase
            .from('interviews')
            .insert([newInterview]);
          if (error) throw error;
          console.log("Interview saved to Supabase!");

          // Navigate only after success
          console.log("Navigating to feedback page with data:", feedback)

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
        }
      } else {
        console.error("Failed to generate feedback")
        setInterviewState("ended")
        alert("Could not generate feedback. Please try again.");
      }
    } catch (err) {
      console.error("Error in getFeedback:", err);
      setInterviewState("ended");
      alert("An error occurred while generating feedback.");
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