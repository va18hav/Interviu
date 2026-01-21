import React from 'react'
import { ArrowRight } from 'lucide-react'
import resumebanner from '../assets/images/resumebanner.png'

const ResumeHero = (props) => {
    return (
        <div className='relative rounded-xl md:rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm'>
            {/* Background decoration */}
            <div className="absolute top-50 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center md:gap-10 lg:gap-8">
                <div className="relative flex flex-col gap-1 items-start z-10 px-8 py-15 lg:px-16 lg:py-20 max-w-4xl space-y-8">

                    <h1 className='font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tighter'>
                        Craft a Resume that <br />
                        Gets You Hired
                    </h1>

                    <p className='font-space text-md lg:text-lg text-slate-600 max-w-sm lg:max-w-xl leading-relaxed'>
                        Our AI doesn't just score you—it gives you a line-by-line roadmap to beat the ATS and impress recruiters.
                    </p>

                    <button
                        onClick={props.onButtonClick}
                        className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all z-20 cursor-pointer shadow-lg shadow-slate-900/20"
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