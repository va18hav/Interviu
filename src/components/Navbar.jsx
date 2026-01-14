import React, { useRef, useEffect } from 'react'
import logo from "../assets/images/logo.png"
import { supabase } from "../supabaseClient"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from 'react'
import { Zap, User, LogOut, LayoutDashboard, FileText, Menu, X, PlusCircle, History, ChevronRight } from 'lucide-react'
import gsap from 'gsap'

const Navbar = ({ credits: propCredits }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const { firstName, lastName, email } = userCredentials || {};
    const [showProfile, setShowProfile] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const [fetchedCredits, setCredits] = useState(0);

    const menuRef = useRef(null);
    const menuItemsRef = useRef([]);
    const menuOverlayRef = useRef(null);

    const credits = propCredits !== undefined && propCredits !== null ? propCredits : fetchedCredits;

    useEffect(() => {
        if (propCredits !== undefined && propCredits !== null) return;

        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('credits')
                    .eq('id', user.id)
                    .single();
                if (data) setCredits(data.credits);
            }
        };
        fetchCredits();
    }, [propCredits]);

    // GSAP Animation for Mobile Menu
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = 'hidden';

            const tl = gsap.timeline();

            tl.to(menuOverlayRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
                .to(menuRef.current, {
                    x: '0%',
                    duration: 0.5,
                    ease: 'power3.out'
                }, '-=0.3')
                .fromTo(menuItemsRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' },
                    '-=0.2'
                );

        } else {
            document.body.style.overflow = 'unset';

            const tl = gsap.timeline();

            tl.to(menuItemsRef.current, {
                y: 10,
                opacity: 0,
                duration: 0.2,
                stagger: 0.03
            })
                .to(menuRef.current, {
                    x: '100%',
                    duration: 0.4,
                    ease: 'power3.in'
                }, '-=0.1')
                .to(menuOverlayRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                }, '-=0.3');
        }
    }, [showMobileMenu]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setShowMobileMenu(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("userCredentials");
        navigate('/login');
        setShowMobileMenu(false);
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Create Interview', path: '/create', icon: PlusCircle },
        { name: 'My Interviews', path: '/dashboard/all-popular-interviews', icon: History },
        { name: 'Resume Analysis', path: '/resume', icon: FileText },
    ];

    const isActive = (path) => location.pathname === path;

    const addToRefs = (el) => {
        if (el && !menuItemsRef.current.includes(el)) {
            menuItemsRef.current.push(el);
        }
    };

    // Clear refs on re-render to avoid duplicates
    menuItemsRef.current = [];

    return (
        <>
            <header className="border-b border-slate-800/50 bg-white/50 backdrop-blur-xl sticky top-0 z-40 w-full ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3 z-50 relative">
                            <Link to="/dashboard" className="flex items-center gap-2 group">
                                <div className="flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img src={logo} alt="Logo" className="w-10 h-10 relative z-10" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-extrabold text-black tracking-tight leading-none">Inter<span className="text-cyan-400">viu</span></h1>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav-bar */}
                        <nav className='hidden md:flex items-center gap-1 bg-slate-100/30 p-1.5 rounded-full border border-slate-300/50'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path)
                                        ? 'text-black bg-slate-100/50 shadow-sm'
                                        : 'text-slate-900 hover:text-black hover:bg-slate-200/50'
                                        }`}
                                >
                                    {link.name === 'My Interviews' ? 'Interviews' : link.name === 'Create Interview' ? 'Create' : link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* User Profile (Desktop) */}
                        <div className="hidden md:flex items-center gap-4 relative">
                            <div className="flex items-center gap-3 pl-4">
                                <div className="flex items-center gap-2 mr-2 bg-slate-300/80 px-3 py-1.5 rounded-full border border-slate-400/50 shadow-sm hover:border-slate-500 transition-colors cursor-pointer">
                                    <div className="p-1 rounded-full bg-yellow-200/10 group-hover:bg-yellow-500/20 transition-colors">
                                        <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <span className="text-sm font-bold text-black tabular-nums">{credits}</span>
                                </div>

                                <button
                                    onClick={() => setShowProfile(prev => !prev)}
                                    className="group flex items-center gap-2 cursor-pointer focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all duration-300 text-sm">
                                        {firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </button>
                            </div>

                            {/* Desktop Profile Dropdown */}
                            {showProfile && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                                    <div className="absolute top-full mt-4 right-0 w-80 bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/5 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                        {/* Header */}
                                        <div className="p-5 border-b border-slate-800/50 bg-slate-900/30">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl text-white font-bold shadow-inner ring-4 ring-slate-900">
                                                    {firstName?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <p className="text-white font-semibold truncate text-lg">
                                                        {firstName && lastName ? `${firstName} ${lastName}` : 'User'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">{email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2 flex flex-col gap-1">
                                            <div className="px-3 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">Account</div>

                                            <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all duration-200 group">
                                                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                                                    <User size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Profile Settings</span>
                                                    <span className="text-xs text-slate-500 group-hover:text-slate-400">Manage account & preferences</span>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="h-px bg-slate-800/50 mx-4 my-1" />

                                        <div className="p-2">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
                                            >
                                                <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 group-hover:border-red-500/20 transition-colors">
                                                    <LogOut size={16} className="text-red-500/70 group-hover:text-red-400 transition-colors" />
                                                </div>
                                                <span className="font-medium">Sign out</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden flex items-center z-50">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative z-50"
                            >
                                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Premium Mobile Menu Overlay */}
            <div
                ref={menuOverlayRef}
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] md:hidden opacity-0 ${showMobileMenu ? 'pointer-events-auto' : 'pointer-events-none'}`}
                onClick={() => setShowMobileMenu(false)}
            />

            {/* Mobile Menu Slide-over */}
            <div
                ref={menuRef}
                className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#070b14] border-l border-slate-800 z-[66] md:hidden shadow-2xl flex flex-col translate-x-full"
            >
                {/* Mobile Menu Header */}
                <div className="relative p-6 border-b border-slate-800/50 flex flex-col gap-6 bg-gradient-to-b from-slate-900/50 to-transparent">
                    <button
                        onClick={() => setShowMobileMenu(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors z-50 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <div ref={addToRefs} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl text-white font-bold shadow-lg ring-4 ring-slate-900/50">
                            {firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-white font-bold text-lg truncate">
                                {firstName ? `Hi, ${firstName}` : 'Welcome'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                    <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-500">{credits} Credits</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <div ref={addToRefs} className="px-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Menu
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            ref={addToRefs}
                            to={link.path}
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${isActive(link.path)
                                ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20'
                                : 'hover:bg-slate-900 border border-transparent'
                                }`}
                        >
                            <div className={`p-2.5 rounded-lg transition-colors ${isActive(link.path)
                                ? 'bg-cyan-500 text-black'
                                : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                                }`}>
                                <link.icon size={20} className={isActive(link.path) ? 'stroke-[2.5px]' : ''} />
                            </div>
                            <span className={`text-base font-medium ${isActive(link.path) ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                }`}>
                                {link.name}
                            </span>
                            {isActive(link.path) && (
                                <ChevronRight size={16} className="ml-auto text-cyan-500" />
                            )}
                        </Link>
                    ))}

                    <div ref={addToRefs} className="mt-6 px-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Account
                    </div>

                    <Link
                        ref={addToRefs}
                        to="/profile"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-900 border border-transparent transition-all duration-200 group"
                    >
                        <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                            <User size={20} />
                        </div>
                        <span className="text-base font-medium text-slate-300 group-hover:text-white">
                            Profile Settings
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <button
                        ref={addToRefs}
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-red-400 font-medium hover:bg-red-500/5 hover:border-red-500/20 transition-all active:scale-[0.98]"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                    <p ref={addToRefs} className="text-center text-[10px] text-slate-600 mt-4">
                        Interviu v1.0.0 &copy; 2026
                    </p>
                </div>
            </div>
        </>
    )
}

export default Navbar
