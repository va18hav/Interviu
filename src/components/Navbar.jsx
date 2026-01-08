import React from 'react'
import logo from "../assets/images/logo.png"
import { supabase } from "../supabaseClient"
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { Zap } from 'lucide-react'

const Navbar = ({ credits: propCredits }) => {
    const navigate = useNavigate()
    const userCredentials = JSON.parse(localStorage.getItem("userCredentials"));
    const { firstName, lastName, email } = userCredentials || {};
    const [showProfile, setShowProfile] = React.useState(false);
    const [showMobileMenu, setShowMobileMenu] = React.useState(false);
    const [fetchedCredits, setCredits] = useState(0);

    const credits = propCredits !== undefined && propCredits !== null ? propCredits : fetchedCredits;

    React.useEffect(() => {
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
    return (
        <header className="border-b border-slate-800/50 bg-black/50 backdrop-blur-xl sticky top-0 z-50 mt-0 rounded-b-2xl w-full ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center">
                            <img src={logo} alt="Logo" className="w-15 h-15" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-white">Inter<span className="text-cyan-400 font-sans">viu</span></h1>
                            <p className="hidden md:block text-xs text-slate-400">Practice Smarter</p>
                        </div>
                    </div>

                    {/* Desktop Nav-bar */}
                    <div className='flex items-center gap-4 hidden md:flex'>
                        <Link to="/dashboard" className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Dashboard</Link>
                        <Link to="/create" className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Create</Link>
                        <Link to="/dashboard/all-popular-interviews" className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Interviews</Link>
                        <Link to="/resume" className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Resume</Link>
                    </div>

                    {/* Mobile Nav-bar */}
                    {showMobileMenu ? (<p onClick={() => setShowMobileMenu(false)} className='text-white cursor-pointer'>Close</p>)
                        : (<div onClick={() => setShowMobileMenu(true)} className="md:hidden flex flex-col justify-center gap-0.5 py-2">
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                            <span className='bg-white w-5 h-0.5 rounded-sm'></span>
                        </div>)}

                    {/* Mobile menu */}

                    {showMobileMenu && <div className="absolute top-18 right-3 lg:top-20 lg:right-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-700/20 text-slate-400 rounded-lg py-5 px-10 flex flex-col items-center gap-4 z-50 shadow-xl border border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl text-white font-semibold shadow-lg">
                            {userCredentials?.firstName?.charAt(0).toUpperCase() + userCredentials?.lastName?.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col items-start gap-4'>
                            <Link to="/dashboard" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Dashboard</Link>
                            <Link to="/create" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Create</Link>
                            <Link to="/dashboard/all-previous-interviews" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Interviews</Link>
                            <Link to="/resume" onClick={() => setShowMobileMenu(false)} className='text-white text-sm hover:text-cyan-400 cursor-pointer'>Resume</Link>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    localStorage.removeItem("userCredentials"); // Cleanup old method
                                    navigate('/login');
                                }}
                                className="text-sm w-full py-2 px-3 rounded-lg bg-cyan-500 border border-cyan-500 text-black hover:bg-cyan-500/20 hover:text-white transition-colors">
                                Log out
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="text-sm w-full py-2 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mt-2"
                            >
                                Profile Settings
                            </button>
                        </div>
                    </div>}

                    {/* User Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-3 pl-4">
                            <div className="flex items-center gap-2 mr-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50 shadow-sm">
                                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-white tabular-nums">{credits}</span>
                                <span className="text-xs text-slate-400 font-medium">credits</span>
                            </div>
                            {/* <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-white">{firstName + " " + lastName}</p>
                                <p className="text-xs text-slate-400">{email}</p>
                            </div> */}
                            <button onClick={() => setShowProfile(prev => !prev)} className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                                {showProfile ? "X" : firstName?.charAt(0).toUpperCase() + lastName?.charAt(0).toUpperCase()}
                            </button>
                        </div>
                    </div>

                    {showProfile && <div className="absolute top-20 right-5 lg:top-20 lg:right-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-700/20 text-slate-400 rounded-lg p-4 flex flex-col items-center gap-2 z-50 shadow-xl border border-slate-800">
                        <div className="w-15 h-15 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl text-white font-semibold shadow-lg">
                            {userCredentials?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-white">{userCredentials?.firstName + " " + userCredentials?.lastName}</p>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                localStorage.removeItem("userCredentials"); // Cleanup old method
                                navigate('/login');
                            }}
                            className="w-full py-2 px-4 rounded-lg bg-cyan-500 border border-cyan-500 text-black hover:bg-cyan-500/20 hover:text-white transition-colors">
                            Log out
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mt-2"
                        >
                            Profile Settings
                        </button>
                    </div>}
                </div>
            </div>
        </header >
    )
}

export default Navbar