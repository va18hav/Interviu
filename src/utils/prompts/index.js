import { softwarePrompt, softwareDrillDeeperPrompt, softwareNextProblemJuniorPrompt } from './softwarePrompts';
import { dataAnalystPrompt, dataAnalystDrillDeeperPrompt, dataAnalystNextProblemJuniorPrompt } from './dataAnalystPrompts';
import { devopsPrompt, devopsDrillDeeperPrompt, devopsNextProblemJuniorPrompt } from './devopsPrompts';

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
    const { role } = context;

    let selectedPrompt = softwarePrompt;

    // Simple verification for Data Analyst
    if (role && role.toLowerCase().includes('data analyst')) {
        selectedPrompt = dataAnalystPrompt;
    } else if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
        selectedPrompt = devopsPrompt;
    }

    return resolveTemplate(selectedPrompt, context);
};

export const getDrillDeeperPrompt = (context) => {
    const { role } = context;

    let selectedPrompt = softwareDrillDeeperPrompt;

    if (role && role.toLowerCase().includes('data analyst')) {
        selectedPrompt = dataAnalystDrillDeeperPrompt;
    } else if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
        selectedPrompt = devopsDrillDeeperPrompt;
    }

    return resolveTemplate(selectedPrompt, context);
};

export const getNextProblemJuniorPrompt = (context) => {
    const { role } = context;

    let selectedPrompt = softwareNextProblemJuniorPrompt;

    if (role && role.toLowerCase().includes('data analyst')) {
        selectedPrompt = dataAnalystNextProblemJuniorPrompt;
    } else if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
        selectedPrompt = devopsNextProblemJuniorPrompt;
    }

    return resolveTemplate(selectedPrompt, context);
};
