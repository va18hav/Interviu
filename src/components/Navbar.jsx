import React, { useRef, useEffect } from 'react'
import logo from "../assets/images/logo.png"
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
            try {
                const userCreds = JSON.parse(localStorage.getItem("userCredentials"));
                if (!userCreds?.id) return;

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits?userId=${userCreds.id}`);
                const data = await response.json();

                if (response.ok) {
                    setCredits(data.credits);
                }
            } catch (error) {
                console.error("Error fetching credits:", error);
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
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST' });
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem("userCredentials");
        localStorage.removeItem("authToken");
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

    // Desktop Nav Refs
    const navRef = useRef(null);
    const navLinksRef = useRef([]);

    // Initialize state from sessionStorage to persist position across page loads (since Navbar re-mounts)
    const [indicatorStyle, setIndicatorStyle] = useState(() => {
        try {
            const saved = sessionStorage.getItem('navIndicatorStyle');
            return saved ? JSON.parse(saved) : { left: 0, width: 0, opacity: 0 };
        } catch (e) {
            return { left: 0, width: 0, opacity: 0 };
        }
    });

    useEffect(() => {
        const updateIndicator = () => {
            const activeIndex = navLinks.findIndex(link => isActive(link.path));

            if (activeIndex !== -1 && navLinksRef.current[activeIndex] && navRef.current) {
                const activeLink = navLinksRef.current[activeIndex];
                const navRect = navRef.current.getBoundingClientRect();
                const linkRect = activeLink.getBoundingClientRect();

                const newStyle = {
                    left: linkRect.left - navRect.left,
                    width: linkRect.width,
                    opacity: 1
                };

                setIndicatorStyle(newStyle);
                sessionStorage.setItem('navIndicatorStyle', JSON.stringify(newStyle));
            } else {
                setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
            }
        };

        // Run calculation after a short delay to ensure DOM is ready/fonts loaded
        const timeoutId = setTimeout(updateIndicator, 50);

        window.addEventListener('resize', updateIndicator);
        return () => {
            window.removeEventListener('resize', updateIndicator);
            clearTimeout(timeoutId);
        };

    }, [location.pathname]);

    const addToNavLinksRef = (el, index) => {
        if (el) {
            navLinksRef.current[index] = el;
        }
    };

    return (
        <>
            <header className="border-b border-slate-400/50 bg-white/50 backdrop-blur-xl sticky top-0 z-40 w-full ">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center z-50 relative">
                            <Link to="/dashboard" className="flex items-center gap-6 group">
                                <div className="flex items-center justify-center relative">
                                    {/* <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                                    <img src={logo} alt="Logo" className="w-10 h-12 relative z-10" />
                                </div>
                                <div className="flex flex-col  -ml-4">
                                    <h1 className="text-xl font-extrabold text-black leading-none">Inter<span class="text-[#111827]">v</span><span class="text-[#64748B]">i</span><span class="text-[#2F6F73]">u</span></h1>
                                    <p className="text-xs text-gray-500">Interview Better</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav-bar */}
                        <nav ref={navRef} className='hidden md:flex items-center gap-1 bg-slate-100/30 p-1.5 rounded-full border border-slate-300/50 relative'>
                            {/* Sliding Indicator */}
                            <div
                                className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
                                style={{
                                    left: `${indicatorStyle.left}px`,
                                    width: `${indicatorStyle.width}px`,
                                    opacity: indicatorStyle.opacity
                                }}
                            />

                            {
                                navLinks.map((link, index) => (
                                    <Link
                                        key={link.path}
                                        ref={el => addToNavLinksRef(el, index)}
                                        to={link.path}
                                        className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${isActive(link.path)
                                            ? 'text-black'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {link.name === 'My Interviews' ? 'Interviews' : link.name === 'Create Interview' ? 'Create' : link.name}
                                    </Link>
                                ))
                            }
                        </nav>

                        {/* User Profile (Desktop) */}
                        <div className="hidden md:flex items-center gap-4 relative">
                            <div className="flex items-center gap-3 pl-4">
                                {/* Removed commented out credits */}

                                <button
                                    onClick={() => setShowProfile(prev => !prev)}
                                    className="group flex items-center gap-2 cursor-pointer focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-800 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-transparent group-hover:ring-cyan-500/50 transition-all duration-300 text-sm">
                                        {firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </button>
                            </div>

                            {/* Desktop Profile Dropdown */}
                            {
                                showProfile && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                                        <div className="absolute top-full mt-4 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden ring-1 ring-black/5 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            {/* Header */}
                                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-500 to-gray-800 flex items-center justify-center text-xl text-white font-bold shadow-md ring-4 ring-white">
                                                        {firstName?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-slate-900 font-bold truncate text-lg">
                                                            {firstName && lastName ? `${firstName} ${lastName}` : 'User'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 truncate mb-2">{email}</p>

                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 w-fit">
                                                            <Zap className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                                            <span className="text-xs font-bold text-yellow-700">{credits} Credits</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-2 flex flex-col gap-1">
                                                <div className="px-3 py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account</div>

                                                <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group">
                                                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-slate-300 transition-colors">
                                                        <User size={16} className="text-slate-500 group-hover:text-cyan-600 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">Profile Settings</span>
                                                        <span className="text-xs text-slate-400 group-hover:text-slate-500">Manage account & preferences</span>
                                                    </div>
                                                </Link>

                                                <Link to="/credits" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group">
                                                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-slate-300 transition-colors">
                                                        <Zap size={16} className="text-slate-500 group-hover:text-yellow-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">Credits & Billing</span>
                                                        <span className="text-xs text-slate-400 group-hover:text-slate-500">View credits and history</span>
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="h-px bg-slate-100 mx-4 my-1" />

                                            <div className="p-2">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                                >
                                                    <div className="p-2 rounded-lg bg-red-50 border border-red-100 group-hover:border-red-200 transition-colors">
                                                        <LogOut size={16} className="text-red-500 group-hover:text-red-600 transition-colors" />
                                                    </div>
                                                    <span className="font-semibold">Sign out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div >

                        {/* Mobile Menu Trigger */}
                        < div className="md:hidden flex items-center z-50" >
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative z-50"
                            >
                                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div >
                    </div >
                </div >
            </header >

            {/* Premium Mobile Menu Overlay */}
            < div
                ref={menuOverlayRef}
                className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden opacity-0 ${showMobileMenu ? 'pointer-events-auto' : 'pointer-events-none'}`}
                onClick={() => setShowMobileMenu(false)}
            />

            {/* Mobile Menu Slide-over */}
            <div
                ref={menuRef}
                className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white border-l border-slate-200 z-[66] md:hidden shadow-2xl flex flex-col translate-x-full"
            >
                {/* Mobile Menu Header */}
                <div className="relative p-6 border-b border-slate-100 flex flex-col gap-6 bg-gradient-to-b from-slate-50 to-transparent">
                    <button
                        onClick={() => setShowMobileMenu(false)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors z-50 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <div ref={addToRefs} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl text-white font-bold shadow-lg ring-4 ring-white">
                            {firstName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-slate-900 font-bold text-lg truncate">
                                {firstName ? `Hi, ${firstName}` : 'Welcome'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                                    <Zap className="w-3 h-3 text-yellow-600 fill-yellow-600" />
                                    <span className="text-xs font-bold text-yellow-700">{credits} Credits</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <div ref={addToRefs} className="px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Menu
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            ref={addToRefs}
                            to={link.path}
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${isActive(link.path)
                                ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100'
                                : 'hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <div className={`p-2.5 rounded-lg transition-colors ${isActive(link.path)
                                ? 'bg-cyan-500 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200'
                                }`}>
                                <link.icon size={20} className={isActive(link.path) ? 'stroke-[2.5px]' : ''} />
                            </div>
                            <span className={`text-base font-medium ${isActive(link.path) ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {link.name}
                            </span>
                            {isActive(link.path) && (
                                <ChevronRight size={16} className="ml-auto text-cyan-500" />
                            )}
                        </Link>
                    ))}

                    <div ref={addToRefs} className="mt-6 px-2 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Account
                    </div>

                    <Link
                        ref={addToRefs}
                        to="/profile"
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-50 border border-transparent transition-all duration-200 group"
                    >
                        <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200 transition-colors">
                            <User size={20} />
                        </div>
                        <span className="text-base font-medium text-slate-600 group-hover:text-slate-900">
                            Profile Settings
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        ref={addToRefs}
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-slate-200 text-red-600 font-medium hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98] shadow-sm"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                    <p ref={addToRefs} className="text-center text-[10px] text-slate-400 mt-4">
                        Interviu v1.0.0 &copy; 2026
                    </p>
                </div>
            </div>
        </>
    )
}

export default Navbar
