import { COMPONENT_METADATA, COMPONENT_CONFIG_SCHEMA } from './designComponentSchema.js';

/**
 * DesignChangeTracker
 * Captures meaningful design changes and generates semantic summaries
 * for the AI interviewer
 */

class DesignChangeTracker {
    constructor() {
        this.changeHistory = [];
        this.lastSyncedIndex = 0;
    }

    /**
     * Record a design change event
     * @param {Object} change - Change event object
     * @returns {string} - Human-readable summary
     */
    recordChange(change) {
        const summary = this.generateSummary(change);

        this.changeHistory.push({
            timestamp: Date.now(),
            type: change.type,
            data: change,
            summary
        });

        return summary;
    }

    /**
     * Generate semantic summary from change event
     * @param {Object} change - Change event
     * @returns {string} - Human-readable summary
     */
    generateSummary(change) {
        if (change.summary) return change.summary;

        switch (change.type) {
            case 'component_added':
                return this.summarizeComponentAdded(change);

            case 'component_removed':
                return this.summarizeComponentRemoved(change);

            case 'connection_added':
                return this.summarizeConnectionAdded(change);

            case 'connection_removed':
                return this.summarizeConnectionRemoved(change);

            case 'config_updated':
                return this.summarizeConfigUpdate(change);

            case 'assumption_stated':
                return this.summarizeAssumption(change);

            default:
                return `Design updated: ${change.type}`;
        }
    }

    summarizeComponentAdded(change) {
        const { component } = change;
        const meta = COMPONENT_METADATA[component.type];
        const label = meta?.label || component.type || 'Component';

        let summary = `Added ${label}`;

        // Check for critical undefined fields
        const schema = COMPONENT_CONFIG_SCHEMA[component.type];
        if (schema && component.undefinedFields?.length > 0) {
            const criticalUndefined = this.getCriticalUndefinedFields(component);
            if (criticalUndefined.length > 0) {
                summary += `; ${criticalUndefined.join(', ')} undefined`;
            }
        }

        return summary;
    }

    summarizeComponentRemoved(change) {
        const { componentType, componentName } = change;
        const meta = COMPONENT_METADATA[componentType];
        return `Removed ${componentName || meta?.label || 'component'}`;
    }

    summarizeConnectionAdded(change) {
        const { fromComponent, toComponent } = change;
        return `Connected ${fromComponent} to ${toComponent}`;
    }

    summarizeConnectionRemoved(change) {
        const { fromComponent, toComponent } = change;
        return `Disconnected ${fromComponent} from ${toComponent}`;
    }

    summarizeConfigUpdate(change) {
        const { component, field, oldValue, newValue, fieldLabel } = change;
        const meta = COMPONENT_METADATA[component.type];
        const label = meta?.label || component.type || 'Component';

        let summary = `${label}: `;

        if (oldValue && newValue) {
            summary += `${fieldLabel} changed from "${oldValue}" to "${newValue}"`;
        } else if (newValue) {
            summary += `${fieldLabel} set to "${newValue}"`;
        } else {
            summary += `${fieldLabel} cleared`;
        }

        // Check if this creates new risks
        const risk = this.assessConfigRisk(component, field, newValue);
        if (risk) {
            summary += `; ${risk}`;
        }

        return summary;
    }

    summarizeAssumption(change) {
        const { component, field, assumption } = change;
        const meta = COMPONENT_METADATA[component.type];
        const label = meta?.label || component.type || 'Component';
        return `${label}: Assuming ${field} = ${assumption}`;
    }

    /**
     * Get critical undefined fields for a component
     * @param {Object} component - Component object
     * @returns {Array} - List of critical undefined field labels
     */
    getCriticalUndefinedFields(component) {
        const schema = COMPONENT_CONFIG_SCHEMA[component.type];
        if (!schema) return [];

        const criticalFields = {
            database: ['sharding_strategy', 'consistency_model', 'replication_scope'],
            cache: ['eviction_policy', 'invalidation_strategy'],
            message_queue: ['ordering_guarantee', 'delivery_guarantee'],
            service: ['scaling_strategy', 'failure_handling'],
            load_balancer: ['algorithm', 'health_check']
        };

        const critical = criticalFields[component.type] || [];

        return schema.fields
            .filter(f => critical.includes(f.key) && component.undefinedFields?.includes(f.key))
            .map(f => f.label.toLowerCase());
    }

    /**
     * Assess risk introduced by configuration change
     * @param {Object} component - Component object
     * @param {string} field - Field key
     * @param {string} value - New value
     * @returns {string|null} - Risk description or null
     */
    assessConfigRisk(component, field, value) {
        // Database risks
        if (component.type === 'database') {
            if (field === 'consistency_model' && value === 'Eventual Consistency') {
                return 'potential read-after-write issues';
            }
            if (field === 'sharding_strategy' && value === 'No Sharding') {
                return 'single point of failure';
            }
            if (field === 'replication_scope' && value === 'None') {
                return 'no fault tolerance';
            }
        }

        // Cache risks
        if (component.type === 'cache') {
            if (field === 'eviction_policy' && !value) {
                return 'memory overflow risk';
            }
            if (field === 'invalidation_strategy' && value === 'Cache-aside') {
                return 'potential stale data';
            }
        }

        // Service risks
        if (component.type === 'service') {
            if (field === 'failure_handling' && value === 'Fail Fast') {
                return 'no retry mechanism';
            }
            if (field === 'scaling_strategy' && value === 'Manual') {
                return 'manual intervention required under load';
            }
        }

        // Load balancer risks
        if (component.type === 'load_balancer') {
            if (field === 'health_check' && value === 'None') {
                return 'cannot detect failed instances';
            }
        }

        return null;
    }

    /**
     * Get all changes since last sync
     * @returns {Array} - List of change summaries
     */
    getChangesSinceLastSync() {
        if (this.lastSyncedIndex >= this.changeHistory.length) {
            return [];
        }

        const changes = this.changeHistory.slice(this.lastSyncedIndex);
        return changes.map(c => c.summary);
    }

    /**
     * Mark current changes as synced
     */
    markAsSynced() {
        this.lastSyncedIndex = this.changeHistory.length;
    }

    /**
     * Get full change history
     * @returns {Array} - All recorded changes
     */
    getAllChanges() {
        return this.changeHistory;
    }

    /**
     * Check if there are unsynced changes
     * @returns {boolean}
     */
    hasUnsyncedChanges() {
        return this.changeHistory.length > this.lastSyncedIndex;
    }

    /**
     * Get count of unsynced changes
     * @returns {number}
     */
    getUnsyncedCount() {
        return this.changeHistory.length - this.lastSyncedIndex;
    }

    /**
     * Determine if a change is significant enough to auto-sync
     * @param {Object} change - Change event
     * @returns {boolean}
     */
    isSignificantChange(change) {
        // Always significant: component add/remove, connections
        if (['component_added', 'component_removed', 'connection_added', 'connection_removed'].includes(change.type)) {
            return true;
        }

        // Config changes are significant if they affect critical fields
        if (change.type === 'config_updated') {
            const criticalFields = {
                database: ['db_type', 'sharding_strategy', 'consistency_model', 'replication_scope'],
                cache: ['cache_type', 'eviction_policy', 'invalidation_strategy'],
                message_queue: ['queue_type', 'ordering_guarantee', 'delivery_guarantee'],
                service: ['scaling_strategy', 'failure_handling'],
                load_balancer: ['algorithm', 'health_check'],
                api_gateway: ['authentication', 'rate_limiting']
            };

            const critical = criticalFields[change.component?.type] || [];
            return critical.includes(change.field);
        }

        // Assumptions are always significant
        if (change.type === 'assumption_stated') {
            return true;
        }

        return false;
    }

    /**
     * Generate a consolidated summary for multiple changes
     * @param {Array} changes - List of change summaries
     * @returns {string}
     */
    generateConsolidatedSummary(changes) {
        if (changes.length === 0) return '';
        if (changes.length === 1) return changes[0];

        return changes.join('; ');
    }

    /**
     * Generate a concise snapshot summary of the current system state
     * Optimized for LLM context (low token usage)
     * @param {Array} components 
     * @param {Array} connections 
     * @returns {string}
     */
    /**
     * Generate a concise snapshot summary of the current system state
     * Optimized for LLM context (low token usage)
     * @param {Array} components 
     * @param {Array} connections 
     * @returns {string}
     */
    /**
     * Generate a structured snapshot of the current system state
     * Optimized for LLM reasoning
     * @param {Array} components 
     * @param {Array} connections 
     * @returns {string}
     */
    summarizeState(components, connections) {
        if (!components || components.length === 0) return "Empty system design.";

        const configured = [];
        const unconfigured = [];
        const risks = [];

        components.forEach(c => {
            const description = this.getComponentDescription(c);
            const isConfigured = this.isComponentConfigured(c);

            if (isConfigured) {
                configured.push(description);
            } else {
                unconfigured.push(this.getComponentLabel(c));
            }

            // Check for risks/missing critical configs
            const criticalUndefined = this.getCriticalUndefinedFields(c);
            if (criticalUndefined.length > 0) {
                risks.push(`${this.getComponentLabel(c)} is missing: ${criticalUndefined.join(', ')}`);
            }
        });

        const flows = this.identifyFlows(components, connections);

        let summary = "";

        if (configured.length > 0) {
            summary += `Configured Components:\n- ${configured.join('\n- ')}\n\n`;
        }

        if (unconfigured.length > 0) {
            summary += `Unconfigured/Default Components: [${unconfigured.join(', ')}]\n\n`;
        }

        if (flows.length > 0) {
            summary += `Data Flows:\n- ${flows.join('\n- ')}\n\n`;
        } else {
            summary += "Data Flows: No connected flows identified.\n\n";
        }

        if (risks.length > 0) {
            summary += `Identified Risks/Missing Configs:\n- ${risks.join('\n- ')}`;
        }

        return summary.trim();
    }

    /**
     * Helper to check if a component has non-default config
     */
    isComponentConfigured(component) {
        if (!component.config) return false;
        return Object.entries(component.config).some(([key, value]) => {
            return key !== 'label' && value && value !== 'None';
        });
    }

    getComponentLabel(component) {
        const meta = COMPONENT_METADATA[component.type];
        return component.config?.label || meta?.label || component.type;
    }

    /**
     * Get detailed description of a component including critical config
     */
    getComponentDescription(component) {
        const label = this.getComponentLabel(component);
        let desc = `${label} (${component.type})`;

        // Dynamic Configuration Extraction
        const schema = COMPONENT_CONFIG_SCHEMA[component.type];
        const details = [];

        if (schema && component.config) {
            schema.fields.forEach(field => {
                const value = component.config[field.key];
                // Exclude empty values, defaults that are "None", and the label itself
                if (value && value !== 'None' && field.key !== 'label') {
                    details.push(`${field.label}: ${value}`);
                }
            });
        }

        if (details.length > 0) {
            desc += ` with ${details.join(', ')}`;
        }

        return desc;
    }

    /**
     * Identify linear data flows in the system map
     * @param {Array} components 
     * @param {Array} connections 
     * @returns {Array} List of flow strings (e.g. "Client -> LB -> Server")
     */
    identifyFlows(components, connections) {
        // 1. Build Adjacency List
        const adj = {};
        const inDegree = {};

        components.forEach(c => {
            adj[c.id] = [];
            inDegree[c.id] = 0;
        });

        connections.forEach(conn => {
            if (adj[conn.from]) {
                adj[conn.from].push(conn.to);
                inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
            }
        });

        // 2. Find Start Nodes
        // Priority: Nodes with in-degree 0
        let startNodes = components.filter(c => inDegree[c.id] === 0);

        // If strict cycle or no clear start, pick logical entry points
        if (startNodes.length === 0 && components.length > 0) {
            const priorityTypes = ['client', 'load_balancer', 'api_gateway'];
            startNodes = components.filter(c => priorityTypes.includes(c.type));

            // Still nothing? Pick the first one.
            if (startNodes.length === 0) startNodes = [components[0]];
        }

        // 3. DFS to find paths
        const flows = [];

        // Track visited nodes per path traversal to handle cycles
        const dfs = (nodeId, path, visitedIds) => {
            const node = components.find(c => c.id === nodeId);
            if (!node) return;

            const label = COMPONENT_METADATA[node.type]?.label || node.type || "Component";
            const currentPath = [...path, label];
            const currentVisited = new Set(visitedIds);
            currentVisited.add(nodeId);

            const neighbors = adj[nodeId] || [];

            // If leaf node or we've hit a cycle/limit
            if (neighbors.length === 0) {
                if (currentPath.length > 1) {
                    flows.push(currentPath.join(' -> '));
                }
                return;
            }

            let extended = false;
            neighbors.forEach(nextId => {
                // Cycle detection using IDs
                if (!currentVisited.has(nextId)) {
                    extended = true;
                    dfs(nextId, currentPath, currentVisited);
                } else {
                    // We hit a cycle!
                    // Add the cycle closing node to the visual path and stop
                    const nextNode = components.find(c => c.id === nextId);
                    const nextLabel = COMPONENT_METADATA[nextNode?.type]?.label || nextNode?.type || "Unknown";
                    const cyclePath = [...currentPath, nextLabel];
                    if (cyclePath.length > 1) {
                        flows.push(cyclePath.join(' -> '));
                    }
                }
            });

            // If we couldn't extend to any neighbor (all visited), record what we have
            if (!extended && neighbors.length > 0) {
                if (currentPath.length > 1) {
                    flows.push(currentPath.join(' -> '));
                }
            }
        };

        startNodes.forEach(node => dfs(node.id, [], new Set()));

        // De-duplicate
        return [...new Set(flows)];
    }

    /**
     * Reset tracker (useful for testing)
     */
    reset() {
        this.changeHistory = [];
        this.lastSyncedIndex = 0;
    }
}

// Export as singleton
export const designChangeTracker = new DesignChangeTracker();

// Export class for testing
export default DesignChangeTracker;
