import React from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import techbanner from '../assets/images/techbanner.png'

const PopularInterviewsBanner = ({ firstName }) => {
    const navigate = useNavigate()
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-gradient-to-br from black/100 via black/60 to black/100 backdrop-blur-sm border border-slate-300/50'>
            {/* Background decoration */}
            <div className="absolute top-30 right-0 w-[500px] h-[500px] bg-red-500/6 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-30 left-0 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col items-start z-10 px-4 py-6 md:py-6 md:px-10 max-w-4xl space-y-5 w-full md:w-auto">

                    {/* Mobile Image - Visible only on mobile, between text and button */}
                    {/* <div className="block md:hidden w-full flex justify-center py-4">
                        <img
                            src={techbanner}
                            alt="Resume Banner"
                            className="w-80 object-cover filter drop-shadow-[0_0_1px_rgba(255,255,255,0.7)]"
                        />
                    </div> */}

                    <h1 className='font-sans text-4xl md:text-7xl font-extrabold tracking-tight leading-1.375'>
                        <span className='bg-gradient-to-r from-gray-800 to-gray-400 bg-clip-text text-transparent'>Hi {firstName},</span>
                        <br />
                        {/* <span className='text-3xl md:text-5xl text-gray-800 font-extrabold'>Welcome to Inter<span className='text-cyan-500'>viu</span></span> */}
                    </h1>

                    <p className='text-md lg:text-lg text-slate-900 max-w-sm lg:max-w-xl tracking-tight'>
                        Practice for top tech companies. Choose from the most popular and realistic interview simulations.
                    </p>

                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="group relative px-5 md:px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 shadow-lg shadow-gray-500/30 hover:scale-105 ">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <span className="relative text-white flex items-center gap-2">
                            Explore All
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>

                {/* Desktop Image - Visible only on desktop */}
                <div
                    className="hidden md:block relative z-20"
                    onMouseMove={(e) => {
                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - left - width / 2) / 25;
                        const y = (e.clientY - top - height / 2) / 25;
                        e.currentTarget.querySelector('img').style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.05, 1.05, 1.05)`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('img').style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
                    }}
                >
                    <img
                        src={techbanner}
                        alt="Resume Banner"
                        className="md:w-70 lg:w-150 object-cover transition-transform duration-200 ease-out cursor-pointer filter drop-shadow-[0_0_1px_rgba(255,255,255,0.7)]"
                        style={{ transformStyle: 'preserve-3d' }}
                    />
                </div>
            </div>

        </div>
    )
}

export default PopularInterviewsBanner