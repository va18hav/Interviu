INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Google Software Engineer L3
(
    'Google',
    'Google Software Engineer L3',
    'Entry',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'Problem Solving', 'Coding Logic', 'System Concepts'],
    'Google L3 interviews consist of 3 technical rounds focusing on algorithmic problem-solving and 1 behavioral round. Each 15-minute round tests core CS fundamentals through verbal explanation. Emphasis on clear logical thinking over syntax for voice interviews.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Algorithms", "Problem Solving", "Googleyness"],
      "behavioralFocus": "Googleyness & Leadership"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Array & String Logic",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Arrays", "Two Pointers", "Hashing Logic"],
        "overview": "Tests fundamental array manipulation and two-pointer techniques explainable verbally. Focus on logical walkthrough rather than code writing. Expect optimization discussions from brute force to optimal.",
        "questions": [
          "Explain two sum logic using hash map - walk through indices, collision handling, missing target cases.",
          "Longest substring without repeats - sliding window movement rules, character replacement strategy.",
          "Three sum problem - sort + two pointers, skip duplicates logic, empty result handling.",
          "Container with most water - two pointers inward movement based on height comparison.",
          "Trapping rain water - monotonic stack logic or two pointers height tracking.",
          "Product array except self - left/right prefix logic without division.",
          "Rotate array - reverse segments logic for k positions, handle k > length.",
          "Merge intervals - sort by start, merge overlapping condition logic.",
          "Subarray sum equals k - prefix sum hash map, negative sum handling.",
          "Longest consecutive sequence - sort uniqueness or hash set O(n) logic.",
          "Group anagrams - character frequency signature or sorted string key logic.",
          "Maximum subarray - Kadane algorithm state transitions, all negative case.",
          "Move zeros to end - two pointers stable partitioning logic.",
          "Find duplicates in array - frequency count or cycle detection logic.",
          "Spiral matrix traversal - four pointers boundary tracking logic."
        ]
      },
      "techRoundTwo": {
        "title": "Tree & Graph Traversal",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["BFS", "DFS", "Tree Properties"],
        "overview": "Tree and graph traversal patterns with recursion/stack visualization. Verbal explanation of queue vs stack behavior. Boundary condition discussions emphasized.",
        "questions": [
          "Validate BST - inorder traversal successor logic or range validation recursion.",
          "Lowest common ancestor - path storage or single pass recursion logic.",
          "Maximum tree depth - recursive left/right max +1, balance discussion.",
          "Level order traversal - queue level size tracking logic.",
          "Zigzag level order - queue + direction reversal or stack alternation.",
          "Number of islands - DFS flood fill neighbor exploration logic.",
          "Course schedule - topological sort indegree counting Kahn's algorithm.",
          "Clone graph - DFS visited tracking deep copy logic.",
          "Word ladder - BFS shortest path level tracking.",
          "Serialize binary tree - preorder string encoding null handling.",
          "Kth smallest BST - inorder stack traversal or Morris traversal.",
          "Diameter of tree - recursion tracking left+right+1 max depth.",
          "Binary tree right side view - level order last node per level.",
          "Graph cycle detection - DFS recursion stack or coloring approach.",
          "Minimum spanning tree - Kruskal union-find or Prim priority queue logic."
        ]
      },
      "techRoundThree": {
        "title": "Dynamic Programming Patterns",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DP States", "Memoization", "Optimization"],
        "overview": "Classic DP problems requiring state definition and recurrence relations. Verbal table construction walkthroughs expected. Space optimization discussions.",
        "questions": [
          "Climbing stairs - DP recurrence, space optimization to O(1).",
          "Coin change minimum coins - DP unbounded knapsack impossible case.",
          "Longest increasing subsequence - patience sorting O(n log n) logic.",
          "House robber - adjacent exclusion state transitions.",
          "Word break - boolean DP substring existence tracking.",
          "Unique paths grid - combinatorial DP edge cases.",
          "Jump game II - greedy jump minimization proof.",
          "Partition equal subset sum - 0/1 knapsack space optimization.",
          "Longest palindromic substring - expand around centers logic.",
          "Edit distance - Levenshtein DP insert/delete/replace costs.",
          "Maximum product subarray - negative tracking state machine.",
          "Decode ways - DP multiplication rules zero handling.",
          "Palindrome partitioning - minimum cuts DP optimization.",
          "Best time buy sell stock - multiple transactions state transitions.",
          "Dungeon game - minimum health path DP from target backward."
        ]
      },
      "behavioral": {
        "title": "Googleyness Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Googleyness behavioral assessment using STAR format focusing on collaboration, learning agility, and impact. Each question probes multiple competencies simultaneously. Follow-up questions test depth of reflection.",
        "questions": [
          "Time you accomplished something others considered impossible (Googleyness). STAR.",
          "Situation requiring extreme ownership of unclear problem (Ownership). STAR.",
          "Example going far beyond basic job requirements (Impact). STAR.",
          "Time you rapidly learned entirely new technical domain (Learning). STAR.",
          "Conflict resolution across engineering teams (Collaboration). STAR.",
          "Pushing back constructively on technical leadership (Constructive Confrontation). STAR.",
          "Delivering business impact through technical excellence (Quality). STAR.",
          "Simplifying complex system for broader team (Simplicity). STAR.",
          "Handling significant personal failure career impact (Resilience). STAR.",
          "Mentoring junior engineer through difficult ramp-up (Teaching). STAR.",
          "Customer empathy driving technical prioritization (User Focus). STAR.",
          "Strategic thinking beyond immediate team scope (Systems Thinking). STAR.",
          "Efficiency innovation reducing operational toil (Efficiency). STAR.",
          "Cross-functional collaboration breaking silos (Teamwork). STAR.",
          "Continuous improvement culture implementation (Growth Mindset). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Google Software Engineer L5
(
    'Google',
    'Google Software Engineer L5',
    'Senior',
    '60 min',
    ARRAY['System Design', 'Advanced Algorithms', 'Leadership', 'Distributed Systems', 'Optimization'],
    'L5 interviews emphasize system design capability alongside algorithmic mastery. Technical rounds blend coding with architecture discussions. Behavioral assesses technical leadership and influence.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["System Design", "Leadership", "Scalability"],
      "behavioralFocus": "Googleyness & Leadership"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Advanced Algorithms",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Hard Problems", "Pattern Synthesis", "Optimization"],
        "overview": "Google-medium to hard problems requiring multiple techniques. Verbal complexity analysis from multiple approaches. Edge case synthesis expected.",
        "questions": [
          "Median maintenance - two heaps balance logic reheapify rules.",
          "Sliding window maximum - deque monotonic queue eviction rules.",
          "LFU cache eviction - frequency doubly linked list promotion.",
          "Serialize N-ary tree - level order encoding child count prefix.",
          "Shortest palindrome - KMP prefix function computation.",
          "Task scheduler cooling - max gap greedy priority queue.",
          "IPO projects - max heap profit greedy selection.",
          "Dungeon game - DP minimum health backward computation.",
          "Burst balloons - DP interval multiplication optimization.",
          "Distinct subsequences - DP string matching count optimization.",
          "Wildcard matching - DP greedy . * consumption rules.",
          "Longest valid parentheses - stack index matching length calculation.",
          "Minimum window substring - sliding window multi-char count tracking.",
          "Word break II - DP recursion with memoization word list.",
          "Regular expression matching - DP * zero-or-more consumption."
        ]
      },
      "techRoundTwo": {
        "title": "Distributed System Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["CAP", "Consistency", "Partitioning"],
        "overview": "Verbal architecture walkthroughs of Google-scale systems. Trade-off discussions across availability/consistency/cost. Capacity planning and failure modes emphasized.",
        "questions": [
          "Design URL shortener - counter sharding custom alias collision.",
          "Design YouTube - video sharding CDN prefetching recommendation.",
          "Design Google Docs - CRDT operational transform conflict resolution.",
          "Design autocomplete - trie + TF-IDF ranking popularity eviction.",
          "Design rate limiter - token bucket GCRA distributed counter.",
          "Design notification system - fan-out patterns retry dead letter.",
          "Design chat system - WebSocket sharding presence connection mgmt.",
          "Design pastebin - sharding syntax highlighting collaboration.",
          "Design leader election - Raft/Zab epoch lease management.",
          "Design CDN - cache invalidation consistency origin failover.",
          "Design recommendation system - matrix factorization serving.",
          "Design log aggregation - ring buffer sharding retention policy.",
          "Design payment processing - idempotency saga distributed tx.",
          "Design IoT pipeline - MQTT broker partitioning rule engine.",
          "Design Google Maps routing - graph partitioning A* heuristics."
        ]
      },
      "techRoundThree": {
        "title": "Architecture Leadership",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Trade-offs", "Mentorship", "Evolution"],
        "overview": "Technical leadership scenarios requiring trade-off justification. System evolution strategies and team technical guidance patterns.",
        "questions": [
          "Microservices migration strategy from monolith - strangler pattern.",
          "Production outage debugging strategy - latency vs error analysis.",
          "Database sharding evolution strategy - range vs hash dynamic.",
          "API evolution strategy versioning vs GraphQL federation.",
          "Circuit breaker pattern design - failure detection half-open.",
          "Event sourcing trade-offs vs CRUD - replay performance query.",
          "CQRS implementation - read model lag tolerance materialized views.",
          "Service mesh vs sidecar proxy - observability security tradeoff.",
          "Chaos engineering strategy - blast radius control rollback.",
          "Data warehouse evolution - lakehouse medallion architecture.",
          "Container orchestration choice - Borg vs Kubernetes internal.",
          "Zero-downtime deployment strategies - blue-green vs canary.",
          "Observability strategy - golden signals SLO error budgets.",
          "Technical debt prioritization framework - interest vs principal.",
          "Cross-team architecture alignment - RFC process adoption."
        ]
      },
      "behavioral": {
        "title": "Googleyness Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Leadership through technical influence across organizations. Scenarios test ability to drive adoption of complex technical changes.",
        "questions": [
          "Led architectural migration across multiple teams (Technical Leadership). STAR.",
          "Technical disagreement with peer senior engineer (Constructive Confrontation). STAR.",
          "Drove adoption of new technology stack org-wide (Influence). STAR.",
          "Recovered from production incident affecting millions (Crisis Leadership). STAR.",
          "Mentored engineer through promotion level-up (People Development). STAR.",
          "Simplified complex distributed system reliability (System Simplification). STAR.",
          "Technical strategy beyond immediate team impact (Strategic Thinking). STAR.",
          "Technical debt elimination business impact (Business Acumen). STAR.",
          "Cross-functional technical alignment competing priorities (Stakeholder Management). STAR.",
          "Rapid prototyping validated product direction (Speed + Quality). STAR.",
          "Technical culture improvement hiring standards (Culture Building). STAR.",
          "Innovation patentable technical contribution (Innovation). STAR.",
          "Technical risk management production deployment (Risk Management). STAR.",
          "Knowledge sharing conference speaking documentation (Thought Leadership). STAR.",
          "Technical excellence raised team performance (Raising Standards). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Google Data Scientist
(
    'Google',
    'Google Data Scientist',
    'Intermediate',
    '60 min',
    ARRAY['Statistics', 'Experimentation', 'SQL', 'ML Fundamentals', 'Causal Inference'],
    'Data Scientist interviews test statistical rigor, experimental design, and SQL mastery. Emphasis on practical business impact through data. Voice-friendly probability puzzles and experimental reasoning.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Statistical Rigor", "Experimentation", "Business Impact"],
      "behavioralFocus": "Googleyness & Leadership"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Statistics & Probability",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Probability", "Estimation", "Hypothesis Testing"],
        "overview": "Verbal probability puzzles and estimation problems common at Google. Expected value calculations and statistical inference reasoning.",
        "questions": [
          "100 doors toggle problem - perfect square logic explanation.",
          "100 prisoners hat problem - optimal strategy expected value.",
          "Monty Hall problem variants - conditional probability switching.",
          "Birthday paradox - pigeonhole principle collision probability.",
          "Coupon collector - expected trials all coupons geometric.",
          "Random walk gambler's ruin - absorption probability calculation.",
          "Secretary problem - optimal stopping 37% rule derivation.",
          "Hat check derangement probability - inclusion-exclusion.",
          "Powerball probability combinations overestimate intuition.",
          "A/B test sample size power calculation effect size.",
          "Multiple testing correction Bonferroni FDR business tradeoff.",
          "Confidence intervals interpretation frequentist vs Bayesian.",
          "p-value fallacy common misinterpretations examples.",
          "Bayes theorem medical test false positive paradox.",
          "Central limit theorem convergence rate standardization."
        ]
      },
      "techRoundTwo": {
        "title": "Experimental Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["A/B Testing", "Causal", "Segmentation"],
        "overview": "Production experimentation system design and analysis methodology. Trade-offs between speed, power, and multiple testing.",
        "questions": [
          "A/B test design traffic allocation sample size power.",
          "Multi-armed bandit exploration exploitation tradeoff algorithms.",
          "Sequential testing optional stopping problem alpha spending.",
          "Network effects experimentation interference unit independence.",
          "Pre-experiment analysis plan preregistration p-hacking.",
          "Heterogeneous treatment effects subgroup analysis power.",
          "Sample ratio mismatch detection correction strategy.",
          "Long-term experimentation discounting future metrics.",
          "Multi-cell experiment multiple treatments interactions.",
          "Causal inference matching propensity score estimation.",
          "Instrumental variables endogeneity identification strategy.",
          "Difference-in-differences parallel trends assumption testing.",
          "Regression discontinuity bandwidth selection placebo tests.",
          "Synthetic control donor pool matching weights.",
          "Time series intervention analysis structural breaks."
        ]
      },
      "techRoundThree": {
        "title": "SQL & Analytics",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Complex Analytics", "Window Functions", "Optimization"],
        "overview": "Google-scale SQL queries requiring window functions and optimization reasoning. Verbal query plan walkthroughs expected.",
        "questions": [
          "Cohort retention analysis period-over-period window functions.",
          "Customer lifetime value discounted future purchases.",
          "Funnel conversion attribution multi-touch models.",
          "RFM segmentation recency frequency monetary quintiles.",
          "Power users whale curve 80/20 revenue analysis.",
          "Seasonality decomposition STL components forecasting.",
          "Anomaly detection z-score MAD multivariate.",
          "Market basket analysis association rules lift support.",
          "Customer segmentation clustering silhouette RFM features.",
          "Survival analysis Kaplan-Meier hazard ratios censoring.",
          "Time between events exponential distribution modeling.",
          "Network analysis centrality betweenness clustering coeff.",
          "Query optimization billion row aggregation indexes.",
          "Materialized view incremental update strategies.",
          "Cross-validation time series walk-forward validation."
        ]
      },
      "behavioral": {
        "title": "Googleyness Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Data science leadership through experimental rigor and business impact. Scenarios test influence with non-technical stakeholders.",
        "questions": [
          "Convinced engineering skip feature lacking experiment (Statistical Rigor). STAR.",
          "Statistical analysis changed product direction (Business Impact). STAR.",
          "Designed experiment proved negative hypothesis (Scientific Method). STAR.",
          "Cross-functional experimentation platform adoption (Influence). STAR.",
          "Rapid experimentation cycle business validation (Speed). STAR.",
          "Statistical communication executive leadership (Communication). STAR.",
          "Mentored analysts experimental best practices (Teaching). STAR.",
          "Production experimentation system architecture (Technical Leadership). STAR.",
          "Handled experimentation platform outage (Crisis Leadership). STAR.",
          "Long-term experimentation strategy planning (Strategic Thinking). STAR.",
          "Statistical culture org-wide adoption (Culture Building). STAR.",
          "Causal inference consulting internal customers (Consulting). STAR.",
          "Experimentation ROI measurement framework (ROI Thinking). STAR.",
          "Multiple stakeholder prioritization experiments (Stakeholder Management). STAR.",
          "Continuous learning new statistical methods (Lifelong Learning). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Google ML Engineer
(
    'Google',
    'Google ML Engineer',
    'Intermediate',
    '60 min',
    ARRAY['Deep Learning', 'MLOps', 'Production Systems', 'TensorFlow', 'Scaling'],
    'Google ML Engineer interviews test production ML systems beyond research. Heavy emphasis on TensorFlow, TPU optimization, and serving systems. Voice-friendly algorithm explanations without syntax.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Production ML", "Scaling", "TensorFlow Expertise"],
      "behavioralFocus": "Googleyness & Leadership"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Deep Learning Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Architecture", "Optimization", "Regularization"],
        "overview": "Core deep learning concepts with mathematical intuition. Forward/backward pass reasoning and optimization dynamics.",
        "questions": [
          "Transformer attention - self-attention matrix computation scaled dot-product.",
          "RNN LSTM vanishing gradient gates forget input output.",
          "CNN receptive field calculation stride padding dilation.",
          "Batch normalization forward backward statistics running avg.",
          "Adam optimizer momentum RMSProp adaptive per-parameter.",
          "Dropout inverted dropout inference scaling prediction.",
          "GAN training instability mode collapse minimax game.",
          "Policy gradient REINFORCE baseline variance reduction.",
          "ResNet skip connections degradation problem gradient flow.",
          "BERT bidirectional transformer masked LM pretraining.",
          "GPT autoregressive causal attention generation.",
          "Vision Transformer ViT image patches positional encoding.",
          "Gradient clipping exploding vanishing gradient mitigation.",
          "Learning rate schedules cosine annealing warmup.",
          "Mixed precision training FP16 accumulation stability."
        ]
      },
      "techRoundTwo": {
        "title": "Production ML Systems",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Serving", "Monitoring", "Optimization"],
        "overview": "Google-scale ML serving architecture and production concerns. Latency, cost, freshness trade-offs emphasized.",
        "questions": [
          "TensorFlow Serving gRPC REST model versioning warm-up.",
          "TPU v4 Pod slicing model parallelism pipeline.",
          "Model ensemble weighted averaging stacking blending.",
          "Online learning concept drift adaptation forgetting.",
          "A/B testing ML models shadow deployment canary.",
          "Model monitoring input drift prediction drift KS test.",
          "Feature store online serving consistency freshness.",
          "Cold start recommendation content-based collaborative.",
          "Multi-tenant model serving endpoint resource isolation.",
          "Model compression quantization pruning knowledge distillation.",
          "Latency prediction serving CPU GPU TPU tradeoff.",
          "Freshness staleness batch prediction scheduling.",
          "Explainability production SHAP LIME sampling tradeoff.",
          "Multi-model endpoints routing latency isolation.",
          "Model registry versioning rollback governance workflow."
        ]
      },
      "techRoundThree": {
        "title": "Scaling ML Infrastructure",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Distributed Training", "Data Pipeline", "Optimization"],
        "overview": "Petabyte-scale ML infrastructure design patterns at Google. Distributed training strategies and data pipeline optimization.",
        "questions": [
          "Data parallel training synchronous asynchronous gradient allreduce.",
          "Model parallel large transformer sharding pipeline parallelism.",
          "TPU mesh networking collective ops butterfly all-gather.",
          "Gradient accumulation microbatch training memory optimization.",
          "Mixed precision FP16 BF16 numerical stability loss scaling.",
          "Optimizer state sharding Adam moments ZeRO.",
          "Checkpointing asynchronous fault tolerance recovery.",
          "Data pipeline TFRecord sharding prefetching caching.",
          "Feature engineering pipeline Beam Spark preprocessing.",
          "Distributed hyperparameter tuning population ray tune.",
          "AutoML neural architecture search reinforcement learning.",
          "Federated learning differential privacy secure aggregation.",
          "Active learning uncertainty sampling pool based.",
          "Multi-task learning shared backbone auxiliary losses.",
          "Transfer learning linear probing full fine-tuning."
        ]
      },
      "behavioral": {
        "title": "Googleyness Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "ML engineering leadership through production impact and cross-functional collaboration. Production ML system ownership scenarios.",
        "questions": [
          "Shipped ML model billion user daily impact (Production Impact). STAR.",
          "Convinced team abandon promising research (Technical Judgment). STAR.",
          "Built production ML platform team adoption (Platform Building). STAR.",
          "Recovered degraded ML model production (Production Expertise). STAR.",
          "ML experimentation influenced product roadmap (Product Influence). STAR.",
          "Mentored ML engineers production best practices (Technical Leadership). STAR.",
          "Simplified complex ML pipeline developer experience (Developer Experience). STAR.",
          "Cross-team ML platform adoption resistance (Change Management). STAR.",
          "Rapid ML prototyping validated hypothesis (Speed + Rigor). STAR.",
          "ML cost optimization saved significant compute (Cost Consciousness). STAR.",
          "Long-term ML platform strategy execution (Strategic Execution). STAR.",
          "Responsible AI fairness bias mitigation production (Ethical Leadership). STAR.",
          "ML knowledge sharing internal external (Thought Leadership). STAR.",
          "Production ML incident cross-functional coordination (Crisis Leadership). STAR.",
          "Continuous learning SOTA ML implementation (Lifelong Learning). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 5. Google Cloud Engineer
(
    'Google',
    'Google Cloud Engineer',
    'Senior',
    '60 min',
    ARRAY['GCP Services', 'Distributed Systems', 'Networking', 'Security', 'Cost Optimization'],
    'Google Cloud Engineer interviews test GCP-native architecture patterns and distributed systems fundamentals. Emphasis on SRE principles, networking, and cost optimization at Google scale.',
    'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["GCP Architecture", "SRE Principles", "Distributed Systems"],
      "behavioralFocus": "Googleyness & Leadership"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "GCP Core Services",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Compute", "Storage", "Networking"],
        "overview": "GCP service selection and integration patterns for Google-scale workloads. Cost/performance trade-offs emphasized.",
        "questions": [
          "GCE vs GKE vs Cloud Run vs Cloud Functions workload selection.",
          "Cloud Storage classes lifecycle policies dual-region multi-region.",
          "VPC global vs regional subnets firewall rules shared VPC.",
          "Cloud Load Balancing global HTTP(S) TCP/SSL/UDP regional.",
          "Cloud SQL vs Spanner vs BigQuery analytical transactional.",
          "Memorystore Redis vs AlloyDB caching strategies.",
          "Pub/Sub vs Eventarc vs Cloud Tasks async processing.",
          "Cloud Functions 2nd gen VPC connector event triggers.",
          "Cloud CDN cache invalidation cache keys behaviors.",
          "Artifact Registry vs Container Registry migration strategy.",
          "Cloud Build CI/CD multi-cluster multi-region builds.",
          "Secret Manager vs Secret Manager Enterprise access patterns.",
          "IAM policy binding hierarchy inheritance conditions.",
          "Cloud Monitoring alerting custom metrics SLO.",
          "Cloud Logging aggregation sinks retention compliance."
        ]
      },
      "techRoundTwo": {
        "title": "Distributed Systems Architecture",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Consistency", "Scaling", "Fault Tolerance"],
        "overview": "Google-scale distributed systems design patterns and consistency models. Capacity planning and failure mode analysis.",
        "questions": [
          "Spanner TrueTime external consistency read-write transactions.",
          "Firestore vs Firestore in Datastore mode scaling limits.",
          "Bigtable performance tuning SSD vs HDD cgroups.",
          "Cloud Pub/Sub exactly-once delivery idempotency ordering.",
          "Dataflow streaming batch unified processing watermark.",
          "Dataproc vs Dataplex vs BigQuery batch analytics.",
          "Cloud Composer Airflow vs Cloud Workflows orchestration.",
          "Cloud Scheduler vs Cloud Tasks vs Cloud Functions cron.",
          "Memorystore replication multi-zone high availability.",
          "Cloud SQL HA multi-zone automated failover.",
          "GKE multi-cluster services multi-cluster Ingress.",
          "Istio service mesh traffic management mTLS circuit breaker.",
          "Knative serverless autoscaling concurrency limits.",
          "Cloud Run jobs vs services vs fully managed.",
          "AlloyDB columnar engine vs PostgreSQL performance."
        ]
      },
      "techRoundThree": {
        "title": "SRE & Cost Optimization",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["SLO", "Error Budgets", "FinOps"],
        "overview": "SRE practices applied to GCP infrastructure. Error budgets, toil reduction, and cost optimization strategies.",
        "questions": [
          "SLO error budget consumption alerting policy design.",
          "Toil reduction automation candidate identification.",
          "Chaos engineering GCP fault injection strategies.",
          "Reliability golden signals latency traffic errors saturation.",
          "Cost optimization Compute Engine preemptible spot VMs.",
          "Committed use discounts flexible sustained use discounts.",
          "BigQuery slot optimization reservations edition pricing.",
          "Cloud Storage storage class analysis lifecycle automation.",
          "GKE cluster autoscaling node pool multi-dimensional.",
          "Cloud Run concurrency autoscaling CPU memory limits.",
          "Dataflow FlexRS preemptible workers cost optimization.",
          "Cloud Functions memory allocation cold start optimization.",
          "Cloud SQL read replicas connection pooling.",
          "VPC Flow Logs sampling aggregation BigQuery analysis.",
          "Cloud Audit Logs compliance retention aggregation."
        ]
      },
      "behavioral": {
        "title": "Googleyness Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Cloud engineering leadership through SRE practices and platform enablement. Production system ownership scenarios.",
        "questions": [
          "Implemented SRE practices reduced toil 50% (SRE Leadership). STAR.",
          "Designed multi-region architecture survived outage (Reliability Engineering). STAR.",
          "Cost optimization saved $1M+ annual compute (Cost Leadership). STAR.",
          "Built internal cloud platform team adoption (Platform Enablement). STAR.",
          "Production incident cross-team coordination (Incident Command). STAR.",
          "Technical architecture influenced product roadmap (Technical Strategy). STAR.",
          "Mentored engineers SRE best practices (Technical Mentorship). STAR.",
          "Simplified complex infrastructure developer experience (Developer Productivity). STAR.",
          "Error budget policy stakeholder alignment (SLO Governance). STAR.",
          "Rapid cloud migration minimal downtime (Migration Leadership). STAR.",
          "Security champion zero trust implementation (Security Leadership). STAR.",
          "Observability platform adoption across orgs (Observability Strategy). STAR.",
          "Multi-cloud hybrid strategy GCP dominance (Strategic Thinking). STAR.",
          "Continuous on-call improvement rotation health (Team Health). STAR.",
          "SRE culture org-wide knowledge sharing (Culture Building). STAR."
        ]
      }
    }
    $$::jsonb
);
