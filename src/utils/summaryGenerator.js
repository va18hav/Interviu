/**
 * Generates semantic summaries for system design changes
 */
import { COMPONENT_METADATA } from './designComponentSchema';

export const generateConnectionSummary = (oldConn, newConn, components) => {
    const fromComp = components.find(c => c.id === newConn.from);
    const toComp = components.find(c => c.id === newConn.to);

    const fromName = fromComp?.config?.label || fromComp ? COMPONENT_METADATA[fromComp.type]?.label : 'Unknown';
    const toName = toComp?.config?.label || toComp ? COMPONENT_METADATA[toComp.type]?.label : 'Unknown';

    const changes = [];
    const oldConfig = oldConn?.config || {};
    const newConfig = newConn.config || {};

    // Detect Transport Changes
    if (newConfig.interaction_type !== oldConfig.interaction_type) {
        changes.push(`set to ${newConfig.interaction_type || 'default interaction'}`);
    }
    if (newConfig.protocol !== oldConfig.protocol) {
        changes.push(`using protocol ${newConfig.protocol}`);
    }
    if (newConfig.timeout !== oldConfig.timeout && newConfig.timeout) {
        changes.push(`with ${newConfig.timeout} timeout`);
    }

    // Detect Reliability Changes
    if (newConfig.circuit_breaker !== oldConfig.circuit_breaker) {
        changes.push(`Circuit Breaker ${newConfig.circuit_breaker}`);
    }
    if (newConfig.retries !== oldConfig.retries && newConfig.retries !== 'None') {
        changes.push(`Retry Policy: ${newConfig.retries}`);
    }

    if (changes.length === 0) return null;

    return `${fromName} → ${toName} connection: ${changes.join(', ')}`;
};

export const generateComponentSummary = (oldComp, newComp) => {
    const changes = [];
    const oldConfig = oldComp?.config || {};
    const newConfig = newComp.config || {};
    const label = newConfig.label || COMPONENT_METADATA[newComp.type]?.label;

    // State Changes
    if (newConfig.st_type !== oldConfig.st_type) {
        changes.push(`marked as ${newConfig.st_type}`);
    }
    if (newConfig.st_replication !== oldConfig.st_replication) {
        changes.push(`replication: ${newConfig.st_replication}`);
    }

    // Workload Changes
    if (newConfig.wl_baseline_rps !== oldConfig.wl_baseline_rps) {
        changes.push(`Baseline RPS set to ${newConfig.wl_baseline_rps}`);
    }
    if (newConfig.wl_burst_multiplier !== oldConfig.wl_burst_multiplier) {
        changes.push(`Burst Multiplier: ${newConfig.wl_burst_multiplier}`);
    }

    // Scaling Changes
    if (newConfig.scale_type !== oldConfig.scale_type) {
        changes.push(`Scaling: ${newConfig.scale_type}`);
    }
    if (newConfig.scale_max_instances !== oldConfig.scale_max_instances) {
        changes.push(`Max Instances: ${newConfig.scale_max_instances}`);
    }

    if (changes.length === 0) return null;

    return `${label} updated: ${changes.join('; ')}`;
};
