import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SystemDesignCanvas from '../components/SystemDesignCanvas';
import ComponentConfigPanel from '../components/ComponentConfigPanel';

const TestDesignUI = () => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleComponentSelect = (component) => {
        setSelectedComponent(component);
    };

    const handleComponentUpdate = (componentId, newConfig) => {
        // This would normally update the component in the canvas
        // For now, just log it
        console.log('Component updated:', componentId, newConfig);
    };

    const handleDesignChange = (change) => {
        console.log('Design change:', change);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">System Design Canvas - Test UI</h1>
                        <p className="text-sm text-gray-500">Design interface testing environment</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Test Mode
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Design Canvas */}
                <div className="flex-1">
                    <SystemDesignCanvas
                        onComponentSelect={handleComponentSelect}
                        selectedComponentId={selectedComponent?.id}
                        onDesignChange={handleDesignChange}
                    />
                </div>

                {/* Component Config Panel */}
                <ComponentConfigPanel
                    component={selectedComponent}
                    onClose={() => setSelectedComponent(null)}
                    onUpdate={handleComponentUpdate}
                />
            </div>
        </div>
    );
};

export default TestDesignUI;
