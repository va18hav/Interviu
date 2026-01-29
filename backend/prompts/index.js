import { softwareCodingRoundPrompt, softwareNonCodingRoundPrompt } from './softwarePrompts.js';
import { dataAnalystCodingRoundPrompt, dataAnalystNonCodingRoundPrompt } from './dataAnalystPrompts.js';
import { devopsCodingRoundPrompt, devopsNonCodingRoundPrompt } from './devopsPropmpts.js';

// Helper to get value from context using path (e.g. "depthLevel.target" or "problemQueue[0]")
const getValue = (path, obj) => {
    return path.split(/[\.\[\]]/).filter(p => p).reduce((o, p) => o ? o[p] : undefined, obj);
};

const resolveTemplate = (template, context) => {
    return template.replace(/{{([\w\d\.\[\]]+)}}/g, (match, key) => {
        const value = getValue(key, context);
        if (value === undefined || value === null) {
            console.warn(`Template variable {{${key}}} not found in context.`);
            return `[MISSING: ${key}]`;
        }
        return Array.isArray(value) ? value.join(", ") : String(value);
    });
};

export const getSystemPrompt = (context) => {
    console.log("getSystemPrompt Context:", context);
    const { role, roundType, type } = context; // destructure type too

    const effectiveRoundType = (roundType || type || '').toLowerCase();

    // 1. Data Analyst
    if (role && role.toLowerCase().includes('data analyst')) {
        return resolveTemplate(dataAnalystCodingRoundPrompt, context);
    }

    // 2. DevOps / SRE
    if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
        let devopsSelectedPrompt = devopsCodingRoundPrompt; // Default fallback

        if (effectiveRoundType.includes('coding') || effectiveRoundType.includes('technical') || effectiveRoundType.includes('code') || effectiveRoundType.includes('debug')) {
            devopsSelectedPrompt = devopsCodingRoundPrompt;
        } else {
            devopsSelectedPrompt = devopsNonCodingRoundPrompt;
        }
        return resolveTemplate(devopsSelectedPrompt, context);
    }

    // 3. General Software Engineering (Default)
    // Select based on Round Type
    let selectedPrompt = softwareCodingRoundPrompt; // Default fallback

    const rType = effectiveRoundType.toLowerCase();

    if (rType.includes('coding') || rType.includes('technical') || rType.includes('code')) {
        selectedPrompt = softwareCodingRoundPrompt;
    } else {
        selectedPrompt = softwareNonCodingRoundPrompt;
    }

    return resolveTemplate(selectedPrompt, context);
};

// Junior prompt export removed as per requirements
