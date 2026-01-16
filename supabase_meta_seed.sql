
-- Clear existing Meta data to start fresh (as requested)
DELETE FROM popular_interviews WHERE company = 'Meta';

INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Meta Software Engineer E3
(
    'Meta',
    'Meta Software Engineer E3',
    'Entry',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'Problem Solving', 'Coding Patterns', 'Debugging Logic'],
    'Meta E3 interviews focus on core algorithmic problem-solving through 3 technical rounds plus behavioral. Emphasis on practical coding patterns used in Facebook production systems. Voice-friendly logic walkthroughs over syntax.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Algorithms", "Real-world Systems", "Execution"],
      "behavioralFocus": "Impact & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Array & Hashing Patterns",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Two Pointers", "Sliding Window", "Hash Maps"],
        "overview": "Fundamental Meta coding patterns from Facebook feeds and social graph problems. Logical walkthroughs of pointer movement and hash collision handling.",
        "questions": [
          "Two sum variants - indices, closest pair, triplet sum hash map logic.",
          "Longest substring no repeats - sliding window char set expansion contraction.",
          "Minimum window substring - multi-char count tracking sliding window.",
          "Container most water - two pointers height comparison movement rules.",
          "Trapping rain water - two pointers water level tracking inward movement.",
          "Product except self - left right prefix accumulation zero handling.",
          "Merge intervals - sort start time merge overlap condition.",
          "Subarray sum equals k - prefix sum hash map negative handling.",
          "Longest consecutive sequence - hash set interval merging.",
          "Group anagrams - char frequency tuple or sorted string signature.",
          "Top k frequent elements - bucket sort frequency array.",
          "LRU cache - hash map doubly linked list eviction promotion.",
          "Valid sudoku - row col box hash set checking.",
          "Rotate image matrix - transpose then reverse each row logic.",
          "Spiral matrix - four pointers boundary contraction traversal."
        ]
      },
      "techRoundTwo": {
        "title": "Tree Graph Social Patterns",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["BFS DFS", "Social Graph", "Tree Manipulation"],
        "overview": "Facebook social graph traversal patterns and tree manipulation common in feeds/ranking. Verbal recursion stack visualization expected.",
        "questions": [
          "Employee importance org chart - DFS recursion hash map lookup.",
          "Course schedule - topological sort Kahn indegree reduction.",
          "Number islands social connections - DFS BFS flood fill.",
          "Clone graph Facebook friends - DFS visited hash deep copy.",
          "Word ladder social distance - BFS level tracking shortest path.",
          "Lowest common ancestor users - path storage recursion logic.",
          "Max area cartesian tree - stack monotonic increasing candidates.",
          "Serialize deserialize tree - preorder encoding null markers.",
          "K closest points origin - max heap distance priority.",
          "Shortest bridge bipartite graph - multi-source BFS level tracking.",
          "Accounts merge emails - union find connected components.",
          "Reorganize string frequency - priority queue round robin.",
          "Alien dictionary - topological sort char graph indegree.",
          "Pacific Atlantic water flow - multi-source DFS reachable areas.",
          "Rotting oranges - multi-source BFS simultaneous spread."
        ]
      },
      "techRoundThree": {
        "title": "DP Backtracking Patterns",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Dynamic Programming", "Recursion", "Optimization"],
        "overview": "Meta production optimization problems requiring state definition and memoization reasoning. Table construction walkthroughs expected.",
        "questions": [
          "House robber Facebook ad placement - adjacent exclusion DP.",
          "Coin change minimum coins - unbounded knapsack impossible case.",
          "Longest increasing subsequence patience sorting O(n log n).",
          "Word break - DP substring existence boolean array.",
          "Unique paths grid obstacles - combinatorial DP.",
          "Partition equal subset sum - 0/1 knapsack space optimization.",
          "Letter phone combinations - backtracking digit mapping.",
          "Word search matrix - DFS backtracking visited marking.",
          "N queens - backtracking column diagonal tracking.",
          "Palindrome partition minimum cuts - DP boolean optimization.",
          "Edit distance Levenshtein - insert delete replace DP table.",
          "Longest palindromic substring - expand around centers O(n²).",
          "Decode ways - DP zero handling multiplication rules.",
          "Best time buy sell stock cooldown - state machine DP.",
          "Dungeon game minimum health - backward DP target first."
        ]
      },
      "behavioral": {
        "title": "Impact Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Meta behavioral emphasizes measurable impact through STAR format. Focus on execution velocity and cross-team results. Follow-ups probe business metrics achieved.",
        "questions": [
          "Shipped feature moved key metric significantly (Impact). STAR.",
          "Fixed critical production issue under deadline (Execution). STAR.",
          "Influenced senior engineers change direction (Influence). STAR.",
          "Owned unclear complex problem end-to-end (Ownership). STAR.",
          "Simplified complex system broader team benefit (Simplification). STAR.",
          "Moved faster than process allowed delivery (Bias for Action). STAR.",
          "Taught complex concept junior engineers (Teaching). STAR.",
          "Recovered from significant career failure (Resilience). STAR.",
          "Built tool saved team significant time (Leverage). STAR.",
          "Cross-team collaboration delivered business result (Collaboration). STAR.",
          "Prioritized correctly under resource constraints (Prioritization). STAR.",
          "Decomposition strategy complex ambiguous problem (Problem Solving). STAR.",
          "Customer empathy drove technical decision (User Focus). STAR.",
          "Technical excellence raised team standards (Excellence). STAR.",
          "Rapid learning new complex domain (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Meta Software Engineer E5
(
    'Meta',
    'Meta Software Engineer E5',
    'Senior',
    '60 min',
    ARRAY['System Design', 'Distributed Systems', 'Architecture', 'Leadership', 'Performance'],
    'E5 interviews blend advanced algorithms with Facebook-scale system design. Technical leadership scenarios test ability to make architectural trade-offs. Heavy production system emphasis.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["System Design", "Scale", "Technical Leadership"],
      "behavioralFocus": "Impact & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Advanced Algorithm Patterns",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Hard Problems", "Meta Patterns", "Optimization"],
        "overview": "Meta-hard problems requiring multiple optimization passes. Verbal complexity analysis across approaches expected.",
        "questions": [
          "Median data stream - two heaps balance reheapify logic.",
          "Sliding window maximum - deque monotonic eviction rules.",
          "LFU cache - freq doubly linked list promotion demotion.",
          "Serialize N-ary tree - level order child count prefix.",
          "Shortest palindrome - KMP prefix function computation.",
          "Minimum window substring multi-char - count tracking.",
          "Task scheduler CPU cooldown - max gap greedy PQ.",
          "Burst balloons - interval DP multiplication optimization.",
          "Dungeon game - backward DP minimum health path.",
          "Wildcard matching - greedy . * consumption rules.",
          "Longest valid parentheses - stack index matching lengths.",
          "Distinct subsequences - DP string matching count.",
          "IPO projects - max heap profit greedy selection.",
          "Minimum cost tree from leaf values - interval DP.",
          "Paint house III - DP state tracking cost color."
        ]
      },
      "techRoundTwo": {
        "title": "Facebook-Scale Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Social Graph", "Feed Ranking", "Real-time"],
        "overview": "Meta production systems - feeds, messaging, social graph at 3B+ users. Capacity planning, sharding, consistency trade-offs.",
        "questions": [
          "Design Facebook news feed - fanout pull ranking cache.",
          "Design Facebook Messenger - WebSocket sharding typing indicators.",
          "Design Instagram Explore - embedding similarity search ANN.",
          "Design Facebook Marketplace search - geo-sharding relevance.",
          "Design Facebook Groups - privacy ACL sharding hierarchy.",
          "Design Instagram Stories - ephemeral storage ranking TTL.",
          "Design WhatsApp status - end-to-end encryption fanout.",
          "Design Facebook Events - capacity conflict graph coloring.",
          "Design Instagram Reels recommendation - multi-stage ranking.",
          "Design Facebook friend recommendation - graph embedding.",
          "Design ad click attribution - last touch multi-touch models.",
          "Design Facebook Live streaming - CDN adaptive bitrate.",
          "Design Instagram shopping - product catalog graph sync.",
          "Design Facebook dating - compatibility scoring privacy.",
          "Design Instagram direct messaging - ephemeral encryption."
        ]
      },
      "techRoundThree": {
        "title": "Architecture Leadership",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Trade-offs", "Migration", "Evolution"],
        "overview": "Technical leadership through architectural decision-making. System evolution strategies and team guidance scenarios.",
        "questions": [
          "Monolith to microservices migration Facebook TAO graph.",
          "Database sharding strategy social graph consistent hashing.",
          "Cache invalidation strategy feed edge cache Zippy.",
          "Real-time consistency eventual vs strong social graph.",
          "API evolution GraphQL federation schema registry.",
          "Service ownership boundaries microservices social features.",
          "Production debugging strategy 99th percentile latency.",
          "Capacity planning 10x growth social graph sharding.",
          "Migration strategy deprecation legacy PHP Hack.",
          "Distributed tracing Zipkin Jaeger Facebook Scribe.",
          "Service level objectives SLO error budgets feeds.",
          "Technical debt prioritization impact vs effort framework.",
          "Cross-team architecture alignment RFC process.",
          "Platform enablement internal developer platform IDP.",
          "Observability golden signals social graph feeds."
        ]
      },
      "behavioral": {
        "title": "Impact Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Senior technical leadership impact across Facebook products. Cross-team influence and strategic execution emphasis.",
        "questions": [
          "Led major architectural migration multiple teams (Architecture Leadership). STAR.",
          "Influenced product direction technical constraints (Product Influence). STAR.",
          "Owned production system billions users daily (System Ownership). STAR.",
          "Mentored engineers promotion level-up (People Development). STAR.",
          "Simplified complex ranking system performance (System Simplification). STAR.",
          "Rapid execution tight deadline business impact (Execution Velocity). STAR.",
          "Technical strategy influenced roadmap years (Strategic Thinking). STAR.",
          "Cross-functional collaboration product engineering (Stakeholder Alignment). STAR.",
          "Technical excellence raised org standards (Standards Leadership). STAR.",
          "Recovered critical outage affected millions (Crisis Leadership). STAR.",
          "Built platform enabled multiple teams (Platform Enablement). STAR.",
          "Technical innovation patentable contribution (Innovation). STAR.",
          "Technical culture improvement hiring standards (Culture Building). STAR.",
          "Knowledge sharing conferences documentation (Thought Leadership). STAR.",
          "Technical risk management high stakes launch (Risk Management). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Meta MLOps Engineer
(
    'Meta',
    'Meta MLOps Engineer',
    'Intermediate',
    '60 min',
    ARRAY['ML Pipelines', 'Production ML', 'PyTorch', 'Distributed Training', 'A/B Testing'],
    'Meta MLOps focuses on Facebook-scale ML infrastructure for ranking/recommendation. PyTorch TRL expertise expected. Production concerns dominate over research.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Production ML", "Scale", "Reliability"],
      "behavioralFocus": "Impact & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "ML Infrastructure Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["PyTorch", "Distributed", "Optimization"],
        "overview": "Meta ML stack - PyTorch, FSDP, TRL, FAISS. Distributed training patterns and optimization strategies.",
        "questions": [
          "PyTorch FSDP fully sharded data parallel memory optimization.",
          "TorchRun elastic training fault tolerance checkpoint recovery.",
          "FAISS approximate nearest neighbor HNSW IVF quantization.",
          "TRL RLHF PPO preference optimization reward modeling.",
          "Mixed precision AMP autocast FP16 accumulation stability.",
          "Gradient checkpointing memory tradeoff recomputation cost.",
          "Optimizer sharding ZeRO Adam moments CPU offload.",
          "Dynamo TorchScript JIT compilation tracing vs scripting.",
          "TorchServe Triton model serving gRPC REST multi-model.",
          "ONNX Runtime TensorRT export optimization quantization.",
          "Model parallelism pipeline sharding activation checkpointing.",
          "Data parallel sync async gradient allreduce ring NCCL.",
          "Elastic training dynamic worker add remove checkpoint.",
          "DeepSpeed ZeRO stages memory optimizer partitioning.",
          "FairScale FSDP ShardedDDP Meta production training."
        ]
      },
      "techRoundTwo": {
        "title": "Production ML Systems",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Serving", "Monitoring", "Experimentation"],
        "overview": "Facebook-scale ML serving for feeds/ads/recommendations. A/B testing integration and production monitoring.",
        "questions": [
          "Multi-stage ranking Lambda architecture retrieval coarse fine.",
          "Real-time feature serving online store Redis HBase.",
          "Model A/B testing shadow traffic canary rollout.",
          "Prediction serving latency p99 <50ms autoscaling.",
          "Model freshness staleness monitoring retraining triggers.",
          "Feature drift input drift prediction drift KS test.",
          "Multi-tenant model serving resource isolation QPS limits.",
          "Online learning concept drift adaptation replay buffer.",
          "Model explainability production SHAP LIME latency tradeoff.",
          "Model compression dynamic quantization pruning distillation.",
          "Batch prediction scheduling Spark EMR Dataflow.",
          "Model registry MLflow WeightsBiases governance workflow.",
          "Data versioning DVC lakeFS feature lineage tracking.",
          "CI/CD ML pipelines GitHub Actions Kubeflow Argo.",
          "Shadow deployment model validation production traffic."
        ]
      },
      "techRoundThree": {
        "title": "Meta ML Infrastructure",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Facebook Scale", "Reliability", "Cost"],
        "overview": "Meta-specific ML infrastructure patterns for 3B+ users daily. Cost optimization at Facebook scale.",
        "questions": [
          "Facebook ranking multi-objective learning to rank LambdaMART.",
          "DeepText multilingual NLP embedding alignment cross-lingual.",
          "FAIR sequence-to-sequence Transformer translation ranking.",
          "PyTorch Mobile on-device inference TensorFlow Lite.",
          "GPU cluster scheduling TPU v4 Pod slice allocation.",
          "Model checkpointing S3 EFS fault tolerance recovery.",
          "Hyperparameter tuning Ax2 population based Bayesian.",
          "Feature store Tecton HBase online offline sync.",
          "A/B testing experimentation platform multi-armed bandit.",
          "Model monitoring Prometheus Grafana SLO alerting.",
          "Cost optimization spot GPU reserved instances FinOps.",
          "Multi-region model deployment latency routing CDN.",
          "Privacy differential privacy federated learning aggregation.",
          "Responsible AI fairness bias mitigation counterfactual.",
          "ML platform self-service developer experience CI/CD."
        ]
      },
      "behavioral": {
        "title": "Impact Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "MLOps leadership through production ML system ownership. Cross-team ML platform enablement scenarios.",
        "questions": [
          "Shipped ML model significant business metric lift (ML Impact). STAR.",
          "Built ML platform team self-service adoption (Platform Enablement). STAR.",
          "Recovered degraded ML model production traffic (Production Reliability). STAR.",
          "Influenced ranking model architecture direction (Technical Influence). STAR.",
          "Rapid ML experimentation validated hypothesis (Experimentation Speed). STAR.",
          "Mentored ML engineers production best practices (Technical Mentorship). STAR.",
          "Simplified ML pipeline developer productivity (Developer Experience). STAR.",
          "ML cost optimization significant compute savings (Cost Leadership). STAR.",
          "Cross-team ML platform adoption resistance (Change Management). STAR.",
          "Production ML incident command coordination (Crisis Leadership). STAR.",
          "Long-term ML infrastructure strategy execution (Strategic Execution). STAR.",
          "Responsible AI fairness production deployment (Ethical Leadership). STAR.",
          "ML knowledge sharing internal conferences (Thought Leadership). STAR.",
          "Technical excellence raised ML standards (Excellence Leadership). STAR.",
          "Continuous learning SOTA production implementation (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Meta Data Scientist
(
    'Meta',
    'Meta Data Scientist',
    'Intermediate',
    '60 min',
    ARRAY['Experimentation', 'Causal Inference', 'SQL', 'Statistics', 'Business Impact'],
    'Meta Data Science emphasizes experimentation at Facebook scale and causal inference for product decisions. Heavy A/B testing and statistical rigor.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Experimentation", "Causal", "Business Impact"],
      "behavioralFocus": "Impact & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Statistics & Probability",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Probability", "Estimation", "Bayesian"],
        "overview": "Meta-scale probability puzzles and statistical inference. Expected value calculations and multiple testing corrections.",
        "questions": [
          "Facebook friend recommendation probability ranking scoring.",
          "A/B test power calculation minimum detectable effect.",
          "Multiple testing correction FDR Bonferroni tradeoff.",
          "Bayesian A/B testing beta prior conjugate posterior.",
          "Sample size calculation sequential testing alpha spending.",
          "p-value fallacy Simpson's paradox examples.",
          "Confidence intervals frequentist Bayesian interpretation.",
          "Expected value optimal stopping secretary problem.",
          "Bayesian bandits Thompson sampling exploration.",
          "Power analysis heterogeneous treatment effects.",
          "Sequential testing optional stopping correction.",
          "Instrumental variables endogeneity social networks.",
          "Propensity score matching observational Facebook data.",
          "Difference differences parallel trends social features.",
          "Regression discontinuity bandwidth Facebook experiments."
        ]
      },
      "techRoundTwo": {
        "title": "Experimentation Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["A/B Testing", "Network Effects", "Scale"],
        "overview": "Facebook-scale experimentation with network effects and interference. Experimentation platform design patterns.",
        "questions": [
          "Facebook news feed A/B test interference design.",
          "Multi-cell experiment treatment interactions power.",
          "Network effects experimentation cluster randomized design.",
          "Sample ratio mismatch detection correction strategy.",
          "Long-term experimentation discounting future metrics.",
          "Pre-registration analysis plan p-hacking prevention.",
          "Heterogeneous treatment effects subgroup discovery.",
          "Multi-armed bandit exploration exploitation Facebook.",
          "Sequential testing alpha spending O'Brien-Fleming.",
          "Causal inference uplift modeling Facebook ads.",
          "Instrumental variables social contagion identification.",
          "Synthetic control Facebook product launch evaluation.",
          "Time series intervention Facebook feature rollout.",
          "Cluster randomized trial spillover contamination.",
          "Experimentation platform self-service A/B framework."
        ]
      },
      "techRoundThree": {
        "title": "SQL & Product Analytics",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Facebook SQL", "Product Metrics", "Optimization"],
        "overview": "Petabyte-scale SQL for Facebook product analytics. Window functions and query optimization at scale.",
        "questions": [
          "Facebook news feed engagement cohort analysis.",
          "DAU MAU retention cohort period-over-period.",
          "Multi-touch attribution last-click time-decay models.",
          "RFM analysis Facebook advertisers monetization.",
          "Power user whale curve 80/20 engagement analysis.",
          "Viral coefficient k-factor friend invite analysis.",
          "Network density clustering coefficient social graph.",
          "Survival analysis content lifetime engagement.",
          "Anomaly detection Facebook metrics z-score MAD.",
          "Market basket analysis association rules content.",
          "Customer journey funnel analysis drop-off attribution.",
          "A/B test SQL analysis CUPED variance reduction.",
          "Query optimization Presto Trino Facebook petabyte.",
          "Materialized view Scuba real-time analytics.",
          "Cross-validation time-series walk-forward Facebook."
        ]
      },
      "behavioral": {
        "title": "Impact Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Data science leadership through experimentation impact. Influencing product decisions with statistical rigor.",
        "questions": [
          "A/B test changed Facebook product direction (Experiment Impact). STAR.",
          "Convinced PM skip feature experiment results (Statistical Leadership). STAR.",
          "Built experimentation platform team adoption (Platform Impact). STAR.",
          "Statistical analysis saved Facebook product (Business Impact). STAR.",
          "Rapid experimentation validated product hypothesis (Speed + Rigor). STAR.",
          "Mentored analysts experimentation best practices (Teaching Impact). STAR.",
          "Cross-functional experiment stakeholder alignment (Stakeholder Influence). STAR.",
          "Long-term experimentation strategy execution (Strategic Thinking). STAR.",
          "Experimentation ROI measurement framework (ROI Thinking). STAR.",
          "Statistical communication leadership presentation (Communication Impact). STAR.",
          "Experimentation culture org-wide adoption (Culture Building). STAR.",
          "Causal inference consulting product teams (Consulting Impact). STAR.",
          "Production experimentation platform reliability (Reliability Leadership). STAR.",
          "Multiple stakeholder experiment prioritization (Prioritization Impact). STAR.",
          "Continuous learning advanced experimentation (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 5. Meta Production Engineer
(
    'Meta',
    'Meta Production Engineer',
    'Senior',
    '60 min',
    ARRAY['SRE', 'Distributed Systems', 'Observability', 'Oncall', 'Capacity Planning'],
    'Meta Production Engineering combines SRE with software engineering. Focus on Facebook-scale reliability, capacity planning, and production systems.',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Reliability", "Scale", "Oncall Excellence"],
      "behavioralFocus": "Impact & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Distributed Systems Reliability",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["CAP", "Consistency", "Fault Tolerance"],
        "overview": "Meta production systems reliability patterns for social graph and feeds. Failure mode analysis and recovery strategies.",
        "questions": [
          "TAO social graph eventual consistency caching strategy.",
          "Zippy memcache consistent hashing failure recovery.",
          "Scribe log aggregation fan-out tailers retention.",
          "MySQL replication binlog multi-DC disaster recovery.",
          "Redis cluster hash slot migration resharding.",
          "HBase regionserver recovery WAL replay compactions.",
          "Cassandra ring consistent hashing hinted handoff.",
          "Kafka partition reassignment consumer group rebalance.",
          "Circuit breaker pattern bulkhead isolation timeout.",
          "Saga distributed transaction choreography orchestration.",
          "Leader election ZooKeeper ephemeral nodes fencing.",
          "Capacity planning 10x growth sharding strategy.",
          "Graceful degradation feature flags fallback.",
          "Chaos engineering controlled outage simulation.",
          "Distributed tracing Zipkin Kingpin propagation."
        ]
      },
      "techRoundTwo": {
        "title": "Observability & Monitoring",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["SLO", "Alerting", "Tracing"],
        "overview": "Meta-scale observability for feeds and social features. Golden signals and alerting philosophy.",
        "questions": [
          "SLO error budget consumption alerting policy design.",
          "Golden signals latency traffic errors saturation.",
          "Alert fatigue reduction signal noise ratio.",
          "Oncall best practices escalation policy rotation.",
          "Distributed tracing propagation context Facebook.",
          "Log aggregation structured logging sampling retention.",
          "Metrics cardinality high vs low cardinality tradeoff.",
          "Dashboard design signal clustering anomaly detection.",
          "Postmortem blameless culture action items tracking.",
          "Runbook automation toil reduction candidate identification.",
          "Capacity forecasting time series anomaly detection.",
          "Error budget policy stakeholder communication.",
          "Observability cost optimization sampling aggregation.",
          "Multi-tenant monitoring isolation alerting.",
          "SLO migration legacy 9s to objective-based."
        ]
      },
      "techRoundThree": {
        "title": "Production Excellence",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Deployment", "Capacity", "Incident Response"],
        "overview": "Meta deployment practices, capacity planning, and incident command. Production system ownership patterns.",
        "questions": [
          "Phased rollout canary blue-green feature flags.",
          "Zero-downtime deployment database migration strategy.",
          "Capacity planning auto-scaling predictive modeling.",
          "Incident command roles responsibilities handoff.",
          "Postmortem RCA action item ownership tracking.",
          "Oncall rotation health burnout prevention.",
          "Service ownership boundaries SLA negotiation.",
          "Technical debt prioritization impact vs effort.",
          "Platform enablement self-service developer platform.",
          "Multi-DC active-active latency routing failover.",
          "Cost optimization spot instances FinOps SRE.",
          "Security vulnerability response patching rollout.",
          "Compliance audit logging retention immutable.",
          "Disaster recovery RTO RPO multi-DC testing.",
          "SRE culture engorg adoption measurement."
        ]
      },
      "behavioral": {
        "title": "Impact Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Production engineering leadership through reliability and toil reduction. Oncall excellence and incident command scenarios.",
        "questions": [
          "Led major outage recovery Facebook-scale (Incident Command). STAR.",
          "Implemented reliability improved SLOs significantly (Reliability Leadership). STAR.",
          "Reduced oncall toil 50% automation (Toil Reduction). STAR.",
          "Built production platform team adoption (Platform Enablement). STAR.",
          "Influenced engineering reliability practices (Reliability Culture). STAR.",
          "Rapid recovery critical production incident (Execution Under Pressure). STAR.",
          "Mentored engineers oncall best practices (Technical Mentorship). STAR.",
          "Capacity planning prevented major outage (Proactive Reliability). STAR.",
          "Cross-team incident coordination complex systems (Stakeholder Coordination). STAR.",
          "SLO implementation changed team behavior (SLO Leadership). STAR.",
          "Technical excellence raised production standards (Excellence Leadership). STAR.",
          "Observability platform org-wide adoption (Observability Strategy). STAR.",
          "Postmortem culture implementation blameless (Culture Building). STAR.",
          "Strategic reliability investment long-term ROI (Strategic Thinking). STAR.",
          "Continuous learning SRE state of practice (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
);
