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
  const interviewEnded = React.useRef(false)
  const vapi = React.useRef(null)

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

      // Define Overrides
      const assistantOverrides = {
        recordingEnabled: false,
        variableValues: {
          firstName: firstName || "User",
          role: role || "Candidate",
          level: level || "Intermediate",
          focus: Array.isArray(focus) ? focus.join(", ") : (focus || ""),
          description: description || "Technical Interview",
          company: company || "",
          type: type || "technical",
          questionPool: questionPool || ""
        },
      }

      console.log("Starting Vapi with overrides:", assistantOverrides)

      const assistantId = customInterview
        ? "c0b4cee2-90d4-41cd-a866-9b25d923a490"
        : "092f0d67-01d2-41c3-b272-97e74a5dcf14";


      // Define Handlers
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

      const callEndHandler = () => {
        console.log("✅ Call ended")
        setInterviewState("ending")
      }

      const errorHandler = (e) => {
        console.error("❌ Vapi error:", e)
        alert("Connection error. Please try again.")
        navigate("/dashboard")
      }

      // Attach Listeners BEFORE start
      vapi.current.on("speech-start", speechStartHandler)
      vapi.current.on("speech-end", speechEndHandler)
      vapi.current.on("message", messageHandler)
      vapi.current.on("call-end", callEndHandler)
      vapi.current.on("error", errorHandler)

      console.log("✅ All event listeners attached")

      // Start Call
      vapi.current.start(assistantId, assistantOverrides)
        .then((res) => console.log("Crucial: Call started successfully", res))
        .catch((err) => {
          console.error("Crucial: Failed to start call", err);
          errorHandler(err);
        });

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

  React.useEffect(() => {
    let interval
    if (isTimerActive) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive])

  React.useEffect(() => {
    if (interviewState === 'ai-speaking' && !isTimerActive) {
      setIsTimerActive(true)
    } else if (interviewState === 'ending') {
      setIsTimerActive(false)
    }
  }, [interviewState, isTimerActive])



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

    // Stop the call
    vapi.current.stop()
    interviewEnded.current = true
    sessionStorage.setItem("interviewEnded", "true")

    // --- CREDIT DEDUCTION START ---
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const durationInMinutes = Math.ceil(elapsedTime / 60);
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

          console.log(`Deducted ${creditCost} credits. New balance: ${newBalance}`);
        }
      }
    } catch (err) {
      console.error("Failed to deduct credits:", err);
    }
    // --- CREDIT DEDUCTION END ---

    setInterviewState("ended")
  }

  async function getFeedback() {
    setInterviewState("ending"); // Show "Generating Feedback" loader

    try {
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

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const newInterview = {
            user_id: user.id,
            role: role || "General",
            date: new Date().toLocaleDateString(),
            duration: length || "15 min",
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

  const durationMinutes = parseInt(length) || 15;
  const isEligibleForFeedback = elapsedTime > (durationMinutes * 60) / 2;

  const FeedbackGeneratedCards = () => (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full items-center justify-center p-12">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {isEligibleForFeedback ? "Interview Ended" : "Cannot Generate Feedback"}
          </h3>
          <p className="text-slate-400 text-sm">
            {isEligibleForFeedback
              ? "Click 'Get Feedback' to generate your detailed performance report"
              : "The interview duration was too short to generate meaningful feedback."}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="h-screen bg-black py-5 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-shrink-0 relative z-10">
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">

              <img src={(!customInterview ? icon : logo)} alt="Logo" className="w-10 h-10" />

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {(!customInterview ? name : role)} <span className="text-cyan-300">Interview</span>
              </h2>
            </div>

            <div className="flex flex-row items-center gap-4 justify-between px-2">
              <div className="font-mono text-xl font-semibold text-white/90 tabular-nums bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 shadow-sm backdrop-blur-sm">
                {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </div>
              {interviewState !== "ended" && interviewState !== "ending" && <button
                className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
                onClick={handleLeave}
              >
                <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Leave Interview
              </button>}
              {interviewState === "ended" && isEligibleForFeedback && <button
                className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-400 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
                onClick={getFeedback}
              >
                <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Get Feedback
              </button>}

              {interviewState === "ended" && !isEligibleForFeedback && <button
                className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-slate-700/50 rounded-xl hover:bg-slate-700 focus:outline-none transition-all duration-200"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>}
            </div>
          </div>
        </div>
      </header>

      {/* Cards - Horizontal Layout */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-1 min-h-0 relative z-10">
        {interviewState === "initializing" ? (
          <LoadingState
            header="Initializing Interview"
            description="Please wait while we initialize your interview"
            color="blue" />

        )
          : interviewState === "ending" ? (
            <LoadingState
              header="Generating Feedback"
              description="Reviewing your interview and generating feedback"
              color="green" />

          ) : interviewState === "ended" ? (
            <FeedbackGeneratedCards />
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full" style={slideUpStyle}>
              {/* AI Interviewer Card */}
              <InterviewerCard interviewState={interviewState} />

              {/* User Card */}
              <UserCard
                interviewState={interviewState}
                firstName={firstName}
              />
            </div>
          )}
      </div>

      {/* Status Textbox */}
      {/* Status Textbox */}
      {interviewState !== "ending" && (
        <StatusBox
          interviewState={interviewState}
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
        />
      )}
    </main>
  )
}

export default InterviewSession
