import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Upload, Briefcase, Target, Code, Sparkles, Brain, Zap, TrendingUp, Clock,
  FileText, Lasso, Cpu, Activity, User, AlertTriangle, Layers, Monitor, Server,
  Shield, CheckCircle, X, Loader2, Play
} from 'lucide-react'
import logo from "../assets/images/logo.png"
import Navbar from "../components/Navbar"
import { sanitizeInput } from "../utils/sanitize"
import {
  ROUND_TYPES, ROLES, EXPERIENCE_LEVELS, DOMAIN_FOCUS, SYSTEM_CONTEXT_SUGGESTIONS,
  TECH_STACKS, PRODUCTION_MATURITY, YEARS_OF_EXPERIENCE, CANDIDATE_STRENGTHS,
  CANDIDATE_WEAKNESSES, FAILURE_INTENSITY, AMBIGUITY_LEVEL, INTERVIEW_STRICTNESS,
  ROUND_SPECIFIC_CONFIG
} from "../utils/interviewConstants"


const CreateInterview = () => {
  const navigate = useNavigate()

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    roundType: "coding",
    role: "sde",
    level: "",
    domainFocus: "",
    systemContext: "",
    techStack: [],
    customTechStack: "",
    productionMaturity: "",
    roundSpecific: {},
    failureIntensity: "realistic",
    ambiguityLevel: "moderate",
    interviewStrictness: "neutral",
    yearsOfExperience: "",
    candidateStrengths: [],
    candidateWeaknesses: [],
    jobDescription: ""
  })

  const [isCompiling, setIsCompiling] = useState(false);


  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || []
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const handleRoundSpecificChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      roundSpecific: {
        ...prev.roundSpecific,
        [field]: value
      }
    }))
  }

  const handleRoundSpecificMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev.roundSpecific[field] || []
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      return {
        ...prev,
        roundSpecific: {
          ...prev.roundSpecific,
          [field]: updated
        }
      }
    })
  }

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleGenerate = async (e) => {
    e.preventDefault()
    sessionStorage.removeItem("interviewEnded")

    const getRoundSpecific = (key) => formData.roundSpecific?.[key] || []
    const formatVal = (val) => Array.isArray(val) ? val.join(', ') : (val || '')
    const techStackStr = [
      ...formData.techStack,
      ...(formData.customTechStack ? [formData.customTechStack] : [])
    ].join(', ')

    const isDevops = formData.role === 'devops'
    const roleLabel = isDevops ? 'Site Reliability Engineer' : 'Software Engineer'
    const yearsLabel = (formData.yearsOfExperience || '').replace(/_/g, '-') || '5+'

    // Build the full interviewState with every custom prompt template variable
    const interviewState = {
      customInterview: true,
      roundType: formData.roundType,
      type: formData.roundType,
      role: roleLabel,
      rawRole: formData.role,
      firstName: 'Candidate',
      length: '45 min',
      level: formData.level,
      years_experience: yearsLabel,
      domain_focus: formData.domainFocus,
      system_context: formData.systemContext,
      tech_stack: techStackStr,
      production_maturity: formData.productionMaturity,
      failure_intensity: formData.failureIntensity,
      ambiguity_level: formData.ambiguityLevel,
      interview_strictness: formData.interviewStrictness,
      candidate_strengths: formatVal(formData.candidateStrengths),
      candidate_weaknesses: formatVal(formData.candidateWeaknesses),
      job_description: formData.jobDescription || '',
      production_context: formData.productionMaturity,
      stress_conditions: `Intensity: ${formData.failureIntensity}`,
      // SDE Coding
      implementation_domain: formatVal(getRoundSpecific('implementationDomain')),
      system_interaction: formatVal(getRoundSpecific('systemInteraction')),
      constraints_emphasis: formatVal(getRoundSpecific('constraintsEmphasis')),
      failure_environment: formatVal(getRoundSpecific('failureEnvironment')),
      data_interaction_type: formatVal(getRoundSpecific('dataInteractionType')),
      // DevOps Coding
      automation_type: formatVal(getRoundSpecific('automationType')),
      infra_environment: formatVal(getRoundSpecific('infraEnvironment')),
      safety_expectations: formatVal(getRoundSpecific('safetyExpectations')),
      operational_constraints: formatVal(getRoundSpecific('operationalConstraints')),
      // Design
      platform_type: formatVal(getRoundSpecific('platformType')),
      deployment_model: formatVal(getRoundSpecific('deploymentModel')),
      operational_expectations: formatVal(getRoundSpecific('operationalExpectations')),
      design_focus: formatVal(getRoundSpecific('designFocus')),
      failure_modeling: formatVal(getRoundSpecific('failureModeling')),
      system_type: formatVal(getRoundSpecific('systemType')),
      scale_expectation: formatVal(getRoundSpecific('scaleExpectation')),
      data_profile: formatVal(getRoundSpecific('dataProfile')),
      // Debug
      failure_surface: formatVal(getRoundSpecific('failureSurface')),
      observability: formatVal(getRoundSpecific('observability')),
      dependency_environment: formatVal(getRoundSpecific('dependencyEnvironment')),
      failure_impact: formatVal(getRoundSpecific('failureImpact')),
      incident_type: formatVal(getRoundSpecific('incidentType')),
      infra_layer: formatVal(getRoundSpecific('infraLayer')),
      signals_available: formatVal(getRoundSpecific('signalsAvailable')),
      impact_scope: formatVal(getRoundSpecific('impactScope')),
      // Behavioral
      operational_exposure: formatVal(getRoundSpecific('operationalExposure')),
      leadership_scope: formatVal(getRoundSpecific('leadershipScope')),
      scenario_emphasis: formatVal(getRoundSpecific('scenarioEmphasis')),
      experience_domain: formatVal(getRoundSpecific('experienceDomain')),
      leadership_exposure: formatVal(getRoundSpecific('leadershipExposure')),
      raw_state: formData,
    }

    const isDebug = formData.roundType === 'debug'

    try {
      if (isDebug) {
        // Debug rounds — call the lightweight compiler and show spinner
        setIsCompiling(true)

        const compilerContext = {
          level: formData.level,
          domain_focus: formData.domainFocus,
          system_context: formData.systemContext,
          tech_stack: techStackStr,
          failure_surface: interviewState.failure_surface || interviewState.incident_type || 'service logic bug',
          dependency_environment: interviewState.dependency_environment || interviewState.infra_layer || 'multi-service',
          failure_impact: interviewState.failure_impact || interviewState.impact_scope || 'user failures',
          incident_type: interviewState.incident_type || 'deployment failure',
          infra_layer: interviewState.infra_layer || 'Kubernetes',
          signals_available: interviewState.signals_available || 'logs',
          impact_scope: interviewState.impact_scope || 'single service',
          production_maturity: formData.productionMaturity,
          years_experience: yearsLabel,
          candidate_weaknesses: formatVal(formData.candidateWeaknesses),
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compile-scenario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: formData.role,
            roundType: formData.roundType,
            formatContext: compilerContext
          })
        })

        if (!response.ok) throw new Error(`Compilation failed: ${response.statusText}`)

        const problemData = await response.json()

        const problemObj = {
          title: problemData.title || 'Debug Challenge',
          statement: problemData.statement || '',
          files: problemData.files || {},
          language: Object.keys(problemData.files || {}).find(f => !f.endsWith('.txt'))?.split('.').pop() || 'python'
        }

        navigate('/debug-round', {
          state: {
            ...interviewState,
            roundProblemData: problemObj,
            problem: problemObj
          }
        })
      } else {
        // Non-debug rounds — navigate directly, no compiler call
        if (formData.roundType === 'coding') {
          navigate('/coding-round', { state: interviewState })
        } else if (formData.roundType === 'design') {
          navigate('/design-round', { state: interviewState })
        } else {
          navigate('/behavioral-round', { state: interviewState })
        }
      }
    } catch (error) {
      console.error('Error starting simulation:', error)
      alert('Failed to compile debug scenario. Please try again.')
    } finally {
      setIsCompiling(false)
    }
  }

  // Validation
  // Validation
  // Check if any round specific field is empty if it exists
  const areRoundSpecificsValid = () => {
    const config = ROUND_SPECIFIC_CONFIG[formData.roundType]?.[formData.role]
    if (!config) return true // No specifics needed

    // Check if each key in config has a corresponding value in formData.roundSpecific
    return Object.keys(config).every(key => {
      const val = formData.roundSpecific[key]
      return val && val.length > 0
    })
  }

  const canGenerate =
    formData.role &&
    formData.level &&
    formData.domainFocus &&
    formData.productionMaturity &&
    formData.systemContext &&
    formData.techStack.length > 0 &&
    formData.failureIntensity &&
    formData.ambiguityLevel &&
    formData.interviewStrictness &&
    formData.yearsOfExperience &&
    formData.candidateStrengths.length > 0 &&
    areRoundSpecificsValid()

  // -------------------------------------------------------------------------
  // Render Helpers
  // -------------------------------------------------------------------------

  const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4 mb-6 border-b border-gray-100 pb-4">
      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-cyan-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )

  const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )

  const Select = ({ name, value, onChange, options, placeholder = "Select..." }) => (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id || opt} value={opt.id || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  )

  const CardSelect = ({ options, value, onChange, name }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => handleChange({ target: { name, value: opt.id } })}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${value === opt.id
            ? 'border-cyan-500 bg-cyan-50/50 text-cyan-700 shadow-sm'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          <span className="font-semibold">{opt.label}</span>
        </button>
      ))}
    </div>
  )

  const MultiSelectChips = ({ options, selected, onToggle, labelFn = (o) => o }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const val = typeof opt === 'string' ? opt : opt.id
        const label = labelFn(opt)
        const isSelected = selected.includes(val)
        return (
          <button
            key={val}
            type="button"
            onClick={() => onToggle(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isSelected
              ? 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-500/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {label}
            {isSelected && <CheckCircle className="w-3 h-3 ml-2 inline-block" />}
          </button>
        )
      })}
    </div>
  )

  // -------------------------------------------------------------------------
  // Render Sections
  // -------------------------------------------------------------------------

  const renderRoundSpecifics = () => {
    const config = ROUND_SPECIFIC_CONFIG[formData.roundType]?.[formData.role]
    if (!config) return null

    // Helper to format key 'implementationDomain' -> 'Implementation Domain'
    const formatLabel = (key) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())

    return (
      <div className="space-y-6 mt-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
        <SectionHeader
          icon={Layers}
          title={`${ROLES.find(r => r.id === formData.role)?.label} ${ROUND_TYPES.find(r => r.id === formData.roundType)?.label} Specifics`}
          description="Fine-tune the scenario details."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(config).map(([key, options]) => (
            <div key={key} className="space-y-2">
              <Label required>{formatLabel(key)}</Label>
              <Select
                name={key}
                value={formData.roundSpecific[key] || ""}
                onChange={(e) => handleRoundSpecificChange(key, e.target.value)}
                options={options.map(o => ({ id: o, label: o }))}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-5xl mx-auto">

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Perfect Interview</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Configure every aspect of your mock interview simulation. From system context to failure modes, make it as real as it gets.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

            {/* 1. TOP LEVEL: Round Type & Role */}
            <div className="p-8 border-b border-slate-100 bg-white">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <Label required>Round Type</Label>
                  <CardSelect
                    options={ROUND_TYPES}
                    value={formData.roundType}
                    name="roundType"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* LEFT COL: Core Settings */}
              <div className="lg:col-span-8 p-8 border-r border-slate-100">

                {/* Role & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label required>Target Role</Label>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      options={ROLES}
                    />
                  </div>
                  <div>
                    <Label required>Level</Label>
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      options={EXPERIENCE_LEVELS}
                    />
                  </div>
                </div>

                {/* Core Context */}
                <SectionHeader icon={Cpu} title="Core Context" description="Define the environment and tech stack." />

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label required>Domain Focus</Label>
                      <Select
                        name="domainFocus"
                        value={formData.domainFocus}
                        onChange={handleChange}
                        options={DOMAIN_FOCUS.map(d => ({ id: d, label: d }))}
                      />
                    </div>
                    <div>
                      <Label required>Production Maturity</Label>
                      <Select
                        name="productionMaturity"
                        value={formData.productionMaturity}
                        onChange={handleChange}
                        options={PRODUCTION_MATURITY}
                      />
                    </div>
                  </div>

                  <div>
                    <Label required>System Context</Label>
                    <div className="mb-2">
                      <input
                        type="text"
                        name="systemContext"
                        value={formData.systemContext}
                        onChange={handleChange}
                        placeholder="e.g. High-throughput payment gateway..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {SYSTEM_CONTEXT_SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, systemContext: s }))}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label required>Tech Stack</Label>
                    <MultiSelectChips
                      options={TECH_STACKS}
                      selected={formData.techStack}
                      onToggle={(val) => handleMultiSelect('techStack', val)}
                    />
                    <input
                      type="text"
                      name="customTechStack"
                      value={formData.customTechStack}
                      onChange={handleChange}
                      placeholder="Other (e.g. Temporal, Raft, eBPF...)"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Round Inputs */}
                {renderRoundSpecifics()}

              </div>

              {/* RIGHT COL: Signals & Meta */}
              <div className="lg:col-span-4 bg-slate-50/50 p-8">

                <SectionHeader icon={Activity} title="Realism & Signals" description="Tune the difficulty and evaluation." />

                <div className="space-y-6">

                  <div>
                    <Label required>Failure Intensity</Label>
                    <Select
                      name="failureIntensity"
                      value={formData.failureIntensity}
                      onChange={handleChange}
                      options={FAILURE_INTENSITY}
                    />
                  </div>

                  <div>
                    <Label required>Ambiguity Level</Label>
                    <Select
                      name="ambiguityLevel"
                      value={formData.ambiguityLevel}
                      onChange={handleChange}
                      options={AMBIGUITY_LEVEL}
                    />
                  </div>

                  <div>
                    <Label required>Interviewer Persona</Label>
                    <Select
                      name="interviewStrictness"
                      value={formData.interviewStrictness}
                      onChange={handleChange}
                      options={INTERVIEW_STRICTNESS}
                    />
                  </div>

                  <hr className="border-gray-200 my-6" />

                  <SectionHeader icon={User} title="Candidate Profile" description="Help us calibrate." />

                  <div>
                    <Label required>Years of Experience</Label>
                    <Select
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      options={YEARS_OF_EXPERIENCE}
                    />
                  </div>

                  <div>
                    <Label required>Your Strengths</Label>
                    <MultiSelectChips
                      options={CANDIDATE_STRENGTHS}
                      selected={formData.candidateStrengths}
                      onToggle={(val) => handleMultiSelect('candidateStrengths', val)}
                    />
                  </div>

                  <div>
                    <Label>Job Description (Optional)</Label>
                    <textarea
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Paste the job description here to tailor the interview context..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 bg-white flex justify-end items-center gap-4 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                disabled={isCompiling}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canGenerate || isCompiling}
                className="group relative px-8 py-3 rounded-xl font-bold text-white overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-105" />
                <span className="relative flex items-center gap-2">
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Initializing Simulation...
                    </>
                  ) : (
                    <>
                      Start Simulation
                      <Play className="w-5 h-5" />
                    </>
                  )}
                </span>
              </button>
            </div>

          </form>
        </div>
      </main>
    </>
  )
}

export default CreateInterview
