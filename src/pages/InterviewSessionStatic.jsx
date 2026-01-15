import { useNavigate } from "react-router-dom"
import React from "react"
import logo from "../assets/images/logo.png"
import InterviewerCard from "../components/InterviewerCard"
import UserCard from "../components/UserCard"
import StatusBox from "../components/StatusBox"
import LoadingState from "../components/LoadingState"
import { Mic, Video, PhoneOff, Settings } from "lucide-react"

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
    const currentAnswer = "Um, yeah—so one challenging problem I worked on recently was using React’s Context API to, kind of, clean up how we were handling global authentication state across the app...."

    const role = "Senior React Developer"
    const name = "Full Stack Developer"
    const icon = logo
    const customInterview = false

    // Static timer effect for realism
    React.useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const slideUpStyle = {
        animation: "slideUp 0.8s ease-out forwards"
    };

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

    const isListening = interviewState === "user-speaking"

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
                        <img src={icon} alt="Logo" className="w-5 h-5 object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-sm font-bold text-slate-900">
                                {name}
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

                    {/* Status Caption Box - Floating */}
                    <div className="absolute bottom-24 left-0 right-0 px-4 pointer-events-none flex justify-center z-10">
                        <div className="w-full max-w-6xl pointer-events-auto">
                            <StatusBox
                                interviewState={interviewState}
                                currentQuestion={currentQuestion}
                                currentAnswer={currentAnswer}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="bg-white border-t border-gray-200 h-20 w-full absolute bottom-0 z-50 flex items-center justify-between px-4 md:px-8 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">

                {/* Left: Info Placeholder */}
                <div className="hidden md:flex items-center gap-4 w-1/3">
                    <div className="text-sm text-slate-500 font-medium">
                        Listening...
                    </div>
                </div>

                {/* Center: Controls */}
                <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
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
                        onClick={() => navigate('/dashboard')}
                    >
                        <PhoneOff className="w-5 h-5" />
                        <span className="hidden sm:inline">End Call</span>
                    </button>

                    {/* Settings - Fake */}
                    <button className="hidden sm:block p-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all border border-transparent hover:border-slate-300" title="Settings">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Right: Empty for balance */}
                <div className="hidden md:flex items-center justify-end w-1/3">
                </div>
            </div>
        </main>
    )
}

export default InterviewSessionStatic
