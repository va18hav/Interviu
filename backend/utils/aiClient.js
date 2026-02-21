
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { jsonrepair } from 'jsonrepair';
dotenv.config();


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Compiles a scenario using Claude.
 * @param {string} systemPrompt - The specialized compiler prompt.
 * @param {string} userContext - The structured inputs from the user form.
 * @param {string} model - The model to use (default: claude-opus-4-6).
 * @returns {Promise<Object>} - The parsed JSON round data.
 */
export async function compileScenario(systemPrompt, userContext, model = 'claude-opus-4-6') {
  console.log(`[ScenarioCompiler] Compiling with model: ${model}`);
  try {
    const message = await anthropic.messages.create({
      model: model,
      max_tokens: 4000, // Increased to support full code file generation
      temperature: 0.1, // Low temp for structured output adherence
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userContext // The formatted string of all form inputs
        }
      ]
    });


    const responseText = message.content[0].text;

    // Sanitize and parse JSON
    let cleanText = responseText;

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

    // 2. Remove comments (// ...) but be careful not to remove urls in strings
    // JSON5 handles comments! So we don't need to strip them.
    // However, we still need to strip surrounding text if any.
    // We do NOT truncate at the last '}' because that might be inside a code string if the output was truncated.
    // We let jsonrepair handle the missing closing braces.

    try {
      // Use jsonrepair to fix common errors (including missing closing braces from truncation)
      // jsonrepair takes a string strings and returns valid JSON string
      const repaired = jsonrepair(cleanText);
      return JSON.parse(repaired);
    } catch (parseError) {
      console.error("JSON Repair/Parse Error:", parseError);
      console.error("Sanitized Content:", cleanText.substring(0, 500) + "...");
      throw new Error("Failed to parse AI response even with repair");
    }


  } catch (error) {
    console.error("Error in compileScenario:", error);
    throw error;
  }
}
