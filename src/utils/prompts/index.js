import { softwarePrompts } from './softwarePrompts';
import { devopsPrompts } from './devopsPrompts';
import { dataAnalystPrompts } from './dataAnalystPrompts';

// Combine all role prompts here
const LEVEL_PROMPTS = {
    software: softwarePrompts,
    devops: devopsPrompts,
    dataanalyst: dataAnalystPrompts,
};

export const getSystemPrompt = (context) => {
    console.log("getSystemPrompt Context:", context);
    const { role, level, company, filter_type } = context;

    // Normalize inputs
    let roleKey = 'software'; // Default

    // Priority 1: Check filter_type explicitly
    if (filter_type) {
        // Normalize: lowercase and remove spaces (e.g. "Data Analyst" -> "dataanalyst")
        const typeKey = filter_type.toLowerCase().replace(/\s+/g, '');
        console.log("Checking filter_type:", typeKey);
        // Check if we have a prompt set for this filter type
        if (Object.keys(LEVEL_PROMPTS).some(k => typeKey.includes(k))) {
            roleKey = Object.keys(LEVEL_PROMPTS).find(k => typeKey.includes(k));
        } else if (typeKey === 'devops') {
            roleKey = 'devops';
        }
    } else {
        console.log("No filter_type, checking role:", role);
        // Priority 2: Fallback to role name matching
        roleKey = Object.keys(LEVEL_PROMPTS).find(r => role.toLowerCase().includes(r)) || 'software';
    }

    console.log("Resolved roleKey:", roleKey);

    const levelKey = level?.toLowerCase().includes('senior') ? 'senior'
        : level?.toLowerCase().includes('lead') ? 'senior'
            : level?.toLowerCase().includes('entry') ? 'entry'
                : level?.toLowerCase().includes('junior') ? 'entry'
                    : 'intermediate';

    console.log("Resolved levelKey:", levelKey);

    // Get specific prompt configuration
    // Default to intermediate text string if not found
    const promptConfig = LEVEL_PROMPTS[roleKey]?.[levelKey] || LEVEL_PROMPTS.software.intermediate;

    // Determine full prompt content
    let fullPrompt = "";

    if (typeof promptConfig === 'object' && promptConfig.type === 'full') {
        fullPrompt = promptConfig.content;
    } else if (typeof promptConfig === 'string') {
        fullPrompt = promptConfig;
    } else {
        fullPrompt = "Error: Invalid prompt configuration.";
    }

    // Replace placeholders
    Object.keys(context).forEach(key => {
        const value = context[key] || "Not specified";
        const stringValue = Array.isArray(value) ? value.join(", ") :
            typeof value === 'object' ? JSON.stringify(value) : String(value);

        // Create a regex to replace all occurrences of {{key}}
        const regex = new RegExp(`{{${key}}}`, 'g');
        fullPrompt = fullPrompt.replace(regex, stringValue);
    });

    // Default replacements for missing keys
    fullPrompt = fullPrompt.replace(/{{company}}/g, context.company || "a tech company")
        .replace(/{{role}}/g, context.role || "Software Engineer")
        .replace(/{{level}}/g, context.level || "Mid-Level")
        .replace(/{{type}}/g, context.type || "Technical");

    return fullPrompt;
};
