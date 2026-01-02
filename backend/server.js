import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Groq from 'groq-sdk' // Import Groq SDK

dotenv.config()
const app = express()
const PORT = 5000

// Initialize Groq with your API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors())
app.use(express.json())

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})