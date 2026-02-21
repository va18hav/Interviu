import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                <span className="font-bold text-white text-lg">I</span>
                            </div>
                            <span className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Inter<span className="font-sans text-cyan-400">viu</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Master your technical interviews with AI-powered mock sessions, real-time feedback, and personalized roadmaps.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Dashboard</Link></li>
                            <li><Link to="/resume" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Resume AI</Link></li>
                            <li><Link to="/create" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Mock Interview</Link></li>
                            <li><Link to="/dashboard/all-popular-interviews" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Popular Roles</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Interview Tips</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Career Guide</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Success Stories</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">About Us</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Interviu. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <span>for developers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
