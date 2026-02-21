import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import bot from "../assets/images/newbot.png"

const DashboardBanner = ({ firstName }) => {
    const navigate = useNavigate()
    return (
        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Subtle Textured Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

            {/* Very Subtle Gradient Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-250 to-gray-200 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl opacity-60" />

            {/* Content */}
            <div className="relative z-10 px-8 md:px-12 py-10 md:py-12 flex items-center justify-between">
                <div className="max-w-2xl space-y-8">
                    <div>
                        <h2 className="font-sans text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                            Configure Interview
                        </h2>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                            Ready to practice? Set up your custom interview session in seconds.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/create')}
                            className="px-8 py-3.5 rounded-2xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2 group">
                            <Plus className="w-5 h-5" />
                            Create New
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            className="hidden md:flex px-8 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-600 font-medium text-sm hover:bg-gray-50 hover:text-gray-900 transition-all items-center gap-2">
                            View History
                        </button>
                    </div>
                </div>
                <img src={bot} alt="" className="hidden md:block absolute -bottom-10 right-0 rotate-[-0deg] opacity-90 w-55 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                {/* <img src={configureBanner} alt="" className="hidden lg:block w-120 h-70 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" /> */}
            </div>
        </div >
    )
}

export default DashboardBanner