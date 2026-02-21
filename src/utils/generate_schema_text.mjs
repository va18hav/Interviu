import fs from 'fs';
import { COMPONENT_CONFIG_SCHEMA, CONNECTION_CONFIG_SCHEMA, COMPONENT_METADATA } from './designComponentSchema.js';

function generateText() {
    let output = [];

    output.push("AVAILABLE CONFIGURATIONS (REFERENCE)");
    output.push("Use these specific fields to ground your questions. If a candidate uses a component, check if they set these fields.");
    output.push("");

    // 1. Connections
    output.push("[Connections]");
    CONNECTION_CONFIG_SCHEMA.fields.forEach(field => {
        let options = "";
        if (field.options) {
            options = `: ${field.options.join(', ')}`;
        }
        output.push(`- ${field.label}${options}`);
    });
    output.push("");

    // 2. Components
    for (const [type, config] of Object.entries(COMPONENT_CONFIG_SCHEMA)) {
        const metadata = COMPONENT_METADATA[type];
        const name = metadata ? metadata.label : type;

        output.push(`[${name}]`);

        config.fields.forEach(field => {
            let options = "";
            if (field.options) {
                // Limit to 6-7 options to avoid huge lines, or just list all?
                // The user wants ALL.
                options = `: ${field.options.join(', ')}`;
            } else if (field.placeholder) {
                options = `: e.g. ${field.placeholder}`;
            }
            output.push(`- ${field.label}${options}`);
        });
        output.push("");
    }

    fs.writeFileSync('temp_schema_output.txt', output.join('\n'));
}

generateText();
