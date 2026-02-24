import React, { useRef, useEffect } from 'react'
import logo from "../assets/images/logo.png"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from 'react'
import { Zap, User, LogOut, LayoutDashboard, FileText, Menu, X, PlusCircle, History, ChevronRight, Users } from 'lucide-react'
import gsap from 'gsap'

const Navbar = ({ credits: propCredits }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const { first_name, last_name, firstName, lastName, email, avatar_url } = userCredentials || {};
    const effectiveFirstName = first_name || firstName;
    const effectiveLastName = last_name || lastName;
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
                if (userCreds?.id) {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits?userId=${userCreds.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();

                    if (response.ok) {
                        setCredits(data.credits);
                    }
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
            const token = localStorage.getItem('authToken');
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
        { name: 'Interviews', path: '/dashboard/all-popular-interviews', icon: Users },
        { name: 'Create Interview', path: '/create', icon: PlusCircle },
        { name: 'Activity', path: '/dashboard/all-previous-interviews', icon: History },
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
            <header className="border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl sticky top-0 z-40 w-full transition-all duration-300">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center z-50 relative">
                            <Link to="/dashboard" className="flex items-center gap-4 group">
                                <div className="flex items-center justify-center relative">
                                    {/* <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                                    <img src={logo} alt="Logo" className="w-12 h-14 relative z-10" />
                                </div>
                                <div className="flex flex-col  -ml-4">
                                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Interviu</h1>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interview Better</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Nav-bar */}
                        <nav ref={navRef} className='hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/60 relative'>
                            {/* Sliding Indicator */}
                            <div
                                className="absolute top-1 bottom-1 bg-indigo-300/60 rounded-full shadow-sm ring-1 ring-black/5 transition-all duration-300 ease-out"
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
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white transition-all duration-300 group-hover:scale-105 group-hover:ring-indigo-500/50 text-xs overflow-hidden">
                                        {avatar_url && avatar_url !== 'null' && avatar_url !== 'undefined' ? (
                                            <img src={avatar_url} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{effectiveFirstName?.charAt(0).toUpperCase() + effectiveLastName?.charAt(0).toUpperCase() || 'U'}</span>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Desktop Profile Dropdown */}
                            {
                                showProfile && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                                        <div className="absolute top-full mt-4 right-0 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-2xl z-50 overflow-hidden ring-1 ring-black/[0.03] origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            {/* Header */}
                                            <div className="p-6 border-b border-slate-100 bg-slate-50/40">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-xl text-white font-black shadow-xl ring-4 ring-white overflow-hidden">
                                                            {avatar_url && avatar_url !== 'null' && avatar_url !== 'undefined' ? (
                                                                <img src={avatar_url} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span>
                                                                    {effectiveFirstName?.charAt(0).toUpperCase() || 'U'}
                                                                    {effectiveLastName?.charAt(0).toUpperCase() || ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-slate-900 font-black truncate text-lg tracking-tight">
                                                            {effectiveFirstName && effectiveLastName ? `${effectiveFirstName} ${effectiveLastName}` : 'User'}
                                                        </p>
                                                        <p className="text-xs text-slate-400 font-medium truncate mb-2">{email}</p>

                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
                                                            <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">{credits} Credits</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-3 flex flex-col gap-1">
                                                <div className="px-3 py-2 text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Account Protocol</div>

                                                <Link to="/profile" onClick={() => setShowProfile(false)} className="flex items-center gap-4 px-3 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-300 group">
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm transition-all">
                                                        <User size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold tracking-tight">Profile Settings</span>
                                                        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Manage identity & skills</span>
                                                    </div>
                                                </Link>

                                                <Link to="/credits" onClick={() => setShowProfile(false)} className="flex items-center gap-4 px-3 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all duration-300 group">
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm transition-all">
                                                        <Zap size={18} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold tracking-tight">Credits & Billing</span>
                                                        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Tokens & session history</span>
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="h-px bg-slate-100 mx-4 my-1" />

                                            <div className="p-3">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-4 px-3 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-2xl transition-all duration-300 group"
                                                >
                                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 group-hover:bg-white group-hover:border-red-200 transition-all">
                                                        <LogOut size={18} className="text-red-500 group-hover:text-red-600 transition-all" />
                                                    </div>
                                                    <span className="font-bold tracking-tight">Sign out</span>
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
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95 relative z-50"
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
                className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl border-l border-slate-200/60 z-[66] md:hidden shadow-2xl flex flex-col translate-x-full"
            >
                {/* Mobile Menu Header */}
                <div className="relative p-8 border-b border-slate-100 flex flex-col gap-6">
                    <button
                        onClick={() => setShowMobileMenu(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all z-50 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <div ref={addToRefs} className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-2xl text-white font-black shadow-xl ring-4 ring-white overflow-hidden">
                                {avatar_url ? (
                                    <img src={avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{firstName?.charAt(0).toUpperCase() || 'U'}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <h3 className="text-slate-900 font-black text-xl tracking-tight truncate">
                                {firstName ? `Hi, ${firstName}` : 'Welcome'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">{credits} Credits</span>
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
                            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive(link.path)
                                ? 'bg-slate-900 shadow-xl shadow-slate-200'
                                : 'hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${isActive(link.path)
                                ? 'bg-white/10 text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-white group-hover:shadow-sm'
                                }`}>
                                <link.icon size={22} className={isActive(link.path) ? 'stroke-[2.5px]' : ''} />
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-base font-black tracking-tight ${isActive(link.path) ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {link.name}
                                </span>
                                <span className={`text-[10px] font-medium leading-none mt-1 ${isActive(link.path) ? 'text-white/60' : 'text-slate-400'
                                    }`}>
                                    {link.name === 'Dashboard' ? 'Overview' : link.name === 'Create Interview' ? 'Customise your interview' : link.name === 'Interviews' ? 'Popular Simulations' : 'Previous activity'}
                                </span>
                            </div>
                            {isActive(link.path) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
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
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm transition-all text-xs">
                            <User size={22} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black tracking-tight text-slate-900">Profile Settings</span>
                            <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">Manage account & preferences</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile Menu Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        ref={addToRefs}
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-red-600 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-100 transition-all active:scale-[0.98] shadow-sm shadow-red-100"
                    >
                        <LogOut size={18} />
                        <span>Sign Out Session</span>
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
