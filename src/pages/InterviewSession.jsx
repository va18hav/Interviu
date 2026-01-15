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

  // FIXED DURATION: 20 minutes
  const INTERVIEW_DURATION_MINUTES = 15;
  const INTERVIEW_DURATION_SECONDS = INTERVIEW_DURATION_MINUTES * 60; // 1200 seconds
  const WRAP_UP_TIME_SECONDS = 14 * 60; // 9 minutes = 540 seconds

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
    questionPool,
    roundKey,
    roundId
  } = location.state || {}

  console.log(location.state)

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

      // Define Overrides - NO LENGTH VARIABLE
      const assistantOverrides = {
        recordingEnabled: false,
        variableValues: {
          firstName: firstName || "User",
          role: role || "",
          level: level || "",
          focus: Array.isArray(focus) ? focus.join(", ") : (focus || ""),
          description: description || "",
          company: company || "",
          type: type || "",
          questionPool: Array.isArray(questionPool) ? questionPool.join("\n") : (questionPool || "")
        },
      }

      console.log("Starting Vapi with overrides:", assistantOverrides)

      const assistantId = customInterview
        ? "30a57c80-c3cf-47c3-a4e1-2cc326afa7b6"
        : "610fd4be-f85c-4731-83d2-beb3dd0b846c";


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
      vapi.current.on("call-end", callEndHandler)
      vapi.current.on("error", errorHandler)

      console.log("✅ All event listeners attached")

      // Start Call
      vapi.current.start(assistantId, assistantOverrides)
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

  // Time remaining reminders - EVERY 30 SECONDS
  React.useEffect(() => {
    if (!vapi.current || (interviewState !== 'ai-speaking' && interviewState !== 'user-speaking')) {
      return;
    }

    const reminderInterval = setInterval(() => {
      const remainingSeconds = INTERVIEW_DURATION_SECONDS - elapsedTime;
      const remainingMinutes = Math.floor(remainingSeconds / 60);
      const remainingSecondsDisplay = remainingSeconds % 60;
      const progressPercent = Math.floor((elapsedTime / INTERVIEW_DURATION_SECONDS) * 100);

      // Only send reminders if we haven't reached target time and interview is active
      if (elapsedTime < INTERVIEW_DURATION_SECONDS && vapi.current && !interviewEnded.current) {
        vapi.current.send({
          type: "add-message",
          message: {
            role: "system",
            content: `⏰ TIME UPDATE: ${remainingMinutes}m ${remainingSecondsDisplay}s remaining (${progressPercent}% complete). Continue with technical questions.`
          }
        });

        console.log(`📢 Time reminder: ${remainingMinutes}m ${remainingSecondsDisplay}s remaining (${progressPercent}% complete)`);
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(reminderInterval);
  }, [elapsedTime, interviewState]);

  // Wrap-up message at 19 minutes (1140 seconds)
  React.useEffect(() => {
    if (elapsedTime >= WRAP_UP_TIME_SECONDS && !wrapUpMessageSent && vapi.current && !interviewEnded.current) {
      setWrapUpMessageSent(true);

      vapi.current.send({
        type: "add-message",
        message: {
          role: "system",
          content: `🎯 WRAP UP NOW: You have reached the 14-minute mark. You have 1 minute remaining. Begin wrapping up the interview now. Thank the candidate and ask if they have any final questions for you.`
        }
      });

      console.log("🎯 WRAP UP MESSAGE SENT at 14 minutes");
    }
  }, [elapsedTime, wrapUpMessageSent]);

  // Auto-end call at 20 minutes
  React.useEffect(() => {
    if (elapsedTime >= INTERVIEW_DURATION_SECONDS && vapi.current && !interviewEnded.current) {
      console.log("⏰ 15 minutes reached - ending call");
      interviewEnded.current = true;
      sessionStorage.setItem("interviewEnded", "true");
      vapi.current.stop();
      setInterviewState("ending");
    }
  }, [elapsedTime]);

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
          focus: focus
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

  // Minimum 10 minutes for feedback (half of 20 minutes)
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
                {(!customInterview ? name : role)}
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