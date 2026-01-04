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
  const interviewEnded = React.useRef(false)
  const vapi = React.useRef(null)

  // Consolidated destructuring for both interview types
  const {
    role,
    level,
    focus = location.state?.role, // Fallback for stored interviews
    length = location.state?.duration, // Map duration to length
    description = "",
    name = "",
    company = "",
    questionPool = []
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

      vapi.current = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)
      console.log("Vapi instance created:", vapi.current)

      const assistantOverrides = {
        recordingEnabled: false,
        variableValues: {
          firstName,
          role,
          level,
          focus,
          length, // Maps to 'limit' or 'duration' in prompt
          description,
          company,
          name,
          questionPool
        },
      }

      const assistantId = customInterview
        ? "992cb9aa-adbd-47e2-b3aa-f881c7142262"
        : "b8483ed5-2f95-4f92-b5ea-69051eee5acf";

      vapi.current.start(assistantId, assistantOverrides)
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
    navigate("/create/interview/id:/feedback", {
      state: feedbackData
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
    <main className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-5 flex flex-col relative overflow-hidden">
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
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">

              <img src={logo} alt="Logo" className="w-15 h-15" />

              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {role} <span className="text-blue-300">Interview</span>
              </h2>
            </div>
            {interviewState !== "ended" && <button
              className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
              onClick={handleLeave}
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave Interview
            </button>}

            {interviewState === "ended" && <button
              className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-400 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105"
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
      <StatusBox
        interviewState={interviewState}
        currentQuestion={currentQuestion}
        currentAnswer={currentAnswer}
      />
    </main>
  )
}

export default InterviewSession
