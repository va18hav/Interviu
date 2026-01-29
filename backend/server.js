import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk' // Import Groq SDK
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getSystemPrompt } from './prompts/index.js';

async function extractTextFromPDF(pdfBuffer) {
    const data = new Uint8Array(pdfBuffer);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(" ") + "\n";
    }
    return fullText;
}

dotenv.config()
const app = express()
const PORT = 5000

// Initialize Supabase (Use env vars in production)
// Using front-end keys temporarily as per plan, but ideally should be in backend .env
const supabaseUrl = 'https://nfgforfzxarpjauiycar.supabase.co';
const supabaseKey = 'sb_publishable_3jcEXhWkwMXxLHIyzP2b9w_90EUHSUf';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Groq with your API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }))

// Validation Schemas
const feedbackSchema = z.object({
    formattedTranscript: z.string().min(1, "Transcript is required"),
    role: z.string().optional(),
    level: z.string().optional(),
    focus: z.string().optional(),
    company: z.string().optional().nullable(),
    roundTitle: z.string().optional().nullable(),
    roundType: z.string().optional().nullable(),
    expectedDepth: z.any().optional()
});

const resumeSchema = z.object({
    pdfBase64: z.string().min(1, "PDF data is required"),
    jobRole: z.string().optional(),
    jobDescription: z.string().optional()
});

// Validation Middleware
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ error: err.errors });
    }
};

// Fixed: The route path should just be the endpoint, not the full URL
// SECURE: End Interview (Generate Feedback + Deduct Credits + Save)
app.post('/api/end-interview', async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Create authenticated Supabase client for this request
        const supabaseUser = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        });

        const {
            userId,
            formattedTranscript,
            durationSeconds,
            role,
            level,
            focus,
            company,
            roundTitle,
            roundType,
            roundId,
            roundKey,
            customInterview
        } = req.body;

        if (!userId || !formattedTranscript) {
            return res.status(400).json({ error: "Missing required fields: userId, formattedTranscript" });
        }

        // 1. Calculate Cost & Deduct Credits
        const durationInMinutes = Math.ceil(durationSeconds / 60);
        const creditCost = durationInMinutes > 0 ? durationInMinutes : 1;

        // Fetch profile
        const { data: profile, error: profileError } = await supabaseUser
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.error("Error fetching profile for deduction:", profileError);
            return res.status(500).json({ error: "Failed to verify user profile" });
        }

        // Deduct credits (allow going to 0, but not negative ideally, though simple subtraction is fine)
        const newBalance = Math.max(0, profile.credits - creditCost);

        const { error: updateError } = await supabaseUser
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

        if (updateError) {
            console.error("Error deducting credits:", updateError);
            // proceed? or fail? Faking it? blocking is safer.
            return res.status(500).json({ error: "Failed to process credits" });
        }

        console.log(`Deducted ${creditCost} credits for user ${userId}. New balance: ${newBalance}`);


        // 2. Generate Feedback (Groq)
        const promptContext = `
Role: ${role}
Level: ${level}
Focus Area(s): ${focus}
Company (if applicable): ${company || 'Not specified'}
Round Type (if applicable): ${roundType || 'Not specified'}
Round Title (if applicable): ${roundTitle || 'Not specified'}

Transcript:
${formattedTranscript}
`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a Senior Technical Hiring Committee Member at a top technology company.

Your responsibility is to evaluate interview performance conservatively and realistically.

KEY INSTRUCTION ON TRANSCRIPTION ERRORS & DATA SANITY:
- This is a Voice-to-Text transcript. It frequently contains:
  1. Phonetic errors (e.g., "Java Script", "Sequel" for SQL).
  2. Context-breaking typos (e.g., "thread" becomes "bread", "react" becomes "re-act", or completely unrelated words).
  3. Missing negatives (e.g., "can" instead of "can't").
- INTELLIGENT RECONSTRUCTION: You must actively reconstruct the likely intended meaning based on the *technical consistency* of the candidate's argument.
- If a candidate suddenly says something illogical that contradicts their previous valid points, ASSUME it is a transcription error, NOT a knowledge gap.
- DO NOT penalize for these artifacts.
- ONLY penalize if the error is structural (e.g., they repeatedly explain a concept incorrectly in different words, confirming it's not a typo).

EVALUATION RUBRIC:
- WEAK/INSUFFICIENT: Unable to explain core concepts, consistently wrong, or needed heavy hand-holding.
- BASIC/BORDERLINE: Can explain "what" but not "step-by-step how" or "why". Rehearsed textbook answers without depth.
- SOLID/ACCEPTABLE: Clear, correct, and complete explanations. Understands trade-offs. (Industry Standard Hire).
- STRONG: Demonstrates deep expertise, edge cases to considerations, system optimizations, and proactive driving of the discussion.

STRICT RULES:
- BE PRECISE: Evidence must be specific quotes or behaviors.
- BE CONCISE: Get straight to the point. No fluff.
- Use the full range of ratings. Do not default to "Solid" or "Acceptable" if the candidate was merely purely functional (which is often just "Basic").`
                },
                {
                    role: "user",
                    content: `"Evaluate the following mock interview based on the context provided.

${promptContext}

OUTPUT FORMAT (JSON ONLY):
{
  "technicalKnowledge": "insufficient | basic | solid | strong",
  "technicalEvidence": "Concise proof (max 2 sentences)",

  "problemSolving": "insufficient | basic | solid | strong",
  "problemSolvingEvidence": "Concise proof (max 2 sentences)",

  "communicationClarity": "low | moderate | high",
  "communicationEvidence": "Concise proof (max 2 sentences)",

  "confidenceSignal": "low | moderate | high",
  "confidenceEvidence": "Concise proof (max 2 sentences)",

  "interviewerInterventionNeeded": true | false,
  "genericResponsesObserved": true | false,

  "overallAssessment": "weak | borderline | acceptable | strong",

  "keyStrengths": [
    "Precise strength 1",
    "Precise strength 2"
  ],

  "areasToImprove": [
    "Specific actionable feedback 1",
    "Specific actionable feedback 2",
    "Specific actionable feedback 3"
  ],

  "summary": "A precise, professional hiring recommendation paragraph (max 3-4 sentences)."
}"`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const feedbackText = chatCompletion.choices[0]?.message?.content;
        if (!feedbackText) throw new Error('No feedback generated from Groq');

        const feedback = JSON.parse(feedbackText);

        // --- DERIVE NUMERIC SCORES ---
        const assessmentScoreMap = { weak: 45, borderline: 58, acceptable: 68, strong: 78 };
        const skillScoreMap = { insufficient: 30, basic: 50, solid: 70, strong: 88, low: 40, moderate: 65, high: 85 };

        const overallScore = assessmentScoreMap[feedback.overallAssessment] || 50;

        const derivedFeedback = {
            ...feedback,
            overallScore: overallScore,
            technicalKnowledgeScore: skillScoreMap[feedback.technicalKnowledge] || 50,
            problemSolvingScore: skillScoreMap[feedback.problemSolving] || 50,
            communicationSkillsScore: skillScoreMap[feedback.communicationClarity] || 50,
            confidenceLevelScore: skillScoreMap[feedback.confidenceSignal] || 50,
            technicalKnowledgeJustification: feedback.technicalEvidence,
            problemSolvingJustification: feedback.problemSolvingEvidence,
            communicationSkillsJustification: feedback.communicationEvidence,
            confidenceLevelJustification: feedback.confidenceEvidence,
            jobReadyScore: Math.round(
                ((skillScoreMap[feedback.technicalKnowledge] || 50) +
                    (skillScoreMap[feedback.problemSolving] || 50) +
                    (skillScoreMap[feedback.communicationClarity] || 50) +
                    (skillScoreMap[feedback.confidenceSignal] || 50)) / 4
            ),
            jobReadyScoreJustification: "Composite score based on technical, problem solving, communication, and confidence signals."
        };

        // 3. Save to Supabase (Server-side)

        // Handle Retry Logic (Delete previous attempts for same round/company if applicable)
        if ((roundId || roundKey) && company) {
            const rKey = roundKey || roundId;
            // Note: Efficiently clean up old records for this specific round type
            // We search for existing interviews that match current criteria
            // Since storing logic in one column JSONB is hard to query perfectly without index, 
            // we'll rely on client deleting? NO. We must do it here. 
            // But we don't have easy access to inspect JSONB efficiently unless we pull all? 
            // Actually, we can fetch all user's interviews for this role and filter in JS, same as frontend did.
            // OR we can skip this "Delete Previous" logic if we just want to keep history? 
            // The frontend logic was: "Delete existing attempt for this round if exists (Retry logic)"
            // Let's implement it for consistency.

            const { data: existingInterviews } = await supabaseUser
                .from('interviews')
                .select('id, feedback_data')
                .eq('user_id', userId)
                .eq('role', role);

            if (existingInterviews && existingInterviews.length > 0) {
                const idsToDelete = existingInterviews
                    .filter(i => i.feedback_data?.roundKey === rKey && i.feedback_data?.company === company)
                    .map(i => i.id);

                if (idsToDelete.length > 0) {
                    await supabaseUser.from('interviews').delete().in('id', idsToDelete);
                    console.log("Deleted previous attempts:", idsToDelete);
                }
            }
        }

        // Enhance feedback with metadata for storage
        if (roundId || roundKey) {
            derivedFeedback.roundKey = roundKey || roundId;
        }
        if (company) {
            derivedFeedback.company = company;
        }

        const newInterview = {
            user_id: userId,
            role: role || "General",
            date: new Date().toLocaleDateString(),
            duration: `${durationInMinutes} min`,
            score: overallScore,
            feedback_data: derivedFeedback,
            // created_at is auto
        };

        const { data: insertedData, error: insertError } = await supabaseUser
            .from('interviews')
            .insert([newInterview])
            .select()
            .single();

        if (insertError) {
            console.error("Error saving interview:", insertError);
            return res.status(500).json({ error: "Feedback generated but failed to save record." });
        }

        console.log("Interview saved successfully:", insertedData.id);

        res.json(derivedFeedback);

    } catch (error) {
        console.error('Groq/Server Error:', error);
        res.status(500).json({ error: 'Failed to process interview completion' });
    }
});

// SECURE: Deduct Credits Only (For manual stops / early exits without feedback)
app.post('/api/deduct-credits', async (req, res) => {
    try {
        const { userId, durationSeconds } = req.body;

        if (!userId || durationSeconds === undefined) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const durationInMinutes = Math.ceil(durationSeconds / 60);
        const creditCost = durationInMinutes > 0 ? durationInMinutes : 1;

        // Fetch profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return res.status(500).json({ error: "Profile not found" });
        }

        const newBalance = Math.max(0, profile.credits - creditCost);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

        if (updateError) {
            return res.status(500).json({ error: "Failed to update credits" });
        }

        console.log(`(Manual Stop) Deducted ${creditCost} credits for user ${userId}.`);
        res.json({ success: true, newBalance });

    } catch (err) {
        console.error("Error deducting credits:", err);
        res.status(500).json({ error: "Internal Error" });
    }
});

// SECURE: Update Profile Endpoint
app.post('/api/update-profile', async (req, res) => {
    try {
        const { userId, updates } = req.body;

        if (!userId || !updates) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Whitelist allowed fields to prevent 'credits' manipulation
        const allowedFields = ['firstName', 'lastName', 'role', 'experience_level', 'skills', 'onboarding_completed'];
        const filteredUpdates = {};

        // Map allowed fields to DB columns if necessary, or just pass through if names match
        // DB columns: role, experience_level, skills, onboarding_completed.
        // firstName/lastName are usually in auth.users metadata, but if we have them in profiles?
        // Checking ProfileSettings.jsx: it updates auth metadata for names, and profiles table for role/exp/skills.
        // Onboarding.jsx updates profiles: role, experience_level, skills, onboarding_completed.

        if (updates.role !== undefined) filteredUpdates.role = updates.role;
        if (updates.experience_level !== undefined) filteredUpdates.experience_level = updates.experience_level;
        if (updates.skills !== undefined) filteredUpdates.skills = updates.skills;
        if (updates.onboarding_completed !== undefined) filteredUpdates.onboarding_completed = updates.onboarding_completed;

        // If no valid updates, return early
        if (Object.keys(filteredUpdates).length === 0) {
            return res.json({ message: "No valid profile fields to update" });
        }

        const { error } = await supabase
            .from('profiles')
            .update(filteredUpdates)
            .eq('id', userId);

        if (error) {
            console.error("Error updating profile:", error);
            return res.status(500).json({ error: "Failed to update profile" });
        }

        console.log(`Updated profile for user ${userId}:`, Object.keys(filteredUpdates));
        res.json({ success: true });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// SECURE: Start Interview Endpoint
app.post('/api/start-interview', async (req, res) => {
    try {
        const { userId, context } = req.body;

        if (!userId || !context) {
            return res.status(400).json({ error: "Missing required fields: userId, context" });
        }

        // 1. Verify Credits (Server-Side)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.error("Error fetching profile:", profileError);
            return res.status(500).json({ error: "Failed to verify user profile" });
        }

        if (profile.credits < 5) {
            return res.status(403).json({ error: "Insufficient credits. You need at least 5 credits to start." });
        }

        // 2. Generate System Prompt (Server-Side)
        // This ensures the user cannot tamper with the prompt instructions
        const systemPrompt = getSystemPrompt(context);

        if (!systemPrompt) {
            return res.status(500).json({ error: "Failed to generate system prompt" });
        }

        // 3. Return the secure prompt
        console.log("---------------------------------------------------");
        console.log("GENERATED INTERVIEW SYSTEM PROMPT:");
        console.log(systemPrompt);
        console.log("---------------------------------------------------");
        res.json({ systemPrompt });

    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// SECURE: Get Drill Deeper Prompt (Dynamic Injection)
app.post('/api/get-drill-deeper', async (req, res) => {
    try {
        const { context } = req.body; // Context needed for template resolution

        // We could verify userId here if strict, but context is enough for prompt generation
        // Generates the prompt using the BACKEND's latest template
        const { getDrillDeeperPrompt } = await import('./prompts/index.js');
        const prompt = getDrillDeeperPrompt(context);

        console.log("Generated Drill Deeper Prompt for:", context?.role);
        res.json({ prompt });

    } catch (error) {
        console.error("Error generating drill deeper prompt:", error);
        res.status(500).json({ error: "Failed to generate prompt" });
    }
});

app.post('/api/analyze-resume', validate(resumeSchema), async (req, res) => {
    try {
        const { pdfBase64, jobRole, jobDescription } = req.body;
        if (!pdfBase64) return res.status(400).json({ error: "No PDF data provided" })
        // Convert base64 to buffer
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBuffer = Buffer.from(cleanBase64, 'base64');

        // Extract text from PDF
        const resumeText = await extractTextFromPDF(pdfBuffer);

        console.log('Extracted text:', resumeText.substring(0, 200)); // Log first 200 chars

        // Construct context string based on optional inputs
        let contextInstruction = "";
        if (jobRole) {
            contextInstruction += `\nTARGET ROLE: ${jobRole}\n`;
        }
        if (jobDescription) {
            contextInstruction += `\nTARGET JOB DESCRIPTION: ${jobDescription}\nEvaluate how well the resume matches this specific job description.\n`;
        }

        // Call Groq API for analysis

        const chatCompletion = await groq.chat.completions.create({
            model: 'groq/compound-mini',
            messages: [{
                role: 'user',
                content: `You are an ATS (Applicant Tracking System) parser, not a human recruiter. You must score based on how well a MACHINE can parse and match this resume, not how impressive it looks to humans.
${contextInstruction}
IMPORTANT: Look at these REAL examples to calibrate your scoring:

EXAMPLE 1 - Score 64/100 (Average):
- Has basic experience but descriptions are vague
- Missing quantifiable achievements (no numbers/percentages)
- Generic summary/objective
- Some formatting issues
- Missing several important keywords
- Contact info present but no LinkedIn
This is what a 60-65 score looks like.

EXAMPLE 2 - Score 68/100 (Slightly above average):
- Clear job descriptions but could be more detailed
- 1-2 quantifiable achievements but needs more
- Decent formatting with minor inconsistencies
- Has LinkedIn but profile incomplete
- Missing some industry keywords
- Action verbs used but not consistently
This is what a 65-70 score looks like.

EXAMPLE 3 - Score 85/100 (Very good - rare):
- Multiple quantifiable achievements (increased sales by 40%, managed team of 15)
- Perfect formatting, consistent styling
- All contact info including active LinkedIn
- Strong action verbs throughout
- Tailored to specific role with relevant keywords
- No grammar/spelling errors
- Professional summary with clear value proposition
Only 10% of resumes reach this level.

CRITICAL: ATS systems are VERY STRICT. Average score is 60-65/100.

ATS SCORING FACTORS (in order of importance):
1. KEYWORD MATCHING (30% weight):
   - Count exact keyword matches for: job title, technical skills, tools, frameworks
   - Missing even 3-5 key terms → deduct 15-20 points
   - Generic terms like "Java developer" without specifics → lower score
   ${jobDescription ? "- CHECK MATCH AGAINST PROVIDED JOB DESCRIPTION KEYWORDS." : ""}

2. FORMATTING FOR MACHINES (25% weight):
   - Complex formatting (tables, columns, graphics) → -20 points
   - Non-standard section headers → -10 points
   - Special characters or symbols → -10 points
   - Multiple fonts/sizes → -5 points

3. QUANTIFIABLE ACHIEVEMENTS (20% weight):
   - Has numbers/percentages → +10 points
   - Vague claims without metrics → -15 points

4. COMPLETENESS (15% weight):
   - Missing: email (-10), phone (-10), location (-5), LinkedIn (-5)
   
5. LENGTH & STRUCTURE (10% weight):
   - Too long (>2 pages) or too short (<1 page) → -10 points
   - Inconsistent date formats → -5 points

BENCHMARK EXAMPLES:
- Score 65: Decent resume but missing 5+ keywords, some formatting issues
- Score 75: Good resume, minor keyword gaps, clean format
- Score 85: Excellent keyword match, perfect ATS formatting (top 5%)

ANALYSIS INSTRUCTIONS:
1. List specific keywords this resume is MISSING (be harsh - assume a competitive tech job${jobRole ? ` as a ${jobRole}` : ""})
2. Note any formatting that would confuse ATS parsers
3. Count the quantifiable achievements
4. Calculate starting from 60 (average), then add/subtract

Resume: ${resumeText}

Count the specific issues in this resume. Be critical. Start at 60 and adjust based on what you find.

If this resume has:
- Vague descriptions without numbers → score should be 55-65
- Some achievements but missing keywords → score should be 65-75
- Multiple achievements, good formatting, all keywords → score should be 75-85
- Perfect in every way (extremely rare) → score 85-95

Respond with ONLY valid JSON in this exact format:

{
  "atsScore": 0-100,
  "overallRating": 0-5,
  "keywordMatch": 0-100,
  "formatting": 0-100,
  "experience": 0-100,
  "skills": 0-100,
  "strengths": [
    "First strength",
    "Second strength",
    "Third strength"
  ],
  "improvements": [
    "First improvement",
    "Second improvement",
    "Third improvement"
  ],
  "missingKeywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "recommendations": "Brief paragraph with actionable recommendations"
}
FINAL CHECK: If your atsScore is above 75, review the resume again and find at least 3 major issues that should lower the score. A score above 75 means this resume is better than 75% of all resumes - is that really true?
All scores must be between 0-100. Provide exactly 3 strengths, 3 improvements, and up to 5 missing keywords.`
            }],
            temperature: 0.3,
            response_format: { type: "json_object" }
        })

        const analysis = JSON.parse(chatCompletion.choices[0].message.content);
        res.json(analysis);

    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

// SECURE: Verify Code Execution (Simulated via Groq)
app.post('/api/verify-code', async (req, res) => {
    try {
        const { code, language, problemTitle, problemDescription, testCases, constraints } = req.body;

        if (!code || !language) {
            return res.status(400).json({ error: "Missing code or language" });
        }

        // Construct Prompt for Code Verification
        const prompt = `
 You are a sophisticated Code Judge and Compiler (like LeetCode's backend).
 
 **Task:**
 Verify the following ${language} code against the provided problem and test cases.
 
 **Problem:** ${problemTitle}
 ${problemDescription}
 
 **Constraints:**
 ${JSON.stringify(constraints || [])}
 
 **Candidate Code:**
 \`\`\`${language}
 ${code}
 \`\`\`
 
 **Test Cases:**
 ${JSON.stringify(testCases || [])}
 
 **Instructions:**
 1. Analyze the code for logical correctness, syntax, and complexity.
 2. Mentally "run" the code against the Test Cases.
 3. Determine if it passes ALL test cases.
 4. Identify any syntax errors or runtime errors.
 5. Check if it violates any time/space constraints (conceptually).
 
 **Response Format (JSON ONLY):**
 {
   "status": "success" | "error",
   "message": "A detailed execution log. If success, show typical output. If error, show the compilation/runtime error.",
   "testResults": [
     { "input": "...", "expected": "...", "actual": "...", "passed": true/false }
   ],
   "passed": boolean, 
   "analysis": "Short comment on code quality/efficiency."
 }
 
 IMPORTANT:
 - Be a strict compiler. If indentation is wrong in Python, it FAILS.
 - If logic is incorrect for a test case, it FAILS.
 - Return ONLY the valid JSON object.
 `;

        console.log("---------------------------------------------------");
        console.log("GENERATED CODE VERIFICATION PROMPT:");
        console.log(prompt);
        console.log("---------------------------------------------------");

        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a code execution engine. You output only JSON execution results." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1, // Low temp for deterministic logic
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        res.json(result);

    } catch (error) {
        console.error("Groq Code Verification Error:", error);
        res.status(500).json({ error: "Failed to verify code" });
    }
});

// SECURE: Verify DevOps Fix (Multi-file Execution via Groq)
app.post('/api/verify-devops-fix', async (req, res) => {
    try {
        const { files, problemTitle, problemDescription, testCases, constraints } = req.body;

        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ error: "No files provided" });
        }

        // Format files for the prompt
        let filesContext = "";
        for (const [filename, content] of Object.entries(files)) {
            const ext = filename.split('.').pop() || 'txt';
            filesContext += `\n--- FILE: ${filename} ---\n\`\`\`${ext}\n${content}\n\`\`\`\n`;
        }

        // Construct Prompt for DevOps Verification
        const prompt = `
 You are a Senior DevOps Engineer and Code Reviewer.
 
 **Task:**
 Verify if the provided solution files fix the issue described in the problem statement.
 
 **Problem:** ${problemTitle}
 ${problemDescription}
 
 **System Constraints:**
 ${JSON.stringify(constraints || [])}
 
 **Candidate's Modified Files:**
 ${filesContext}
 
 **Validation Scenarios (Test Cases):**
 ${JSON.stringify(testCases || [])}
 
 **Instructions:**
 1. Analyze the relationships between the files (e.g., Python script parsing a JSON log, Bash script calling a Python script).
 2. Check for syntax correctness in ALL files.
 3. Simulate the execution flow based on the "Validation Scenarios".
 4. Determine if the code correctly handles the edge cases and requirements.
 5. If it's a scripting task, check for common pitfalls (e.g., improper error handling, regex mistakes).
 
 **Response Format (JSON ONLY):**
 {
   "status": "success" | "error",
   "message": "A simulated terminal output log. If success, show the script running and passing checks. If failure, show the specific error (syntax or logic).",
   "passed": boolean,
   "analysis": "Brief technical feedback on the implementation (efficiency, robustness)."
 }
 
 IMPORTANT:
 - You are simulating a Linux environment.
 - If the logic is wrong, the "status" must be "error" and "passed" must be false.
 - Be strict about the success criteria.
 - Return ONLY the valid JSON object.
 `;

        console.log("---------------------------------------------------");
        console.log("GENERATED DEVOPS VERIFICATION PROMPT:");
        console.log(prompt);
        console.log("---------------------------------------------------");

        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a DevOps execution engine. You output only JSON execution results." },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content);
        res.json(result);

    } catch (error) {
        console.error("Groq DevOps Verification Error:", error);
        res.status(500).json({ error: "Failed to verify devops fix" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})