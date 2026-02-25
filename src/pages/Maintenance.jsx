import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, AlertCircle } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mx-auto w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-2xl shadow-indigo-500/10 border border-slate-100"
                >
                    <Settings className="w-12 h-12 text-indigo-500 absolute animate-[spin_4s_linear_infinite]" />
                    <Wrench className="w-8 h-8 text-indigo-400 absolute rotate-45" />
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Under Maintenance
                    </h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        We are tracking a critical streaming issue and performing system upgrades. Interviu will be back online shortly.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
                    <AlertCircle className="w-4 h-4" />
                    <span>We will be back online shortly</span>
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
