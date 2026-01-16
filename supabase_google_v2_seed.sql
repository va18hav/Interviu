-- Add new columns for enhanced interview details
ALTER TABLE popular_interviews 
ADD COLUMN IF NOT EXISTS interviewer_personality text,
ADD COLUMN IF NOT EXISTS common_failure_reasons text[],
ADD COLUMN IF NOT EXISTS filter_type text;

-- Insert Google L3 Interview Data
INSERT INTO popular_interviews (
    company,
    role,
    icon_url,
    level,
    total_duration,
    overview,
    skills,
    company_traits,
    interviewer_personality,
    common_failure_reasons,
    filter_type,
    rounds
) VALUES (
    'Google',
    'Software Engineer L3',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    'Entry',
    '60 min',
    'Google L3 interviews evaluate problem-solving ability, algorithmic thinking, and communication clarity. The emphasis is on deriving correct solutions, explaining trade-offs, and demonstrating Googleyness rather than writing perfect code.',
    ARRAY['Algorithms', 'Problem Solving', 'Googleyness', 'Communication'], -- Mapped from emphasis/overview for UI compatibility
    '{
        "interviewStyle": "analytical",
        "emphasis": ["Algorithms", "Problem Solving", "Googleyness"],
        "behavioralFocus": "Googleyness & Leadership"
    }'::jsonb,
    'calm, probing, correctness-oriented',
    ARRAY[
        'jumping to solution without reasoning',
        'poor explanation of logic',
        'missing edge cases'
    ],
    'Software', -- New filter type
    '{
        "techRoundOne": {
            "id": "tech-1",
            "title": "Arrays & Core Logic",
            "type": "technical",
            "duration": "15 min",
            "shortOverview": "This round evaluates your ability to reason through fundamental array and string problems. Interviewers focus on logical clarity, optimization thinking, and how well you explain your approach verbally.",
            "roundIntent": "Evaluate the candidate’s ability to reason about basic data structures, derive efficient solutions, and communicate their thought process clearly.",
            "skillsEvaluated": [
                "Array traversal",
                "Sliding window reasoning",
                "Hash-based optimization",
                "Time and space complexity analysis"
            ],
            "difficultyBand": {
                "startingDifficulty": "Easy",
                "expectedCeiling": "Medium",
                "canEscalateTo": "Medium+ if candidate performs strongly"
            },
            "acceptableProblemTypes": [
                "Subarray and substring optimization",
                "Frequency counting",
                "Two-pointer reasoning",
                "Prefix sums"
            ],
            "interviewerFocus": [
                "Does the candidate reason before solving?",
                "Is the logic explained step-by-step?",
                "Are edge cases addressed naturally?"
            ],
            "antiPatternsToWatch": [
                "Memorized answers without explanation",
                "Ignoring constraints",
                "Overengineering simple problems"
            ],
            "followUpGuidelines": {
                "whenCandidateIsStrong": [
                    "Ask for alternative approaches",
                    "Introduce constraint changes",
                    "Ask about trade-offs"
                ],
                "whenCandidateIsAverage": [
                    "Clarify reasoning steps",
                    "Probe edge cases"
                ],
                "whenCandidateStruggles": [
                    "Ask for brute-force logic",
                    "Give Socratic hints"
                ]
            },
            "evaluationSignals": {
                "strongSignal": [
                    "Derives optimal solution independently",
                    "Explains complexity accurately",
                    "Anticipates follow-ups"
                ],
                "weakSignal": [
                    "Needs repeated hints",
                    "Cannot explain why solution works",
                    "Misses basic edge cases"
                ]
            }
        },
        "techRoundTwo": {
            "id": "tech-2",
            "title": "Trees & Graph Traversal",
            "type": "technical",
            "duration": "15 min",
            "shortOverview": "This round focuses on tree and graph traversal patterns. Interviewers assess your understanding of recursion, BFS vs DFS, and how you reason about hierarchical structures.",
            "roundIntent": "Assess recursive thinking, traversal logic, and comfort with tree and graph-based data structures.",
            "skillsEvaluated": [
                "DFS vs BFS reasoning",
                "Recursion and stack behavior",
                "Graph connectivity",
                "Tree properties"
            ],
            "difficultyBand": {
                "startingDifficulty": "Easy-Medium",
                "expectedCeiling": "Medium",
                "canEscalateTo": "Medium+"
            },
            "acceptableProblemTypes": [
                "Binary tree traversal",
                "Graph traversal",
                "Connected components",
                "Tree validation problems"
            ],
            "interviewerFocus": [
                "Can the candidate visualize recursion?",
                "Is space complexity understood?",
                "Are base cases clearly reasoned?"
            ],
            "antiPatternsToWatch": [
                "Confusing DFS and BFS",
                "Incorrect base cases",
                "Shallow recursion understanding"
            ],
            "followUpGuidelines": {
                "whenCandidateIsStrong": [
                    "Ask for iterative alternatives",
                    "Discuss space optimization"
                ],
                "whenCandidateStruggles": [
                    "Trace a small example",
                    "Guide base-case identification"
                ]
            },
            "evaluationSignals": {
                "strongSignal": [
                    "Clear recursion explanation",
                    "Correct traversal choice",
                    "Confident complexity discussion"
                ],
                "weakSignal": [
                    "Confused traversal logic",
                    "Cannot reason through recursion"
                ]
            }
        },
        "techRoundThree": {
            "id": "tech-3",
            "title": "Dynamic Programming & Optimization",
            "type": "technical",
            "duration": "15 min",
            "shortOverview": "This round evaluates structured problem decomposition and optimization thinking. Interviewers expect you to define states clearly and reason through transitions verbally.",
            "roundIntent": "Evaluate DP state formulation, recurrence reasoning, and optimization skills.",
            "skillsEvaluated": [
                "DP state definition",
                "Recurrence formulation",
                "Memoization vs tabulation",
                "Space optimization"
            ],
            "difficultyBand": {
                "startingDifficulty": "Medium",
                "expectedCeiling": "Medium+",
                "canEscalateTo": "Hard-lite"
            },
            "acceptableProblemTypes": [
                "1D and 2D DP",
                "Optimization problems",
                "Greedy vs DP comparisons"
            ],
            "interviewerFocus": [
                "Clarity of state definition",
                "Correct transitions",
                "Optimization awareness"
            ],
            "antiPatternsToWatch": [
                "Jumping to DP without clarity",
                "Incorrect state modeling"
            ],
            "followUpGuidelines": {
                "whenCandidateIsStrong": [
                    "Ask for space optimization",
                    "Formal recurrence derivation"
                ],
                "whenCandidateStruggles": [
                    "Define state verbally",
                    "Break into subproblems"
                ]
            },
            "evaluationSignals": {
                "strongSignal": [
                    "Clean state definition",
                    "Correct recurrence",
                    "Optimization reasoning"
                ],
                "weakSignal": [
                    "Unclear DP formulation",
                    "Guessing transitions"
                ]
            }
        },
        "behavioral": {
            "id": "behavioral-1",
            "title": "Googleyness & Collaboration",
            "type": "behavioral",
            "duration": "15 min",
            "shortOverview": "This round assesses collaboration, learning mindset, and reflection through real-world scenarios using the STAR method.",
            "roundIntent": "Evaluate ownership, learning agility, and alignment with Google’s culture.",
            "skillsEvaluated": [
                "Communication",
                "Ownership",
                "Learning agility",
                "Conflict resolution"
            ],
            "difficultyBand": {
                "startingDifficulty": "Baseline",
                "expectedCeiling": "Deep reflection"
            },
            "acceptableProblemTypes": [
                "Conflict scenarios",
                "Failure reflection",
                "Cross-team collaboration"
            ],
            "interviewerFocus": [
                "Depth of reflection",
                "Specificity of examples",
                "Ownership vs blame"
            ],
            "antiPatternsToWatch": [
                "Vague answers",
                "Lack of accountability"
            ],
            "followUpGuidelines": {
                "whenCandidateIsStrong": [
                    "Probe learning outcomes",
                    "Explore impact"
                ],
                "whenCandidateIsWeak": [
                    "Ask for specifics",
                    "Request concrete actions"
                ]
            },
            "evaluationSignals": {
                "strongSignal": [
                    "Clear ownership",
                    "Thoughtful reflection",
                    "Learning demonstrated"
                ],
                "weakSignal": [
                    "Generic responses",
                    "Avoids responsibility"
                ]
            }
        }
    }'::jsonb
);
