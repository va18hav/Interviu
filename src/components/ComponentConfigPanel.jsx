import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { COMPONENT_METADATA, COMPONENT_CONFIG_SCHEMA } from '../utils/designComponentSchema';

const ComponentConfigPanel = ({ component, onSave, onClose }) => {
    const [config, setConfig] = useState(component?.config || {});
    const [definedFields, setDefinedFields] = useState(component?.definedFields || []);
    const [assumedFields, setAssumedFields] = useState(component?.assumedFields || []);

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
            <div key={field.key} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                        {field.label}
                        {status === 'undefined' && (
                            <span className="text-[10px] text-orange-600 flex items-center gap-1 bg-orange-50 px-1 rounded">
                                <AlertCircle size={10} />
                                Req
                            </span>
                        )}
                        {status === 'assumed' && (
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded">
                                Auto
                            </span>
                        )}
                    </label>
                    {status === 'undefined' && (
                        <button
                            onClick={() => handleMarkAsAssumed(field.key)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 underline"
                        >
                            Assume
                        </button>
                    )}
                </div>

                {field.type === 'select' || field.type === 'select-multi' ? (
                    <select
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded text-xs transition-colors ${status === 'undefined'
                            ? 'border-orange-300 bg-orange-50 focus:border-orange-500 focus:ring-1 focus:ring-orange-200'
                            : status === 'assumed'
                                ? 'border-blue-300 bg-blue-50 focus:border-blue-500'
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                    >
                        <option value="">Select...</option>
                        {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : field.type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={2}
                        className={`w-full px-2 py-1.5 border rounded text-xs transition-colors ${status === 'undefined'
                            ? 'border-orange-300 bg-orange-50 focus:border-orange-500'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full px-2 py-1.5 border rounded text-xs transition-colors ${status === 'undefined'
                            ? 'border-orange-300 bg-orange-50 focus:border-orange-500'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                    />
                )}
            </div>
        );
    };

    const undefinedCount = allFieldKeys.length - definedFields.length - assumedFields.length;

    return (
        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div
                className="p-4 text-white flex items-center justify-between"
                style={{ backgroundColor: primaryMetadata.color }}
            >
                <div>
                    <h3 className="font-semibold text-sm">
                        {types.length > 1
                            ? types.map(t => COMPONENT_METADATA[t]?.label).join(' + ')
                            : primaryMetadata.label
                        }
                    </h3>
                    <p className="text-[10px] opacity-90 mt-1">
                        {definedFields.length} defined • {assumedFields.length} assumed • {undefinedCount} undefined
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Configuration Fields */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    <p className="font-medium mb-1">Configuration Guide</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Fill in known values to mark fields as <strong>defined</strong></li>
                        <li>Mark fields as <strong>assumed</strong> if you're making reasonable assumptions</li>
                        <li><strong>Undefined</strong> fields will be highlighted to the interviewer</li>
                    </ul>
                </div>

                <div className="space-y-6">
                    {/* Always visible Name Field */}
                    <div className="border border-blue-100 rounded-lg overflow-hidden bg-blue-50/50">
                        <div className="px-3 py-2 border-b border-blue-100 bg-blue-50">
                            <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                                Component Identity
                            </h4>
                        </div>
                        <div className="p-3">
                            <div className="mb-0">
                                <label className="text-xs font-medium text-gray-700 flex items-center gap-2 mb-1">
                                    Name / Label
                                </label>
                                <input
                                    type="text"
                                    value={config.label || ''}
                                    onChange={(e) => handleFieldChange('label', e.target.value)}
                                    placeholder={types.length > 1 ? types.map(t => COMPONENT_METADATA[t]?.label).join(' + ') : primaryMetadata.label}
                                    className="w-full px-2 py-1.5 border border-blue-200 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                    {Object.entries(groupedFields).map(([group, fields]) => (
                        <div key={group} className="border border-gray-100 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {group}
                                </h4>
                            </div>
                            <div className="p-3 bg-white">
                                {fields.map(renderField)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
                >
                    <Save size={18} />
                    Save Configuration
                </button>

                {undefinedCount > 0 && (
                    <p className="text-xs text-orange-600 mt-2 text-center flex items-center justify-center gap-1">
                        <AlertCircle size={12} />
                        {undefinedCount} field{undefinedCount > 1 ? 's' : ''} still undefined
                    </p>
                )}
            </div>
        </div>
    );
};

export default ComponentConfigPanel;
