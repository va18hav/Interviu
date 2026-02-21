import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Trash2 } from 'lucide-react';
import { CONNECTION_CONFIG_SCHEMA } from '../utils/designComponentSchema';

const ConnectionConfigPanel = ({ connection, components, onSave, onDelete, onClose }) => {
    const [config, setConfig] = useState(connection?.config || {});
    const [definedFields, setDefinedFields] = useState(connection?.definedFields || []);
    const [assumedFields, setAssumedFields] = useState(connection?.assumedFields || []);

    const fromComp = components.find(c => c.id === connection?.from);
    const toComp = components.find(c => c.id === connection?.to);

    useEffect(() => {
        if (connection) {
            setConfig(connection.config || {});
            setDefinedFields(connection.definedFields || []);
            setAssumedFields(connection.assumedFields || []);
        }
    }, [connection]);

    if (!connection) return null;

    const handleFieldChange = (fieldKey, value) => {
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

    const handleSave = () => {
        const undefinedFields = CONNECTION_CONFIG_SCHEMA.fields
            .map(f => f.key)
            .filter(key => !definedFields.includes(key) && !assumedFields.includes(key));

        const updatedConnection = {
            ...connection,
            config,
            definedFields,
            assumedFields,
            undefinedFields
        };

        onSave(updatedConnection);
    };

    const getFieldStatus = (fieldKey) => {
        if (definedFields.includes(fieldKey)) return 'defined';
        if (assumedFields.includes(fieldKey)) return 'assumed';
        return 'undefined';
    };

    // Group fields by their group property
    const groupedFields = CONNECTION_CONFIG_SCHEMA.fields.reduce((acc, field) => {
        const group = field.group || 'General';
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

                {field.type === 'select' ? (
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

    const undefinedCount = CONNECTION_CONFIG_SCHEMA.fields.length - definedFields.length - assumedFields.length;

    return (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="p-4 bg-gray-800 text-white flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">Connection Configuration</h3>
                    {fromComp && toComp && (
                        <p className="text-xs opacity-80 mt-1">
                            {fromComp.config.service_name || fromComp.type} → {toComp.config.service_name || toComp.type}
                        </p>
                    )}
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
                <div className="space-y-6">
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
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                <button
                    onClick={() => {
                        if (window.confirm('Delete this connection?')) {
                            onDelete(connection.id);
                            onClose();
                        }
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 font-medium"
                    title="Delete Connection"
                >
                    <Trash2 size={18} />
                </button>

                <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                    <Save size={18} />
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default ConnectionConfigPanel;
