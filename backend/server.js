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
                    content: "You are an expert interview analyzer. You must respond with ONLY valid JSON."
                },
                {
                    role: "user",
                    content: `Analyze this ${role} mock interview for a ${level} candidate focusing on ${focus}.
                    Transcript: ${formattedTranscript}. Some important instructions:
                    1. If the transcript is very small or if the user has ended the interview without speaking much, keep all the scores as 0 and return empty arrays for key strengths. Add three points in areas to improve that indiacate the user had left the interview without speaking much.
                    2. Keep the scores realistic and based on the transcript. Do not overestimate or underestimate.
                    Respond in this exact JSON format:
                    {
                      "overallScore": 0-100,
                      "technicalKnowledge": 0-100,
                      "communicationSkills": 0-100,
                      "problemSolving": 0-100,
                      "confidenceLevel": 0-100,
                      "jobReadyScore": 0-100,
                      "keyStrengths": ["string", "string", "string"],
                      "areasToImprove": ["string", "string", "string"]
                    }`
                }
            ],
            model: "llama-3.3-70b-versatile", // Powerful free-tier model
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
        const { pdfBase64 } = req.body;
        if (!pdfBase64) return res.status(400).json({ error: "No PDF data provided" })
        // Convert base64 to buffer
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        const pdfBuffer = Buffer.from(cleanBase64, 'base64');

        // Extract text from PDF
        const resumeText = await extractTextFromPDF(pdfBuffer);

        console.log('Extracted text:', resumeText.substring(0, 200)); // Log first 200 chars

        // Call Groq API for analysis

        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{
                role: 'user',
                content: `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume and provide a detailed ATS score and feedback.

Resume:
${resumeText}

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