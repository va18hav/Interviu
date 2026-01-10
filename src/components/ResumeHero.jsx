import React from 'react'
import { ArrowRight } from 'lucide-react'
import resumebanner from '../assets/images/resumebanner.png'

const ResumeHero = (props) => {
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-gradient-to-br from black/100 via black/60 to black/100 backdrop-blur-sm'>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col gap-1 items-start z-10 px-8 py-20 lg:px-16 lg:py-28 max-w-4xl space-y-8">

                    <h1 className='font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter'>
                        Craft a Resume that <br />
                        <span className=''>
                            Gets You Hired
                        </span>
                    </h1>

                    <p className='font-space text-md lg:text-lg text-slate-400 max-w-sm lg:max-w-xl leading-relaxed'>
                        Our AI doesn't just score you—it gives you a line-by-line roadmap to beat the ATS and impress recruiters.
                    </p>

                    <button
                        onClick={props.onButtonClick}
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-300/90 to-yellow-600/80 border border-yellow-500/30 hover:opacity-90 transition-all z-20 cursor-pointer"
                    >
                        {props.buttonText || "Check Score"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                        src={resumebanner}
                        alt="Resume Banner"
                        className="md:w-70 lg:w-100 object-cover transition-transform duration-200 ease-out cursor-pointer"
                        style={{ transformStyle: 'preserve-3d' }}
                    />
                </div>
            </div>

        </div>
    )
}

export default ResumeHero