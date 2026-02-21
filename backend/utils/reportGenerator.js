import Anthropic from '@anthropic-ai/sdk';
import { softwareFeedbackPrompt } from '../prompts/softwareFeedbackPrompt.js';
import { devopsFeedbackPrompt } from '../prompts/devopsFeedbackPrompt.js';
import { resolveTemplate } from '../prompts/index.js';
import { jsonrepair } from 'jsonrepair';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateInterviewReport(session, context) {
    try {
        console.log(`[ReportGenerator] Generating report for session ${session.id}...`);

        const isDevOps = context.role && (
            context.role.toLowerCase().includes('devops') ||
            context.role.toLowerCase().includes('sre') ||
            context.role.toLowerCase().includes('reliability')
        );

        const promptTemplate = isDevOps ? devopsFeedbackPrompt : softwareFeedbackPrompt;

        // Compile transcript
        const fullTranscript = session.history
            .filter(msg => msg.role !== 'system')
            .map(msg => `[${msg.role.toUpperCase()}]: ${msg.content}`)
            .join('\n\n');

        // Prepare context for prompt
        const reportContext = {
            ...context,
            company: context.company || 'the company',
            role: context.role || 'Software Engineer',
            level: context.level || 'Senior',
            round_type: context.type || 'Technical',
            interview_date: new Date().toLocaleDateString(),
            candidate_name: context.candidate_name || 'Candidate',
            full_transcript: fullTranscript,
            // Map interviewer persona details (which might use 'role' and 'level' internally)
            // to the specific interviewer_ fields used in feedback prompts
            interviewer_role: context.persona?.role || context.interviewer_role || 'Interviewer',
            interviewer_level: context.persona?.level || context.interviewer_level || 'Senior',
            ...context.problem, // problem.title, problem.statement, etc.
            ...context.flow,
            ...context.persona,
            ...context.evaluation_intelligence,
            ...context.candidate_reasoning_signals,
            ...context.evaluation
        };

        const finalPrompt = resolveTemplate(promptTemplate, reportContext);

        console.log(`[ReportGenerator] Sending to Claude...`);

        const response = await anthropic.messages.create({
            model: "claude-opus-4-6",
            max_tokens: 3000,
            temperature: 0.1,
            messages: [
                { role: "user", content: finalPrompt }
            ]
        });

        const reportText = response.content[0].text;

        // Sanitize and parse JSON
        let cleanText = reportText;

        // 1. Remove Markdown Code Blocks (if present)
        const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            cleanText = jsonMatch[1];
        } else {
            // If no code blocks, try to find the starting brace
            const firstCurly = cleanText.indexOf('{');
            if (firstCurly !== -1) {
                cleanText = cleanText.substring(firstCurly);
            }
        }

        try {
            // Use jsonrepair to fix common errors (including missing closing braces from truncation)
            const repaired = jsonrepair(cleanText);
            return JSON.parse(repaired);
        } catch (parseError) {
            console.error("[ReportGenerator] JSON Repair/Parse Error:", parseError);
            console.error("[ReportGenerator] Sanitize Content Snippet:", cleanText.substring(0, 500) + "...");
            throw new Error("Failed to parse JSON from Claude response");
        }

    } catch (error) {
        console.error("[ReportGenerator] Error generating report:", error);
        throw error;
    }
}
