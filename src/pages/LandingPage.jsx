import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, FileText, ChevronRight, Zap, Target, Code, CheckCircle, Shield, Users } from 'lucide-react';
import logo from '../assets/images/logo.png';
import google from '../assets/images/google.png';
import amazon from '../assets/images/amazon.png';
import meta from '../assets/images/meta.png';
import techbanner from '../assets/images/techbanner.png';
import resumebanner from '../assets/images/resumebanner.png';
import bot from '../assets/images/bot.png';

const RevealOnScroll = ({ children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`${className} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {children}
        </div>
    );
};

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1),rgba(15,23,42,0)_50%)]" />
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Intervyu" className="w-8 h-8 md:w-10 md:h-10" />
                        <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Intervyu</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white font-medium transition-colors hidden md:block">
                            Sign In
                        </button>
                        <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 z-10">
                        <RevealOnScroll>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-6">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm font-medium text-cyan-200">AI-Powered Interview Prep</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                                Master Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Tech Interview</span>
                            </h1>
                            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                                Practice with realistic AI interviewers, get instant feedback, and analyze your resume to land your dream job at top tech companies.
                            </p>
                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-cyan-50 transition-all flex items-center gap-2 group">
                                    Start Practicing Free
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-slate-800/50 text-white border border-slate-700 rounded-full font-medium hover:bg-slate-800 transition-all backdrop-blur-sm flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    View Features
                                </button>
                            </div>
                            <div className="pt-8 flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-white">JD</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-white">AS</div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-xs text-white">MP</div>
                                </div>
                                <p>Used by 1,000+ developers</p>
                            </div>
                        </RevealOnScroll>
                    </div>

                    <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
                        <RevealOnScroll className="relative w-full h-full perspective-1000">
                            {/* Floating Elements Animation */}
                            <div className="relative w-full h-full animate-float-slow">
                                <img src={techbanner} alt="Dashboard Preview" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none object-contain filter drop-shadow-[0_0_50px_rgba(34,211,238,0.2)] rounded-2xl border border-white/10" />

                                {/* Floating Cards */}
                                <div className="absolute top-[20%] -left-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl animate-float-delayed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">Excellent Answer!</p>
                                            <p className="text-xs text-slate-400">Score: 98/100</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-[20%] -right-4 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <Brain className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">AI Analysis</p>
                                            <p className="text-xs text-slate-400">Processing feedback...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-12 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-slate-500 text-sm font-medium mb-8">PRACTICE FOR INTERVIEWS AT</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <img src={google} alt="Google" className="h-8 md:h-10 object-contain" />
                        <img src={amazon} alt="Amazon" className="h-8 md:h-10 object-contain" />
                        <img src={meta} alt="Meta" className="h-8 md:h-10 object-contain" />
                        <div className="text-white/30 font-bold text-xl flex items-center gap-2"><Code className="w-6 h-6" /> Netflix</div>
                        <div className="text-white/30 font-bold text-xl flex items-center gap-2"><Target className="w-6 h-6" /> Microsoft</div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <RevealOnScroll>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to <br /> <span className="text-cyan-400">ace the interview</span></h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our platform combines advanced AI with proven interview frameworks to give you the competitive edge.</p>
                        </div>
                    </RevealOnScroll>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[{
                            icon: <Brain className="w-8 h-8 text-purple-400" />,
                            title: "AI Interviewer",
                            desc: "Practice with a voice-enabled AI that adapts to your responses and asks follow-up questions.",
                            gradient: "from-purple-500/10 to-purple-500/5",
                            border: "hover:border-purple-500/30"
                        }, {
                            icon: <FileText className="w-8 h-8 text-cyan-400" />,
                            title: "ATS Resume Scan",
                            desc: "Get detailed analysis of your resume against job descriptions to ensure you get shortlisted.",
                            gradient: "from-cyan-500/10 to-cyan-500/5",
                            border: "hover:border-cyan-500/30"
                        }, {
                            icon: <Target className="w-8 h-8 text-green-400" />,
                            title: "Real-time Feedback",
                            desc: "Receive instant scoring on audio clarity, confidence, keyword usage, and answer quality.",
                            gradient: "from-green-500/10 to-green-500/5",
                            border: "hover:border-green-500/30"
                        }].map((feature, i) => (
                            <RevealOnScroll key={i} className={`delay-${i * 100}`}>
                                <div className={`h-full p-8 rounded-3xl border border-white/10 bg-gradient-to-b ${feature.gradient} backdrop-blur-sm transition-all duration-300 hover:transform hover:-translate-y-2 ${feature.border} group`}>
                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-slate-900/50 to-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <RevealOnScroll className="order-2 lg:order-1">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <img src={resumebanner} alt="Resume Scanner" className="relative rounded-xl border border-white/10 shadow-2xl w-full rotate-2 hover:rotate-0 transition-transform duration-500" />
                            </div>
                        </RevealOnScroll>
                        <RevealOnScroll className="order-1 lg:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Analyze & Optimize Your Resume</h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Smart Keyword Matching", desc: "Identify missing keywords from job descriptions." },
                                    { title: "Formatting Check", desc: "Ensure your resume parses correctly in ATS systems." },
                                    { title: "Actionable Insights", desc: "Get specific recommendations to improve your score." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                            <span className="text-cyan-400 font-bold">{i + 1}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                                            <p className="text-slate-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/resume')} className="mt-10 px-8 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
                                Try Resume Analyzer
                            </button>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-900/10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px]"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <RevealOnScroll>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to verify your skills?</h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of developers who are landing better jobs with higher salaries.</p>
                        <button onClick={() => navigate('/login')} className="px-10 py-5 bg-white text-slate-900 text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-cyan-500/20">
                            Start Your Free Session
                        </button>
                    </RevealOnScroll>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-black/40 text-slate-400 text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="Logo" className="w-6 h-6 grayscale opacity-80" />
                            <span className="text-white font-bold text-lg">Intervyu</span>
                        </div>
                        <p className="max-w-xs">AI-powered interview prep platform for developers. Practice, analyze, and succeed.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Mock Interviews</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Resume AI</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
                    <p>&copy; 2026 Intervyu. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">GitHub</a>
                        <a href="#" className="hover:text-white">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
