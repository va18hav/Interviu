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
import { generateInterviewReport } from './utils/reportGenerator.js';
import { compileScenario } from './utils/aiClient.js';
import devopsScenarioCompilerPrompt from './prompts/devopsScenarioCompiler.js';
import softwareScenarioCompilerPrompt from './prompts/softwareScenarioCompiler.js';

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

import http from 'http';
import { setupWebSocket, sessions } from './websocketHandler.js';

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://nfgforfzxarpjauiycar.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_3jcEXhWkwMXxLHIyzP2b9w_90EUHSUf';
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client using service role key — bypasses RLS for backend-only operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { autoRefreshToken: false, persistSession: false } })
    : supabase;

// Initialize Groq with your API Key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(express.json({ limit: '50mb' })); // Add JSON body parser at the top
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
    origin: ['https://intervyu-virid.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



app.post('/api/auth/password', async (req, res) => {
    const { password } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const { error } = await supabase.auth.updateUser(token, { password }); // This might not work if createClient doesn't have context. 
        // Actually, supabase-js `updateUser` usually works if you pass the JWT to `getUser` but for `updateUser`?
        // If we use the standard client, we need to set the session first.

        // Alternatively, since we are moving logic to backend, we might need to rely on the client sending the request to Supabase directly OR
        // we set the session on the backend client.
        // For now, let's try setting session or assume the token is enough? 
        // Supabase `updateUser` on a generic client updates the logged in user.
        // We probably need to use `supabase.auth.admin.updateUserById` with service key OR 
        // create a client for this user: createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } } })

        // I will use the "create client for user" approach.
        const userSupabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        });

        const { error: updateError } = await userSupabase.auth.updateUser({ password });

        if (updateError) throw updateError;
        res.json({ message: "Password updated" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

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

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login Error (Supabase):", error);
            return res.status(401).json({ error: error.message });
        }

        if (!data.user) {
            console.error("Login Success but no user returned?", data);
            return res.status(500).json({ error: "No user returned from provider" });
        }

        res.json(data);
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ error: "Internal Server Error during login" });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Logged out successfully" });
});

app.get('/api/auth/user', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// ==========================================
// GOOGLE OAUTH ENDPOINTS
// ==========================================

// Step 1: Redirect browser to Google via Supabase
// After auth, Supabase sends tokens directly to the frontend via hash fragment (implicit flow)
app.get('/api/auth/google', async (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Supabase implicit flow delivers #access_token directly to this URL
                redirectTo: `${frontendUrl}/auth/callback`,
                skipBrowserRedirect: true,
            }
        });

        if (error || !data?.url) {
            console.error('[OAuth] Failed to get Google auth URL:', error);
            return res.status(500).json({ error: 'Failed to initiate Google login' });
        }

        res.redirect(data.url);
    } catch (err) {
        console.error('[OAuth] Google redirect error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Step 2: Supabase/Google redirects back here with ?code=
app.get('/api/auth/callback', async (req, res) => {
    const { code, error: oauthError } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (oauthError) {
        console.error('[OAuth] Callback error from Google:', oauthError);
        return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    if (!code) {
        return res.redirect(`${frontendUrl}/login?error=no_code`);
    }

    try {
        // Exchange the authorization code for a real session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error || !data?.session) {
            console.error('[OAuth] Code exchange failed:', error);
            return res.redirect(`${frontendUrl}/login?error=session_failed`);
        }

        const { session, user } = data;
        const userMeta = user?.user_metadata || {};

        // Build a safe user object matching what email/password login returns
        const safeUser = JSON.stringify({
            id: user.id,
            firstName: userMeta.full_name?.split(' ')[0] || userMeta.name?.split(' ')[0] || 'User',
            lastName: userMeta.full_name?.split(' ').slice(1).join(' ') || '',
            email: user.email,
            avatarUrl: userMeta.avatar_url || null
        });

        // Redirect the browser to the frontend callback page with token embedded in URL
        const params = new URLSearchParams({
            token: session.access_token,
            user: safeUser
        });

        res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (err) {
        console.error('[OAuth] Callback processing error:', err);
        res.redirect(`${frontendUrl}/login?error=internal_error`);
    }
});

// ==========================================
// DATA ENDPOINTS
// ==========================================

// Dashboard Data
app.get('/api/dashboard', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;

        // Fetch Recent Completed Activity
        // Promise.resolve({ data: [] }) as interviews table was deleted
        const interviewsObj = { data: [] };

        // Tailored "Popular" Interviews Logic
        let tailoredInterviews = [];
        if (profile) {
            const role = profile.role || 'SDE'; // Standardized from role_preference
            const normalizedType = role.toLowerCase().includes('devops') ? 'devops' : 'sde';
            const table = normalizedType === 'sde' ? 'sde_interviews' : 'devops_interviews';

            // Mapping for level
            const levelMap = { 'Junior': 'entry', 'Mid-Level': 'intermediate', 'Senior': 'senior' };
            const level = levelMap[profile.experience_level] || profile.experience_level;

            const userSkills = profile.skills
                ? profile.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
                : [];

            let query = supabase.from(table).select('*');
            if (level) {
                query = query.ilike('level', level);
            }

            const { data: candidates, error: fetchError } = await query
                .order('created_at', { ascending: false })
                .limit(50); // Get a good sample to score

            if (fetchError) throw fetchError;

            // Score and filter
            let results = candidates || [];
            if (userSkills.length > 0) {
                results = results.map(interview => {
                    const interviewSkills = (interview.skills || []).map(s => s.toLowerCase());
                    const matchCount = userSkills.filter(userSkill =>
                        interviewSkills.some(dbSkill =>
                            dbSkill.includes(userSkill) || userSkill.includes(dbSkill)
                        )
                    ).length;
                    return { ...interview, _matchCount: matchCount };
                }).sort((a, b) => (b._matchCount || 0) - (a._matchCount || 0));
            }

            tailoredInterviews = results.slice(0, 3).map(item => ({
                ...item,
                type: normalizedType,
                icon_url: item.icon_link
            }));
        }

        res.json({
            profile: profile,
            recentInterviews: interviewsObj.data || [],
            popularInterviews: tailoredInterviews
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: `Dashboard Error: ${error.message || JSON.stringify(error)}` });
    }
});

// Credits
app.get('/api/credits', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (error) throw error;
        res.json({ credits: data?.credits || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile
app.get('/api/profile', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/profile', async (req, res) => {
    const { userId, updates } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Interviews
// Fetch all interviews (SDE & DevOps)
app.get('/api/interviews', async (req, res) => {
    try {
        const [sdeResponse, devopsResponse] = await Promise.all([
            supabase.from('sde_interviews').select('*'),
            supabase.from('devops_interviews').select('*')
        ]);

        if (sdeResponse.error) throw sdeResponse.error;
        if (devopsResponse.error) throw devopsResponse.error;

        const sdeData = (sdeResponse.data || []).map(item => ({ ...item, type: 'sde' }));
        const devopsData = (devopsResponse.data || []).map(item => ({ ...item, type: 'devops' }));

        const allData = [...sdeData, ...devopsData];
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch user interview progress
app.get('/api/interviews/progress', async (req, res) => {
    const { userId, role } = req.query;
    if (!userId || !role) return res.status(400).json({ error: "User ID and Role required" });

    try {
        const { data, error } = await supabase
            .from('interviews')
            .select('feedback_data, score')
            .eq('user_id', userId)
            .eq('role', role);

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch single interview details
app.get('/api/interviews/:id', async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // 'sde' or 'devops'

    try {
        let table = 'popular_interviews'; // Default fallback
        if (type === 'sde') table = 'sde_interviews';
        if (type === 'devops') table = 'devops_interviews';

        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==============================================================
// COMPLETED INTERVIEWS — Specific list routes MUST come before /:id
// ==============================================================

// GET /api/completed-interviews/curated?userId=...
app.get('/api/completed-interviews/curated', async (req, res) => {
    const { userId, interviewId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    try {
        let query = supabaseAdmin
            .from('completed_curated_interviews')
            .select('*')
            .eq('user_id', userId);

        if (interviewId) {
            query = query.eq('curated_interview_id', interviewId);
        }

        const { data, error } = await query.order('completed_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('[completed-interviews/curated]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/recent-interviews?userId=...
app.get('/api/recent-interviews', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    try {
        // 1. Get unique recent curated_interview_ids
        const { data: activity, error: activityError } = await supabaseAdmin
            .from('completed_curated_interviews')
            .select('curated_interview_id, round_id, completed_at')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (activityError) throw activityError;

        const interviewMap = {};
        const uniqueInterviewIds = [];

        activity.forEach(item => {
            if (!interviewMap[item.curated_interview_id]) {
                if (uniqueInterviewIds.length < 3) {
                    uniqueInterviewIds.push(item.curated_interview_id);
                    interviewMap[item.curated_interview_id] = {
                        id: item.curated_interview_id,
                        completedRounds: new Set()
                    };
                }
            }
            if (interviewMap[item.curated_interview_id]) {
                if (item.round_id) {
                    interviewMap[item.curated_interview_id].completedRounds.add(item.round_id);
                }
            }
        });

        // 2. Fetch metadata for these IDs
        const recentInterviews = [];
        for (const id of uniqueInterviewIds) {
            let { data: interview } = await supabaseAdmin
                .from('sde_interviews')
                .select('*')
                .eq('id', id)
                .single();

            if (!interview) {
                const { data: devops } = await supabaseAdmin
                    .from('devops_interviews')
                    .select('*')
                    .eq('id', id)
                    .single();
                interview = devops;
            }

            if (interview) {
                const totalRounds = interview.rounds?.length || 0;
                const completedCount = interviewMap[id].completedRounds.size;
                const progress = totalRounds > 0 ? Math.round((completedCount / totalRounds) * 100) : 0;

                recentInterviews.push({
                    ...interview,
                    icon_url: interview.icon_link,
                    progress,
                    completedCount,
                    totalRounds
                });
            }
        }

        res.json(recentInterviews);
    } catch (error) {
        console.error('[recent-interviews]', error.message);
        res.status(500).json({ error: error.message });
    }
});


// GET /api/completed-interviews/custom?userId=...
app.get('/api/completed-interviews/custom', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    try {
        const { data, error } = await supabaseAdmin
            .from('completed_custom_interviews')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        console.error('[completed-interviews/custom]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/completed-interviews/:id
app.delete('/api/completed-interviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Try deleting from curated interviews
        const { error: curatedError } = await supabaseAdmin
            .from('completed_curated_interviews')
            .delete()
            .eq('id', id);

        // 2. Try deleting from custom interviews (even if curated failed, curated is usually what 'id' would match)
        const { error: customError } = await supabaseAdmin
            .from('completed_custom_interviews')
            .delete()
            .eq('id', id);

        // Check if at least one succeeded or both failed
        if (curatedError && customError) {
            throw new Error(`Failed to delete from both tables: ${curatedError.message} | ${customError.message}`);
        }

        res.json({ message: "Interview record deleted successfully" });
    } catch (error) {
        console.error('[DELETE completed-interview]', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Fetch completed interview details (specifically feedback) — wildcard AFTER specific routes
app.get('/api/completed-interviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Try finding in curated first
        let { data, error } = await supabase
            .from('completed_curated_interviews')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            // Try custom
            const { data: customData, error: customError } = await supabase
                .from('completed_custom_interviews')
                .select('*')
                .eq('id', id)
                .single();

            if (customError) throw customError;
            data = customData;
        }

        // Return normalized data structure if needed, or just raw
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.delete('/api/interviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('interviews')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: "Interview deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Onboarding
app.post('/api/onboarding', async (req, res) => {
    const { userId, onboardingData } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        // Update profile with onboarding data
        const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                onboarding_completed: true,
                ...onboardingData
            });

        if (updateError) throw updateError;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Onboarding Interview Preview Fetch
// GET /api/onboarding-interviews?type=sde&level=intermediate&skills=React,Node.js
app.get('/api/onboarding-interviews', async (req, res) => {
    const { type, level, skills } = req.query;
    const normalizedType = type ? type.toLowerCase().trim() : '';

    if (!normalizedType || (normalizedType !== 'sde' && normalizedType !== 'devops')) {
        return res.status(400).json({ error: "Valid 'type' (sde or devops) is required" });
    }

    const table = normalizedType === 'sde' ? 'sde_interviews' : 'devops_interviews';
    // Lowercase user skills for case-insensitive comparison later in JS
    const userSkills = skills
        ? skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        : [];

    try {
        let query = supabase.from(table).select('*');

        // Case-insensitive level filter — DB may store 'Intermediate' or 'intermediate', ilike handles both
        if (level) {
            query = query.ilike('level', level);
        }

        // NOTE: We do NOT use Supabase .ov() for skills here because it is case-sensitive
        // and DB skills like "Swift" won't match user input "swift". We fetch a wider set
        // and do case-insensitive scoring in JavaScript below.
        // Increased limit from 50 to 300 to better catch skill matches if recent ones don't match
        query = query.order('created_at', { ascending: false }).limit(300);

        const { data, error } = await query;
        if (error) throw error;

        let results = data || [];

        // JS-side case-insensitive skills filtering and match-count scoring
        if (userSkills.length > 0 && results.length > 0) {
            results = results
                .map(interview => {
                    const interviewSkills = (interview.skills || []).map(s => s.toLowerCase());
                    // Bidirectional substring match (case-insensitive):
                    // "c++" matches "high-performance c/c++ / c#"
                    // "azure" matches "azure cloud services architecture"
                    const matchCount = userSkills.filter(userSkill =>
                        interviewSkills.some(dbSkill =>
                            dbSkill.includes(userSkill) || userSkill.includes(dbSkill)
                        )
                    ).length;
                    return { ...interview, _matchCount: matchCount };
                })
                .filter(i => i._matchCount > 0)           // at least 1 skill must match
                .sort((a, b) => b._matchCount - a._matchCount); // most matches first
        }

        // Return top 2
        const topTwo = results.slice(0, 2);
        res.json({ interviews: topTwo });
    } catch (error) {
        console.error('[OnboardingInterviews] Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// Resume (GET)
app.get('/api/resume', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/resume-analyses', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const { data, error } = await supabase
            .from('resume_analyses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/resume-analyses', async (req, res) => {
    const { userId, jobRole, fileName, atsScore, analysisResult } = req.body;
    try {
        const { data, error } = await supabase
            .from('resume_analyses')
            .insert([
                {
                    user_id: userId,
                    job_role: jobRole,
                    file_name: fileName,
                    ats_score: atsScore,
                    analysis_result: analysisResult
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/resume-analyses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('resume_analyses')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: "Analysis deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Resume (POST/Analyze is already partly handled, but we might want a simple CRUD one)
// The existing /api/analyze-resume endpoint handles the heavy lifting.
// We might need a generic save endpoint if needed, but for now specific flow seems to be used.



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

        return res.json({ success: true });

    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// SECURE: End Interview & Generate Report
app.post('/api/end-interview', async (req, res) => {
    try {
        const { userId, durationInMinutes, history, context, generateReport = true, sessionId } = req.body;

        if (!userId || durationInMinutes === undefined) {
            return res.status(400).json({ error: "Missing required fields: userId, durationInMinutes" });
        }

        // 1. Calculate Credits to Deduct (1 min = 1 credit, rounded up)
        const creditsToDeduct = Math.ceil(durationInMinutes);
        console.log(`[EndInterview] Ending session for User ${userId}. Duration: ${durationInMinutes}m. Deducting: ${creditsToDeduct} credits.`);

        // 2. Transact with Supabase (Check & Deduct)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            console.error("Error fetching profile for deduction:", profileError);
            return res.status(500).json({ error: "Failed to verify user profile" });
        }

        // Deduct credits (allow negative balance if necessary, or check?) 
        // We will allow it to go negative for now to handle edge cases where user runs over.
        const newBalance = profile.credits - creditsToDeduct;

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits: newBalance })
            .eq('id', userId);

        if (updateError) {
            console.error("Error updating credits:", updateError);
            return res.status(500).json({ error: "Failed to deduct credits" });
        }

        // 3. Generate Report
        // Fetch the real session from the WebSocket server if available
        let sessionData = {
            id: sessionId || `session-${Date.now()}`,
            history: history || [],
            context: context
        };

        const activeWsSession = sessionId ? sessions.get(sessionId) : null;
        if (activeWsSession) {
            console.log(`[EndInterview] Found active WebSocket session for ${sessionId}, using real history.`);
            sessionData = activeWsSession; // Pass the whole real session
        } else if (!history || history.length === 0) {
            console.warn("[EndInterview] No history provided and no active WS session found for report generation.");
        }

        let report = null;

        if (generateReport) {
            console.log(`[EndInterview] Generating report and storing interview data for ${sessionId}...`);

            // 1. Generate Report
            // Note: generateInterviewReport assumes 'session' object structure. We mock it here.
            try {
                const generatedReportData = await generateInterviewReport(sessionData, context);
                report = generatedReportData;

                // 2. Store in Database
                const isCustom = context.customInterview === true;
                const timestamp = new Date().toISOString();

                if (isCustom) {
                    // Prepare title (System Context / Domain Context) with first letter capitalized
                    let titleRaw = context.domain_focus;
                    // Ensure only first letter is capitalized (rest kept as is, or lowercase? "first letter being upper-case always" usually implies fixing the first char)
                    const title = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);

                    const { error: insertError } = await supabaseAdmin
                        .from('completed_custom_interviews')
                        .insert([{
                            user_id: userId,
                            title: title,
                            job_role: context.role,
                            job_description: context.job_description || context.problem_statement || null,
                            transcript: sessionData.history,
                            report_data: report,
                            score: report.verdict.confidence, // Assuming report has a score field
                            duration_mins: Math.ceil(durationInMinutes),
                            started_at: null, // We don't track start time explicitly in this endpoint input yet
                            completed_at: timestamp
                        }]);

                    if (insertError) {
                        console.error("Error inserting custom interview:", insertError);
                        // We don't fail the request, but log it. Report is returned to user.
                    } else {
                        console.log("[EndInterview] Custom interview stored successfully.");
                    }

                } else {
                    // Curated Interview
                    // Extract origin ID from roundKey if possible: "uuid-round-N"
                    let curatedId = null;
                    if (context.roundKey && context.roundKey.includes('-round-')) {
                        curatedId = context.roundKey.split('-round-')[0];
                    }

                    const { error: insertError } = await supabaseAdmin
                        .from('completed_curated_interviews')
                        .insert([{
                            user_id: userId,
                            round_id: context.roundId,
                            curated_interview_id: curatedId,
                            type: context.type || 'sde',
                            title: context.title || "Interview",
                            company: context.company,
                            transcript: sessionData.history,
                            report_data: report,
                            score: report.verdict.confidence,
                            duration_mins: Math.ceil(durationInMinutes),
                            started_at: null,
                            completed_at: timestamp
                        }]);

                    if (insertError) {
                        console.error("Error inserting curated interview:", insertError);
                    } else {
                        console.log("[EndInterview] Curated interview stored successfully.");
                    }
                }

            } catch (err) {
                console.error("[EndInterview] Report generation or storage failed:", err);
                // Fallback: Return success to user but with error message in report field?
                report = { status: "failed", error: "Report generation failed on server." };
            }
        } else {
            console.log("[EndInterview] Skipping report generation as per client request (criteria not met).");
            report = { message: "Report generation skipped. Minimum interview requirements not met." };
        }

        res.json({
            success: true,
            creditsDeducted: creditsToDeduct,
            newBalance,
            report
        });

    } catch (error) {
        console.error("Error ending interview:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Standalone Credit Deduction (for aborts/leaves)
app.post('/api/deduct-credits', async (req, res) => {
    const { userId, durationSeconds } = req.body;
    if (!userId || durationSeconds === undefined) return res.status(400).json({ error: "Missing fields" });

    const durationInMinutes = durationSeconds / 60;
    const creditsToDeduct = Math.ceil(durationInMinutes);

    try {
        const { data: profile, error } = await supabase.from('profiles').select('credits').eq('id', userId).single();
        if (error || !profile) throw new Error("Profile not found");

        const newBalance = profile.credits - creditsToDeduct;
        const { error: updateError } = await supabase.from('profiles').update({ credits: newBalance }).eq('id', userId);
        if (updateError) throw updateError;

        console.log(`[DeductCredits] Deducted ${creditsToDeduct} credits for user ${userId}.`);
        res.json({ success: true, newBalance });
    } catch (err) {
        console.error("Error deducting credits:", err);
        res.status(500).json({ error: err.message });
    }
});

// SCENARIO COMPILATION ENDPOINT
app.post('/api/compile-scenario', async (req, res) => {
    const { role, roundType, formatContext } = req.body;

    if (!formatContext) {
        return res.status(400).json({ error: "Context required" });
    }

    try {
        // Select Prompt
        let compilerPrompt = softwareScenarioCompilerPrompt; // Default
        if (role && (role.toLowerCase().includes('devops') || role.toLowerCase().includes('sre') || role.toLowerCase().includes('reliability'))) {
            compilerPrompt = devopsScenarioCompilerPrompt;
        }

        // Inject Variables
        // The prompt template expects {variable} placeholders. We'll reuse the handleBars logic or simple replace if needed.
        // But wait, compileScenario accepts a system prompt string. 
        // We need to resolve the prompt template first.

        // Since resolveTemplate is exported from prompts/index.js, let's use it.
        // But wait, prompts/index.js exports resolveTemplate? Yes.
        // Let's import it above if not already visible (it is not exported by name in line 10, check again).
        // Line 10: import { getSystemPrompt } from './prompts/index.js';
        // Need to update import in line 10 or duplicate logic.

        let resolvedPrompt = compilerPrompt;

        // Simple resolution for now to avoid altering index.js imports too much
        // Or better, let's update index.js to export it or just copy the simple replace logic.
        const resolveTemplateLocal = (template, context) => {
            return template.replace(/{{([\w\d\._]+)}}|{([\w\d\._]+)}/g, (match, key1, key2) => {
                const key = key1 || key2;
                // Handle nested keys if any, though most prompt vars seem flat or passed flat
                // The prompt uses {variable}, not {{variable}} in some places based on devopsScenarioCompiler.js view
                // Actually devopsScenarioCompiler.js uses {round_type}, {role} etc.
                return context[key] !== undefined ? String(context[key]) : match;
            });
        };

        resolvedPrompt = resolveTemplateLocal(compilerPrompt, formatContext);

        // Call AI with default max_tokens (1200) for debug scenario generation to prevent JSON truncation
        const roundData = await compileScenario(resolvedPrompt, JSON.stringify(formatContext, null, 2));

        res.json(roundData);

    } catch (error) {
        console.error("Scenario Compilation Error:", error);
        res.status(500).json({ error: "Failed to compile scenario" });
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

// SECURE: Execute Code via Piston API (Multi-Language Support)
app.post('/api/run-code', async (req, res) => {
    try {
        const { language, code, files, stdin } = req.body;

        if ((!code && (!files || files.length === 0)) || !language) {
            return res.status(400).json({ error: "Missing code/files or language" });
        }

        // Map frontend language names to Piston runtime names
        // https://emkc.org/api/v2/piston/runtimes
        const runtimeMap = {
            'javascript': { language: 'javascript', version: '18.15.0' },
            'js': { language: 'javascript', version: '18.15.0' },
            'python': { language: 'python', version: '3.10.0' },
            'py': { language: 'python', version: '3.10.0' },
            'java': { language: 'java', version: '15.0.2' },
            'cpp': { language: 'c++', version: '10.2.0' },
            'c': { language: 'c', version: '10.2.0' },
            'go': { language: 'go', version: '1.16.2' },
            'rust': { language: 'rust', version: '1.68.2' },
            'typescript': { language: 'typescript', version: '5.0.3' },
            'ts': { language: 'typescript', version: '5.0.3' },
            'php': { language: 'php', version: '8.2.3' },
            'csharp': { language: 'csharp', version: '6.12.0' }, // Mono
            'swift': { language: 'swift', version: '5.3.3' },
            'bash': { language: 'bash', version: '5.2.0' },
            'sh': { language: 'bash', version: '5.2.0' }
        };

        const config = runtimeMap[language.toLowerCase()] || { language: language.toLowerCase(), version: '*' };

        // Prepare files for Piston
        let pistonFiles = [];
        if (files && Array.isArray(files) && files.length > 0) {
            // Multi-file mode
            pistonFiles = files.map(f => ({
                name: f.name,
                content: f.content
            }));
        } else {
            // Single-file backward compatibility
            pistonFiles = [{
                content: code
            }];
        }

        console.log(`[Piston] Executing ${config.language} with ${pistonFiles.length} file(s)...`);

        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: config.language,
                version: config.version,
                files: pistonFiles,
                stdin: stdin || "",
                args: req.body.args || [],
                compile_timeout: 10000,
                run_timeout: req.body.run_timeout || 3000
            })
        });

        const result = await response.json();

        if (result.message) {
            // API Error (e.g. Runtime not found)
            console.error('[Piston] API Error:', result.message);
            return res.json({ error: result.message });
        }

        // Piston Response Format: { language, version, run: { stdout, stderr, code, signal, output } }
        res.json(result);

    } catch (error) {
        console.error("Piston Execution Error:", error);
        res.status(500).json({ error: "Failed to execute code via Piston API" });
    }
});

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})