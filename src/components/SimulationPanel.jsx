import React from 'react';
import { Play, TrendingUp, Globe, AlertTriangle, Zap, Server, Activity, ShieldAlert } from 'lucide-react';

const EVOLUTION_STAGES = [
    { id: 'mvp', label: 'MVP', icon: Play, desc: 'Single region, minimal redundancy' },
    { id: 'scale_up', label: 'Scale Up', icon: TrendingUp, desc: 'Vertical scaling, caching introduced' },
    { id: 'global', label: 'Global', icon: Globe, desc: 'Multi-region, active-active, huge scale' },
    { id: 'degraded', label: 'Degraded', icon: AlertTriangle, desc: 'Simulated partial outages' }
];

const SimulationPanel = ({
    activeStage,
    onStageChange,
    activeFailures,
    onClearFailures,
    onInjectFailure
}) => {

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-2 z-40 min-w-[500px]">
            {/* Header / Stats */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-orange-500" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Simulation Control</span>
                </div>
                {Object.keys(activeFailures).length > 0 && (
                    <button
                        onClick={onClearFailures}
                        className="text-[10px] text-red-600 hover:bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors"
                    >
                        <ShieldAlert size={12} />
                        Clear {Object.keys(activeFailures).length} Failures
                    </button>
                )}
            </div>

            {/* Evolution Stages */}
            <div className="flex items-center gap-1 justify-center p-1">
                {EVOLUTION_STAGES.map((stage) => {
                    const isActive = activeStage === stage.id;
                    const Icon = stage.icon;
                    return (
                        <button
                            key={stage.id}
                            onClick={() => onStageChange(stage.id)}
                            className={`
                                flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                                ${isActive
                                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                    : 'hover:bg-gray-50 text-gray-500 border border-transparent'
                                }
                            `}
                            title={stage.desc}
                        >
                            <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                            <span className="text-[10px] font-medium">{stage.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Simulation Tips */}
            <div className="bg-gray-50 rounded-lg p-2 text-[10px] text-gray-500 text-center border border-gray-100">
                Switch stages to see how architecture holds up. Click components to inject specific failures.
            </div>
        </div>
    );
};

export default SimulationPanel;
