import React from 'react';
import {
    Code2,
    Server,
    CheckCircle2,
    ArrowRight,
    Terminal,
    Database,
    Cpu,
    Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoleFocus = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'sde',
            icon: <Code2 className="w-8 h-8" />,
            title: 'Software Engineer',
            subtitle: 'L3 - L6 Roles',
            description: 'Master the core competencies required for top-tier engineering roles. From algorithmic problem solving to high-level system architecture.',
            features: [
                'Data Structures & Algorithms',
                'System Design (HLD & LLD)',
                'Code Debugging & Optimization',
                'Behavioral & Leadership'
            ],
            gradient: "from-blue-600 to-indigo-600",
            bgGradient: "bg-gradient-to-br from-blue-50 via-white to-blue-50/50",
            accentColor: "text-blue-600",
            techIcons: [<Terminal className="w-4 h-4" />, <Layers className="w-4 h-4" />]
        },
        {
            id: 'devops',
            icon: <Server className="w-8 h-8" />,
            title: 'DevOps & SRE',
            subtitle: 'Infrastructure & Ops',
            description: 'Scale and secure production systems. Navigate complex infrastructure challenges, incident response, and reliability engineering.',
            features: [
                'Kubernetes & Cloud Infrastructure',
                'Incident Response & Root Cause',
                'Observability & Monitoring',
                'CI/CD Pipelines & Automation'
            ],
            gradient: "from-purple-600 to-pink-600",
            bgGradient: "bg-gradient-to-br from-purple-50 via-white to-purple-50/50",
            accentColor: "text-purple-600",
            techIcons: [<Cpu className="w-4 h-4" />, <Database className="w-4 h-4" />]
        }
    ];

    return (
        <section className="py-10 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                        Choose Your <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                            Career Path
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Specialized interview tracks designed to match the specific expectations of your target role and level.
                    </p>
                </div>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="group relative rounded-2xl p-0.5 bg-gradient-to-b from-gray-300 to-transparent hover:from-gray-200 transition-all duration-300"
                        >
                            <div className={`relative h-full bg-white rounded-[14px] p-5 md:p-6 overflow-hidden transition-all duration-300 group-hover:shadow-lg border border-gray-100 flex flex-col`}>

                                {/* Subtle Background Gradient */}
                                <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br ${role.gradient} opacity-[0.03] rounded-4xl pointer-events-none transition-opacity group-hover:opacity-[0.06]`}></div>

                                {/* Content Wrapper */}
                                <div className="relative z-10 flex flex-col h-full">

                                    {/* Header + Title Row */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl bg-gray-50 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300 shadow-sm`}>
                                                {React.cloneElement(role.icon, { className: "w-6 h-6" })}
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                                    {role.title}
                                                </h3>
                                                <div className={`text-xs font-bold uppercase tracking-wider ${role.accentColor}`}>
                                                    {role.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-md text-gray-600 leading-relaxed font-medium mb-6 line-clamp-3">
                                        {role.description}
                                    </p>

                                    {/* Features List */}
                                    <ul className="space-y-3 mb-8 flex-grow">
                                        {role.features.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-gray-700 group/item">
                                                <CheckCircle2 className={`w-4 h-4 ${role.accentColor} mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform`} />
                                                <span className="font-medium text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => navigate('/dashboard/all-popular-interviews')}
                                        className="max-w-[60%] mx-auto group/btn relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 overflow-hidden"
                                    >
                                        <span className="relative z-10">Start {role.title} Track</span>
                                        <ArrowRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />

                                        {/* Button Shine Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Note */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400 font-medium">
                        More roles coming soon • Constantly updated with latest interview patterns
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RoleFocus;
