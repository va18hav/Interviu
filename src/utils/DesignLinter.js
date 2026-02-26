import { COMPONENT_TYPES, COMPONENT_METADATA } from './designComponentSchema';

/**
 * Validates the current design against architectural best practices.
 * Returns an array of issues.
 * 
 * Issue Structure:
 * {
 *   id: string,
 *   ruleId: string,
 *   severity: 'HIGH' | 'MEDIUM' | 'LOW',
 *   message: string,
 *   componentIds: string[]
 * }
 */
export const validateDesign = (components, connections) => {
    const issues = [];

    // Helper: Build adjacency list for connectivity checks
    const adjList = {};
    const revAdjList = {};
    connections.forEach(conn => {
        if (!adjList[conn.from]) adjList[conn.from] = [];
        if (!revAdjList[conn.to]) revAdjList[conn.to] = [];
        adjList[conn.from].push(conn.to);
        revAdjList[conn.to].push(conn.from);
    });

    // --- RULE 1: Direct Database Exposure (SECURITY) ---
    connections.forEach(conn => {
        const fromComp = components.find(c => c.id === conn.from);
        const toComp = components.find(c => c.id === conn.to);

        if (fromComp && toComp) {
            const fromTypes = fromComp.mergedTypes || [fromComp.type];
            const toTypes = toComp.mergedTypes || [toComp.type];

            const fromIsClient = fromTypes.some(t => COMPONENT_METADATA[t]?.category === 'Basic Infrastructure' && t === COMPONENT_TYPES.CLIENT);
            const toIsData = toTypes.some(t => COMPONENT_METADATA[t]?.category === 'Storage');

            if (fromIsClient && toIsData) {
                issues.push({
                    id: `sec-db-exposure-${conn.id}`,
                    ruleId: 'SECURITY_DB_EXPOSURE',
                    severity: 'HIGH',
                    message: `Security Risk: Client is directly accessing Database. Use a Service or API Gateway layer.`,
                    componentIds: [fromComp.id, toComp.id]
                });
            }
        }
    });

    // --- RULE 2: Single Point of Failure (RELIABILITY) ---
    components.forEach(comp => {
        const types = comp.mergedTypes || [comp.type];
        const hasCriticalCategory = types.some(t => ['Compute', 'Basic Infrastructure', 'Storage'].includes(COMPONENT_METADATA[t]?.category));

        if (hasCriticalCategory) {
            const instances = comp.config?.scale_min_instances || 1;
            const isRedundant = comp.config?.scale_type === 'Horizontal (Auto)' || parseInt(instances) > 1;

            if (parseInt(instances) < 2 && !isRedundant) {
                const label = comp.config?.label || types.map(t => COMPONENT_METADATA[t]?.label).join(' + ');
                issues.push({
                    id: `rel-spof-${comp.id}`,
                    ruleId: 'RELIABILITY_SPOF',
                    severity: 'MEDIUM',
                    message: `Potential SPOF: '${label}' has only 1 instance configured. Consider adding redundancy (Min 2 instances).`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 3: Missing Observability (OPERATIONAL) ---
    components.forEach(comp => {
        const types = comp.mergedTypes || [comp.type];
        const needsObservability = types.some(t => ['Compute', 'Basic Infrastructure'].includes(COMPONENT_METADATA[t]?.category));

        if (needsObservability) {
            const connectedToObservability = (adjList[comp.id] || []).some(targetId => {
                const target = components.find(c => c.id === targetId);
                const targetTypes = target?.mergedTypes || (target?.type ? [target.type] : []);
                return targetTypes.some(tt => COMPONENT_METADATA[tt]?.category === 'Observability');
            });

            if (!connectedToObservability) {
                const label = comp.config?.label || types.map(t => COMPONENT_METADATA[t]?.label).join(' + ');
                issues.push({
                    id: `ops-no-obs-${comp.id}`,
                    ruleId: 'OPS_NO_OBSERVABILITY',
                    severity: 'LOW',
                    message: `Missing Observability: '${label}' has no connected logging or metrics pipeline.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 4: Unbounded Queue & Spike Protection (RELIABILITY) ---
    components.forEach(comp => {
        const types = comp.mergedTypes || [comp.type];
        const hasQueue = types.some(t => t === COMPONENT_TYPES.MESSAGE_QUEUE || t === COMPONENT_TYPES.STREAM_PROCESSING);

        if (hasQueue) {
            // Check neighbors for DLQ or Backpressure
            const neighbors = [...(adjList[comp.id] || []), ...(revAdjList[comp.id] || [])];
            const hasProtection = neighbors.some(targetId => {
                const target = components.find(c => c.id === targetId);
                const targetTypes = target?.mergedTypes || (target?.type ? [target.type] : []);
                return targetTypes.some(tt => tt === COMPONENT_TYPES.DEAD_LETTER_QUEUE || tt === COMPONENT_TYPES.BACKPRESSURE_CONTROLLER);
            });

            if (!hasProtection) {
                const label = comp.config?.label || types.map(t => COMPONENT_METADATA[t]?.label).join(' + ');
                issues.push({
                    id: `rel-queue-protection-${comp.id}`,
                    ruleId: 'RELIABILITY_UNPROTECTED_QUEUE',
                    severity: 'MEDIUM',
                    message: `Queue lacks spike protection: '${label}' is not connected to a Dead Letter Queue or Backpressure Controller. Configured retention might still overflow under massive spikes.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 5: No Rate Limiting (PROTECTION) ---
    components.forEach(comp => {
        const types = comp.mergedTypes || [comp.type];
        const hasGateway = types.some(t => t === COMPONENT_TYPES.API_GATEWAY);

        if (hasGateway) {
            const rateLimit = comp.config?.rate_limiting;
            if (!rateLimit || rateLimit === 'None') {
                const label = comp.config?.label || types.map(t => COMPONENT_METADATA[t]?.label).join(' + ');
                issues.push({
                    id: `sec-no-ratelimit-${comp.id}`,
                    ruleId: 'SECURITY_NO_RATELIMIT',
                    severity: 'MEDIUM',
                    message: `No Rate Limiting: '${label}' is unprotected from traffic spikes. Configure rate limits.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    return issues;
};
