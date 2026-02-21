import React from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import techbanner from '../assets/images/techbanner.png'
import dashboardBanner from '../assets/images/newcompany.png'
import bot from "../assets/images/techbanner1.png"


const PopularInterviewsBanner = ({ firstName }) => {
    const navigate = useNavigate()
    return (
        <div className='relative flex items-center gap-0 rounded-3xl overflow-hidden bg-white border border-gray-300 shadow-sm group hover:shadow-md transition-all duration-300 h-full'>
            {/* Subtle Textured Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

            <div className="relative flex flex-col items-start z-10 px-8 py-10 md:px-12 space-y-6 w-full">

                <h1 className='font-sans text-4xl lg:text-5xl xl:text-6xl text-gray-900 font-extrabold tracking-tighter leading-tighter'>
                    Hi <span className='bg-gradient-to-r from-gray-900 to-gray-300 bg-clip-text text-transparent'>{firstName},</span>
                </h1>

                <p className='text-lg lg:text-xl text-gray-500 max-w-md tracking-tight leading-relaxed font-medium'>
                    Choose from the most popular and realistic company simulations.
                </p>

                <button
                    onClick={() => navigate('/dashboard/all-popular-interviews')}
                    className="mt-4 px-8 py-3.5 rounded-2xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2 group">
                    Explore All
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
            </div>

            {/* <img src={bot} alt="" className="hidden md:block absolute md:bottom-[-20%] lg:bottom-[-25%] xl:bottom-[10%] right-[2%] w-60 lg:w-100 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" /> */}
            <img src={bot} alt="" className="hidden md:block w-60 lg:w-70 xl:w-90 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />

        </div >
    )
}

export default PopularInterviewsBanner