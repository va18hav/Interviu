-- ============================================================
-- DUMMY DATA: Completed Interviews
-- ============================================================
-- STEP 1: Replace YOUR_USER_ID with your actual Supabase user UUID.
-- You can find it in Supabase → Authentication → Users, or run:
--   SELECT id FROM profiles WHERE email = 'your@email.com';
--
-- STEP 2: Run this in Supabase SQL Editor.
-- ============================================================

-- Set your user ID once for easy substitution
DO $$
DECLARE
    user_id UUID := 'YOUR_USER_ID'; -- <- Replace this
BEGIN

-- ============================================================
-- 1. CURATED INTERVIEWS (completed_curated_interviews)
-- ============================================================

INSERT INTO completed_curated_interviews
    (user_id, type, title, company, score, duration_mins, started_at, completed_at, report_data)
VALUES
(
    user_id,
    'sde',
    'System Design: URL Shortener',
    'Google',
    8,
    47,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days' + INTERVAL '47 minutes',
    '{
        "candidateName": "Candidate",
        "role": "Software Engineer",
        "date": "Jan 15, 2025",
        "verdict": {
            "signal": "Strong Hire",
            "confidence": 8,
            "level": "L5 / Senior",
            "risk": "Low",
            "summary": "The candidate demonstrated strong system design fundamentals with clear thinking on scalability tradeoffs. Their approach to the URL shortener was methodical — they identified bottlenecks early, proposed a sensible sharding strategy, and reasoned well about consistency vs availability for the redirect service."
        },
        "decision": {
            "worked": [
                "Immediately identified scale requirements — handled 100M URLs, 10B redirects/day",
                "Proposed Base62 encoding with collision detection and expiry TTL handling",
                "Correctly chose eventual consistency for reads given the read-heavy workload"
            ],
            "blocked": [
                "Struggled to articulate cache invalidation strategy for custom aliases",
                "Missed rate limiting at the API gateway for abuse prevention",
                "Did not address analytics pipeline (click counts, geo tracking)"
            ],
            "change": [
                "Add a dedicated analytics service decoupled from redirect path",
                "Discuss CDN edge caching for hot URLs (top 1% of traffic)",
                "Clarify SLA and design for the 99.99% availability requirement"
            ]
        },
        "technicalProfile": [
            { "name": "Scalability Reasoning", "desc": "Estimated load correctly and proposed horizontal sharding early", "status": "strong" },
            { "name": "Data Modeling", "desc": "Identified key entities and relationships with appropriate indexes", "status": "strong" },
            { "name": "Failure Handling", "desc": "Addressed database failover but missed partial network splits", "status": "developing" },
            { "name": "Security Awareness", "desc": "Mentioned HTTPS redirect but skipped spam/abuse vectors", "status": "weak" },
            { "name": "Communication", "desc": "Explained tradeoffs clearly, used whiteboard effectively", "status": "strong" }
        ],
        "roundInsight": {
            "type": "System Design",
            "score": "strong",
            "summary": "A confident and well-structured design with good tradeoff reasoning. The candidate needs to work on the operational and security dimensions of their designs — thinking about abuse, monitoring, and analytics as first-class concerns.",
            "breakdown": [
                { "category": "Requirement Gathering", "status": "strong", "text": "Clarified scale upfront and proposed read/write ratio before jumping to solution." },
                { "category": "High-Level Architecture", "status": "strong", "text": "Clean layered design — API → App → Cache → DB with async analytics." },
                { "category": "Deep Dive", "status": "developing", "text": "Explained the short code generation well but cache invalidation was hand-wavy." },
                { "category": "Operational Concerns", "status": "weak", "text": "Skipped monitoring, alerting, and the analytics question entirely." }
            ]
        },
        "failurePatterns": [
            { "title": "Skipping Operational Layer", "desc": "Consistently designs the happy path but skips monitoring, alerting, and observability — a common gap for engineers moving to senior levels." },
            { "title": "Cache Invalidation Avoidance", "desc": "Acknowledged the problem but deferred a concrete strategy. Interviewers flag this as a knowledge gap." }
        ],
        "readinessMap": {
            "ready": [
                "FAANG L4/L5 System Design screens",
                "Teams focused on high-read-throughput services",
                "Companies with strong eng culture (clear thinking valued)"
            ],
            "needsWork": [
                "Ops-heavy roles (SRE/Platform) — needs operational design depth",
                "Security-critical systems — abuse vectors not considered",
                "Analytics/ML infra roles — pipeline design not practiced"
            ]
        },
        "improvementPlan": [
            "Practice designing the analytics/observability layer explicitly — treat it as part of every system design, not an afterthought.",
            "Deep dive into cache invalidation patterns: write-through, write-behind, and cache-aside with TTL expiry for aliases.",
            "Read the Google SRE Book Chapter 6 (Monitoring Distributed Systems) and apply its SLI/SLO framing to your next design."
        ],
        "nextStrategy": [
            { "action": "Redo this problem with a focus on the analytics pipeline" },
            { "action": "Practice a rate-limiting / API abuse prevention system design" },
            { "action": "Study Amazon DynamoDB + ElastiCache patterns for URL shortener scale" }
        ]
    }'::jsonb
),
(
    user_id,
    'sde',
    'LRU Cache Implementation',
    'Meta',
    6,
    38,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days' + INTERVAL '38 minutes',
    '{
        "candidateName": "Candidate",
        "role": "Software Engineer",
        "date": "Jan 11, 2025",
        "verdict": {
            "signal": "Lean Hire",
            "confidence": 6,
            "level": "L4 / Mid-Level",
            "risk": "Medium",
            "summary": "The candidate solved the LRU cache correctly using a HashMap + Doubly Linked List but struggled to reason about thread-safety and advanced optimizations. The solution was working but required some nudging on edge cases."
        },
        "decision": {
            "worked": [
                "Correctly identified HashMap + DLL as the O(1) solution without hints",
                "Handled the eviction logic correctly on cache miss",
                "Walked through the solution with a concrete example before coding"
            ],
            "blocked": [
                "Did not address thread-safety — needed explicit prompting",
                "Initial implementation had a bug with the dummy head/tail sentinel pattern",
                "Did not discuss alternatives (e.g., OrderedDict in Python)"
            ],
            "change": [
                "Always discuss concurrency implications before finalizing a data structure design",
                "Use sentinel nodes from the start to simplify DLL edge cases",
                "Know your language standard library — mention LinkedHashMap in Java / OrderedDict in Python"
            ]
        },
        "technicalProfile": [
            { "name": "Algorithm Selection", "desc": "Correctly chose optimal data structure combination", "status": "strong" },
            { "name": "Edge Case Handling", "desc": "Caught empty cache and capacity=1 but missed thread-safety", "status": "developing" },
            { "name": "Code Quality", "desc": "Clean variable naming, reasonable structure, some redundant checks", "status": "developing" },
            { "name": "Communication", "desc": "Thought out loud but occasionally went quiet during debugging", "status": "developing" },
            { "name": "Optimization Awareness", "desc": "Recognized O(1) requirement but did not proactively offer language built-in alternatives", "status": "weak" }
        ],
        "roundInsight": {
            "type": "Coding",
            "score": "developing",
            "summary": "A functional solution with the right algorithmic intuition, but the execution had a bug that required an interviewer nudge, and thread-safety was skipped entirely. At the L4 bar, candidates are expected to surface concurrency concerns independently.",
            "breakdown": [
                { "category": "Problem Understanding", "status": "strong", "text": "Asked clarifying questions about capacity and eviction policy upfront." },
                { "category": "Solution Design", "status": "strong", "text": "Correctly proposed HashMap + DLL before writing any code." },
                { "category": "Implementation", "status": "developing", "text": "Working solution but had a subtle bug with pointer updates during eviction." },
                { "category": "Testing & Edge Cases", "status": "developing", "text": "Tested happy path but skipped concurrent access and integer overflow for keys." }
            ]
        },
        "failurePatterns": [
            { "title": "Concurrency Blind Spot", "desc": "Thread-safety was not mentioned proactively. Senior engineers are expected to flag this in any shared data structure design." },
            { "title": "Bug Under Pressure", "desc": "Pointer update logic had a subtle off-by-one. Needs more practice with linked list manipulation under time pressure." }
        ],
        "readinessMap": {
            "ready": [
                "Mid-level coding screens at most product companies",
                "Frontend/Full-stack roles where algorithmic depth is secondary",
                "Startups prioritizing execution speed over CS fundamentals"
            ],
            "needsWork": [
                "FAANG coding bars (Meta E4/E5 expects flawless execution)",
                "Systems with concurrency requirements",
                "Roles requiring deep knowledge of language internals"
            ]
        },
        "improvementPlan": [
            "Practice 10 linked list problems on LeetCode (Medium/Hard) with a strict 25-minute timer to reduce bugs under pressure.",
            "Study Java Concurrent collections (ConcurrentHashMap, Collections.synchronizedMap) and Python threading.Lock for LRU thread-safety.",
            "For every data structure problem, add a step: ''What breaks if two threads call this simultaneously?''"
        ],
        "nextStrategy": [
            { "action": "Retry this problem with a thread-safe implementation using ReentrantReadWriteLock" },
            { "action": "Solve LFU Cache (LeetCode 460) as the natural follow-up" },
            { "action": "Practice explaining your solution to a rubber duck before the interviewer sees it" }
        ]
    }'::jsonb
),
(
    user_id,
    'devops',
    'Kubernetes Cluster Autoscaler Debug',
    'AWS',
    7,
    52,
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '14 days' + INTERVAL '52 minutes',
    '{
        "candidateName": "Candidate",
        "role": "DevOps / SRE Engineer",
        "date": "Jan 4, 2025",
        "verdict": {
            "signal": "Hire",
            "confidence": 7,
            "level": "Senior SRE",
            "risk": "Low-Medium",
            "summary": "Strong production mindset and solid Kubernetes debugging methodology. The candidate systematically narrowed down the autoscaler issue, checked the right signals in the right order, and proposed a sensible fix. Minor gaps in FinOps awareness and multi-cluster observability."
        },
        "decision": {
            "worked": [
                "Started by checking node conditions and cluster-autoscaler logs — correct first instinct",
                "Identified pending pods due to node selector constraints as root cause",
                "Proposed a staged rollout fix with feature flags and rollback plan"
            ],
            "blocked": [
                "Did not check resource quotas per namespace until prompted",
                "Missed the FinOps angle — scaling up costs money, budget alerts matter",
                "No mention of Cluster Autoscaler Expander strategies (LeastWaste vs Priority)"
            ],
            "change": [
                "Build a checklist habit: Node → Pod → Quota → Policies → Networking for K8s debug",
                "Always quantify cost impact of scaling decisions in production SRE interviews",
                "Study CA expander strategies and when to use them"
            ]
        },
        "technicalProfile": [
            { "name": "Kubernetes Debugging", "desc": "Navigated kubectl commands systematically, checked the right resources", "status": "strong" },
            { "name": "Root Cause Analysis", "desc": "Identified node selector mismatch as root cause within ~15 minutes", "status": "strong" },
            { "name": "Observability", "desc": "Mentioned Prometheus/Grafana but did not drive the investigation with metrics", "status": "developing" },
            { "name": "Cost Awareness", "desc": "Did not raise cost implications of autoscaler behavior", "status": "weak" },
            { "name": "Communication", "desc": "Clear and methodical explanations throughout the session", "status": "strong" }
        ],
        "roundInsight": {
            "type": "Debug",
            "score": "strong",
            "summary": "Excellent systematic debugging approach that mirrors how senior SREs operate in production. The candidate has a strong instinct for Kubernetes internals. The gaps are in cross-cutting concerns (cost, multi-cluster) rather than core debugging skills.",
            "breakdown": [
                { "category": "Initial Triage", "status": "strong", "text": "Checked node state, pod state, and CA logs in the right order." },
                { "category": "Root Cause Identification", "status": "strong", "text": "Correctly identified node selector + taint mismatch as the blocking condition." },
                { "category": "Fix & Rollout", "status": "developing", "text": "Proposed a valid fix but rollback plan needed more detail on validation gates." },
                { "category": "Post-Incident", "status": "weak", "text": "Did not discuss postmortem, runbook update, or alerting improvements." }
            ]
        },
        "failurePatterns": [
            { "title": "Post-Incident Blindspot", "desc": "Focused entirely on the fix without discussing the systemic improvements (runbooks, alerts, blameless postmortems) that separate SREs from sysadmins." },
            { "title": "Cost Deafness", "desc": "Autoscaler decisions have direct cost impact. Not raising this in a DevOps interview signals incomplete production experience." }
        ],
        "readinessMap": {
            "ready": [
                "Senior SRE roles at mid-size product companies",
                "Platform engineering teams managing multi-cluster Kubernetes",
                "On-call rotations for production Kubernetes infrastructure"
            ],
            "needsWork": [
                "FAANG SRE (stronger postmortem and cost culture expected)",
                "FinOps-focused roles at cloud-native companies",
                "Multi-region, multi-cluster chaos engineering scenarios"
            ]
        },
        "improvementPlan": [
            "Build a personal Kubernetes debug runbook — document the exact kubectl commands for each failure class (CrashLoopBackOff, Pending, Evicted, OOMKilled).",
            "Study the Cluster Autoscaler FAQ and expander strategies (LeastWaste, Priority, Random) to understand when each is optimal.",
            "Practice the postmortem format: Timeline → Root Cause → Impact → Action Items → Prevention — and include it in every debug scenario answer."
        ],
        "nextStrategy": [
            { "action": "Run a Kubernetes cluster autoscaler simulation with intentional node selector mismatches in a local kind cluster" },
            { "action": "Write a mock postmortem for this incident following the Google SRE postmortem template" },
            { "action": "Study AWS Cost Explorer integration with EKS cluster autoscaler for FinOps awareness" }
        ]
    }'::jsonb
);

-- ============================================================
-- 2. CUSTOM INTERVIEWS (completed_custom_interviews)
-- ============================================================

INSERT INTO completed_custom_interviews
    (user_id, title, job_role, job_description, score, duration_mins, started_at, completed_at, report_data)
VALUES
(
    user_id,
    'Distributed rate limiter for a SaaS API gateway',
    'Senior Backend Engineer',
    'We are looking for a backend engineer to join our platform team. You will design and build rate limiting, throttling, and API gateway infrastructure for a multi-tenant SaaS product serving 50M requests/day.',
    9,
    55,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '55 minutes',
    '{
        "candidateName": "Candidate",
        "role": "Senior Backend Engineer",
        "date": "Jan 13, 2025",
        "verdict": {
            "signal": "Strong Hire",
            "confidence": 9,
            "level": "Staff / L6",
            "risk": "Very Low",
            "summary": "Exceptional performance. The candidate demonstrated deep knowledge of distributed rate limiting algorithms (Token Bucket, Sliding Window Log, Fixed Window Counter) and correctly reasoned about their tradeoffs for a multi-tenant SaaS context. Their Redis-based implementation design was production-grade."
        },
        "decision": {
            "worked": [
                "Immediately distinguished between Token Bucket (burst-friendly) and Sliding Window Log (precision) with concrete examples",
                "Proposed a Redis INCR + EXPIRE pattern for fixed windows and a Lua script for atomic sliding window counters",
                "Addressed multi-region rate limiting with a gossip-based soft limit approach"
            ],
            "blocked": [
                "Did not initially consider tenant-level vs user-level granularity — needed a prompt",
                "Brief confusion about Redis cluster key distribution for multi-key Lua scripts"
            ],
            "change": [
                "Lead with tenant vs user granularity as an explicit axis in any SaaS rate limiting design",
                "Study Redis Cluster EVALSHA behavior for multi-key scripts and the KEYS constraint"
            ]
        },
        "technicalProfile": [
            { "name": "Algorithm Depth", "desc": "Deep, unprompted knowledge of rate limiting algorithms and their tradeoffs", "status": "strong" },
            { "name": "Distributed Systems", "desc": "Correctly addressed multi-region consistency with soft limits and sync strategies", "status": "strong" },
            { "name": "Redis Expertise", "desc": "Production-grade Redis patterns — Lua scripts, pipelining, EXPIRE atomicity", "status": "strong" },
            { "name": "SaaS Design Thinking", "desc": "Initially missed tenant vs user granularity but recovered quickly", "status": "developing" },
            { "name": "Communication", "desc": "Crystal clear explanations with concrete numbers and named algorithm alternatives", "status": "strong" }
        ],
        "roundInsight": {
            "type": "Custom Coding/Design",
            "score": "strong",
            "summary": "A textbook Staff-level design session. The candidate proactively explored edge cases, offered multiple algorithmic alternatives with tradeoffs, and proposed a production-grade implementation using Redis — all without hand-holding.",
            "breakdown": [
                { "category": "Problem Scoping", "status": "strong", "text": "Asked about burst behavior, tenant count, and acceptable error rate before designing." },
                { "category": "Algorithm Selection", "status": "strong", "text": "Evaluated 3 algorithms with clear tradeoffs, landed on sliding window counter for most use cases." },
                { "category": "Implementation", "status": "strong", "text": "Redis Lua script for atomicity was correct and cited actual Redis docs behavior." },
                { "category": "Scale & Reliability", "status": "developing", "text": "Multi-region design was good but Redis Cluster key co-location concern slipped through." }
            ]
        },
        "failurePatterns": [
            { "title": "SaaS Tenant Modeling Lag", "desc": "Defaulted to per-user rate limiting before considering per-tenant limits, which is the primary concern in multi-tenant SaaS products." }
        ],
        "readinessMap": {
            "ready": [
                "Staff/Principal Engineer roles at SaaS companies",
                "API Platform / Gateway teams at scale",
                "Distributed systems design-heavy interviews at any tier"
            ],
            "needsWork": [
                "Redis Cluster internals (KEYS constraint for multi-key Lua scripts)",
                "Tenant modeling in SaaS — needs to be the first instinct, not a recovery"
            ]
        },
        "improvementPlan": [
            "Study Redis Cluster and the KEYS requirement for Lua scripts — specifically how hash tags ({tenant_id}) solve key slot co-location.",
            "Build a mental model for SaaS rate limiting: always start with Tenant → User → Endpoint as the granularity hierarchy."
        ],
        "nextStrategy": [
            { "action": "Implement a working Redis sliding window rate limiter and test it under concurrency" },
            { "action": "Read the Cloudflare blog on their distributed rate limiting architecture" },
            { "action": "Design a circuit breaker system as the natural follow-up to rate limiting" }
        ]
    }'::jsonb
),
(
    user_id,
    'Behavioral interview for a Staff engineer role',
    'Staff Software Engineer',
    'Looking for a Staff engineer to lead cross-team technical initiatives, mentor senior engineers, and define the technical direction for the infrastructure platform.',
    7,
    40,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days' + INTERVAL '40 minutes',
    '{
        "candidateName": "Candidate",
        "role": "Staff Software Engineer",
        "date": "Jan 8, 2025",
        "verdict": {
            "signal": "Hire",
            "confidence": 7,
            "level": "Staff / L6",
            "risk": "Medium",
            "summary": "Strong individual contributor instincts with growing leadership presence. The candidate told compelling stories about technical impact but struggled to articulate the organizational and influence dimensions expected at the Staff level. With coaching, they are close to the bar."
        },
        "decision": {
            "worked": [
                "''Tell me about a time you disagreed with your manager'' — used STAR cleanly and showed maturity",
                "Quantified impact in all three technical stories (latency reduction, cost savings, cycle time)",
                "Showed self-awareness about areas for growth when prompted"
            ],
            "blocked": [
                "Could not clearly articulate how they influenced engineers outside their team (Staff-level expectation)",
                "''Where do you want to be in 5 years?'' response was vague — no clear technical vision",
                "Avoided conflict in the ''influence without authority'' story — sanitized version raised flags"
            ],
            "change": [
                "Prepare explicit cross-team influence stories — projects where you changed someone else''s roadmap or standards",
                "Develop a crisp 2-minute ''technical vision'' narrative for your domain",
                "In conflict stories, name the actual tension — interviewers trust candidates more when they acknowledge friction"
            ]
        },
        "technicalProfile": [
            { "name": "Technical Impact", "desc": "Strong quantified stories of hands-on technical work", "status": "strong" },
            { "name": "Leadership Presence", "desc": "Good mentor stories but cross-team influence was underdeveloped", "status": "developing" },
            { "name": "Communication", "desc": "Clear and confident delivery — good pacing and structure", "status": "strong" },
            { "name": "Self-Awareness", "desc": "Acknowledged weaknesses authentically when asked", "status": "strong" },
            { "name": "Strategic Vision", "desc": "Could not articulate a clear technical direction beyond current role scope", "status": "weak" }
        ],
        "roundInsight": {
            "type": "Behavioral",
            "score": "developing",
            "summary": "Strong IC foundation with a developing Staff-level leadership narrative. The candidate''s technical stories were compelling, but the organizational influence and vision dimensions — the defining traits of Staff engineers — need more explicit preparation.",
            "breakdown": [
                { "category": "STAR Story Quality", "status": "strong", "text": "Well-structured answers with clear situation, action, and quantified results." },
                { "category": "Cross-Team Influence", "status": "weak", "text": "Could not name a project where they changed another team''s direction or standards." },
                { "category": "Conflict Navigation", "status": "developing", "text": "Named the conflict but avoided describing the full friction — came across as diplomatic rather than authentic." },
                { "category": "Vision & Direction", "status": "weak", "text": "No clear technical north star beyond current project scope." }
            ]
        },
        "failurePatterns": [
            { "title": "Staff-Level Influence Gap", "desc": "Staff-level behavioral screens specifically test for influence without authority at org scale. Without a strong cross-team story, candidates fail to clear the bar regardless of technical quality." },
            { "title": "Conflict Sanitization", "desc": "Over-polished conflict stories signal risk-aversion. Experienced interviewers look for candidates who can name disagreements authentically and show they resolved them constructively." }
        ],
        "readinessMap": {
            "ready": [
                "Senior Engineer (L5) behavioral bars at any company",
                "Tech Lead roles where IC + leadership balance is acceptable",
                "Companies with strong mentorship culture opportunities"
            ],
            "needsWork": [
                "Staff/L6 behaviorals at FAANG — cross-team influence is a hard requirement",
                "VP/Director-level influence panels",
                "Roles requiring explicit organizational design experience"
            ]
        },
        "improvementPlan": [
            "Identify and prepare 3 cross-team influence stories before your next Staff interview — look for: standards you set that other teams adopted, roadmaps you changed through technical argument, or engineers you upskilled outside your direct team.",
            "Craft your ''technical north star'' narrative: a 90-second answer to ''What would you build if you had a year and a team?'' in your domain.",
            "Re-examine your conflict stories — add the tension explicitly, then show the resolution. Authenticity > Polish."
        ],
        "nextStrategy": [
            { "action": "Map your last 2 years of work to: IC impact / team leadership / org influence — find the org influence gaps" },
            { "action": "Practice the ''influence without authority'' scenario with a peer mock interview" },
            { "action": "Read ''The Staff Engineer''s Path'' by Tanya Reilly — directly maps to these gaps" }
        ]
    }'::jsonb
);

END $$;
