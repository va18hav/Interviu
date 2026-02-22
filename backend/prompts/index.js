import { softwareCodingRoundPrompt, softwareBehavioralRoundPrompt, softwareDebugRoundPrompt, softwareDesignRoundPrompt } from './softwarePrompts.js';
import { dataAnalystCodingRoundPrompt, dataAnalystNonCodingRoundPrompt } from './dataAnalystPrompts.js';
import { devopsCodingRoundPrompt, devopsDebugRoundPrompt, devopsDesignRoundPrompt, devopsBehavioralRoundPrompt } from './devopsPrompts.js';
import {
    customSoftwareCodingRoundPrompt,
    customSoftwareDebugRoundPrompt,
    customSoftwareDesignRoundPrompt,
    customSoftwareBehavioralRoundPrompt
} from './customSoftwarePrompts.js';
import {
    customDevopsCodingRoundPrompt,
    customDevopsDesignRoundPrompt,
    customDevopsBehavioralRoundPrompt,
    customDevopsDebugRoundPrompt
} from './customDevopsPrompts.js';

// Helper to get value from context using path (e.g. "depthLevel.target" or "problemQueue[0]")
const getValue = (path, obj) => {
    return path.split(/[\.\[\]]/).filter(p => p).reduce((o, p) => o ? o[p] : undefined, obj);
};

import Handlebars from 'handlebars';

export const resolveTemplate = (template, context) => {
    try {
        const compiled = Handlebars.compile(template);
        return compiled(context);
    } catch (error) {
        console.error("Handlebars Error:", error);
        // Fallback to simple replace if Handlebars fails
        return template.replace(/{{([\w\d\.\[\]]+)}}/g, (match, key) => {
            const keys = key.split(/[\.\[\]]/).filter(p => p);
            const value = keys.reduce((o, p) => o ? o[p] : undefined, context);
            return value !== undefined && value !== null ? String(value) : match;
        });
    }
};

export const getSystemPrompt = (context) => {
    console.log("getSystemPrompt Context:", context);

    // Create a local context to avoid mutating the original
    const templateContext = { ...context };

    // Format files into a readable string if they exist as an object
    // This prevents [object Object] in the final prompt
    const filesObj = templateContext.files || templateContext.initial_files;
    if (filesObj && typeof filesObj === 'object') {
        let filesStr = '';
        for (const [filename, content] of Object.entries(filesObj)) {
            filesStr += `\n--- File: ${filename} ---\n${content}\n`;
        }
        templateContext.files = filesStr;
    }

    const { role, roundType, type } = templateContext;

    const effectiveRoundType = (roundType || type || '').toLowerCase();

    // 0. Custom Interviews — route to custom prompts
    if (context.customInterview) {
        const isDevops = role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'));

        let customPrompt;
        if (isDevops) {
            if (effectiveRoundType.includes('coding') || effectiveRoundType.includes('technical') || effectiveRoundType.includes('code')) {
                customPrompt = customDevopsCodingRoundPrompt;
            } else if (effectiveRoundType.includes('design')) {
                customPrompt = customDevopsDesignRoundPrompt;
            } else if (effectiveRoundType.includes('behavioral') || effectiveRoundType.includes('behavior')) {
                customPrompt = customDevopsBehavioralRoundPrompt;
            } else if (effectiveRoundType.includes('debug')) {
                // Route to custom DevOps debug prompt
                customPrompt = customDevopsDebugRoundPrompt;
            } else {
                customPrompt = customDevopsCodingRoundPrompt;
            }
        } else {
            if (effectiveRoundType.includes('coding') || effectiveRoundType.includes('technical') || effectiveRoundType.includes('code')) {
                customPrompt = customSoftwareCodingRoundPrompt;
            } else if (effectiveRoundType.includes('design')) {
                customPrompt = customSoftwareDesignRoundPrompt;
            } else if (effectiveRoundType.includes('behavioral') || effectiveRoundType.includes('behavior')) {
                customPrompt = customSoftwareBehavioralRoundPrompt;
            } else if (effectiveRoundType.includes('debug')) {
                customPrompt = customSoftwareDebugRoundPrompt;
            } else {
                customPrompt = customSoftwareCodingRoundPrompt;
            }
        }
        return resolveTemplate(customPrompt, templateContext);
    }

    // 1. Data Analyst
    if (role && role.toLowerCase().includes('data analyst')) {
        return resolveTemplate(dataAnalystCodingRoundPrompt, templateContext);
    }

    // 2. DevOps / SRE
    if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
        let devopsSelectedPrompt = devopsCodingRoundPrompt; // Default fallback

        if (effectiveRoundType.includes('coding') || effectiveRoundType.includes('technical') || effectiveRoundType.includes('code')) {
            devopsSelectedPrompt = devopsCodingRoundPrompt;
        } else if (effectiveRoundType.includes('behavioral') || effectiveRoundType.includes('behavior')) {
            devopsSelectedPrompt = devopsBehavioralRoundPrompt;
        } else if (effectiveRoundType.includes('design') || effectiveRoundType.includes('system design')) {
            devopsSelectedPrompt = devopsDesignRoundPrompt;
        } else if (effectiveRoundType.includes('debug') || effectiveRoundType.includes('debugging')) {
            devopsSelectedPrompt = devopsDebugRoundPrompt;
        }
        return resolveTemplate(devopsSelectedPrompt, templateContext);
    }

    // 3. General Software Engineering (Default)
    // Select based on Round Type
    let selectedPrompt = softwareCodingRoundPrompt; // Default fallback

    const rType = effectiveRoundType.toLowerCase();

    if (rType.includes('coding') || rType.includes('technical') || rType.includes('code')) {
        selectedPrompt = softwareCodingRoundPrompt;
    } else if (rType.includes('behavioral') || rType.includes('behavior')) {
        selectedPrompt = softwareBehavioralRoundPrompt;
    } else if (rType.includes('debug') || rType.includes('debugging')) {
        selectedPrompt = softwareDebugRoundPrompt;
    } else if (rType.includes('design') || rType.includes('system design')) {
        selectedPrompt = softwareDesignRoundPrompt;
    }

    return resolveTemplate(selectedPrompt, templateContext);
};

// Junior prompt export removed as per requirements
