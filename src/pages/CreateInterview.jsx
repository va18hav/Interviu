import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase, Target, Code, Sparkles, Brain, Zap, TrendingUp, Clock,
  FileText, Cpu, Activity, User, Layers, Monitor, Server, Settings,
  Shield, CheckCircle, X, Loader2, Play, ChevronRight, ArrowLeft,
  Terminal, Database, Globe, Mic, Bug, Heart, Box, Workflow, Rocket
} from 'lucide-react'
import Navbar from "../components/Navbar"
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

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
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
      implementation_domain: formatVal(getRoundSpecific('implementationDomain')),
      system_interaction: formatVal(getRoundSpecific('systemInteraction')),
      constraints_emphasis: formatVal(getRoundSpecific('constraintsEmphasis')),
      failure_environment: formatVal(getRoundSpecific('failureEnvironment')),
      data_interaction_type: formatVal(getRoundSpecific('dataInteractionType')),
      automation_type: formatVal(getRoundSpecific('automationType')),
      infra_environment: formatVal(getRoundSpecific('infraEnvironment')),
      safety_expectations: formatVal(getRoundSpecific('safetyExpectations')),
      operational_constraints: formatVal(getRoundSpecific('operationalConstraints')),
      platform_type: formatVal(getRoundSpecific('platformType')),
      deployment_model: formatVal(getRoundSpecific('deploymentModel')),
      operational_expectations: formatVal(getRoundSpecific('operationalExpectations')),
      design_focus: formatVal(getRoundSpecific('designFocus')),
      failure_modeling: formatVal(getRoundSpecific('failureModeling')),
      system_type: formatVal(getRoundSpecific('systemType')),
      scale_expectation: formatVal(getRoundSpecific('scaleExpectation')),
      data_profile: formatVal(getRoundSpecific('dataProfile')),
      failure_surface: formatVal(getRoundSpecific('failureSurface')),
      observability: formatVal(getRoundSpecific('observability')),
      dependency_environment: formatVal(getRoundSpecific('dependencyEnvironment')),
      failure_impact: formatVal(getRoundSpecific('failureImpact')),
      incident_type: formatVal(getRoundSpecific('incidentType')),
      infra_layer: formatVal(getRoundSpecific('infraLayer')),
      signals_available: formatVal(getRoundSpecific('signalsAvailable')),
      impact_scope: formatVal(getRoundSpecific('impactScope')),
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

        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/compile-scenario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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
        if (formData.roundType === 'coding') navigate('/coding-round', { state: interviewState })
        else if (formData.roundType === 'design') navigate('/design-round', { state: interviewState })
        else navigate('/behavioral-round', { state: interviewState })
      }
    } catch (error) {
      console.error('Error starting simulation:', error)
      alert('Failed to compile debug scenario. Please try again.')
    } finally {
      setIsCompiling(false)
    }
  }

  // Validation
  const areRoundSpecificsValid = () => {
    const config = ROUND_SPECIFIC_CONFIG[formData.roundType]?.[formData.role]
    if (!config) return true
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
    formData.candidateWeaknesses.length > 0 &&
    areRoundSpecificsValid()

  // -------------------------------------------------------------------------
  // Mini UI Components
  // -------------------------------------------------------------------------

  const SectionTitle = ({ icon: Icon, title, step }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
          {step}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 leading-tight">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration Segment</p>
      </div>
    </div>
  )

  const Label = ({ children, required }) => (
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
      {children}
      {required && <span className="text-red-500 ml-1 mt-[-2px] inline-block">*</span>}
    </label>
  )

  const Select = ({ name, value, onChange, options, placeholder = "Select Option" }) => (
    <div className="relative group">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 group-hover:bg-white group-hover:border-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id || opt} value={opt.id || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-300 group-hover:text-indigo-400 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-90" />
      </div>
    </div>
  )

  const RoundTypeCard = ({ type }) => {
    const isSelected = formData.roundType === type.id
    const iconMap = {
      'coding': <Terminal className="w-6 h-6" />,
      'design': <Layers className="w-6 h-6" />,
      'debug': <Bug className="w-6 h-6" />,
      'behavioral': <Mic className="w-6 h-6" />
    }

    return (
      <button
        type="button"
        onClick={() => setFormData(p => ({ ...p, roundType: type.id }))}
        className={`relative flex flex-col p-6 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden group ${isSelected
          ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200'
          : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-100'
          }`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors mb-4 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
          }`}>
          {iconMap[type.id] || <Code className="w-6 h-6" />}
        </div>
        <span className={`text-base font-black transition-colors ${isSelected ? 'text-white' : 'text-slate-900'}`}>
          {type.label}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
          Round Module
        </span>
        {isSelected && (
          <motion.div
            layoutId="activeRound"
            className="absolute top-4 right-4"
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </button>
    )
  }

  const Chip = ({ label, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 ${isSelected
        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 translate-y-[-2px]'
        : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
        }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* Cinematic Header */}
      <div className="relative w-full overflow-hidden bg-slate-950 px-6 py-24 md:px-16 md:py-32 mb-12 rounded-b-[4rem]">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-xs uppercase tracking-[0.2em]">Abort Construction</span>
            </button>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">
              Simulation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Blueprint.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-xl font-medium leading-relaxed">
              Architect your interview environment. Define stack constraints, inject failure vectors, and calibrate evaluating stressors.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Form Content */}
          <div className="lg:col-span-8 space-y-20">

            {/* Phase 0: Objective */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <SectionTitle icon={Rocket} title="Round Objective" step="0" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ROUND_TYPES.map(type => (
                  <RoundTypeCard key={type.id} type={type} />
                ))}
              </div>
            </motion.section>

            {/* Phase 1: Environment */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <SectionTitle icon={Workflow} title="Environmental Core" step="1" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label required>Target Role Interface</Label>
                  <Select name="role" value={formData.role} onChange={handleChange} options={ROLES} />
                </div>
                <div className="space-y-2">
                  <Label required>Difficulty Normalization</Label>
                  <Select name="level" value={formData.level} onChange={handleChange} options={EXPERIENCE_LEVELS} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label required>Domain Architecture</Label>
                  <Select name="domainFocus" value={formData.domainFocus} onChange={handleChange} options={DOMAIN_FOCUS.map(d => ({ id: d, label: d }))} />
                </div>
                <div className="space-y-2">
                  <Label required>Production Maturity</Label>
                  <Select name="productionMaturity" value={formData.productionMaturity} onChange={handleChange} options={PRODUCTION_MATURITY} />
                </div>
              </div>

              <div className="space-y-2">
                <Label required>System Context Identity</Label>
                <div className="relative group">
                  <input
                    type="text"
                    name="systemContext"
                    value={formData.systemContext}
                    onChange={handleChange}
                    placeholder="e.g. Distributed Consensus Engine..."
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300"
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {SYSTEM_CONTEXT_SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, systemContext: s }))}
                        className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-100 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all"
                      >
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label required>Primary Technology Stack</Label>
                <div className="flex flex-wrap gap-3">
                  {TECH_STACKS.map(tech => (
                    <Chip
                      key={tech}
                      label={tech}
                      isSelected={formData.techStack.includes(tech)}
                      onClick={() => handleMultiSelect('techStack', tech)}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  name="customTechStack"
                  value={formData.customTechStack}
                  onChange={handleChange}
                  placeholder="Additional specialized stack components (Redis, Kafka, AWS...)"
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 italic"
                />
              </div>

              {/* Round Specifics Injection */}
              {(() => {
                const config = ROUND_SPECIFIC_CONFIG[formData.roundType]?.[formData.role]
                if (!config) return null
                return (
                  <div className="pt-12 mt-12 border-t border-slate-50 space-y-8">
                    <div className="flex items-center gap-4">
                      <Box className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Deep Logic Injection</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Object.entries(config).map(([key, options]) => (
                        <div key={key} className="space-y-2">
                          <Label required>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
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
              })()}
            </motion.section>

            {/* Phase 2: Calibrations */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <SectionTitle icon={Settings} title="Execution Calibration" step="2" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <Label required>Failure Intensity</Label>
                  <Select name="failureIntensity" value={formData.failureIntensity} onChange={handleChange} options={FAILURE_INTENSITY} />
                </div>
                <div className="space-y-2">
                  <Label required>Ambiguity Level</Label>
                  <Select name="ambiguityLevel" value={formData.ambiguityLevel} onChange={handleChange} options={AMBIGUITY_LEVEL} />
                </div>
                <div className="space-y-2">
                  <Label required>Evaluation Persona</Label>
                  <Select name="interviewStrictness" value={formData.interviewStrictness} onChange={handleChange} options={INTERVIEW_STRICTNESS} />
                </div>
              </div>
            </motion.section>

            {/* Phase 3: Candidate Profile */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <SectionTitle icon={Brain} title="Candidate Profile" step="3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <Label required>Experience Quantization</Label>
                  <Select name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} options={YEARS_OF_EXPERIENCE} />
                </div>

                <div className="space-y-4">
                  <Label required>Strengths</Label>
                  <div className="flex flex-wrap gap-2">
                    {CANDIDATE_STRENGTHS.map(s => (
                      <Chip
                        key={s}
                        label={s}
                        isSelected={formData.candidateStrengths.includes(s)}
                        onClick={() => handleMultiSelect('candidateStrengths', s)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label required>Weaknesses</Label>
                  <div className="flex flex-wrap gap-2">
                    {CANDIDATE_WEAKNESSES.map(w => (
                      <Chip
                        key={w}
                        label={w}
                        isSelected={formData.candidateWeaknesses.includes(w)}
                        onClick={() => handleMultiSelect('candidateWeaknesses', w)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Job Description Synthesis (Optional)</Label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Ingest JD to tailor the scenario logic..."
                  className="w-full rounded-[2rem] border border-slate-100 bg-slate-50 px-8 py-6 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-300 resize-none"
                />
              </div>
            </motion.section>

          </div>

          {/* Sidebar Blueprint Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white space-y-8 shadow-2xl overflow-hidden relative group">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <History className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Blueprint Scan</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-widest">Validation Status</span>
                    <span className={`font-black uppercase tracking-[0.2em] ${canGenerate ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {canGenerate ? 'Stable' : 'Incomplete'}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: canGenerate ? "100%" : "65%" }}
                      className={`h-full ${canGenerate ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                      <span className="text-sm font-black text-white">{ROUND_TYPES.find(r => r.id === formData.roundType)?.label || 'Awaiting Selection'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interface</span>
                      <span className="text-sm font-black text-white">{ROLES.find(r => r.id === formData.role)?.label || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment</span>
                      <span className="text-sm font-black text-white truncate">{formData.systemContext || 'Undefined'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-slate-800 pt-8 space-y-4">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isCompiling}
                  className="w-full relative group/btn flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 group-hover/btn:scale-105 transition-transform duration-500" />
                  <div className="relative flex items-center gap-3">
                    {isCompiling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        Initiate Simulation
                        <Play className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  Clear Blueprint
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

// Minimal Helpers
const History = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
  </svg>
)

export default CreateInterview
