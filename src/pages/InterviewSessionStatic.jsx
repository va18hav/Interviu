import { useNavigate } from "react-router-dom"
import React from "react"
import logo from "../assets/images/logo.png"
import InterviewerCard from "../components/InterviewerCard"
import UserCard from "../components/UserCard"
import StatusBox from "../components/StatusBox"

const InterviewSessionStatic = () => {
    const navigate = useNavigate()
    // Static user credentials
    const userCredentials = {
        firstName: "Vaibhav",
        lastName: "Example",
        email: "vaibhav@example.com"
    };
    const { firstName } = userCredentials;

    // Static state for photoshoot visual
    const [interviewState, setInterviewState] = React.useState('ai-speaking')
    const [elapsedTime, setElapsedTime] = React.useState(142) // 02:22

    // Static content
    const currentQuestion = "Can you describe a challenging technical problem you solved recently using React's context API?"
    const currentAnswer = null // User is listening

    const role = "Senior React Developer"
    const name = "Frontend Developer"
    const icon = logo // Or use a Google logo if available, falling back to app logo
    const customInterview = false // Pretend it's a popular interview

    // Static timer effect for realism (optional, but requested "static replica" might imply frozen state, 
    // but "experiment with visual changes" might benefit from a running timer. 
    // The user asked for "static replica... without functionalities... for a photoshoot". 
    // Frozen or running timer works. I'll make it run to feel alive but won't trigger anything.
    React.useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const slideUpStyle = {
        animation: "slideUp 0.8s ease-out forwards"
    };

    // Add styles for animation
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

    return (
        <main className="h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-5 flex flex-col relative overflow-hidden">
            {/* Animated background effects */}

            {/* Header */}
            <header className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-shrink-0 relative z-10">
                <div className="">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">

                            <img src={icon} alt="Logo" className="w-10 h-10" />

                            <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                {name} <span className="text-blue-300">Interview</span>
                            </h2>
                        </div>

                        <div className="flex flex-row items-center gap-4 justify-between px-2">
                            <div className="font-mono text-xl font-semibold text-white/90 tabular-nums bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 shadow-sm backdrop-blur-sm">
                                {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:{(elapsedTime % 60).toString().padStart(2, '0')}
                            </div>
                            <button
                                className="group relative inline-flex items-center justify-center px-3 py-2 lg:px-6 lg:py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105"
                                onClick={() => navigate('/dashboard')}
                            >
                                <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Leave Interview
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Cards - Horizontal Layout */}
            <div className="max-w-7xl mx-auto mb-4 sm:mb-6 w-full flex-1 min-h-0 relative z-10">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-full" style={slideUpStyle}>
                    {/* AI Interviewer Card */}
                    <InterviewerCard interviewState={interviewState} />

                    {/* User Card */}
                    <UserCard
                        interviewState={interviewState}
                        firstName={firstName}
                    />
                </div>
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

export default InterviewSessionStatic
