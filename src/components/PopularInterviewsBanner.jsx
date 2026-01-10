import React from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import techbanner from '../assets/images/techbanner.png'

const PopularInterviewsBanner = () => {
    const navigate = useNavigate()
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-gradient-to-br from black/100 via black/60 to black/100 backdrop-blur-sm'>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col gap-1 items-start z-10 px-8 py-15 lg:px-16 lg:py-20 max-w-4xl space-y-8">

                    <h1 className='font-sans text-4xl md:text-5xl font-extrabold text-slate-200 tracking-tighter'>
                        Top Tech
                        <br />
                        Interview Simulations
                    </h1>

                    <p className='font-space text-md lg:text-lg text-slate-400 max-w-sm lg:max-w-xl tracking-tight'>
                        Practice for top tech companies. Choose from our most popular and realistic interview simulations.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                        className="bg-gradient-to-r from-cyan-600/90 via-cyan-500/90 to-cyan-400/80 border border-cyan-500/30 px-8 py-4 rounded-lg text-white hover:bg-slate-500/30 hover:border-cyan-500/60 hover:text-slate-300 font-medium text-sm flex items-center gap-1 transition-colors">
                        Explore All
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
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
                        className="mt-15 md:w-70 lg:w-150 object-cover transition-transform duration-200 ease-out cursor-pointer filter drop-shadow-[0_0_1px_rgba(255,255,255,0.7)]"
                        style={{ transformStyle: 'preserve-3d' }}
                    />
                </div>
            </div>

        </div>
    )
}

export default PopularInterviewsBanner