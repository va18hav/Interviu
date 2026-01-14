import google from "../assets/images/google.png"
import amazon from "../assets/images/amazon.png"
import meta from "../assets/images/meta.png"

const TechInterviews = [
    {
        "id": 1,
        "company": "Google",
        "role": "L4",
        "icon": google,
        "level": "Intermediate",
        "totalDuration": "80 min",
        "skills": ["Advanced DSA Reasoning", "Algorithmic Trade-offs", "Verbal Complexity Analysis", "Googliness", "Leadership without Authority"],
        "overview": "For this role Google emphasizes strong data structures and algorithms skills, the ability to reason clearly about problem-solving strategies, and to communicate trade-offs and complexity verbally during interviews. Behavioral signals around General Cognitive Ability and 'Googliness' are also critical, with focus on ownership, collaboration, and navigating ambiguity in addition to technical depth.",

        "companyTraits": {
            "interviewStyle": "analytical",
            "emphasis": ["DSA", "Problem Solving", "Scale"],
            "behavioralFocus": "Googliness & GCA"
        },
        "rounds": {
            "techRoundOne": {
                "title": "Core DSA & Logic",
                "id": "tech-1",
                "type": "technical",
                "duration": "5 min",
                "focus": ["DSA", "Logic"],
                "overview": "Focuses on core DSA fundamentals through verbal reasoning and algorithmic logic explanation. Candidates explain approaches, trade-offs, and complexity without writing code, testing clarity of thought and structured problem-solving.",

                "questions": [
                    "Given an integer array, explain how you would find the length of the longest contiguous subarray with sum equal to a target K, starting from a brute-force approach and then optimizing using prefix sums and hashing.",

                    "You are given a sorted array that has been rotated at an unknown pivot; describe how you would logically find the minimum element in O(log n) time and which invariants you rely on during the search.",

                    "Given an array of positive integers and a target sum S, walk through how you would determine whether there exists a contiguous subarray whose sum is exactly S, and how you would handle large inputs without overflow.",

                    "Given a string, describe in detail how you would compute the length of the longest substring without repeating characters using a sliding-window approach, including how you track indices and complexity.",

                    "Given two strings s and t, explain how you would determine if t is an anagram of s and then how you would extend the logic to handle Unicode and streaming input.",

                    "Given a string containing only brackets like '()[]{}', explain how you would determine if the input string is valid and how you would detect prefix-related violations early.",

                    "You are given a string s; describe how you would compress it by replacing consecutive repeated characters with the character followed by the count (for example, aaabb → a3b2) and when in-place modification is practical.",

                    "Explain how you would detect whether a singly linked list has a cycle and, if so, how you would logically find the node where the cycle starts, comparing different strategies and their space trade-offs.",

                ]
            },
            "techRoundTwo": {
                "title": "Advanced Algorithms & Optimization",
                "id": "tech-2",
                "type": "technical",
                "duration": "30 min",
                "focus": ["Advanced DSA", "Optimization"],
                "overview": "Tests deeper algorithmic understanding through advanced topics and optimization strategies. Emphasis on explaining complex data structures, algorithm trade-offs, and scalability considerations verbally.",

                "questions": [
                    "You are given a grid with obstacles; describe how you would count the number of unique paths from top-left to bottom-right, first with a recursive formulation and then as a bottom-up dynamic programming table.",

                    "Given an array of integers, explain two approaches to find the length of the longest increasing subsequence: an O(n^2) dynamic programming method and an O(n log n) method using binary search, and when each is acceptable.",

                    "Given a string s, explain how you would compute the minimum number of insertions needed to make it a palindrome, including how you define your DP state and relate it to the longest palindromic subsequence.",

                    "You are given a list of jobs with start time, end time, and profit; walk through how you would find the maximum profit subset of non-overlapping jobs using dynamic programming and sorting by end time.",

                    "Given a 2D matrix of integers, explain how you would find a path from top-left to bottom-right that minimizes the sum of the values along the path and how you would adapt your reasoning for large sparse grids.",

                    "You are given a weighted directed graph with non-negative weights; verbally walk through how you would implement Dijkstra's algorithm using a priority queue and compare the complexity on sparse versus dense graphs.",

                    "In a directed graph, explain how you would detect whether there is a cycle and return one such cycle, contrasting a DFS-based approach with Kahn's algorithm for topological sorting.",

                    "Given a connected, undirected, weighted graph, describe how you would compute its Minimum Spanning Tree and when you would choose Kruskal's algorithm versus Prim's algorithm in real scenarios.",

                    "You are given a graph representing a road network; explain how you would reason about finding single-source shortest paths when some nodes have very high degree and memory is constrained.",

                    "Design a Trie data structure that supports insert, search, and prefix search for lowercase English words; describe the node structure verbally and how operations traverse the tree.",

                    "You are given a dictionary of words; explain how you would use a Trie to implement an autocomplete feature that returns the top K suggestions for a given prefix and how you would incorporate ranking or frequency.",

                    "Explain how you would use a Trie or a related structure to detect whether any string in a list is a prefix of another string, and how you would ensure the solution scales to very large dictionaries.",

                    "Describe how a Segment Tree can be used to support point updates and range sum queries on an array, and walk through how queries and updates conceptually traverse the tree.",

                    "You need to support range minimum queries and point updates on an array; compare at a high level how a Segment Tree, a Fenwick Tree, and a Sparse Table differ and when you would prefer each.",

                    "Consider an array representing daily user traffic; explain how you would conceptually use a Segment Tree with lazy propagation to support range increment updates and range maximum queries without going into code details."

                ]
            },
            "behavioral": {
                "title": "Googliness & Leadership",
                "id": "behavioral-1",
                "type": "behavioral",
                "duration": "20 min",
                "overview": "Evaluates 'Googliness' through behavioral scenarios focusing on leadership without authority, handling ambiguity, conflict resolution, and fostering diversity. STAR-method responses expected with emphasis on impact and learning.",

                "questions": [
                    "Tell me about a time you had to make progress on a project with very ambiguous or frequently changing requirements; how did you bring clarity while still moving forward.",

                    "Describe a situation where you had to influence a technical decision without having formal authority over the people involved; what specific actions did you take and what was the outcome.",

                    "Give an example of a time when two senior teammates strongly disagreed on the direction of a project; how did you help resolve the conflict and what did you learn.",

                    "Tell me about a time you identified a critical problem that nobody officially owned; how did you step in, and how did you balance this with your existing responsibilities.",

                    "Describe a situation where you received feedback you strongly disagreed with; how did you respond in the moment, and what did you do afterward.",

                    "Give an example of a time when you worked with a team that had very diverse backgrounds or viewpoints; how did you ensure everyone was heard and productive.",

                    "Tell me about a time you had to deliver under a very tight deadline with incomplete information; how did you decide what to prioritize and what to cut.",

                    "Describe a time when you changed your mind about a technical approach after new data or feedback; what did that look like in practice and how did you communicate it.",

                    "Tell me about a time you mentored or unblocked a teammate even though it was not formally part of your role; what motivated you and what was the impact.",

                    "Describe a situation where a decision you made negatively affected another team or stakeholder; how did you handle the fallout and rebuild trust.",

                    "Give an example of a time when you had to challenge a decision or plan that you believed was not in the users' best interest; how did you raise your concerns.",

                    "Tell me about a time you built or worked on a product that needed to support users with very different needs or constraints; how did you incorporate those perspectives into your decisions.",

                    "Describe a time you joined a project late when the architecture or direction was already mostly set; how did you ramp up and still add meaningful value.",

                    "Tell me about a situation where your team was stuck or going in circles; what did you do to create structure, drive alignment, and move toward a decision.",

                    "Give an example of a time when you made a mistake that impacted your team or a production system; how did you handle communication, mitigation, and learning afterward."

                ]
            }
        }
    },

    {
        "id": 2,
        "company": "Amazon",
        "role": "SDE II",
        "icon": amazon,
        "level": "Intermediate",
        "totalDuration": "120 min",
        "skills": ["DSA Problem Solving", "LLD Design", "System Scalability", "Leadership Principles", "Customer Obsession"],
        "overview": "Amazon SDE II interviews typically feature an Online Assessment followed by a 4-round onsite loop with 3-4 coding/LLD sessions, one system design, and behavioral questions tied to Leadership Principles (LPs) in every round. Emphasis is on medium-hard LeetCode-style problems, object-oriented design, scalable systems, and demonstrating LPs like Ownership, Customer Obsession, Dive Deep, and Bias for Action through STAR responses.",

        "companyTraits": {
            "interviewStyle": "pragmatic",
            "emphasis": ["Coding", "LLD", "System Design"],
            "behavioralFocus": "Leadership Principles"
        },
        "rounds": {
            "techRoundOne": {
                "title": "Coding & DSA Round 1",
                "id": "tech-1",
                "type": "technical",
                "duration": "20 min",
                "focus": ["Arrays", "Strings", "Logic"],
                "overview": "Tests core DSA through verbal explanation of medium LeetCode problems, focusing on arrays/strings, optimization, and edge cases. Expect 1-2 problems with follow-ups; emphasize time/space complexity and customer impact verbally.",

                "questions": [
                    "Explain how you would find the longest substring without repeating characters in a string, detailing your sliding window logic, hash map usage, and O(n) optimization.",

                    "Given an array of integers and a target sum, describe how you would find two numbers that add up to the target, then extend to the 3-sum variant with no duplicates.",

                    "You have a list of intervals; merge overlapping ones and explain how you would sort and scan efficiently while handling edge cases like empty lists.",

                    "Describe merging k sorted lists using a min-heap; walk through the priority queue logic and why it's optimal for large k.",

                    "Given a string with parentheses, explain how you would validate if it's correctly matched using a stack, and handle follow-ups like finding minimum insertions.",

                    "Explain finding the maximum product subarray in an array with negatives; discuss prefix products and resetting logic for sign changes.",

                    "You are given meeting rooms with start/end times; determine the minimum number of rooms needed by sorting and sweeping.",

                    "Describe generating parentheses for n pairs using backtracking, pruning invalid paths early in the recursion tree.",

                    "Given a matrix, explain rotating it 90 degrees clockwise in-place, focusing on layer-by-layer transposition and reversal steps.",

                    "Explain finding the median of two sorted arrays in O(log(min(m,n))) time using binary search on partitions.",

                    "You have a string; find the length of the longest palindrome substring and compare expand-around-center vs DP approaches verbally.",

                    "Describe implementing LRU Cache with O(1) get/put using hash map and doubly linked list; explain eviction logic.",

                    "Given an array, find k closest points to origin using max-heap or quickselect; discuss trade-offs for large k.",

                    "Explain word break problem: given dictionary, segment word into matching sequences using DP memoization.",

                    "You are given stock prices; explain maximum profit with at most k transactions using DP states for transactions used."

                ]
            },
            "techRoundTwo": {
                "title": "Coding & LLD Round 2",
                "id": "tech-2",
                "type": "technical",
                "duration": "20 min",
                "focus": ["Graphs", "Trees", "LLD"],
                "overview": "Covers graph/tree algorithms and low-level design, with verbal walkthroughs of OOP design for extensible systems. Focus on clean interfaces, error handling, and Amazon-scale extensibility.",

                "questions": [
                    "Explain topological sort on a DAG using Kahn's BFS or DFS; handle cycle detection and multiple valid orders.",

                    "Given a binary tree, verify if it's a BST; describe inorder traversal logic and bounds checking recursively.",

                    "Design a parking lot system with multiple levels, spots by size, and payment; define classes, enums, and entry/exit flows verbally.",

                    "Explain lowest common ancestor in a binary tree using recursion or parent pointers; extend to kth ancestor.",

                    "You have a graph; detect and return cycle using DFS with colors or recursion stack; discuss space optimization.",

                    "Design an elevator system for a building with requests, optimization algorithms like SCAN, and fault tolerance.",

                    "Serialize/deserialize binary tree to string; explain preorder traversal with markers for nulls.",

                    "Given a tree, find diameter (longest path); use two BFS or recursion for heights and max sum.",

                    "Design a tic-tac-toe game with AI minimax; discuss alpha-beta pruning for efficiency.",

                    "Explain clone graph using DFS/BFS with hash map for visited nodes; handle disconnected components.",

                    "Design a movie ticket booking system with seats, shows, payments, and concurrency for high traffic.",

                    "You are given words; ladder length shortest transformation sequence using BFS levels.",

                    "Design a URL shortener with custom aliases, analytics, and collision resolution using base62.",

                    "Explain max area of island in binary matrix using DFS flood fill; track visited to avoid recount.",

                    "Design a file system with directories/files, CRUD operations, and path resolution using trie-like structure."

                ]
            },
            "techRoundThree": {
                "title": "System Design & Coding",
                "id": "tech-3",
                "type": "technical",
                "duration": "30 min",
                "focus": ["System Design", "Scalability"],
                "overview": "High-level system design for Amazon-scale services with deep dives into bottlenecks, trade-offs, and data models. Often includes a coding follow-up; emphasize customer obsession and frugality.",

                "questions": [
                    "Design a notification system like Amazon SNS that handles millions of pushes; cover queuing, retries, fan-out, and monitoring.",

                    "Explain designing Amazon Prime Video recommendation engine: data pipelines, ML models, A/B testing, and personalization at scale.",

                    "You need a rate limiter for APIs; compare token bucket vs leaky bucket, distributed with Redis, and handling bursts.",

                    "Design URL shortener like bit.ly with analytics, custom URLs, expiration; discuss ID generation, sharding, caching.",

                    "Explain a pastebin service like AWS S3 + CloudFront for syntax-highlighted snippets with versioning and access control.",

                    "Design Amazon's order recommendation system based on cart, history, inventory; real-time vs batch processing trade-offs.",

                    "You have a chat service like Slack; cover WebSockets, message delivery guarantees, search, and partitioning by user ID.",

                    "Explain designing a distributed cache like ElastiCache: eviction policies, consistency, multi-region replication.",

                    "Design a job scheduler like AWS Step Functions for cron jobs, dependencies, retries, and monitoring at scale.",

                    "Given e-commerce inventory; design sync across warehouses with eventual consistency, overbooking prevention.",

                    "Explain Twitter-like feed for Amazon sellers: fan-out on write vs pull, ranking, personalization signals.",

                    "Design an autocomplete search like Amazon search bar: tries, popularity ranking, query suggestions, latency.",

                    "You need a logging system like CloudWatch: ingestion at high TPS, aggregation, querying, retention policies.",

                    "Explain ride-sharing matching like Uber: geohashing, spatial indexing, real-time assignment, surge pricing.",

                    "Design a metrics monitoring system: time-series DB like Prometheus, alerting, dashboards for AWS services."

                ]
            },
            "behavioral": {
                "title": "Leadership Principles Deep Dive",
                "id": "behavioral-1",
                "type": "behavioral",
                "duration": "10 min",
                "overview": "Dedicated Bar Raiser-style round probing Amazon's 16 Leadership Principles via STAR stories. Every technical round also includes 2-3 LP questions; demonstrate Customer Obsession, Ownership, Dive Deep.",

                "questions": [
                    "Tell me about a time you were obsessed with a customer need and went above and beyond to solve it (Customer Obsession).",

                    "Describe when you took ownership of a project outside your scope and saw it through to delivery (Ownership).",

                    "Give an example of diving deep into a production issue to find the root cause and prevent recurrence (Dive Deep).",

                    "Tell me about a time you disagreed with a decision but committed after debate (Have Backbone; Disagree and Commit).",

                    "Describe simplifying a complex system or process while maintaining functionality (Invent and Simplify).",

                    "Give an example of bias for action: making a fast decision with incomplete info that drove results (Bias for Action).",

                    "Tell me when you insisted on high standards despite pushback from team or leadership (Insist on the Highest Standards).",

                    "Describe delivering results despite significant obstacles or resource constraints (Deliver Results).",

                    "Give an example of thinking big: proposing a scalable solution beyond immediate needs (Think Big).",

                    "Tell me about earning trust from skeptical stakeholders through transparency and delivery (Earn Trust).",

                    "Describe being frugal: accomplishing more with fewer resources innovatively (Frugality).",

                    "Give an example of learning from failure and applying it to future successes (Learn and Be Curious).",

                    "Tell me when you hired/developed talent or helped a low performer improve (Hire and Develop the Best).",

                    "Describe handling broad responsibility as scale increased, like compliance or sustainability (Success and Scale Bring Broad Responsibility).",

                    "Give an example of striving to be the best employer: improving team morale or diversity (Strive to be Earth's Best Employer)."

                ]
            }
        }
    },

    {
        "id": 3,
        "company": "Meta",
        "role": "E4",
        "icon": meta,
        "level": "Intermediate",
        "totalDuration": "180 min",
        "skills": ["LeetCode Medium-Hard Coding", "System/Product Design", "Behavioral Authenticity", "Complexity Analysis", "Scalability Reasoning"],
        "overview": "Meta E4 interviews follow a recruiter screen, technical phone screen (1-2 coding problems), and 4-5 onsite rounds: 2-3 coding, 1 system/product design, and 1 behavioral. Emphasis is on solving 2 medium-hard LeetCode problems per coding round in ~20-25 min each, with clear verbal communication, optimal solutions, and authenticity in behavioral discussions.",

        "companyTraits": {
            "interviewStyle": "collaborative",
            "emphasis": ["Coding Speed", "Design Trade-offs", "Communication"],
            "behavioralFocus": "Past Impact & Growth"
        },
        "rounds": {
            "techRoundOne": {
                "title": "Coding Round 1",
                "id": "tech-1",
                "type": "technical",
                "duration": "45 min",
                "focus": ["Arrays", "Strings", "Hashing"],
                "overview": "Solve and verbally explain 2 medium LeetCode problems (Meta-tagged preferred) with optimal time/space. Interviewer probes follow-ups; focus on edge cases, testing, and clean logic walkthrough.",

                "questions": [
                    "Given a string, find the length of the longest substring without repeating characters; explain sliding window with hash set/map and handle all edge cases verbally.",

                    "You have an array of integers; return indices of two numbers that add up to a target (two sum), then extend to 3-sum with no duplicates using sorting/hashes.",

                    "Merge intervals from a list of start/end pairs; describe sorting by start, then merging overlapping ones with greedy scan.",

                    "Given meeting rooms with times, find minimum rooms needed; explain sorting starts/ends and two-pointer sweep.",

                    "Validate parentheses string with multiple types; walk through stack-based matching and early mismatch detection.",

                    "Group anagrams from a list of strings; use sorted string or char-count tuple as key in hash map.",

                    "Longest palindrome substring; compare expand-around-center (O(n^2)) vs Manacher's algorithm verbally.",

                    "Product of array except self; explain left/right prefix products to achieve O(n) time O(1) extra space.",

                    "Container with most water; two pointers from ends, move shorter inward based on area formula.",

                    "Rotate array k steps; reverse entire, then reverse segments for in-place O(1) space.",

                    "Top k frequent elements; heap or quickselect on freq map, discuss O(n log k) vs O(n).",

                    "LRU Cache design verbally: hash doubly-linked list, O(1) get/put with move-to-front eviction.",

                    "Word break: segment string using dict with DP memoization or trie; explain recursion tree pruning.",

                    "Maximum subarray sum (Kadane); handle all-negative case, extend to circular variant.",

                    "Encode/decode strings to/from short links; base62 on hash or counter for collision-free IDs."

                ]
            },
            "techRoundTwo": {
                "title": "Coding Round 2",
                "id": "tech-2",
                "type": "technical",
                "duration": "45 min",
                "focus": ["Graphs", "Trees", "DP"],
                "overview": "2 more medium-hard problems, often graph/tree/DP Meta-tagged. Expect optimal solutions quickly; verbalize thought process, alternatives, and test cases before detailing logic.",

                "questions": [
                    "Course schedule: detect cycle in graph for topological order using Kahn's BFS or DFS.",

                    "Number of islands in grid; DFS/BFS flood fill, count components while marking visited.",

                    "Clone graph; DFS/BFS with hashmap for node copies, handle cycles and disconnects.",

                    "Word ladder shortest path; BFS on word graph differing by one letter using dict set.",

                    "Lowest common ancestor in binary tree; recursion returning paths or using properties.",

                    "Serialize/deserialize binary tree; preorder with markers for nulls, reconstruct recursively.",

                    "Validate binary search tree; inorder traversal or recursive bounds checking.",

                    "Diameter of binary tree; max of left+right heights at each node via recursion.",

                    "House robber linear DP; max loot non-adjacent, extend to circular houses with cases.",

                    "Unique paths in grid with obstacles; 2D DP top-down or bottom-up space optimized.",

                    "Longest increasing subsequence; O(n^2) DP or O(n log n) patience sorting binary search.",

                    "Coin change minimum coins; unbounded knapsack DP, handle impossible cases.",

                    "Maximal square in binary matrix; DP for largest square ending at each cell.",

                    "Edit distance (levenshtein); 2D DP for insert/delete/replace operations.",

                    "Regular expression matching; DP or recursion with memo for . and * wildcards."

                ]
            },
            "techRoundThree": {
                "title": "System/Product Design",
                "id": "tech-3",
                "type": "technical",
                "duration": "45 min",
                "focus": ["Architecture", "Scalability"],
                "overview": "Design Meta-scale service like News Feed or Messenger; cover functional/non-functional reqs, APIs, DB schema, scaling bottlenecks, caching/sharding. Verbal high-level diagrams and trade-offs.",

                "questions": [
                    "Design Facebook News Feed: ranking, fan-out, storage, real-time updates, personalization at billions scale.",

                    "Design Messenger chat app: 1:1/group, typing indicators, message guarantees, search, E2E encryption.",

                    "Design Instagram photo sharing: upload, feed, stories, filters, infinite scroll, CDN integration.",

                    "Design URL shortener for fb.me: collision handling, analytics, custom shortcodes, expiration.",

                    "Design typeahead/autocomplete for search: trie/index, popularity, query correction, latency <100ms.",

                    "Design Facebook friend recommendation: graph algorithms, ML features, anti-spam, scale to 3B users.",

                    "Design notification system: push/email/SMS, batching, preferences, retry queues, undeliverable handling.",

                    "Design Instagram Explore page: content ranking, diversity, A/B testing, cold start for new users.",

                    "Design a pastebin service: syntax highlighting, versioning, sharing, rate limiting, abuse detection.",

                    "Design Facebook Marketplace search: geolocation, filters, ranking, fraud prevention.",

                    "Design rate limiter for APIs: token bucket, distributed Redis, per-user/IP, burst handling.",

                    "Design a job queue system: scheduling, retries, priorities, dead letter queues, monitoring.",

                    "Design Twitter-like tweet service: timeline, retweets, likes, threading, global replication.",

                    "Design photo storage/viewer: sharding, thumbnails, transcoding pipeline, hot/cold storage.",

                    "Design Facebook Events: creation, RSVPs, recommendations, calendar sync, capacity limits."

                ]
            },
            "behavioral": {
                "title": "Behavioral & Retrospective",
                "id": "behavioral-1",
                "type": "behavioral",
                "duration": "45 min",
                "overview": "Discuss career trajectory, challenges overcome, teamwork, failures/learnings, and Meta fit. Be authentic; use STAR but focus on impact, growth mindset, and collaboration. Review past projects deeply.",

                "questions": [
                    "Tell me about yourself and why Meta specifically.",

                    "Describe your most significant career accomplishment and its impact.",

                    "Give an example of a time you failed; what did you learn and how did you apply it.",

                    "Tell me about a challenging bug or outage you debugged under pressure.",

                    "Describe working with a difficult team member; how did you resolve it.",

                    "Why are you looking to leave your current role/company.",

                    "Tell me about a project where you optimized performance at scale.",

                    "Describe receiving tough feedback; how did you act on it.",

                    "Give an example of mentoring juniors or cross-team collaboration.",

                    "How do you prioritize tasks in ambiguous situations.",

                    "Describe innovating on a feature that improved metrics/user experience.",

                    "Tell me about balancing perfectionism with shipping deadlines.",

                    "What excites you about Meta's challenges vs previous roles.",

                    "Describe a cross-functional project with design/product.",

                    "How do you stay updated technically and apply new learnings."

                ]
            }
        }
    }

]

export default TechInterviews;