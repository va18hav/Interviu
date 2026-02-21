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
    connections.forEach(conn => {
        if (!adjList[conn.from]) adjList[conn.from] = [];
        adjList[conn.from].push(conn.to);
    });

    // --- RULE 1: Direct Database Exposure (SECURITY) ---
    // Architecture Anti-Pattern: Client -> Database
    connections.forEach(conn => {
        const fromComp = components.find(c => c.id === conn.from);
        const toComp = components.find(c => c.id === conn.to);

        if (fromComp && toComp) {
            const fromMeta = COMPONENT_METADATA[fromComp.type];
            const toMeta = COMPONENT_METADATA[toComp.type];

            if (fromMeta?.category === 'client' && toMeta?.category === 'data') {
                issues.push({
                    id: `sec-db-exposure-${conn.id}`,
                    ruleId: 'SECURITY_DB_EXPOSURE',
                    severity: 'HIGH',
                    message: `Security Risk: Client '${fromMeta.label}' is directly accessing Database '${toMeta.label}'. Use a Service or API Gateway layer.`,
                    componentIds: [fromComp.id, toComp.id]
                });
            }
        }
    });

    // --- RULE 2: Single Point of Failure (RELIABILITY) ---
    // Components that should be redundant but aren't
    components.forEach(comp => {
        const type = comp.type;
        const meta = COMPONENT_METADATA[type];

        // Skip clients, queues, CDNs for simple SPOF check (though queues can be SPOF, usually managed)
        if (['service', 'gateway', 'data'].includes(meta?.category)) {
            // Check 'instances' or 'redundancy' config
            const instances = comp.config?.instances || 1;
            const isRedundant = comp.config?.redundancy === true || comp.config?.redundancy === 'active-passive';

            // If instances is explicit and < 2, FLAG IT
            // Note: We need to check if schema HAS instances field to avoid false positives on simple nodes
            if (instances < 2 && !isRedundant) {
                issues.push({
                    id: `rel-spof-${comp.id}`,
                    ruleId: 'RELIABILITY_SPOF',
                    severity: 'MEDIUM',
                    message: `Potential SPOF: '${meta.label}' has only 1 instance configured. Consider adding redundancy (Min 2 instances).`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 3: Missing Observability (OPERATIONAL) ---
    // Services should have logging/metrics or be connected to an Observability tool
    components.forEach(comp => {
        const meta = COMPONENT_METADATA[comp.type];
        if (meta?.category === 'service' || meta?.category === 'gateway') {
            // Check connection to Observability components
            const connectedToObservability = (adjList[comp.id] || []).some(targetId => {
                const target = components.find(c => c.id === targetId);
                return COMPONENT_METADATA[target?.type]?.category === 'observability';
            });

            const hasConfiguredLogs = comp.config?.logging_enabled === true;

            if (!connectedToObservability && !hasConfiguredLogs) {
                issues.push({
                    id: `ops-no-obs-${comp.id}`,
                    ruleId: 'OPS_NO_OBSERVABILITY',
                    severity: 'LOW',
                    message: `Missing Observability: '${meta.label}' has no connected logging or metrics pipeline.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 4: Unbounded Queue (RELIABILITY) ---
    components.forEach(comp => {
        if (comp.type === COMPONENT_TYPES.QUEUE || comp.type === COMPONENT_TYPES.STREAM) {
            const retention = comp.config?.retention_period;
            const maxSize = comp.config?.max_message_size;

            // If completely default/undefined
            if (!retention && !maxSize) {
                issues.push({
                    id: `rel-unbounded-queue-${comp.id}`,
                    ruleId: 'RELIABILITY_UNBOUNDED_QUEUE',
                    severity: 'MEDIUM',
                    message: `Unbounded Queue/Stream: '${COMPONENT_METADATA[comp.type].label}' needs retention or size limits to prevent overflow.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    // --- RULE 5: No Rate Limiting (PROTECTION) ---
    components.forEach(comp => {
        if (comp.type === COMPONENT_TYPES.API_GATEWAY) {
            const rateLimit = comp.config?.rate_limit;
            if (!rateLimit) {
                issues.push({
                    id: `sec-no-ratelimit-${comp.id}`,
                    ruleId: 'SECURITY_NO_RATELIMIT',
                    severity: 'MEDIUM',
                    message: `No Rate Limiting: API Gateway is unprotected from traffic spikes. Configure rate limits.`,
                    componentIds: [comp.id]
                });
            }
        }
    });

    return issues;
};
