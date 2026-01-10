import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
    return (
        <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Intervyu" className="w-8 h-8 contrast-125 brightness-150" />
                    <span className="text-xl font-bold text-white tracking-tight">Interviu</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
                    <a href="#interviews" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Interviews</a>
                    <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
                    <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</a>
                </div>

                <div className="flex items-center gap-4">
                    {userCredentials ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-white hover:text-cyan-400 transition-colors hidden sm:block"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar