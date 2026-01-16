
-- Clear existing Microsoft data to start fresh (as requested)
DELETE FROM popular_interviews WHERE company = 'Microsoft';

INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Microsoft Software Engineer
(
    'Microsoft',
    'Microsoft Software Engineer',
    'Intermediate',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'System Design', 'Azure Integration', 'Debugging'],
    'Microsoft SDE interviews emphasize practical problem-solving with 3 technical rounds plus behavioral. Focus on Windows/Azure integration patterns and production debugging. Voice-friendly logic explanations over syntax.',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Practical Coding", "System Integration", "Customer Focus"],
      "behavioralFocus": "Growth Mindset & Collaboration"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Core Algorithms",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Arrays", "Hashing", "Two Pointers"],
        "overview": "Microsoft classic problems from Windows/Office codebase. Emphasis on edge case handling and optimization discussion.",
        "questions": [
          "Two sum closest pair variants hash map collision handling.",
          "Longest substring no repeats sliding window expansion contraction.",
          "Minimum window substring multi-char count tracking.",
          "Container most water two pointers height movement.",
          "Trapping rain water monotonic stack pointer logic.",
          "Product except self left right prefix zero handling.",
          "Merge intervals sort start merge overlap condition.",
          "Subarray sum equals k prefix hash negative numbers.",
          "LRU cache hash doubly linked list eviction.",
          "Top k frequent elements bucket sort frequency.",
          "Group anagrams char frequency signature sorting.",
          "Rotate array reverse segments k positions.",
          "Valid sudoku row col box hash set validation.",
          "Spiral matrix four pointers boundary traversal.",
          "K closest points max heap distance priority."
        ]
      },
      "techRoundTwo": {
        "title": "Tree Graph Patterns",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["BFS DFS", "System Traversal", "Optimization"],
        "overview": "Tree/graph traversal common in Windows file systems and Azure resource graphs. Verbal recursion visualization expected.",
        "questions": [
          "Validate BST inorder successor range recursion.",
          "Lowest common ancestor path storage recursion.",
          "Serialize deserialize binary tree preorder encoding.",
          "Kth smallest BST inorder stack Morris traversal.",
          "Number islands DFS flood fill neighbor exploration.",
          "Course schedule topological sort indegree Kahn.",
          "Clone graph DFS visited hash deep copy.",
          "Word ladder BFS shortest path level tracking.",
          "Max tree depth recursion left right balance.",
          "Level order traversal queue level size tracking.",
          "Diameter tree recursion left right max depth.",
          "Right side view level order last node.",
          "Accounts merge union find email components.",
          "Pacific Atlantic water flow multi-source DFS.",
          "Rotting oranges multi-source BFS spread simulation."
        ]
      },
      "techRoundThree": {
        "title": "DP Optimization",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Dynamic Programming", "Greedy", "Backtracking"],
        "overview": "Microsoft production optimization problems from Office/Teams. Table construction walkthroughs and space optimization expected.",
        "questions": [
          "House robber adjacent exclusion state transitions.",
          "Coin change minimum unbounded knapsack impossible case.",
          "Longest increasing subsequence patience sorting.",
          "Word break DP substring boolean tracking.",
          "Unique paths grid obstacles combinatorial DP.",
          "Jump game II greedy jump minimization.",
          "Partition equal subset sum 0/1 knapsack.",
          "Letter phone backtracking digit mapping.",
          "Word search matrix DFS visited marking.",
          "Palindrome partition minimum cuts optimization.",
          "Edit distance Levenshtein insert delete replace.",
          "Longest palindromic expand around centers.",
          "Decode ways DP zero multiplication rules.",
          "Best time buy sell cooldown state machine.",
          "Dungeon game backward minimum health path."
        ]
      },
      "behavioral": {
        "title": "Growth Mindset Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Microsoft Growth Mindset behavioral using STAR format. Emphasis on learning from failure, collaboration, and customer obsession.",
        "questions": [
          "Time you failed learned grew stronger (Growth Mindset). STAR.",
          "Cross-team collaboration delivered customer value (Collaboration). STAR.",
          "Customer feedback changed technical approach (Customer Obsession). STAR.",
          "Owned ambiguous problem end-to-end (Ownership). STAR.",
          "Taught complex concept team members (One Microsoft). STAR.",
          "Simplified complex system team productivity (Simplification). STAR.",
          "Rapid learning new technology domain (Learning Agility). STAR.",
          "Influenced senior leader direction change (Influence). STAR.",
          "Delivered results despite obstacles (Results Focus). STAR.",
          "Built tool saved team significant time (Leverage). STAR.",
          "Technical excellence raised team standards (Excellence). STAR.",
          "Recovered production incident under pressure (Resilience). STAR.",
          "Strategic thinking beyond immediate scope (Strategic Thinking). STAR.",
          "Inclusive team environment creation (Inclusion). STAR.",
          "Continuous improvement process implementation (Continuous Improvement). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Microsoft Data Scientist
(
    'Microsoft',
    'Microsoft Data Scientist',
    'Intermediate',
    '60 min',
    ARRAY['Statistics', 'ML', 'SQL', 'Experimentation', 'Azure Synapse'],
    'Microsoft Data Scientist interviews test statistical rigor, A/B testing, and Azure analytics integration. Emphasis on business impact through experimentation.',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Experimentation", "Business Impact", "Azure Analytics"],
      "behavioralFocus": "Growth Mindset & Collaboration"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Statistics Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Probability", "Hypothesis Testing", "Bayesian"],
        "overview": "Microsoft product experimentation statistical foundations. Power calculations and multiple testing corrections.",
        "questions": [
          "A/B test power calculation minimum detectable effect.",
          "Multiple testing correction FDR Bonferroni tradeoff.",
          "Bayesian A/B testing beta prior posterior update.",
          "Sample size calculation sequential alpha spending.",
          "p-value fallacy Simpson paradox examples.",
          "Confidence intervals frequentist Bayesian comparison.",
          "Expected value optimal stopping problems.",
          "Bayesian bandits Thompson sampling exploration.",
          "Heterogeneous treatment effects power analysis.",
          "Sequential testing optional stopping correction.",
          "Instrumental variables endogeneity identification.",
          "Propensity score matching observational data.",
          "Difference-in-differences parallel trends testing.",
          "Regression discontinuity bandwidth selection.",
          "Synthetic control donor pool matching."
        ]
      },
      "techRoundTwo": {
        "title": "Experimentation Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["A/B Testing", "Causal", "Segmentation"],
        "overview": "Microsoft-scale experimentation for Teams/Office 365. Network effects and interference handling.",
        "questions": [
          "Multi-armed bandit exploration exploitation tradeoff.",
          "Network effects cluster randomized design.",
          "Sample ratio mismatch detection correction.",
          "Long-term experimentation future discounting.",
          "Pre-registration analysis plan p-hacking prevention.",
          "Subgroup analysis heterogeneous effects discovery.",
          "Multi-cell experiment treatment interactions.",
          "Causal inference uplift modeling.",
          "Time series intervention analysis.",
          "Synthetic control product launch evaluation.",
          "Instrumental variables network effects.",
          "Regression discontinuity natural experiments.",
          "Experimentation platform self-service design.",
          "CUPED variance reduction implementation.",
          "Sequential testing O'Brien-Fleming boundaries."
        ]
      },
      "techRoundThree": {
        "title": "SQL & Azure Analytics",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Synapse", "Power BI", "Optimization"],
        "overview": "Azure Synapse and Power BI analytics at Microsoft scale. Complex window functions and optimization.",
        "questions": [
          "Cohort retention analysis period-over-period.",
          "Customer lifetime value discounted calculation.",
          "Multi-touch attribution time-decay models.",
          "RFM segmentation Power BI visualization.",
          "Power user whale curve analysis.",
          "Seasonality decomposition forecasting.",
          "Anomaly detection z-score multivariate.",
          "Survival analysis Kaplan-Meier censoring.",
          "Market basket association rules lift.",
          "Customer journey funnel attribution.",
          "Azure Synapse query optimization partitioning.",
          "Power BI row-level security RLS.",
          "Incremental refresh large fact tables.",
          "Delta Lake ACID transactions Synapse.",
          "Databricks Spark SQL optimization."
        ]
      },
      "behavioral": {
        "title": "Growth Mindset Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Data science impact through experimentation and stakeholder influence. Growth mindset through learning agility.",
        "questions": [
          "Experiment changed product direction (Experiment Impact). STAR.",
          "Convinced PM data-driven decision (Influence). STAR.",
          "Built analytics platform team adoption (Platform Impact). STAR.",
          "Rapid experimentation validated hypothesis (Speed + Rigor). STAR.",
          "Statistical communication leadership level (Communication). STAR.",
          "Mentored analysts best practices (Teaching). STAR.",
          "Cross-functional experiment alignment (Collaboration). STAR.",
          "Experimentation ROI measurement (Business Acumen). STAR.",
          "Statistical culture org-wide adoption (Culture Building). STAR.",
          "Production experimentation reliability (Reliability). STAR.",
          "Long-term experimentation strategy (Strategic Thinking). STAR.",
          "Causal inference product consulting (Consulting). STAR.",
          "Multiple stakeholder prioritization (Prioritization). STAR.",
          "Continuous statistical learning (Learning Agility). STAR.",
          "Data-driven culture implementation (Data Culture). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Microsoft Azure Engineer
(
    'Microsoft',
    'Microsoft Azure Engineer',
    'Senior',
    '60 min',
    ARRAY['Azure Services', 'Architecture', 'Security', 'Cost Management', 'DevOps'],
    'Azure Engineer interviews test Well-Architected Framework and enterprise patterns. Emphasis on hybrid cloud, security, and cost optimization.',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Azure Architecture", "Enterprise Scale", "Security"],
      "behavioralFocus": "Growth Mindset & Collaboration"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Core Azure Services",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Compute", "Storage", "Networking"],
        "overview": "Azure service selection for enterprise workloads. Cost/performance/security trade-offs.",
        "questions": [
          "VM Scale Sets vs AKS vs App Service vs Functions.",
          "Storage Account tiers lifecycle policies GRS.",
          "VNet peering Global VNet Peering service endpoints.",
          "Application Gateway vs Load Balancer vs Front Door.",
          "Azure SQL vs Cosmos DB vs Synapse partitioning.",
          "Azure Cache Redis Premium vs Standard clustering.",
          "Service Bus vs Event Grid vs Event Hubs patterns.",
          "Azure Functions Premium vs Consumption cold start.",
          "Azure CDN custom origins cache purge WAF.",
          "Container Registry vs ACR Tasks build automation.",
          "Azure DevOps vs GitHub Actions enterprise CI/CD.",
          "Key Vault vs Managed Identities access patterns.",
          "Azure Monitor vs Application Insights APM.",
          "Azure Policy vs Blueprints governance.",
          "Azure AD B2C vs B2B identity federation."
        ]
      },
      "techRoundTwo": {
        "title": "High Availability Architecture",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Multi-Region", "DR", "Global Distribution"],
        "overview": "Azure global enterprise architecture with RTO/RPO requirements. Multi-region active-active patterns.",
        "questions": [
          "Azure Traffic Manager vs Front Door latency routing.",
          "Azure Site Recovery vs Azure Backup RPO RTO.",
          "Cosmos DB multi-region writes strong consistency.",
          "Azure SQL Geo-Replication active geo-replication.",
          "Azure Storage Cross-Region Replication versioning.",
          "AKS multi-region federation external DNS.",
          "Azure Database Migration Service online migration.",
          "Azure Arc hybrid Kubernetes management.",
          "Azure Lighthouse cross-tenant management.",
          "Azure Private Link private endpoints Service Bus.",
          "Azure DDoS Protection Network vs Standard.",
          "Azure Sentinel SIEM SOAR threat detection.",
          "Azure Defender multi-cloud threat protection.",
          "Azure Update Manager patch orchestration.",
          "Azure Chaos Studio fault injection testing."
        ]
      },
      "techRoundThree": {
        "title": "Cost Security Optimization",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Well-Architected", "FinOps", "Zero Trust"],
        "overview": "Azure Well-Architected Framework excellence pillars. Cost allocation and security baseline.",
        "questions": [
          "Azure Cost Management budgets forecasting FinOps.",
          "Reserved VM Instances Spot VMs savings plans.",
          "Azure Advisor recommendations prioritization framework.",
          "Azure Policy custom policy definitions remediation.",
          "Azure Blueprints environment provisioning governance.",
          "Microsoft Defender for Cloud secure score.",
          "Azure Security Center Just-In-Time VM access.",
          "Azure Network Security Groups NSG flow logs.",
          "Azure AD Conditional Access risk-based policies.",
          "Azure Key Vault HSM managed keys rotation.",
          "Azure Information Protection sensitivity labels.",
          "Azure Purview data catalog lineage governance.",
          "Azure Migrate assessment dependency visualization.",
          "Azure Landing Zones platform foundation governance.",
          "Azure Well-Architected Review tooling assessment."
        ]
      },
      "behavioral": {
        "title": "Growth Mindset Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Azure engineering leadership through enterprise transformation. Customer success and technical strategy.",
        "questions": [
          "Led enterprise Azure migration success (Migration Leadership). STAR.",
          "Designed multi-region architecture survived outage (Reliability). STAR.",
          "Cost optimization saved significant spend (Cost Leadership). STAR.",
          "Built Azure platform team adoption (Platform Enablement). STAR.",
          "Security incident response coordination (Security Leadership). STAR.",
          "Technical strategy influenced cloud roadmap (Strategic Thinking). STAR.",
          "Mentored engineers Azure best practices (Technical Mentorship). STAR.",
          "Simplified complex cloud architecture (Architecture Simplification). STAR.",
          "Customer cloud success partnership (Customer Success). STAR.",
          "Rapid cloud prototyping validated approach (Speed + Rigor). STAR.",
          "Cross-team cloud governance alignment (Governance Leadership). STAR.",
          "Azure innovation competitive advantage (Innovation). STAR.",
          "Technical excellence raised cloud standards (Excellence). STAR.",
          "Continuous cloud learning certification (Learning Agility). STAR.",
          "Inclusive cloud team environment (Inclusion Leadership). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Microsoft AI Engineer
(
    'Microsoft',
    'Microsoft AI Engineer',
    'Senior',
    '60 min',
    ARRAY['Azure AI', 'ML Ops', 'Cognitive Services', 'Bot Framework', 'Responsible AI'],
    'Microsoft AI Engineer interviews test Azure AI services and MLOps patterns. Emphasis on Cognitive Services, Bot Framework, and responsible AI.',
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Azure AI Services", "Production AI", "Responsible AI"],
      "behavioralFocus": "Growth Mindset & Collaboration"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Azure AI Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Cognitive Services", "Vision", "NLP"],
        "overview": "Azure Cognitive Services APIs and custom model integration patterns.",
        "questions": [
          "Azure Computer Vision custom vision training deployment.",
          "Azure Form Recognizer document layout extraction.",
          "Azure Speech multi-language translation real-time.",
          "LUIS vs CLU conversational understanding intents.",
          "Azure Text Analytics sentiment entity recognition.",
          "Face API emotion detection identity verification.",
          "Custom Vision object detection vs classification.",
          "Anomaly Detector multivariate time series.",
          "Content Moderator profanity image moderation.",
          "Azure Video Indexer video insight extraction.",
          "Bot Framework composer state management.",
          "QnA Maker knowledge base curation.",
          "Personalizer reinforcement learning ranking.",
          "Azure AI Language custom text classification.",
          "Speech-to-Text custom acoustic neural models."
        ]
      },
      "techRoundTwo": {
        "title": "AI Production Systems",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["ML Ops", "Model Serving", "Monitoring"],
        "overview": "Azure ML production patterns and monitoring. Model lifecycle management.",
        "questions": [
          "Azure ML managed endpoints traffic splitting A/B.",
          "Model monitoring drift detection retraining pipeline.",
          "ONNX model interoperability TensorFlow PyTorch.",
          "Azure ML pipelines automated ML workflow.",
          "Model explainability interpretML SHAP integration.",
          "Responsible AI fairness assessment dashboard.",
          "Azure AI Studio prompt flow orchestration.",
          "Cognitive Search semantic ranking hybrid search.",
          "Azure Container Instances vs AKS model serving.",
          "Real-time inference vs batch scoring patterns.",
          "Model versioning rollback production governance.",
          "Feature store online offline serving patterns.",
          "AutoML classification regression forecasting.",
          "Hyperparameter tuning Bayesian sweep automation.",
          "Data drift concept drift automated alerting."
        ]
      },
      "techRoundThree": {
        "title": "Enterprise AI Architecture",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Architecture", "Integration", "Scale"],
        "overview": "Enterprise AI architecture patterns across Azure services. Integration and scaling strategies.",
        "questions": [
          "Azure AI platform self-service developer portal.",
          "Cognitive Services multi-region deployment latency.",
          "Bot Framework multi-channel Teams Slack web.",
          "Azure AI governance model catalog approval.",
          "RAG retrieval augmented generation vector search.",
          "Azure OpenAI GPT deployment content filtering.",
          "LangChain Semantic Kernel orchestration patterns.",
          "Azure AI Document Intelligence forms processing.",
          "Speech Service batch transcription processing.",
          "Custom Vision multi-tenant training deployment.",
          "Personalizer multi-slot reinforcement learning.",
          "Azure AI Vision edge deployment IoT.",
          "Cognitive Search knowledge mining enterprise.",
          "Responsible AI content safety automated.",
          "AI platform cost optimization governance."
        ]
      },
      "behavioral": {
        "title": "Growth Mindset Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "AI engineering leadership through responsible AI and enterprise impact. Customer transformation scenarios.",
        "questions": [
          "Shipped AI solution business transformation (AI Impact). STAR.",
          "Responsible AI implementation production (Responsible AI). STAR.",
          "Built AI platform team self-service (Platform Enablement). STAR.",
          "AI experimentation influenced product (Experiment Impact). STAR.",
          "Mentored AI engineers best practices (Technical Leadership). STAR.",
          "Simplified complex AI pipeline (AI Simplification). STAR.",
          "Customer AI success partnership (Customer Success). STAR.",
          "AI cost optimization significant savings (Cost Leadership). STAR.",
          "Cross-team AI governance alignment (Governance Leadership). STAR.",
          "Rapid AI prototyping validated approach (Speed + Rigor). STAR.",
          "AI innovation competitive advantage (AI Innovation). STAR.",
          "Technical excellence raised AI standards (Excellence). STAR.",
          "Continuous AI learning SOTA implementation (Learning Agility). STAR.",
          "Inclusive AI team responsible practices (Inclusion). STAR.",
          "AI strategy long-term enterprise roadmap (Strategic Thinking). STAR."
        ]
      }
    }
    $$::jsonb
);
