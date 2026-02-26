import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, X, Check, Settings2 } from 'lucide-react';
import { CONNECTION_CONFIG_SCHEMA } from '../utils/designComponentSchema';

const FloatingConnectionConfig = ({ position, connection, onSave, onDelete, onClose }) => {
    const [config, setConfig] = useState(connection?.config || {});
    const cardRef = useRef(null);
    const [adjustedPos, setAdjustedPos] = useState(null);

    useEffect(() => {
        if (connection) {
            setConfig(connection.config || {});
        }
    }, [connection]);

    // Handle Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                // Do not close here, let the canvas handle deselection to avoid conflicts
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave({
            ...connection,
            config,
            definedFields: Object.keys(config),
            undefinedFields: []
        });
        onClose();
    };

    useLayoutEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            // We use documentElement.clientWidth/Height to be safe with scrollbars, though innerWidth is usually fine for fixed
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let { x, y } = position;

            // Horizontal Adjustment
            if (x + rect.width > viewportWidth - 20) {
                x = viewportWidth - rect.width - 20;
            }
            if (x < 20) x = 20;

            // Vertical Adjustment
            if (y + rect.height > viewportHeight - 20) {
                // Try flipping UP if no space below
                if (position.y - rect.height > 20) {
                    y = position.y - rect.height; // Place bottom at click point roughly
                } else {
                    y = viewportHeight - rect.height - 20; // Force fit
                }
            }
            if (y < 20) y = 20;

            setAdjustedPos({ x, y });
        }
    }, [position, config]);

    if (!connection) return null;

    // Measurement style: No animations, no scale, invisible
    const measurementStyle = {
        left: position.x,
        top: position.y,
        opacity: 0,
        pointerEvents: 'none',
        transform: 'none' // CRITICAL: Ensure we measure true size
    };

    // Final style: Animate in
    const finalStyle = {
        left: adjustedPos?.x,
        top: adjustedPos?.y,
        opacity: 1,
        // We let the class handle the scale animation, but we set position explicitly
    };

    const content = (
        <div
            ref={cardRef}
            className={`fixed z-[9999] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/80 p-0 w-[280px] flex flex-col ring-1 ring-black/5 transition-all duration-300 ${adjustedPos ? 'animate-in fade-in zoom-in-95' : ''}`}
            style={adjustedPos ? finalStyle : measurementStyle}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <Settings2 size={14} className="text-blue-500" />
                    <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Connection</h4>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 -mr-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4 p-4">
                {CONNECTION_CONFIG_SCHEMA.fields.map(field => (
                    <div key={field.key} className="flex flex-col gap-1.5 group">
                        <label className="text-[9px] uppercase font-bold text-gray-500 group-focus-within:text-blue-500 transition-colors ml-0.5 tracking-widest">
                            {field.label}
                        </label>
                        {field.type === 'select' ? (
                            <div className="relative">
                                <select
                                    value={config[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="w-full text-xs font-medium border border-gray-200 rounded-md px-2.5 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white hover:border-gray-300 transition-all cursor-pointer shadow-sm text-gray-800"
                                >
                                    <option value="">Select...</option>
                                    {field.options?.map?.(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <input
                                type={field.type === 'text' ? 'text' : field.type}
                                value={config[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder || ''}
                                className="w-full text-xs font-medium border border-gray-200 rounded-md px-2.5 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white hover:border-gray-300 transition-all shadow-sm text-gray-800"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-3 bg-gray-50/80 border-t border-gray-100 rounded-b-xl shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
                <button
                    onClick={() => {
                        if (window.confirm('Delete this connection?')) {
                            onDelete(connection.id);
                            onClose();
                        }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                    title="Delete Connection"
                >
                    <Trash2 size={16} />
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] uppercase tracking-wide font-bold py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                >
                    <Check size={14} strokeWidth={2.5} />
                    APPLY CHANGES
                </button>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default FloatingConnectionConfig;
