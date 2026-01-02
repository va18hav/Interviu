import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Upload, Briefcase, Target, Code, Sparkles, Brain, Zap, TrendingUp, Clock, FileText, Lasso } from 'lucide-react'
import logo from "../assets/images/logo.png"
import peek from "../assets/images/peek.png"

const CreateInterview = () => {
  // Navigaton

  const location = useLocation()
  const navigate = useNavigate()
  // Form data
  const [formData, setFormData] = React.useState({
    role: "",
    level: "",
    focus: "",
    length: "",
    description: ""

  })

  // Handle text / select / textarea changes
  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,

    }))

  }

  // Handle form submit
  function handleGenerate(e) {
    e.preventDefault()

    sessionStorage.removeItem("interviewEnded")

    navigate("/create/interview/1", {
      state: {
        role: formData.role,
        level: formData.level,
        focus: formData.focus,
        length: formData.length,
        description: formData.description
      },
    })
  }

  // Simple derived state
  const canGenerate = formData.role.trim() !== ""

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-4 flex items-center justify-between">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-15 h-15" />
          </div>
          <div className="flex flex-col gap-0">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Create Mock Interview
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl text-sm">
              AI-powered interview practice tailored to your role
            </p>
          </div>
        </div>

        {/* Main Card - Two Column Layout */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

            {/* Left Column - Feature Card (2 columns) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-10 flex flex-col justify-center relative overflow-hidden border-r border-slate-800/50">
              {/* Decorative gradient orbs */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

              <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Practice Like
                    <br />
                    <span className="text-cyan-400">A Pro</span>
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Get personalized AI interviews that adapt to your experience level and focus areas
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Feature 1 */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Brain className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">AI-Powered Questions</h3>
                      <p className="text-slate-500 text-sm">Dynamic questions based on your profile</p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Real-time Feedback</h3>
                      <p className="text-slate-500 text-sm">Instant analysis of your responses</p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Track Progress</h3>
                      <p className="text-slate-500 text-sm">Monitor improvement over time</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                {/* <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/50">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">10K+</div>
                    <div className="text-xs text-slate-500">Interviews Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">95%</div>
                    <div className="text-xs text-slate-500">Success Rate</div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Right Column - Form (3 columns) */}
            <div className="lg:col-span-3 p-10">
              <div className="space-y-5">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Interview Configuration</h2>
                  <p className="text-slate-400 text-sm">Customize your practice session</p>
                </div>

                {/* Job Role */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    Job Role
                    <span className="text-red-400 text-xs">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer, Full Stack Engineer"
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-slate-600"
                  />
                </div>

                {/* Experience Level and Interview Length - Side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Experience Level */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Target className="w-4 h-4 text-cyan-400" />
                      Experience Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all appearance-none cursor-pointer hover:border-slate-600"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      <option value="" className="bg-slate-900">Select level</option>
                      <option value="junior" className="bg-slate-900">Junior</option>
                      <option value="mid" className="bg-slate-900">Mid-Level</option>
                      <option value="senior" className="bg-slate-900">Senior</option>
                    </select>
                  </div>

                  {/* Interview Length */}
                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Interview Length
                    </label>
                    <select
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all appearance-none cursor-pointer hover:border-slate-600"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1.25rem'
                      }}
                    >
                      <option value="" className="bg-slate-900">Select length</option>
                      <option value="5 min" className="bg-slate-900">Short (5 min)</option>
                      <option value="10 min" className="bg-slate-900">Medium (10 min)</option>
                      <option value="15 min" className="bg-slate-900">Long (15 min)</option>
                    </select>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Code className="w-4 h-4 text-cyan-400" />
                    Focus Areas / Tech Stack
                  </label>
                  <textarea
                    name="focus"
                    value={formData.focus}
                    onChange={handleChange}
                    rows={3}
                    placeholder="React, TypeScript, System Design, Node.js, AWS..."
                    className="w-full resize-none rounded-lg border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-slate-600"
                  />
                </div>

                {/* Target Job Description */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Target Job Description
                    <span className="text-slate-500 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Paste the job description you're preparing for to get more tailored questions..."
                    className="w-full resize-none rounded-lg border border-slate-700/50 bg-slate-900/60 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-slate-600"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full group relative px-8 py-4 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 disabled:shadow-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 transition-all duration-300 group-hover:scale-105 group-disabled:group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-white flex items-center justify-center gap-3">

                      Start Interview
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

  )
}

export default CreateInterview
