import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Plus, ZoomIn, ZoomOut, Settings, X, ChevronLeft, ChevronRight, Link as LinkIcon, AlertTriangle, Activity, Trash2, CheckCircle, AlertCircle, Download, Upload, FileJson, Image as ImageIcon, FileText, Save, ArrowRight, Square } from 'lucide-react';
import { COMPONENT_METADATA, COMPONENT_CONFIG_SCHEMA } from '../utils/designComponentSchema';
import { getIconForType } from '../utils/DesignIcons.jsx';
import { validateDesign } from '../utils/DesignLinter';
import { exportToJson, exportToPng, generateSpec, saveToLocal, loadFromLocal } from '../utils/ExportUtils';
import ComponentConfigPanel from './ComponentConfigPanel';
import FloatingConnectionConfig from './FloatingConnectionConfig';
import SimulationPanel from './SimulationPanel';
import { generateConnectionSummary, generateComponentSummary } from '../utils/summaryGenerator';

const SystemDesignCanvas = ({ onDesignChange, onComponentSelect, selectedComponentId: externalSelectedId, stateRef, initialData, interviewMode = false, isFullScreen = false }) => {
    const [components, setComponents] = useState(initialData?.components || []);
    const [connections, setConnections] = useState(initialData?.connections || []);
    const [validationIssues, setValidationIssues] = useState([]);
    const [isHealthCheckOpen, setIsHealthCheckOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [hoveredLibraryItem, setHoveredLibraryItem] = useState(null);
    const [draggedComponent, setDraggedComponent] = useState(null); // For library items
    const [draggingComponentId, setDraggingComponentId] = useState(null); // For existing items
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Resize state
    const [resizingComponentId, setResizingComponentId] = useState(null);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const [selectedComponentId, setSelectedComponentId] = useState(null);
    const [componentPopupPos, setComponentPopupPos] = useState(null);
    const [selectedConnectionId, setSelectedConnectionId] = useState(null);
    const [connectionPopupPos, setConnectionPopupPos] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);

    // Modes
    const [isConnectionMode, setIsConnectionMode] = useState(false);
    const [isSimulationMode, setIsSimulationMode] = useState(false);

    // Simulation Mode State
    const [activeFailures, setActiveFailures] = useState({}); // { [componentId]: 'outage' | 'latency' }
    const [failureMenuTarget, setFailureMenuTarget] = useState(null); // { id: componentId, x: 0, y: 0 }
    const [activeStage, setActiveStage] = useState('mvp');

    // Sync external selection prop to internal state
    useEffect(() => {
        if (externalSelectedId !== undefined) {
            setSelectedComponentId(externalSelectedId);
        }
    }, [externalSelectedId]);

    const [connectionStartComponentId, setConnectionStartComponentId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Track mouse for temp line

    const canvasRef = useRef(null);
    const nextIdRef = useRef(1);

    // Sync state to initialData when it changes (for tab switching)
    useEffect(() => {
        if (initialData) {
            setComponents(initialData.components || []);
            setConnections(initialData.connections || []);

            // Update nextIdRef to avoid collisions
            const ids = (initialData.components || []).map(c => {
                const match = c.id.match(/comp-(\d+)/);
                return match ? parseInt(match[1]) : 0;
            });
            nextIdRef.current = Math.max(0, ...ids) + 1;
        }
    }, [initialData]);

    // Sync state to parent refs for snapshot generation
    useEffect(() => {
        if (stateRef) {
            if (stateRef.components) stateRef.components.current = components;
            if (stateRef.connections) stateRef.connections.current = connections;
        }
    }, [components, connections, stateRef]);

    // Run Validation Effect
    useEffect(() => {
        // Debounce validation slightly to avoid flicker
        const timer = setTimeout(() => {
            const issues = validateDesign(components, connections);
            setValidationIssues(issues);
        }, 500);
        return () => clearTimeout(timer);
    }, [components, connections]);

    // Calculate Health Status
    const healthStatus = useMemo(() => {
        if (validationIssues.length === 0) return 'healthy';
        if (validationIssues.some(i => i.severity === 'HIGH')) return 'critical';
        return 'warning';
    }, [validationIssues]);

    // Update component configuration
    const handleComponentSave = (updatedComponent) => {
        const oldComponent = components.find(c => c.id === updatedComponent.id);

        setComponents(prev => prev.map(c =>
            c.id === updatedComponent.id ? updatedComponent : c
        ));

        // Detect and emit specific config changes
        if (onDesignChange && oldComponent && oldComponent.config && updatedComponent.config) {
            const changedKeys = [];

            Object.keys(updatedComponent.config).forEach(key => {
                const oldValue = oldComponent.config[key];
                const newValue = updatedComponent.config[key];

                if (oldValue !== newValue && key !== 'label') {
                    changedKeys.push(key);
                }
            });

            // If changes exist, send ONE summary event
            if (changedKeys.length > 0) {
                const types = updatedComponent.mergedTypes || [updatedComponent.type];
                const allFields = types.flatMap(t => COMPONENT_CONFIG_SCHEMA[t]?.fields || []);

                const readableKeys = changedKeys.map(k => {
                    const field = allFields.find(f => f.key === k);
                    return field?.label || k;
                }).join(', ');

                const componentLabel = updatedComponent.config?.label ||
                    (types.length > 1 ? types.map(t => COMPONENT_METADATA[t]?.label).join(' + ') : COMPONENT_METADATA[updatedComponent.type]?.label);

                onDesignChange({
                    type: 'config_updated',
                    component: updatedComponent,
                    summary: `Configured ${componentLabel}: set ${readableKeys}`,
                    changedFields: changedKeys
                });
            }
        }

        setSelectedComponentId(null);
    };

    const handleConnectionSave = (updatedConnection) => {
        const oldConnection = connections.find(c => c.id === updatedConnection.id);
        const semanticSummary = generateConnectionSummary(oldConnection, updatedConnection, components);

        setConnections(prev => prev.map(c =>
            c.id === updatedConnection.id ? updatedConnection : c
        ));

        setSelectedConnectionId(null);

        if (onDesignChange && semanticSummary) {
            onDesignChange({
                type: 'connection_configured',
                connectionId: updatedConnection.id,
                summary: semanticSummary
            });
        }
    };

    // Add component to canvas
    const addComponent = useCallback((type, position) => {
        const newComponent = {
            id: `comp-${nextIdRef.current++}`,
            type,
            position: position || { x: 100, y: 100 },
            config: {},
            definedFields: [],
            assumedFields: [],
            undefinedFields: Object.keys(COMPONENT_METADATA[type]?.fields || {})
        };

        setComponents(prev => [...prev, newComponent]);

        // Notify parent of change
        if (onDesignChange) {
            onDesignChange({
                type: 'component_added',
                component: newComponent,
                summary: `Added ${COMPONENT_METADATA[type].label}`
            });
        }
    }, [onDesignChange]);

    // Remove component
    const removeComponent = useCallback((componentId) => {
        const component = components.find(c => c.id === componentId);

        setComponents(prev => prev.filter(c => c.id !== componentId));
        setConnections(prev => prev.filter(
            conn => conn.from !== componentId && conn.to !== componentId
        ));

        if (onDesignChange && component) {
            onDesignChange({
                type: 'component_removed',
                componentId,
                summary: `Removed ${COMPONENT_METADATA[component.type].label}`
            });
        }
    }, [components, onDesignChange]);

    // Add connection between components
    const addConnection = useCallback((fromId, toId) => {
        const fromComp = components.find(c => c.id === fromId);
        const toComp = components.find(c => c.id === toId);

        if (!fromComp || !toComp) return;

        const newConnection = {
            id: `conn-${Date.now()}`,
            from: fromId,
            to: toId
        };

        setConnections(prev => [...prev, newConnection]);

        if (onDesignChange) {
            onDesignChange({
                type: 'connection_added',
                connection: newConnection,
                summary: `Connected ${COMPONENT_METADATA[fromComp.type].label} to ${COMPONENT_METADATA[toComp.type].label}`
            });
        }
    }, [components, onDesignChange]);

    // Handle component drag (New items from Library)
    const handleComponentDrop = (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');

        if (componentType) {
            const rect = canvasRef.current.getBoundingClientRect();
            // Calculate exact position without any grid snapping
            const x = (e.clientX - rect.left - pan.x) / zoom;
            const y = (e.clientY - rect.top - pan.y) / zoom;

            // Adding new component from library
            addComponent(componentType, { x, y });
        }
    };

    // Handle smooth component dragging (Existing items)
    const handleComponentMouseDown = (e, component) => {
        e.stopPropagation(); // Prevent panning
        if (e.button !== 0) return; // Only left click

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;

        setDraggingComponentId(component.id);
        setDragOffset({
            x: mouseX - component.position.x,
            y: mouseY - component.position.y
        });
    };

    // Handle Resize Mousedown
    const handleResizeMouseDown = (e, component) => {
        e.stopPropagation();
        if (e.button !== 0) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;

        setResizingComponentId(component.id);
        setResizeStart({
            x: mouseX,
            y: mouseY,
            w: component.width || 400,
            h: component.height || 300
        });
    };

    // Pan controls
    const handleMouseDown = (e) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
            e.preventDefault();
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;

        // Track mouse position for temporary connection line
        if (isConnectionMode && connectionStartComponentId) {
            setMousePos({ x: mouseX, y: mouseY });
        }

        if (resizingComponentId) {
            const dx = mouseX - resizeStart.x;
            const dy = mouseY - resizeStart.y;

            setComponents(prev => prev.map(comp =>
                comp.id === resizingComponentId
                    ? { ...comp, width: Math.max(100, resizeStart.w + dx), height: Math.max(100, resizeStart.h + dy) }
                    : comp
            ));
        } else if (draggingComponentId) {
            const newX = mouseX - dragOffset.x;
            const newY = mouseY - dragOffset.y;

            // Check if moved significantly to consider it a drag
            if (!isDraggingRef.current) {
                isDraggingRef.current = true;
            }

            setComponents(prev => prev.map(comp =>
                comp.id === draggingComponentId
                    ? { ...comp, position: { x: newX, y: newY } }
                    : comp
            ));
        } else if (isPanning) {
            setPan({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setResizingComponentId(null);

        if (draggingComponentId) {
            const draggedComp = components.find(c => c.id === draggingComponentId);
            if (draggedComp) {
                // Collision Detection for Merging
                const targetComp = components.find(c => {
                    if (c.id === draggingComponentId) return false;

                    const dx = Math.abs(c.position.x - draggedComp.position.x);
                    const dy = Math.abs(c.position.y - draggedComp.position.y);

                    // Simple distance-based collision (assuming components are ~100x80)
                    return dx < 60 && dy < 50;
                });

                if (targetComp) {
                    // Merge!
                    const updatedComponents = components.filter(c => c.id !== draggingComponentId).map(c => {
                        if (c.id === targetComp.id) {
                            const currentMergedTypes = c.mergedTypes || [c.type];
                            const newMergedTypes = [...currentMergedTypes, draggedComp.type];
                            return {
                                ...c,
                                mergedTypes: newMergedTypes,
                                // Also merge configuration if relevant (e.g., label)
                                config: {
                                    ...c.config,
                                    label: c.config.label || COMPONENT_METADATA[c.type].label
                                }
                            };
                        }
                        return c;
                    });

                    setComponents(updatedComponents);

                    if (onDesignChange) {
                        onDesignChange({
                            type: 'components_merged',
                            targetId: targetComp.id,
                            mergedType: draggedComp.type,
                            summary: `Merged ${COMPONENT_METADATA[draggedComp.type].label} into ${COMPONENT_METADATA[targetComp.type].label}`
                        });
                    }
                }
            }
        }

        setDraggingComponentId(null);
        setTimeout(() => {
            isDraggingRef.current = false;
        }, 50);
    };

    const isDraggingRef = useRef(false);

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    // Refactored Connection Logic (Click-to-Connect)
    const handleComponentClick = (e, componentId) => {
        // e.stopPropagation() is handled by caller if needed, but here we want to ensure we don't trigger canvas click
        e.stopPropagation();

        // If we just finished dragging, ignore the click
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            return;
        }

        if (isConnectionMode) {
            if (connectionStartComponentId === null) {
                // Start connection
                setConnectionStartComponentId(componentId);

                // Initialize mouse pos for immediate feedback
                const rect = canvasRef.current.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left - pan.x) / zoom;
                const mouseY = (e.clientY - rect.top - pan.y) / zoom;
                setMousePos({ x: mouseX, y: mouseY });

            } else {
                // Complete connection (if different component)
                if (connectionStartComponentId !== componentId) {
                    addConnection(connectionStartComponentId, componentId);
                    setConnectionStartComponentId(null); // Reset after connection
                } else {
                    // Clicking same component: Cancel or do nothing? 
                    // Let's cancel selection to be intuitive
                    setConnectionStartComponentId(null);
                }
            }
        } else {
            // Normal Selection Mode -> Open Config
            setSelectedComponentId(componentId);
            const component = components.find(c => c.id === componentId);
            if (component && component.type !== 'bounding_box' && component.type !== 'text_note') {
                setComponentPopupPos({ x: e.clientX, y: e.clientY });
            }
            onComponentSelect(component);
        }
    };

    // Remove connection
    const removeConnection = useCallback((connectionId) => {
        setConnections(prev => prev.filter(c => c.id !== connectionId));

        if (onDesignChange) {
            onDesignChange({
                type: 'connection_removed',
                connectionId,
                summary: 'Removed connection'
            });
        }
    }, [onDesignChange]);

    // Helper to get center connection points for a component
    const getConnectionPoints = (comp) => {
        const { x, y } = comp.position;
        const config = comp.config || {};

        // Sizing logic
        let compW = 100;
        let compH = isFullScreen ? 56 : 48; // Standard node height

        if (comp.type === 'bounding_box') {
            const sizeMap = { 'Small': 300, 'Medium': 500, 'Large': 800, 'Extra Large': 1200 };
            const boxSize = sizeMap[config.size || 'Medium'];
            compW = boxSize;
            compH = boxSize * 0.75; // 4:3 ratio
        } else if (comp.type === 'text_note') {
            compW = 160;
            compH = 120;
        } else {
            // Standard node
            const typesCount = (comp.mergedTypes || [comp.type]).length;
            compW = (isFullScreen ? 120 : 100) + (typesCount > 1 ? (typesCount - 1) * 45 : 0);
        }

        // The icon container width is roughy 40px per icon + gaps, only for standard nodes
        let iconLeft = compW / 2; // Default center
        if (comp.type !== 'bounding_box' && comp.type !== 'text_note') {
            const typesCount = (comp.mergedTypes || [comp.type]).length;
            const iconContainerW = (isFullScreen ? 56 : 48) + (typesCount > 1 ? (typesCount - 1) * 40 : 0);
            iconLeft = (compW - iconContainerW) / 2;
        } else {
            iconLeft = 0; // Not used the same way
        }

        return {
            top: { x: x + compW / 2, y: y },
            right: { x: x + compW, y: y + compH / 2 },
            bottom: { x: x + compW / 2, y: y + compH },
            left: { x: x, y: y + compH / 2 }
        };
    };

    // Helper: Determine optimal connection sides
    const getOptimalSides = useCallback((fromComp, toComp, toPos) => {
        const fromPoints = getConnectionPoints(fromComp);
        let toPoints;
        if (toComp) {
            toPoints = getConnectionPoints(toComp);
        } else if (toPos) {
            toPoints = { top: toPos, right: toPos, bottom: toPos, left: toPos };
        } else return null;

        const dx = toPoints.top.x - fromPoints.top.x;
        const dy = toPoints.top.y - fromPoints.top.y;

        const sides = ['top', 'right', 'bottom', 'left'];
        let minDist = Infinity;
        let bestS = 'right';
        let bestE = 'left';

        sides.forEach(sSide => {
            sides.forEach(eSide => {
                const p1 = fromPoints[sSide];
                const p2 = toPoints[eSide];
                const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);

                let penalty = 0;
                // Favor opposite sides (e.g., right to left, bottom to top)
                const isOpposite = (sSide === 'right' && eSide === 'left') ||
                    (sSide === 'left' && eSide === 'right') ||
                    (sSide === 'bottom' && eSide === 'top') ||
                    (sSide === 'top' && eSide === 'bottom');

                if (isOpposite) penalty -= 40;

                // Extra bias based on relative alignment
                const isVerticalLayout = Math.abs(dy) > Math.abs(dx) * 1.5;
                const isHorizontalLayout = Math.abs(dx) > Math.abs(dy) * 1.5;

                if (isVerticalLayout && (sSide === 'bottom' || sSide === 'top')) penalty -= 30;
                if (isHorizontalLayout && (sSide === 'left' || sSide === 'right')) penalty -= 30;

                // Strongly discourage same side connections
                if (sSide === eSide) penalty += 100;

                if (d + penalty < minDist) {
                    minDist = d + penalty;
                    bestS = sSide;
                    bestE = eSide;
                }
            });
        });

        return { start: bestS, end: bestE };
    }, []);

    // Memoize connection grouping to prevent overlaps
    const connectionLayout = useMemo(() => {
        const usage = {}; // { compId: { top: [connIds], ... } }
        const decisions = {}; // { connId: { start, end } }

        components.forEach(c => {
            usage[c.id] = { top: [], right: [], bottom: [], left: [] };
        });

        connections.forEach(conn => {
            if (conn.isTemp) return;
            const from = components.find(c => c.id === conn.from);
            const to = components.find(c => c.id === conn.to);
            if (!from || !to) return;

            const sides = getOptimalSides(from, to, null);
            if (sides) {
                decisions[conn.id] = sides;
                if (usage[from.id]) usage[from.id][sides.start].push(conn.id);
                if (usage[to.id]) usage[to.id][sides.end].push(conn.id);
            }
        });

        // 2. Fix ordering based on spatial position to prevent "crossing" lines
        // For each component's usage list, sort the connection IDs by the relative position of the "other" component.
        Object.keys(usage).forEach(compId => {
            ['top', 'right', 'bottom', 'left'].forEach(side => {
                const connIds = usage[compId][side];
                if (connIds.length > 1) {
                    connIds.sort((aId, bId) => {
                        const connA = connections.find(c => c.id === aId);
                        const connB = connections.find(c => c.id === bId);
                        if (!connA || !connB) return 0;

                        const otherAId = connA.from === compId ? connA.to : connA.from;
                        const otherBId = connB.from === compId ? connB.to : connB.from;
                        const otherA = components.find(c => c.id === otherAId);
                        const otherB = components.find(c => c.id === otherBId);

                        if (!otherA || !otherB) return 0;

                        // On Left/Right sides, sort by Y (top to bottom)
                        if (side === 'left' || side === 'right') {
                            return otherA.position.y - otherB.position.y;
                        }
                        // On Top/Bottom sides, sort by X (left to right)
                        else {
                            return otherA.position.x - otherB.position.x;
                        }
                    });
                }
            });
        });

        return { usage, decisions };
    }, [components, connections, getOptimalSides]);

    // Render production-grade Bezier connections
    const renderConnection = (conn) => {
        const fromComp = components.find(c => c.id === conn.from);

        // If it's a temp mouse connection, we don't have a toComp
        const toComp = conn.to ? components.find(c => c.id === conn.to) : null;
        const toPosition = conn.toPosition; // {x, y} from mouse

        if (!fromComp || (!toComp && !toPosition)) return null;

        let startSide = 'right';
        let endSide = 'left';

        if (conn.isTemp) {
            const sides = getOptimalSides(fromComp, toComp, toPosition);
            if (sides) {
                startSide = sides.start;
                endSide = sides.end;
            }
        } else {
            const decision = connectionLayout.decisions[conn.id];
            if (decision) {
                startSide = decision.start;
                endSide = decision.end;
            }
        }

        const fromPoints = getConnectionPoints(fromComp);
        let startPoint = { ...fromPoints[startSide] };

        let toPoints;
        if (toComp) {
            toPoints = getConnectionPoints(toComp);
        } else if (toPosition) {
            toPoints = {
                top: toPosition, right: toPosition, bottom: toPosition, left: toPosition
            };
        }

        let endPoint = toPoints ? { ...toPoints[endSide] } : { x: 0, y: 0 };

        // Apply Offsets for Static Connections to prevent overlap
        if (!conn.isTemp && toComp && connectionLayout.usage[fromComp.id] && connectionLayout.usage[toComp.id]) {
            const GAP = 10;
            const sUsage = connectionLayout.usage[fromComp.id][startSide] || [];
            const eUsage = connectionLayout.usage[toComp.id][endSide] || [];

            const sIndex = sUsage.indexOf(conn.id);
            const eIndex = eUsage.indexOf(conn.id);

            if (sIndex !== -1 && sUsage.length > 1) {
                const offset = (sIndex - (sUsage.length - 1) / 2) * GAP;
                if (startSide === 'top' || startSide === 'bottom') startPoint.x += offset;
                else startPoint.y += offset;
            }

            if (eIndex !== -1 && eUsage.length > 1) {
                const offset = (eIndex - (eUsage.length - 1) / 2) * GAP;
                if (endSide === 'top' || endSide === 'bottom') endPoint.x += offset;
                else endPoint.y += offset;
            }
        }

        const { x: sx, y: sy } = startPoint;
        const { x: ex, y: ey } = endPoint;

        // Bezier Control Point Calculation
        // Control points determine the curve direction
        const dist = Math.hypot(ex - sx, ey - sy);
        const curvature = Math.max(dist * 0.4, 50); // Dynamic curvature

        let cp1 = { x: sx, y: sy };
        let cp2 = { x: ex, y: ey };

        // Push CP1 out from start side
        if (startSide === 'right') cp1.x += curvature;
        else if (startSide === 'left') cp1.x -= curvature;
        else if (startSide === 'top') cp1.y -= curvature;
        else if (startSide === 'bottom') cp1.y += curvature;

        // Push CP2 out from end side
        if (endSide === 'right') cp2.x += curvature;
        else if (endSide === 'left') cp2.x -= curvature;
        else if (endSide === 'top') cp2.y -= curvature;
        else if (endSide === 'bottom') cp2.y += curvature;

        const pathData = `M ${sx} ${sy} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${ex} ${ey}`;

        // Arrow Head Calculation (Correctly aligned with end tangent)
        // Tangent vector at t=1 is (P3 - P2), i.e., (ex, ey) - (cp2x, cp2y)
        // If ex=cp2x, we fallback to P3-P1.
        let tx = ex - cp2.x;
        let ty = ey - cp2.y;
        if (Math.abs(tx) < 0.1 && Math.abs(ty) < 0.1) {
            tx = ex - cp1.x;
            ty = ey - cp1.y;
        }

        const angle = Math.atan2(ty, tx);
        const arrowSize = 6;

        // Arrow points
        const a1x = ex - arrowSize * Math.cos(angle - Math.PI / 6);
        const a1y = ey - arrowSize * Math.sin(angle - Math.PI / 6);
        const a2x = ex - arrowSize * Math.cos(angle + Math.PI / 6);
        const a2y = ey - arrowSize * Math.sin(angle + Math.PI / 6);

        const arrowPath = `M ${ex} ${ey} L ${a1x} ${a1y} L ${a2x} ${a2y} Z`;

        // Bidirectional Start Arrow (Only for Bidirectional Stream)
        let startArrowPath = null;
        if (!conn.isTemp && conn.config?.interaction_type === 'Bidirectional Stream') {
            let stx = sx - cp1.x;
            let sty = sy - cp1.y;
            if (Math.abs(stx) < 0.1 && Math.abs(sty) < 0.1) {
                stx = sx - cp2.x;
                sty = sy - cp2.y;
            }
            const sAngle = Math.atan2(sty, stx);
            const sa1x = sx - arrowSize * Math.cos(sAngle - Math.PI / 6);
            const sa1y = sy - arrowSize * Math.sin(sAngle - Math.PI / 6);
            const sa2x = sx - arrowSize * Math.cos(sAngle + Math.PI / 6);
            const sa2y = sy - arrowSize * Math.sin(sAngle + Math.PI / 6);
            startArrowPath = `M ${sx} ${sy} L ${sa1x} ${sa1y} L ${sa2x} ${sa2y} Z`;
        }

        const strokeColor = conn.isTemp ? "#3B82F6" : "#475569"; // slate-600
        // Sequence Number Rendering (Middle of Bezier)
        let seqNode = null;
        if (!conn.isTemp && conn.config?.sequence_number) {
            // Cubic bez evaluation at t=0.5
            const t = 0.5;
            const mt1 = 1 - t;
            const midX = mt1 * mt1 * mt1 * sx + 3 * mt1 * mt1 * t * cp1.x + 3 * mt1 * t * t * cp2.x + t * t * t * ex;
            const midY = mt1 * mt1 * mt1 * sy + 3 * mt1 * mt1 * t * cp1.y + 3 * mt1 * t * t * cp2.y + t * t * t * ey;

            seqNode = (
                <g transform={`translate(${midX}, ${midY})`}>
                    <circle cx="0" cy="0" r="10" fill="white" stroke={strokeColor} strokeWidth="1.5" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill={strokeColor} style={{ pointerEvents: 'none' }}>
                        {conn.config.sequence_number}
                    </text>
                </g>
            );
        }

        // Calculate path length for dash animation
        const pathLength = Math.sqrt(Math.pow(ex - sx, 2) + Math.pow(ey - sy, 2)) + curvature * 2; // Approximation

        return (
            <g key={conn.id}
                className={`transition-all duration-300 ${!conn.isTemp ? 'animate-in fade-in duration-500 cursor-pointer group' : ''}`}
            >
                {/* Start Terminal Dot */}
                <circle cx={sx} cy={sy} r="3" fill={strokeColor} opacity={conn.isTemp ? 0.6 : 1} />

                {/* Hit Box */}
                {/* Invisible thicker path for easier hovering/clicking */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="20"
                    style={{ pointerEvents: 'stroke' }}
                    onClick={(e) => {
                        if (conn.isTemp) return;
                        e.stopPropagation();
                        setSelectedConnectionId(conn.id);
                        setConnectionPopupPos({ x: e.clientX, y: e.clientY });
                    }}
                />

                {/* The visible line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={conn.isTemp ? "2" : "2"}
                    strokeDasharray={conn.isTemp ? "5,5" : "none"}
                    className={!conn.isTemp ? "group-hover:stroke-blue-500 group-hover:stroke-[3px] transition-colors duration-300" : "animate-pulse opacity-60"}
                    style={{ pointerEvents: 'stroke' }}
                    onClick={(e) => {
                        if (conn.isTemp) return;
                        e.stopPropagation();
                        setSelectedConnectionId(conn.id);
                        setConnectionPopupPos({ x: e.clientX, y: e.clientY });
                    }}
                />

                {/* Arrow Head */}
                <path
                    d={arrowPath}
                    fill={strokeColor}
                    className={!conn.isTemp ? "group-hover:fill-blue-500 transition-colors duration-300 animate-in fade-in zoom-in slide-in-from-left-2 duration-700" : "opacity-60"}
                    style={{ pointerEvents: 'none', animationFillMode: 'both' }}
                />

                {/* Bidirectional Arrow Head */}
                {startArrowPath && (
                    <path
                        d={startArrowPath}
                        fill={strokeColor}
                        className={!conn.isTemp ? "group-hover:fill-blue-500 transition-colors duration-300 animate-in fade-in zoom-in slide-in-from-right-2 duration-700" : "opacity-60"}
                        style={{ pointerEvents: 'none', animationFillMode: 'both' }}
                    />
                )}

                {/* Sequence Number Label */}
                {seqNode}
            </g>
        );
    };

    // Export Handlers
    const handleExportJson = () => exportToJson(components, connections);
    const handleExportPng = () => exportToPng('system-design-canvas-area', 'architecture.png');
    const handleExportSpec = () => {
        const spec = generateSpec(components, connections);
        const blob = new Blob([spec], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "architecture-spec.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleSave = () => {
        const time = saveToLocal(components, connections);
        alert(`Design saved locally at ${time}`);
    };

    const handleLoad = () => {
        const data = loadFromLocal();
        if (data) {
            if (window.confirm("Load saved design? This will overwrite current changes.")) {
                setComponents(data.components || []);
                setConnections(data.connections || []);
            }
        } else {
            alert("No saved design found.");
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 relative">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 z-10 pl-20"> {/* Added left padding for collapsed sidebar */}

                <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="Zoom In"
                >
                    <ZoomIn size={18} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-gray-100 rounded"
                    title="Zoom Out"
                >
                    <ZoomOut size={18} />
                </button>
                <span className="text-sm text-gray-600">{Math.round(zoom * 100)}%</span>

                <div className="h-6 w-px bg-gray-300 mx-2" />

                {!interviewMode && (<button
                    onClick={() => {
                        const rect = canvasRef.current.getBoundingClientRect();
                        const x = (rect.width / 2 - pan.x) / zoom;
                        const y = (rect.height / 2 - pan.y) / zoom;
                        addComponent('bounding_box', { x, y });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors hover:bg-gray-100 text-gray-700"
                    title="Add Bounding Box"
                >
                    <Square size={16} />
                    <span className="font-medium hidden sm:inline">Box</span>
                </button>)}

                {!interviewMode && (<button
                    onClick={() => {
                        const rect = canvasRef.current.getBoundingClientRect();
                        const x = (rect.width / 2 - pan.x) / zoom;
                        const y = (rect.height / 2 - pan.y) / zoom;
                        addComponent('text_note', { x, y });
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors hover:bg-gray-100 text-gray-700"
                    title="Add Text Note"
                >
                    <FileText size={16} />
                    <span className="font-medium hidden sm:inline">Note</span>
                </button>
                )}


                <div className="h-6 w-px bg-gray-300 mx-2" />

                {!interviewMode && (
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => {
                                setIsConnectionMode(!isConnectionMode);
                                setConnectionStartComponentId(null);
                                setIsSimulationMode(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${isConnectionMode
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'hover:bg-gray-200 text-gray-700'
                                }`}
                            title="Toggle Connection Mode"
                        >
                            <LinkIcon size={16} />
                            <span className="font-medium">Connect</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsSimulationMode(!isSimulationMode);
                                setIsConnectionMode(false);
                                setFailureMenuTarget(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${isSimulationMode
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'hover:bg-gray-200 text-gray-700'
                                }`}
                            title="Toggle Failure Simulation"
                        >
                            <Activity size={16} />
                            <span className="font-medium">Simulate</span>
                        </button>
                    </div>
                )}
                {interviewMode && (
                    <button
                        onClick={() => {
                            setIsConnectionMode(!isConnectionMode);
                            setConnectionStartComponentId(null);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${isConnectionMode
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        title="Toggle Connection Mode"
                    >
                        <LinkIcon size={16} />
                        <span className="font-medium">Connect</span>
                    </button>
                )}

                {/* HEALTH INDICATOR */}
                {!interviewMode && (
                    <div className="relative ml-2">
                        <button
                            onClick={() => setIsHealthCheckOpen(!isHealthCheckOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${healthStatus === 'healthy'
                                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                : healthStatus === 'critical'
                                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 animate-pulse'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                }`}
                            title="System Health Check"
                        >
                            {healthStatus === 'healthy' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            {validationIssues.length === 0 ? 'Healthy' : `${validationIssues.length} Issues`}
                        </button>

                        {/* Health Popover */}
                        {isHealthCheckOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm text-gray-800">Architecture Validator</h3>
                                    <button onClick={() => setIsHealthCheckOpen(false)} className="text-gray-500 hover:text-gray-700">
                                        <X size={14} />
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2">
                                    {validationIssues.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                                            <p className="text-sm">All systems nominal.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {validationIssues.map(issue => (
                                                <div key={issue.id} className={`p-3 rounded-lg border text-xs ${issue.severity === 'HIGH'
                                                    ? 'bg-red-50 border-red-100 text-red-800'
                                                    : issue.severity === 'MEDIUM'
                                                        ? 'bg-amber-50 border-amber-100 text-amber-800'
                                                        : 'bg-blue-50 border-blue-100 text-blue-800'
                                                    }`}>
                                                    <div className="flex items-center gap-2 mb-1 font-bold">
                                                        {issue.severity === 'HIGH' && <AlertTriangle size={12} />}
                                                        <span>{issue.ruleId.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    <p className="opacity-90 leading-relaxed">{issue.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* EXPORT / SAVE CONTROLS */}
                {!interviewMode && (
                    <>
                        <div className="h-6 w-px bg-gray-300 mx-2" />

                        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                            <button
                                onClick={handleSave}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Save Design"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleLoad}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Load Design"
                            >
                                <Upload size={16} />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-300 mx-2" />

                        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                            <button
                                onClick={handleExportJson}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Export JSON"
                            >
                                <FileJson size={16} />
                            </button>
                            <button
                                onClick={handleExportPng}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Export PNG"
                            >
                                <ImageIcon size={16} />
                            </button>
                            <button
                                onClick={handleExportSpec}
                                className="p-1.5 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                                title="Generate Spec"
                            >
                                <FileText size={16} />
                            </button>
                        </div>
                    </>
                )}

                <div className="ml-auto text-sm text-gray-500">
                    {components.length} components • {connections.length} connections
                </div>
            </div>

            {/* Instructions Banner */}
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-sm text-blue-800 pl-20"> {/* Added left padding */}
                <strong>Controls:</strong> Click on the component to configure it • Click components to connect (Connect mode) • Click connections to configure • Alt+Drag to pan canvas
            </div>

            {/* Component Library Sidebar */}
            <div
                className={`absolute left-0 top-0 bottom-0 bg-white border-r border-gray-200 shadow-lg z-20 transition-all duration-300 flex flex-col ${isSidebarExpanded ? 'w-64' : 'w-16'}`}
            >
                {/* Toggle Handle */}
                <div className={`p-2 border-b border-gray-200 flex items-center ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title={isSidebarExpanded ? "Collapse" : "Expand"}
                    >
                        {isSidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <div className="p-2 overflow-y-auto flex-1">
                    {Object.entries(
                        Object.entries(COMPONENT_METADATA)
                            .filter(([type]) => type !== 'bounding_box' && type !== 'text_note')
                            .reduce((acc, [type, meta]) => {
                                const category = meta.category || 'Other';
                                if (!acc[category]) acc[category] = [];
                                acc[category].push({ type, meta });
                                return acc;
                            }, {})
                    ).map(([category, items]) => (
                        <div key={category} className="mb-2">
                            {isSidebarExpanded && (
                                <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    {category}
                                </h3>
                            )}
                            {items.map(({ type, meta }) => (
                                <div
                                    key={type}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('componentType', type);
                                        setDraggedComponent(type);
                                    }}
                                    onDragEnd={() => setDraggedComponent(null)}
                                    onMouseEnter={(e) => {
                                        if (!isSidebarExpanded) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredLibraryItem({
                                                label: meta.label,
                                                top: rect.top + rect.height / 2,
                                                left: rect.right + 10 // Position to the right of the sidebar
                                            });
                                        }
                                    }}
                                    onMouseLeave={() => setHoveredLibraryItem(null)}
                                    className={`
                                group relative flex items-center gap-3 p-2 mb-1 rounded cursor-move transition-all border
                                ${isSidebarExpanded
                                            ? 'mx-2 bg-gray-50 hover:bg-gray-100 border-gray-200'
                                            : 'justify-center border-transparent hover:bg-gray-100'}
                            `}
                                >
                                    <div
                                        className="w-8 h-8 rounded flex items-center justify-center p-1.5 flex-shrink-0"
                                        style={{ backgroundColor: `${meta.color}15` }} // Light background opacity
                                    >
                                        {(() => {
                                            const IconComponent = getIconForType(type);
                                            return <IconComponent size={20} color={meta.color} />;
                                        })()}
                                    </div>


                                    {isSidebarExpanded && (
                                        <span className="text-sm flex-1 truncate">{meta.label}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Tooltip for Collapsed Sidebar */}
            {
                hoveredLibraryItem && !isSidebarExpanded && (
                    <div
                        className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none flex items-center"
                        style={{
                            top: hoveredLibraryItem.top,
                            left: hoveredLibraryItem.left,
                            transform: 'translateY(-50%)'
                        }}
                    >
                        {/* Arrow */}
                        <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                        {hoveredLibraryItem.label}
                    </div>
                )
            }

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: `${pan.x}px ${pan.y}px`
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleComponentDrop}
            >
                <div
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: '0 0',
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    {/* SVG for connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                        {connections.map(img => renderConnection(img))}
                    </svg>

                    {/* Temporary Connection Line (Mouse Follower) */}
                    {isConnectionMode && connectionStartComponentId && (
                        renderConnection({
                            id: 'temp-mouse',
                            from: connectionStartComponentId,
                            toPosition: mousePos, // New prop we'll need to handle in renderConnection
                            isTemp: true
                        })
                    )}

                    {/* Components - Sort to render bounding boxes first (behind others) */}
                    {[...components]
                        .sort((a, b) => {
                            if (a.type === 'bounding_box' && b.type !== 'bounding_box') return -1;
                            if (a.type !== 'bounding_box' && b.type === 'bounding_box') return 1;
                            return 0;
                        })
                        .map((component) => {
                            const meta = COMPONENT_METADATA[component.type];
                            const schema = COMPONENT_CONFIG_SCHEMA[component.type];
                            // Correct logic for config count: "definedFields.length / totalFields"
                            const totalFields = schema?.fields ? schema.fields.length : 0;

                            const isConnectionStart = connectionStartComponentId === component.id;
                            const failureType = activeFailures[component.id]; // 'outage' | 'latency' | undefined

                            // Calculate custom dimensions respecting dragged size or falling back to defaults
                            let compW = component.width || 100;
                            let compH = component.height || (isFullScreen ? 90 : 80);

                            if (component.type === 'bounding_box') {
                                if (!component.width) {
                                    const sizeMap = { 'Small': 300, 'Medium': 500, 'Large': 800, 'Extra Large': 1200 };
                                    compW = sizeMap[component.config?.size || 'Medium'];
                                }
                                if (!component.height) {
                                    compH = compW * 0.75;
                                }
                            } else if (component.type === 'text_note') {
                                compW = component.width || 160;
                                compH = component.height || 120;
                            } else {
                                compW = component.width || ((isFullScreen ? 120 : 100) + ((component.mergedTypes || [component.type]).length > 1 ? ((component.mergedTypes || [component.type]).length - 1) * 45 : 0));
                            }

                            // Determine z-index dynamically
                            let zIndexBase = 2;
                            if (component.type === 'bounding_box') zIndexBase = 1;
                            if (selectedComponentId === component.id) zIndexBase = 10;
                            if (isConnectionStart) zIndexBase = 50;

                            return (
                                <div
                                    key={component.id}
                                    onMouseDown={(e) => {
                                        if (!isConnectionMode && !isSimulationMode) {
                                            // Only handle drag if we click the wrapper or header, NOT the background
                                            if (component.type === 'bounding_box') {
                                                // Event is naturally stopped by pointer-events mapping above
                                                handleComponentMouseDown(e, component);
                                            } else {
                                                handleComponentMouseDown(e, component);
                                            }
                                        }
                                    }}
                                    onClick={(e) => {
                                        if (isSimulationMode) {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setFailureMenuTarget({
                                                id: component.id,
                                                x: rect.right + 10,
                                                y: rect.top
                                            });
                                        } else {
                                            handleComponentClick(e, component.id);
                                        }
                                    }}
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        if (component.type === 'text_note') {
                                            setEditingNoteId(component.id);
                                        }
                                    }}
                                    className={`
                                    group absolute flex flex-col items-center justify-start transition-all duration-300 select-none animate-in zoom-in-75 fade-in duration-300
                                    ${component.type === 'bounding_box' ? 'pointer-events-auto' : ''}
                                    ${component.type !== 'text_note' ? 'cursor-pointer' : ''}
                                `}
                                    style={{
                                        left: component.position.x,
                                        top: component.position.y,
                                        width: component.type === 'text_note' ? 'max-content' : `${compW}px`,
                                        maxWidth: component.type === 'text_note' ? '300px' : undefined,
                                        height: component.type === 'text_note' ? 'auto' : `${compH}px`,
                                        minWidth: component.type === 'text_note' ? '160px' : undefined,
                                        zIndex: zIndexBase
                                    }}
                                >
                                    {/* Wrapper for Icon + Status used for hover target */}
                                    <div className={`relative w-full  h-full transition-transform duration-300 ${['bounding_box', 'text_note'].includes(component.type) ? '' : 'group-hover:-translate-y-0.5'}`}>
                                        {component.type === 'bounding_box' ? (
                                            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-start p-3 bg-transparent pointer-events-none relative group-hover:border-gray-400 transition-colors">
                                                {/* Header area - clickable for dragging */}
                                                <div className="text-gray-500 font-semibold mb-1 flex items-center gap-2 text-xs uppercase tracking-wider pointer-events-auto cursor-move bg-white/80 px-2 py-1 rounded backdrop-blur-sm -mt-6 -ml-2 select-none">
                                                    {(() => { const IconComp = getIconForType(component.type); return <IconComp size={14} /> })()}
                                                    {component.config?.label || meta.label}
                                                </div>

                                                {/* Resize Handle */}
                                                <div
                                                    className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-end justify-end p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                                                    onMouseDown={(e) => handleResizeMouseDown(e, component)}
                                                >
                                                    <div className="w-3 h-3 border-r-2 border-b-2 border-gray-400 rounded-sm"></div>
                                                </div>
                                            </div>
                                        ) : component.type === 'text_note' ? (
                                            <div
                                                className={`w-full h-full bg-yellow-100 shadow-md p-3 text-gray-800 rounded-lg flex flex-col items-start border border-yellow-200/50 transition-shadow ${editingNoteId === component.id ? 'ring-2 ring-blue-400 shadow-lg' : 'group-hover:shadow-lg'}`}
                                                style={{ pointerEvents: 'auto', minWidth: '160px', minHeight: '60px' }}
                                            >
                                                <div
                                                    className={`w-full h-full whitespace-pre-wrap text-[12px] font-medium leading-relaxed font-sans text-gray-800 outline-none ${editingNoteId === component.id ? 'cursor-text' : 'cursor-move'}`}
                                                    contentEditable={editingNoteId === component.id}
                                                    suppressContentEditableWarning={true}
                                                    onBlur={(e) => {
                                                        const newText = e.target.innerText;
                                                        setEditingNoteId(null);
                                                        setComponents(components.map(c =>
                                                            c.id === component.id ? { ...c, config: { ...c.config, text: newText } } : c
                                                        ));
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onMouseDown={(e) => {
                                                        if (editingNoteId === component.id) {
                                                            e.stopPropagation(); // allow text selection when editing
                                                        }
                                                        // let bubble up when not editing so we can drag the note!
                                                    }}
                                                    ref={(el) => {
                                                        if (el && editingNoteId === component.id && document.activeElement !== el) {
                                                            el.focus();
                                                            try {
                                                                const selection = window.getSelection();
                                                                const range = document.createRange();
                                                                range.selectNodeContents(el);
                                                                range.collapse(false);
                                                                selection.removeAllRanges();
                                                                selection.addRange(range);
                                                            } catch (err) { }
                                                        }
                                                    }}
                                                >
                                                    {component.config?.text || (editingNoteId === component.id ? '' : "Double click to edit...")}
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`
                                                ${isFullScreen ? 'h-14' : 'h-12'} w-auto min-w-[3rem] mx-auto rounded-2xl flex items-center justify-center p-2.5 transition-all duration-300 shadow-sm border border-slate-200/80 bg-white/95 backdrop-blur-sm
                                                ${selectedComponentId === component.id
                                                        ? 'ring-2 ring-blue-500 shadow-xl scale-105'
                                                        : 'hover:shadow-xl'
                                                    }
                                                ${activeFailures[component.id] === 'outage'
                                                        ? 'bg-red-50 ring-2 ring-red-400'
                                                        : activeFailures[component.id] === 'latency'
                                                            ? 'bg-amber-50 ring-2 ring-amber-400'
                                                            : ''
                                                    }
                                            `}
                                            >
                                                {(() => {
                                                    const typesToRender = component.mergedTypes || [component.type];

                                                    // Dynamic color based on failure status
                                                    const getIconColor = (type) => activeFailures[component.id] === 'outage'
                                                        ? '#EF4444'
                                                        : activeFailures[component.id] === 'latency'
                                                            ? '#F59E0B'
                                                            : COMPONENT_METADATA[type]?.color || '#64748B';

                                                    return (
                                                        <div className="flex items-center gap-1.5 px-1">
                                                            {typesToRender.map((type, idx) => {
                                                                const IconComp = getIconForType(type);
                                                                return (
                                                                    <React.Fragment key={`${component.id}-${type}-${idx}`}>
                                                                        {idx > 0 && <span className="text-slate-400 font-bold text-xs">+</span>}
                                                                        <IconComp size={isFullScreen ? 28 : 20} color={getIconColor(type)} />
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}

                                        {/* Delete Button (Hover) - Top Right */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeComponent(component.id);
                                            }}
                                            className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100 z-20"
                                            title="Delete Component"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>

                                    {/* Label - Clean Text Below (Only for Standard Components) */}
                                    {component.type !== 'bounding_box' && component.type !== 'text_note' && (
                                        <div className="mt-2 text-center max-w-full px-1">
                                            <div className="text-xs font-bold text-slate-700 leading-tight truncate px-1.5 py-0.5 rounded bg-white/50 backdrop-blur-[1px]">
                                                {component.config?.label || meta.label}
                                            </div>

                                            {/* Optional Subtext */}
                                            {component.config?.st_type && (
                                                <div className="text-[9px] text-slate-500 capitalize truncate mt-0.5">
                                                    {component.config.st_type}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Failure Indicator Badge */}
                                    {failureType && (
                                        <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1 ${failureType === 'outage' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}>
                                            <AlertTriangle size={10} />
                                            {failureType.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div >
            </div >

            {/* Instructions */}
            {
                components.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-gray-400">
                            <p className="text-lg font-semibold mb-2">Start Building Your System Design</p>
                            <p className="text-sm">Drag the components from the sidebar to get started</p>
                            <p className="text-xs mt-4 text-gray-500">Toggle connect mode to connect the components • Click on components to configure • Click connections to configure connection</p>
                        </div>
                    </div>
                )
            }

            {/* Failure Context Menu */}
            {
                failureMenuTarget && (
                    <>
                        <div
                            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 flex flex-col gap-1 w-40"
                            style={{
                                left: failureMenuTarget.x,
                                top: failureMenuTarget.y
                            }}
                        >
                            <h4 className="text-xs font-semibold text-gray-500 mb-1 px-2">Inject Failure</h4>
                            <button
                                onClick={() => {
                                    setActiveFailures(prev => ({ ...prev, [failureMenuTarget.id]: 'outage' }));
                                    setFailureMenuTarget(null);
                                }}
                                className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded"
                            >
                                <AlertTriangle size={14} />
                                Total Outage
                            </button>
                            <button
                                onClick={() => {
                                    setActiveFailures(prev => ({ ...prev, [failureMenuTarget.id]: 'latency' }));
                                    setFailureMenuTarget(null);
                                }}
                                className="flex items-center gap-2 px-2 py-1.5 text-xs text-amber-600 hover:bg-amber-50 rounded"
                            >
                                <Activity size={14} />
                                High Latency
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                                onClick={() => {
                                    setActiveFailures(prev => {
                                        const next = { ...prev };
                                        delete next[failureMenuTarget.id];
                                        return next;
                                    });
                                    setFailureMenuTarget(null);
                                }}
                                className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
                            >
                                <Activity size={14} className="opacity-0" /> {/* Spacer */}
                                Clear Failure
                            </button>
                        </div>

                        {/* Background Click to dismiss menu */}
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setFailureMenuTarget(null)}
                        />
                    </>
                )
            }

            {/* Simulation Panel */}
            {
                isSimulationMode && (
                    <SimulationPanel
                        activeStage={activeStage}
                        onStageChange={(stage) => {
                            setActiveStage(stage);
                            if (onDesignChange) onDesignChange({ type: 'stage_changed', summary: `Evolution stage changed to ${stage.toUpperCase()}` });
                        }}
                        activeFailures={activeFailures}
                        onClearFailures={() => {
                            setActiveFailures({});
                            if (onDesignChange) onDesignChange({ type: 'simulation_reset', summary: 'All active failures cleared' });
                        }}
                        onInjectFailure={() => { }}
                    />
                )
            }

            {/* Floating Connection Config */}
            {
                selectedConnectionId && connectionPopupPos && (
                    <FloatingConnectionConfig
                        position={connectionPopupPos}
                        connection={connections.find(c => c.id === selectedConnectionId)}
                        onSave={handleConnectionSave}
                        onDelete={(id) => {
                            removeConnection(id);
                            setSelectedConnectionId(null);
                            setConnectionPopupPos(null);
                        }}
                        onClose={() => {
                            setSelectedConnectionId(null);
                            setConnectionPopupPos(null);
                        }}
                    />
                )
            }

            {/* Component Config Panel */}
            {selectedComponentId && !components.find(c => c.id === selectedComponentId)?.type?.includes('text_note') && (
                <ComponentConfigPanel
                    component={components.find(c => c.id === selectedComponentId)}
                    position={componentPopupPos}
                    onSave={(updatedConfig) => {
                        updateComponentConfig(selectedComponentId, updatedConfig);
                        setSelectedComponentId(null);
                        setComponentPopupPos(null);
                    }}
                    onClose={() => {
                        setSelectedComponentId(null);
                        setComponentPopupPos(null);
                    }}
                />
            )}
        </div >
    );
};
export default SystemDesignCanvas;
