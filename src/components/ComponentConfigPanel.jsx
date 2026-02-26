import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle } from 'lucide-react';
import { COMPONENT_METADATA, COMPONENT_CONFIG_SCHEMA } from '../utils/designComponentSchema';

const ComponentConfigPanel = ({ component, position, onSave, onClose }) => {
    const [config, setConfig] = useState(component?.config || {});
    const [definedFields, setDefinedFields] = useState(component?.definedFields || []);
    const [assumedFields, setAssumedFields] = useState(component?.assumedFields || []);

    const cardRef = useRef(null);
    const [adjustedPos, setAdjustedPos] = useState(null);

    const types = component?.mergedTypes || (component?.type ? [component.type] : []);

    // Aggregate metadata and schemas
    const allSchemas = types.map(t => COMPONENT_CONFIG_SCHEMA[t]).filter(Boolean);
    const allMetadata = types.map(t => COMPONENT_METADATA[t]).filter(Boolean);

    // Primary metadata (for colors/labels)
    const primaryMetadata = allMetadata[0];

    useEffect(() => {
        if (component) {
            setConfig(component.config || {});
            setDefinedFields(component.definedFields || []);
            setAssumedFields(component.assumedFields || []);
        }
    }, [component]);

    useLayoutEffect(() => {
        if (cardRef.current && position) {
            const rect = cardRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let { x, y } = position;

            // Offset slightly from cursor/component
            x += 20;

            if (x + rect.width > viewportWidth - 20) {
                x = position.x - rect.width - 20; // Flip to left side
            }
            if (x < 20) x = 20;

            if (y + rect.height > viewportHeight - 20) {
                y = viewportHeight - rect.height - 20; // Shift up
            }
            if (y < 20) y = 20;

            setAdjustedPos({ x, y });
        }
    }, [position, config]);

    if (!component || allSchemas.length === 0) return null;

    const handleFieldChange = (fieldKey, value) => {
        // 🔄 Local State Update Only
        setConfig(prev => ({
            ...prev,
            [fieldKey]: value
        }));

        // Mark as defined if value is not empty
        if (value && value.trim() !== '') {
            if (!definedFields.includes(fieldKey)) {
                setDefinedFields(prev => [...prev, fieldKey]);
            }
            // Remove from assumed if it was there
            setAssumedFields(prev => prev.filter(f => f !== fieldKey));
        } else {
            // Remove from defined if value is cleared
            setDefinedFields(prev => prev.filter(f => f !== fieldKey));
        }
    };

    const handleMarkAsAssumed = (fieldKey) => {
        if (!assumedFields.includes(fieldKey)) {
            setAssumedFields(prev => [...prev, fieldKey]);
            setDefinedFields(prev => prev.filter(f => f !== fieldKey));
        }
    };

    const allFieldsList = Array.from(
        new Map(allSchemas.flatMap(s => s.fields || []).map(f => [f.key, f])).values()
    );
    const allFieldKeys = allFieldsList.map(f => f.key);

    const handleSave = () => {
        const undefinedFields = allFieldKeys.filter(key => !definedFields.includes(key) && !assumedFields.includes(key));

        const updatedComponent = {
            ...component,
            config,
            definedFields,
            assumedFields,
            undefinedFields
        };

        // 💾 Trigger Parent Save ONLY here
        onSave(updatedComponent);
    };

    const getFieldStatus = (fieldKey) => {
        if (definedFields.includes(fieldKey)) return 'defined';
        if (assumedFields.includes(fieldKey)) return 'assumed';
        return 'undefined';
    };

    // Group fields by their group property
    const groupedFields = allFieldsList.reduce((acc, field) => {
        const group = field.group || 'Core Configuration';
        if (!acc[group]) acc[group] = [];
        acc[group].push(field);
        return acc;
    }, {});

    const renderField = (field) => {
        const status = getFieldStatus(field.key);
        const value = config[field.key] || '';

        return (
            <div key={field.key} className="mb-4 group">
                <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 group-focus-within:text-blue-500 transition-colors">
                        {field.label}
                        {status === 'undefined' && (
                            <span className="text-[9px] text-orange-500 flex items-center gap-0.5 bg-orange-50 px-1 rounded-sm border border-orange-100">
                                Req
                            </span>
                        )}
                        {status === 'assumed' && (
                            <span className="text-[9px] text-blue-500 bg-blue-50 px-1 rounded-sm border border-blue-100">
                                Auto
                            </span>
                        )}
                    </label>
                    {status === 'undefined' && (
                        <button
                            onClick={() => handleMarkAsAssumed(field.key)}
                            className="text-[9px] text-blue-500 hover:text-blue-700 underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Assume
                        </button>
                    )}
                </div>

                {field.type === 'select' || field.type === 'select-multi' ? (
                    <div className="relative">
                        <select
                            value={value}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className={`w-full px-2.5 py-2 rounded-md text-xs font-medium outline-none appearance-none transition-all shadow-sm cursor-pointer ${status === 'undefined'
                                ? 'border border-orange-200 bg-orange-50/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 text-orange-900'
                                : status === 'assumed'
                                    ? 'border border-blue-200 bg-blue-50/50 focus:border-blue-400 text-blue-900'
                                    : 'border border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-800'
                                }`}
                        >
                            <option value="">Select...</option>
                            {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                ) : field.type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className={`w-full px-2.5 py-2 rounded-md text-xs font-medium outline-none transition-all shadow-sm resize-none ${status === 'undefined'
                            ? 'border border-orange-200 bg-orange-50/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 text-orange-900'
                            : 'border border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-800'
                            }`}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-2.5 py-2 rounded-md text-xs font-medium outline-none transition-all shadow-sm ${status === 'undefined'
                            ? 'border border-orange-200 bg-orange-50/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 text-orange-900'
                            : 'border border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-800'
                            }`}
                    />
                )}
            </div>
        );
    };

    const undefinedCount = allFieldKeys.length - definedFields.length - assumedFields.length;

    const measurementStyle = {
        left: position?.x || 0,
        top: position?.y || 0,
        opacity: 0,
        pointerEvents: 'none',
        transform: 'none'
    };

    const finalStyle = {
        left: adjustedPos?.x,
        top: adjustedPos?.y,
        opacity: 1,
    };

    const content = (
        <div
            ref={cardRef}
            className={`fixed z-[9999] bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/80 p-0 w-[340px] max-h-[85vh] flex flex-col ring-1 ring-black/5 transition-all duration-300 ${adjustedPos ? 'animate-in fade-in zoom-in-95' : ''}`}
            style={adjustedPos ? finalStyle : measurementStyle}
        >
            {/* Header */}
            <div
                className="p-4 text-white flex items-center justify-between rounded-t-xl shrink-0"
                style={{ backgroundColor: primaryMetadata.color }}
            >
                <div>
                    <h3 className="font-bold text-sm tracking-wide">
                        {types.length > 1
                            ? types.map(t => COMPONENT_METADATA[t]?.label).join(' + ')
                            : primaryMetadata.label
                        }
                    </h3>
                    <p className="text-[10px] opacity-80 mt-1 font-medium tracking-wide">
                        {definedFields.length} DEFINED • {assumedFields.length} ASSUMED • {undefinedCount} UNDEFINED
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Configuration Fields */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
                <div className="space-y-6">
                    {/* Always visible Name Field */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Component Identity
                            </h4>
                        </div>
                        <div className="p-4">
                            <div className="mb-0 group">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-1.5 group-focus-within:text-blue-500 transition-colors">
                                    Name / Label
                                </label>
                                <input
                                    type="text"
                                    value={config.label || ''}
                                    onChange={(e) => handleFieldChange('label', e.target.value)}
                                    placeholder={types.length > 1 ? types.map(t => COMPONENT_METADATA[t]?.label).join(' + ') : primaryMetadata.label}
                                    className="w-full px-2.5 py-2 border border-gray-200 rounded-md text-xs font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white hover:border-gray-300 transition-all shadow-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    {Object.entries(groupedFields).map(([group, fields]) => (
                        <div key={group} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
                            <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    {group}
                                </h4>
                            </div>
                            <div className="p-4">
                                {fields.map(renderField)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] rounded-b-xl shrink-0">
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                    <Save size={16} strokeWidth={2.5} />
                    APPLY CHANGES
                </button>

                {undefinedCount > 0 && (
                    <p className="text-[10px] font-bold text-orange-500 mt-3 text-center flex items-center justify-center gap-1.5 uppercase tracking-wide">
                        <AlertCircle size={14} />
                        {undefinedCount} field{undefinedCount > 1 ? 's' : ''} undefined
                    </p>
                )}
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default ComponentConfigPanel;
