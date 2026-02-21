import { COMPONENT_METADATA } from './designComponentSchema';

/**
 * Architecture Intelligence Engine
 * Analyzes the system design graph to generate semantic understanding.
 */

// Build an adjacency list and object lookup from raw canvas data
const buildGraph = (components, connections) => {
    const adj = {};
    const revAdj = {}; // Reverse adjacency for finding dependencies
    const nodeMap = {};

    components.forEach(c => {
        adj[c.id] = [];
        revAdj[c.id] = [];
        nodeMap[c.id] = c;
    });

    connections.forEach(conn => {
        // Only valid connections where both ends exist
        if (adj[conn.from] && nodeMap[conn.to]) {
            adj[conn.from].push(conn.to);
        }
        if (revAdj[conn.to] && nodeMap[conn.from]) {
            revAdj[conn.to].push(conn.from);
        }
    });

    return { adj, revAdj, nodeMap };
};

// Identify critical paths starting from Clients
const findUserFlows = (graph, components) => {
    const clients = components.filter(c => c.type === 'client');
    const flows = [];

    // Simple DFS to find paths
    const dfs = (nodeId, path, visited) => {
        const node = graph.nodeMap[nodeId];
        const label = COMPONENT_METADATA[node.type]?.label || node.type;
        const newPath = [...path, label];

        // If it's a leaf node (no outgoing connections) or we've gone deep enough
        if (!graph.adj[nodeId] || graph.adj[nodeId].length === 0 || path.length > 5) {
            flows.push(newPath.join(' -> '));
            return;
        }

        let extended = false;
        graph.adj[nodeId].forEach(neighborId => {
            if (!visited.has(neighborId)) {
                extended = true;
                visited.add(neighborId);
                dfs(neighborId, newPath, visited);
                visited.delete(neighborId);
            } else {
                // Cycle detected - add the closing node to show the loop
                const neighborNode = graph.nodeMap[neighborId];
                const neighborLabel = COMPONENT_METADATA[neighborNode.type]?.label || neighborNode.type;
                const cyclePath = [...newPath, neighborLabel];
                flows.push(cyclePath.join(' -> '));
                extended = true; // Treated as extended effectively
            }
        });

        // If we have neighbors but couldn't extend (all visited - strictly shouldn't happen with the else block above, 
        // but good for safety if we change logic), OR if we simply want to capture the path so far if it's a valid end of a sub-branch?
        // Actually the else block handles the cycle report.
        // What if we just stop? 
        // The original logic pushed only at leaves.
        // With check above:
        // 1. Leaf -> pushed at start of function.
        // 2. Cycle -> pushed in else block.
        // 3. Normal path -> recursive call.
        // Seems correct.
    };

    clients.forEach(client => {
        dfs(client.id, [], new Set([client.id]));
    });

    return [...new Set(flows)]; // Dedup
};

// Detect Single Points of Failure
const detectSPOFs = (components) => {
    // Logic: Look for components that are single instances where redundancy is expected
    const spofs = [];

    components.forEach(c => {
        const type = c.type;
        const config = c.config || {};

        // Critical infra that usually needs redundancy
        const criticalTypes = ['load_balancer', 'database', 'service', 'api_gateway'];

        if (criticalTypes.includes(type)) {
            // Check config for redundancy
            const isRedundant =
                (config.scale_type && config.scale_type.includes('Horizontal')) ||
                (config.rel_redundancy && !config.rel_redundancy.includes('None')) ||
                (config.replication_scope && !config.replication_scope.includes('Single'));

            if (!isRedundant) {
                // Also check implicit redundancy (multiple nodes of same type? tough to say without more context, assume config is truth)
                spofs.push(`${COMPONENT_METADATA[type]?.label || type} (ID: ${c.id.slice(0, 4)})`);
            }
        }
    });

    return spofs;
};

// Generate a natural language summary
export const generateArchitectureSummary = (components, connections) => {
    if (!components || components.length === 0) return "Empty Canvas";

    const graph = buildGraph(components, connections);
    const flows = findUserFlows(graph, components);
    const spofs = detectSPOFs(components);

    // Group components by category
    const counts = {};
    components.forEach(c => {
        const meta = COMPONENT_METADATA[c.type];
        const category = meta?.category || 'Other';
        counts[category] = (counts[category] || 0) + 1;
    });

    let summary = `System Architecture Overview:\n`;

    // 1. High-level Composition
    summary += `- Components: ${components.length} nodes across ${Object.keys(counts).length} layers.\n`;
    Object.entries(counts).forEach(([cat, count]) => {
        summary += `  - ${cat}: ${count}\n`;
    });

    // 2. Key Flows
    if (flows.length > 0) {
        summary += `- Detected User Flows:\n`;
        flows.slice(0, 3).forEach(f => summary += `  - ${f}\n`); // Limit to top 3
        if (flows.length > 3) summary += `  - ...and ${flows.length - 3} more paths.\n`;
    } else {
        summary += `- No complete user flows detected (Connecting clients to services).\n`;
    }

    // 3. Reliability Analysis
    if (spofs.length > 0) {
        summary += `- Reliability Risks (Potential SPOFs): ${spofs.join(', ')}.\n`;
    } else {
        summary += `- No obvious Single Points of Failure detected based on configuration.\n`;
    }

    // 4. Observability Coverage
    const obsComponents = components.filter(c => {
        const conf = c.config || {};
        return conf.obs_metrics_enabled === 'Yes';
    });
    const obsCoverage = Math.round((obsComponents.length / components.length) * 100);
    summary += `- Observability Coverage: ${obsCoverage}% of components emitting metrics.\n`;

    return summary;
};
