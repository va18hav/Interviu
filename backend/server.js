import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk' // Import Groq SDK
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

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

// Initialize Groq with your API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Fixed: The route path should just be the endpoint, not the full URL
app.post('/api/generate-feedback', async (req, res) => {
    try {
        const { formattedTranscript, role, level, focus, company, roundTitle, roundType, expectedDepth } = req.body

        // Construct the prompt context
        const promptContext = `
Role: ${role}
Level: ${level}
Focus Area(s): ${focus}
Company (if applicable): ${company || 'Not specified'}
Round Type (if applicable): ${roundType || 'Not specified'}
Round Title (if applicable): ${roundTitle || 'Not specified'}

Transcript:
${formattedTranscript}
`

        // Using Llama-3.3-70b-versatile for high-quality reasoning
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a Senior Technical Hiring Committee Member at a top technology company.

Your responsibility is to evaluate interview performance conservatively and realistically,
exactly as a real interviewer would after a phone screen or onsite round.

This is NOT coaching. This is NOT encouragement.
This is a hiring signal evaluation.

STRICT RULES:
- Do NOT inflate ratings.
- Do NOT assume knowledge beyond what is explicitly demonstrated.
- Penalize vague, generic, buzzword-heavy, or AI-like responses.
- Penalize answers that lack prioritization, trade-offs, or causal reasoning.
- If the interviewer had to rephrase, guide, or narrow questions, this is a NEGATIVE signal.
- Strong terminology without explanation does NOT equal strong understanding.
- Silence, hesitation, or partial reasoning should be treated neutrally or negatively — never positively.

You must respond with ONLY valid JSON.`
                },
                {
                    role: "user",
                    content: `"Evaluate the following mock interview.

${promptContext}

SPECIAL CONDITIONS:
1. If the transcript is very short, incomplete, or the candidate exits early:
   - overallAssessment must be 'weak'
   - keyStrengths must be empty
   - areasToImprove must include 3 points explaining insufficient participation

2. Judge ONLY what is explicitly demonstrated.
   - Do NOT reward what the candidate could have said.
   - Do NOT reward completeness without ownership or reasoning.

3. Use conservative calibration.
   - Most real interviews fall between 'borderline' and 'acceptable'.

Return the response in EXACTLY the following JSON format:

{
  "technicalKnowledge": "insufficient | basic | solid | strong",
  "technicalEvidence": "Concrete transcript-based justification",

  "problemSolving": "insufficient | basic | solid | strong",
  "problemSolvingEvidence": "How the candidate reasons, debugs, or approaches problems",

  "communicationClarity": "low | moderate | high",
  "communicationEvidence": "Structure, clarity, precision, conciseness",

  "confidenceSignal": "low | moderate | high",
  "confidenceEvidence": "Ownership, decisiveness, consistency",

  "interviewerInterventionNeeded": true | false,
  "genericResponsesObserved": true | false,

  "overallAssessment": "weak | borderline | acceptable | strong",

  "keyStrengths": [
    "Strength backed by transcript evidence",
    "Strength backed by transcript evidence"
  ],

  "areasToImprove": [
    "Specific, actionable weakness",
    "Specific, actionable weakness",
    "Specific, actionable weakness"
  ],

  "summary": "One concise paragraph written like a real hiring committee note"
}"`
                }
            ],
            model: "groq/compound", // Powerful free-tier model
            temperature: 0.2, // Low temperature for consistent, conservative evaluation
            response_format: { type: "json_object" } // Forces the model to return valid JSON
        })

        const feedbackText = chatCompletion.choices[0]?.message?.content

        if (!feedbackText) {
            throw new Error('No feedback generated from Groq')
        }

        const feedback = JSON.parse(feedbackText)

        // --- DERIVE NUMERIC SCORES (INTERNAL LOGIC) ---
        const assessmentScoreMap = {
            weak: 45,
            borderline: 58,
            acceptable: 68,
            strong: 78
        };

        const skillScoreMap = {
            insufficient: 30,
            basic: 50,
            solid: 70,
            strong: 88,
            low: 40,
            moderate: 65,
            high: 85
        };

        // Calculate derived scores
        const overallScore = assessmentScoreMap[feedback.overallAssessment] || 50;

        // Map skill ratings to numbers for frontend progress bars
        const derivedFeedback = {
            ...feedback,
            overallScore: overallScore,
            technicalKnowledgeScore: skillScoreMap[feedback.technicalKnowledge] || 50,
            problemSolvingScore: skillScoreMap[feedback.problemSolving] || 50,
            communicationSkillsScore: skillScoreMap[feedback.communicationClarity] || 50,
            confidenceLevelScore: skillScoreMap[feedback.confidenceSignal] || 50,
            // Map old field names to new values for frontend compatibility where needed
            technicalKnowledgeJustification: feedback.technicalEvidence,
            problemSolvingJustification: feedback.problemSolvingEvidence,
            communicationSkillsJustification: feedback.communicationEvidence,
            confidenceLevelJustification: feedback.confidenceEvidence,
            // Job Ready Score can be an average of the others
            jobReadyScore: Math.round(
                ((skillScoreMap[feedback.technicalKnowledge] || 50) +
                    (skillScoreMap[feedback.problemSolving] || 50) +
                    (skillScoreMap[feedback.communicationClarity] || 50) +
                    (skillScoreMap[feedback.confidenceSignal] || 50)) / 4
            ),
            jobReadyScoreJustification: "Composite score based on technical, problem solving, communication, and confidence signals."
        };

        res.json(derivedFeedback)

    } catch (error) {
        console.error('Groq API Error:', error)
        res.status(500).json({ error: 'Failed to generate feedback' })
    }
})

app.post('/api/analyze-resume', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})