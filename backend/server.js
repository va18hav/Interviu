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
        const { formattedTranscript, role, level, focus } = req.body

        // Using Llama-3.3-70b-versatile for high-quality reasoning
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a Senior Technical Hiring Committee Member. Your goal is to provide a balanced, highly accurate evaluation of a candidate's performance. You must respond with ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Analyze this ${role} mock interview for a ${level} candidate focusing on ${focus}.
                    Transcript: ${formattedTranscript}. Some important instructions:
                    1. If the transcript is very small or if the user has ended the interview without speaking much, keep all the scores as 0 and return empty arrays for key strengths. Add three points in areas to improve that indiacate the user had left the interview without speaking much.
                    2. Keep the scores realistic and based on the transcript. Do not underestimate.
                    3. Return the summary as a string. The summary must have the entire summary of the conversation in the form of a paragraph, should precisely point where the candidate is technically sound, confident, and where the candidate is not. 
                    Respond in this exact JSON format:
                    4. Return the qna as an object with questions from the ${formattedTranscript} and answers from your own perspective. Think of it like, what would be the best answer for the particular question, of course in questions where there are multiple possiblities such as explaining a project, or a follow-up question regarding that,
                       or if the interview is a behavioural interview, what would you do if you were in the candidate's shoes, with the same project explanations, this should focus on the framing and explaining technical depth of the same project.
                    5. jobReadyScore is the combination of all performance metrics to indicate your overall preparedness for real interviews.
                    {
                      "overallScore": 0-100,
                      "technicalKnowledge": 0-100,
                      "technicalKnowledgeJustification": "string",
                      "communicationSkills": 0-100,
                      "communicationSkillsJustification": "string",
                      "problemSolving": 0-100,
                      "problemSolvingJustification": "string",
                      "confidenceLevel": 0-100,
                      "confidenceLevelJustification": "string",
                      "jobReadyScore": 0-100,
                      "jobReadyScoreJustification": "string",
                      "keyStrengths": ["string", "string", "string"],
                      "areasToImprove": ["string", "string", "string"]
                      "summary" : "string"
                      "qna": [
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },
                                { "question": "Question text...", "answer": "Suggested answer..." },   
                                ]
                    }`
                }
            ],
            model: "groq/compound-mini", // Powerful free-tier model
            temperature: 0.5,
            response_format: { type: "json_object" } // Forces the model to return valid JSON
        })

        const feedbackText = chatCompletion.choices[0]?.message?.content

        if (!feedbackText) {
            throw new Error('No feedback generated from Groq')
        }

        const feedback = JSON.parse(feedbackText)
        res.json(feedback)

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