

INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Amazon SDE I
(
    'Amazon',
    'Amazon SDE I',
    'Entry',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'Coding', 'Problem Solving', 'OOP'],
    'Amazon SDE I interviews typically consist of 3 technical rounds focusing on coding fundamentals and 1 behavioral round emphasizing Leadership Principles. Each 15-minute round tests core DSA skills and behavioral fit. The process assesses both technical proficiency and cultural alignment through structured questioning.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Algorithms", "Leadership Principles", "Customer Obsession"],
      "behavioralFocus": "Leadership Principles"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Coding Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Arrays", "Strings", "Time Complexity"],
        "overview": "This round evaluates basic data structure knowledge and coding ability. Expect medium-level LeetCode-style problems solvable in O(n) time. Interviewers assess code clarity and edge case handling.",
        "questions": [
          "Implement two sum using hash map, explain why O(n) is optimal vs nested loops O(n²), handle edge cases like empty array or no solution.",
          "Find longest substring without repeating characters using sliding window and set, detail left/right pointer movement and char replacement logic.",
          "Reverse a linked list iteratively, discuss recursive vs iterative space complexity, handle single node and empty list cases.",
          "Check if parentheses string is valid using stack, explain push/pop operations and matching rules for '()', '[]', '{}'.",
          "Merge two sorted linked lists, describe dummy node approach and pointer merging logic for O(n+m) time.",
          "Find missing number in 1 to n array using XOR or sum formula, compare both methods' integer overflow risks.",
          "Implement LRU Cache with hash map + doubly linked list, detail get/put operations and O(1) complexity proof.",
          "Rotate array k positions using reverse algorithm, explain three-step reversal and handle k > length cases.",
          "Group anagrams using sorted string as key in hash map, discuss prime number multiplication alternative.",
          "Maximum subarray sum using Kadane's algorithm, handle all negative numbers case and track start/end indices.",
          "Valid palindrome ignoring non-alphanumeric chars case-insensitively, use two pointers vs reverse+compare.",
          "Climbing stairs with DP memoization, explain Fibonacci relation and space optimization to O(1).",
          "House robber DP problem, detail states for robbing/not robbing current house and handle edge cases.",
          "Container with most water using two pointers, explain why pointers move inward based on shorter height.",
          "Product array except self without division using left/right prefix arrays, handle zero cases."
        ]
      },
      "techRoundTwo": {
        "title": "Data Structures Deep Dive",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Trees", "Graphs", "BFS/DFS"],
        "overview": "Focuses on tree/graph traversal and manipulation. Problems require understanding recursion and queue/stack usage. Expect optimization discussions.",
        "questions": [
          "Validate binary search tree using inorder traversal or min-max range recursion, discuss both approaches.",
          "Lowest common ancestor in BST using path storage or recursion, handle equal values case.",
          "Maximum depth of binary tree recursively, optimize iterative stack approach and discuss balance.",
          "Binary tree level order traversal using queue BFS, handle zigzag order variation.",
          "Number of islands in grid using DFS flood fill, modify for surrounded regions problem.",
          "Course schedule topological sort using Kahn's algorithm with indegree array, detect cycles.",
          "Clone graph using DFS with visited hash map, explain deep copy vs shallow reference.",
          "Word ladder shortest path using BFS, detail wordList transformation to neighbors.",
          "Serialize/desserialize binary tree using preorder traversal string, handle null nodes.",
          "Kth smallest element in BST using inorder traversal stack, optimize with Morris traversal.",
          "Diameter of binary tree as max of left+right+1 depths, compute via recursion.",
          "Construct binary tree from preorder+inorder, explain index tracking and subtree recursion.",
          "Graph valid tree check: single connected component + no cycles via Union-Find or DFS.",
          "Minimum height trees using topological sort on leaves, explain peeling layers.",
          "Alien dictionary topological sort from char order strings, handle cycles and multiples."
        ]
      },
      "techRoundThree": {
        "title": "Problem Solving Patterns",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DP", "Greedy", "Backtracking"],
        "overview": "Tests pattern recognition and optimization skills. Questions emphasize deriving optimal solutions from first principles.",
        "questions": [
          "Longest increasing subsequence DP O(n²) then optimize to O(n log n) with patience sorting.",
          "Word break DP boolean array, detail substring checks and memoization.",
          "Coin change minimum coins unbounded knapsack DP, handle impossible cases.",
          "Unique paths robot grid DP combinatorial or memoized recursion.",
          "Jump game II greedy jumps minimizing steps, prove optimality.",
          "Partition equal subset sum knapsack 0/1 DP space optimized.",
          "Letter combinations phone number backtracking with string builder.",
          "Permutations unique backtracking swap approach avoiding duplicates.",
          "Subsets powerset backtracking include/exclude decisions.",
          "N-Queens backtracking with column/45deg tracking.",
          "Regular expression matching DP 2D table for . and * handling.",
          "Longest valid parentheses stack or DP tracking lengths.",
          "Decode ways string DP where dp[i] = ways for s[0:i-1].",
          "Palindrome partitioning minimum cuts DP boolean + count.",
          "Edit distance Levenshtein DP operations insert/delete/replace."
        ]
      },
      "behavioral": {
        "title": "Leadership Principles Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Deep dive into Amazon's 16 Leadership Principles using STAR format (Situation, Task, Action, Result). Each interviewer probes 2-3 principles deeply with follow-ups. Demonstrates cultural fit beyond technical skills.",
        "questions": [
          "Tell me about a time you went above and beyond for a customer (Customer Obsession). STAR.",
          "Describe when you disagreed with a teammate and how resolved (Have Backbone; Disagree and Commit). STAR.",
          "Situation where you delivered results with tight deadlines (Deliver Results). STAR.",
          "Example of inventing a novel solution to a hard problem (Invent and Simplify). STAR.",
          "Time you took ownership beyond your role (Ownership). STAR.",
          "How you learned from a major failure (Learn and Be Curious). STAR.",
          "Instance of deep customer empathy driving decisions (Earn Trust). STAR.",
          "When you simplified complex processes (Dive Deep; Bias for Action). STAR.",
          "Example mentoring junior team members (Insist on the Highest Standards). STAR.",
          "Time you committed to team decision despite disagreement (Think Big). STAR.",
          "Situation where frugality drove innovation (Frugality). STAR.",
          "How you earned trust through vulnerability (Strive to be Earth's Best Employer). STAR.",
          "Example of long-term strategic thinking (Success and Scale Bring Broad Responsibility). STAR.",
          "When curiosity led to business impact (Learn and Be Curious). STAR.",
          "Time you raised standards when others accepted mediocrity (Insist on the Highest Standards). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Amazon SDE III
(
    'Amazon',
    'Amazon SDE III',
    'Senior',
    '75 min',
    ARRAY['Advanced Algorithms', 'System Design', 'Architecture', 'Leadership', 'Mentorship'],
    'SDE III process includes 3 advanced technical rounds plus behavioral, sometimes 5 total. Heavy system design and leadership focus differentiates from lower levels. Expect architectural trade-offs and mentorship scenarios.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["System Design", "Leadership", "Scalability"],
      "behavioralFocus": "Leadership Principles"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Advanced Algorithms",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Hard LeetCode", "Optimization", "Space Efficiency"],
        "overview": "Challenging problems requiring multiple optimizations and pattern synthesis.",
        "questions": [
          "Median stream data structure using two heaps, detail balance reheapify logic.",
          "Trapping rain water monotonic stack or two pointers.",
          "Sliding window maximum deque monotonic queue.",
          "LFU Cache hashmap + doubly linked list + freq map.",
          "Serialize/deserialize N-ary tree level order strings.",
          "Shortest palindrome KMP prefix table.",
          "Longest consecutive sequence union-find or sorted set.",
          "Task scheduler CPU cooling greedy priority queue.",
          "IPO project greedy heap max profit.",
          "Find median data stream online algorithm.",
          "Dungeon game DP min health path.",
          "Best time buy sell stock IV multiple transactions DP.",
          "Burst balloons DP intervals max coins.",
          "Distinct subsequences DP string matching count.",
          "Wildcard matching DP . * handling."
        ]
      },
      "techRoundTwo": {
        "title": "Complex System Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Distributed Systems", "CAP", "Consistency"],
        "overview": "Design scalable distributed systems handling failures and high QPS.",
        "questions": [
          "Design URL shortener like TinyURL with custom aliases and analytics.",
          "Design notification system push/email/SMS with retry queues.",
          "Design pastebin with syntax highlighting and collaboration.",
          "Design chat system 1M concurrent users WebSocket/sharding.",
          "Design autocomplete search prefix tree + TF-IDF ranking.",
          "Design ticketmaster ticketing high concurrency optimistic locking.",
          "Design Uber real-time location matching ETA calculation.",
          "Design TinyURL analytics geographic IP tracking.",
          "Design rate limiter token bucket sliding window.",
          "Design leader election distributed systems Raft/Paxos.",
          "Design CDN content distribution cache invalidation.",
          "Design recommendation engine collaborative filtering.",
          "Design log aggregation system ELK stack sharding.",
          "Design payment gateway idempotency PCI compliance.",
          "Design IoT telemetry pipeline 1B events/day Spark."
        ]
      },
      "techRoundThree": {
        "title": "Architecture & Leadership",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Trade-offs", "Mentorship", "Scalability"],
        "overview": "Leadership through technical decisions and team guidance scenarios.",
        "questions": [
          "When would you choose microservices vs monolith, migration strategy.",
          "Debug production outage 99.9% service latency spike.",
          "Design mentorship program junior engineer ramp-up.",
          "API gateway vs direct service communication pros/cons.",
          "Database sharding strategy consistent hashing range.",
          "Circuit breaker pattern implementation Hystrix resilience.",
          "Event sourcing vs CRUD trade-offs state reconstruction.",
          "CQRS implementation read/write models sync.",
          "Service mesh Istio traffic management security.",
          "Chaos engineering fault injection strategy.",
          "Data lake vs warehouse analytics use cases.",
          "Kubernetes vs ECS container orchestration choice.",
          "GraphQL vs REST API evolution gateway.",
          "Zero-downtime deployment blue-green canary.",
          "Observability metrics traces logs golden signals."
        ]
      },
      "behavioral": {
        "title": "Leadership Principles Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Senior leadership scenarios across all 16 principles with team impact.",
        "questions": [
          "Led team through major architectural refactor (Ownership). STAR.",
          "Pushed back on senior leadership wrong direction (Have Backbone). STAR.",
          "Drove business-critical feature launch (Deliver Results). STAR.",
          "Invented new distributed tracing system (Invent and Simplify). STAR.",
          "Took ownership of failing team project (Ownership). STAR.",
          "Recovered from multi-million dollar outage (Dive Deep). STAR.",
          "Mentored engineer to promotion (Earn Trust). STAR.",
          "Simplified legacy codebase 10x perf (Bias for Action). STAR.",
          "Raised engineering standards org-wide (Highest Standards). STAR.",
          "Disagreed committed to risky launch (Disagree Commit). STAR.",
          "Frugal solution saved 1M/year (Frugality). STAR.",
          "Built inclusive diverse engineering team (Earth's Best). STAR.",
          "Strategic platform investment 3yr ROI (Think Big). STAR.",
          "Continuous learning conferences patents (Be Curious). STAR.",
          "Customer obsession redesigned billing UX (Customer Obsession). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Amazon Data Engineer
(
    'Amazon',
    'Amazon Data Engineer',
    'Intermediate',
    '60 min',
    ARRAY['ETL', 'SQL', 'Spark', 'Data Modeling', 'Airflow'],
    'Data Engineer interviews emphasize ETL pipelines, big data processing, and data modeling. Rounds test practical data infrastructure skills. Behavioral round assesses cross-team collaboration.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Data Pipelines", "Scalability", "Data Quality"],
      "behavioralFocus": "Leadership Principles"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "SQL Mastery",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Complex Joins", "Window Functions", "Optimization"],
        "overview": "Advanced SQL queries on large datasets with performance considerations.",
        "questions": [
          "Find 2nd highest salary per department using window functions.",
          "Running total sales by date partitioned by region window.",
          "Customer lifetime value cohort analysis SQL.",
          "Identify duplicate records fuzzy matching Levenshtein.",
          "Pivot sales data rows to columns dynamic SQL.",
          "Recursive CTE org hierarchy employee manager.",
          "Top N queries per group dense_rank() window.",
          "Gaps islands problem consecutive date ranges.",
          "Sessionization user activity timestamps SQL.",
          "A/B test statistical significance query.",
          "Median calculation SQL no window functions.",
          "JSON data extraction nested arrays SQL.",
          "Slow query optimization execution plan indexes.",
          "Data quality checks nulls duplicates constraints.",
          "Materialized view vs CTE performance."
        ]
      },
      "techRoundTwo": {
        "title": "ETL Pipeline Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Spark", "Airflow", "Kafka"],
        "overview": "Design production data pipelines handling failures and scaling.",
        "questions": [
          "Design daily ETL 1TB sales data Spark partitioning.",
          "Airflow DAG backfill strategy dependency management.",
          "Kafka CDC change data capture pipeline.",
          "Delta Lake ACID transactions Spark merge upsert.",
          "Data lakehouse architecture Iceberg vs Delta.",
          "Streaming pipeline Spark Structured Streaming.",
          "Slowly changing dimensions SCD type 2 upsert.",
          "Pipeline monitoring alerts data quality SLAs.",
          "Cost optimization EMR spot instances autoscaling.",
          "Data lineage tracking Apache Atlas.",
          "Schema evolution Avro Protobuf compatibility.",
          "Batch vs stream processing Lambda architecture.",
          "Idempotent pipeline design exactly-once semantics.",
          "Data mesh domain-oriented decentralized data.",
          "Feature store serving online offline ML."
        ]
      },
      "techRoundThree": {
        "title": "Big Data Infrastructure",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Redshift", "Data Warehousing", "Optimization"],
        "overview": "Data warehouse design and optimization for analytics workloads.",
        "questions": [
          "Star schema vs snowflake denormalization trade-offs.",
          "Redshift distribution sort keys optimization.",
          "Materialized views incremental refresh strategy.",
          "Columnar vs row storage compression analytics.",
          "Partition pruning Hive partition evolution.",
          "Workload management WLM query queues.",
          "Vacuum analyze maintenance operations.",
          "Federated query S3 Redshift Spectrum.",
          "Data sharing Snowflake vs Redshift.",
          "BI acceleration result caching.",
          "Query optimization EXPLAIN ANALYZE joins.",
          "Concurrency scaling elastic resize.",
          "Cross-region data replication.",
          "Cost allocation tags billing.",
          "Data governance catalog lineage."
        ]
      },
      "behavioral": {
        "title": "Leadership Principles Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Behavioral questions focused on data team leadership and cross-functional impact.",
        "questions": [
          "Fixed broken daily pipeline impacted analytics (Deliver Results). STAR.",
          "Convinced analysts use proper data model (Have Backbone). STAR.",
          "Built self-service data platform (Invent Simplify). STAR.",
          "Owned end-to-end data platform migration (Ownership). STAR.",
          "Simplified complex reporting 50% faster (Bias Action). STAR.",
          "Mentored analysts SQL best practices (Earn Trust). STAR.",
          "Customer data needs drove platform design (Customer Obsession). STAR.",
          "Raised data quality standards automated tests (Highest Standards). STAR.",
          "Dive deep debugged month-old data corruption (Dive Deep). STAR.",
          "Frugal solution saved 100K compute costs (Frugality). STAR.",
          "Strategic data lake investment ROI (Think Big). STAR.",
          "Inclusive data team diverse perspectives (Earth's Best). STAR.",
          "Continuous learning new big data tools (Be Curious). STAR.",
          "Disagreed stakeholder wrong metrics definition (Disagree Commit). STAR.",
          "Scale Bring Broad Responsibility data privacy (Scale Responsibility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Amazon ML Engineer
(
    'Amazon',
    'Amazon ML Engineer',
    'Intermediate',
    '60 min',
    ARRAY['ML Algorithms', 'MLOps', 'Feature Engineering', 'Model Deployment', 'SageMaker'],
    'ML Engineer interviews test end-to-end ML lifecycle skills from data to production. Emphasis on practical deployment and monitoring. Behavioral assesses ML team collaboration.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Production ML", "A/B Testing", "Model Monitoring"],
      "behavioralFocus": "Leadership Principles"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "ML Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Algorithms", "Math", "Evaluation"],
        "overview": "Core ML algorithms and mathematical foundations with implementation details.",
        "questions": [
          "XGBoost gradient boosting trees loss functions regularization.",
          "Transformer attention self-attention multi-head positional encoding.",
          "GANs generator discriminator minimax loss mode collapse.",
          "RNN LSTM GRU vanishing gradients sequence modeling.",
          "CNN conv layers pooling batch norm ResNet skip connections.",
          "PCA SVD dimensionality reduction explained variance.",
          "K-means GMM clustering elbow method silhouette score.",
          "Bias-variance tradeoff overfitting regularization L1 L2 dropout.",
          "Cross-validation k-fold stratified time-series split.",
          "Hyperparameter tuning grid random Bayesian Optuna.",
          "Feature selection mutual information recursive elimination.",
          "Imbalanced classification SMOTE precision recall F1 AUC-PR.",
          "Time series ARIMA Prophet seasonality decomposition.",
          "Reinforcement learning Q-learning policy gradient actor-critic.",
          "Anomaly detection isolation forest autoencoder one-class SVM."
        ]
      },
      "techRoundTwo": {
        "title": "Feature Engineering MLOps",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Pipelines", "SageMaker", "Monitoring"],
        "overview": "Production ML systems design and operationalization.",
        "questions": [
          "Design real-time inference pipeline SageMaker endpoint autoscaling.",
          "Feature store online offline serving Tecton Feast.",
          "Model drift detection statistical tests monitoring.",
          "A/B testing experimentation platform multi-armed bandit.",
          "Model registry versioning MLflow SageMaker Model Registry.",
          "Data versioning DVC lakeFS lineage tracking.",
          "CI/CD ML pipelines GitHub Actions Kubeflow.",
          "Shadow deployment canary blue-green ML models.",
          "Explainability SHAP LIME feature importance.",
          "Model compression quantization pruning distillation.",
          "SageMaker processing jobs distributed training.",
          "Multi-model endpoints cost optimization.",
          "Batch transform large scale inference.",
          "Cold start problem recommendation systems.",
          "Personalization collaborative content-based hybrid."
        ]
      },
      "techRoundThree": {
        "title": "Advanced ML Systems",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Scaling", "Optimization", "Production"],
        "overview": "Scaling ML to Amazon-scale production environments.",
        "questions": [
          "Distributed training Horovod DDP data parallel.",
          "Model serving TensorFlow Serving TorchServe Triton.",
          "GPU optimization mixed precision TF32 AMP.",
          "Recommendation ranking LambdaMART GBDT neural nets.",
          "NLP BERT fine-tuning transformers tokenization.",
          "Computer vision object detection YOLO EfficientDet.",
          "Time series forecasting DeepAR Prophet N-BEATS.",
          "AutoML neural architecture search NAS.",
          "Federated learning privacy-preserving distributed training.",
          "Active learning query strategy model uncertainty.",
          "Multi-task learning shared representations.",
          "Transfer learning domain adaptation fine-tuning.",
          "Robustness adversarial training data augmentation.",
          "Fairness bias mitigation demographic parity.",
          "Causal inference uplift modeling counterfactuals."
        ]
      },
      "behavioral": {
        "title": "Leadership Principles Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "ML-specific leadership scenarios and cross-functional impact.",
        "questions": [
          "Shipped ML model 10% revenue lift (Deliver Results). STAR.",
          "Convinced stakeholders model not ready prod (Have Backbone). STAR.",
          "Built end-to-end MLOps platform (Ownership). STAR.",
          "Simplified complex model interpretability (Invent Simplify). STAR.",
          "Fixed model degradation prod alerting (Dive Deep). STAR.",
          "Mentored data scientists best practices (Earn Trust). STAR.",
          "Customer ML needs drove solution design (Customer Obsession). STAR.",
          "Raised ML model standards automated evals (Highest Standards). STAR.",
          "Bias for action rapid ML prototyping (Bias Action). STAR.",
          "Frugal ML compute optimization spot GPU (Frugality). STAR.",
          "Strategic ML platform investment (Think Big). STAR.",
          "Inclusive ML team responsible AI (Earth's Best). STAR.",
          "Continuous learning latest SOTA papers (Be Curious). STAR.",
          "Committed disagreed model architecture (Disagree Commit). STAR.",
          "Responsible AI ethical ML deployment (Scale Responsibility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 5. Amazon Solutions Architect
(
    'Amazon',
    'Amazon Solutions Architect',
    'Senior',
    '60 min',
    ARRAY['AWS Services', 'Cloud Architecture', 'Cost Optimization', 'Security', 'Well-Architected'],
    'Solutions Architect interviews focus on AWS Well-Architected Framework and customer scenarios. Emphasis on trade-offs, cost, and operational excellence. Behavioral assesses customer empathy.',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["AWS Services", "Well-Architected", "Customer Focus"],
      "behavioralFocus": "Leadership Principles"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Core AWS Services",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Compute", "Storage", "Networking"],
        "overview": "Deep dive into core AWS services and integration patterns.",
        "questions": [
          "EC2 vs Lambda vs ECS Fargate vs EKS workload choice.",
          "S3 lifecycle policies Glacier Vault Lock versioning.",
          "VPC peering Transit Gateway vs VPC endpoints.",
          "ALB NLB Gateway Load Balancer differences.",
          "EBS EFS FSx storage performance cost comparison.",
          "CloudFront behaviors Lambda@Edge caching.",
          "DynamoDB single table design GSI LSI.",
          "RDS Aurora vs Redshift analytics workloads.",
          "ElastiCache Redis vs Memcached use cases.",
          "SQS SNS EventBridge messaging patterns.",
          "Step Functions state machines error handling.",
          "API Gateway REST HTTP GraphQL throttling.",
          "CloudWatch Container Insights X-Ray tracing.",
          "Secrets Manager vs SSM Parameter Store.",
          "IAM policy conditions least privilege."
        ]
      },
      "techRoundTwo": {
        "title": "High Availability Architecture",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DR", "Multi-AZ", "Global"],
        "overview": "Design highly available global architectures with RTO/RPO.",
        "questions": [
          "Multi-region active-active architecture Route 53 latency.",
          "Disaster recovery pilot light warm standby backup restore.",
          "99.99% SLA architecture multi-AZ design.",
          "Database replication cross-region lag monitoring.",
          "Global Accelerator static anycast IP.",
          "DynamoDB Global Tables multi-region sync.",
          "Aurora Global Database cross-region read replicas.",
          "S3 Cross-Region Replication CRR versioning.",
          "CloudFront origin failover behavior policies.",
          "RDS Multi-AZ failover automated vs manual.",
          "EKS cluster multi-AZ node groups.",
          "ECS Fargate placement strategies.",
          "Lambda provisioned concurrency multi-AZ.",
          "Backup Vault Lock compliance retention.",
          "AWS Shield DDoS protection auto-remediation."
        ]
      },
      "techRoundThree": {
        "title": "Cost Optimization Security",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Well-Architected", "FinOps", "Zero Trust"],
        "overview": "Well-Architected Framework excellence pillars with trade-offs.",
        "questions": [
          "Well-Architected Framework 6 pillars review trade-offs.",
          "Cost optimization Reserved Instances Savings Plans.",
          "Spot instances interruption handling strategy.",
          "FinOps practices tagging allocation showback.",
          "Security zero trust least privilege SCPs.",
          "GuardDuty Macie Security Hub detective controls.",
          "Network segmentation VPC flow logs GuardDuty.",
          "Data encryption KMS customer managed keys.",
          "IAM Access Analyzer policy generation.",
          "Config Rules compliance continuous monitoring.",
          "CloudTrail organization trail aggregation.",
          "Backup compliance cross-region copy Vault Lock.",
          "Well-Architected Tool remediation framework.",
          "Operational excellence runbooks automation.",
          "Reliability chaos engineering fault injection."
        ]
      },
      "behavioral": {
        "title": "Leadership Principles Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Customer-facing architecture leadership scenarios.",
        "questions": [
          "Diffused angry customer architecture concerns (Earn Trust). STAR.",
          "Pushed back unrealistic customer deadlines (Have Backbone). STAR.",
          "Delivered complex migration on-time (Deliver Results). STAR.",
          "Simplified customer confusing architecture (Invent Simplify). STAR.",
          "Owned customer relationship end-to-end (Ownership). STAR.",
          "Analyzed customer failed deployment root cause (Dive Deep). STAR.",
          "Customer empathy drove architecture decisions (Customer Obsession). STAR.",
          "Raised security standards customer objection (Highest Standards). STAR.",
          "Rapid prototype customer POC MVP (Bias Action). STAR.",
          "Frugal architecture saved customer 50% costs (Frugality). STAR.",
          "Strategic cloud migration multi-year roadmap (Think Big). STAR.",
          "Mentored customer architects best practices (Earth's Best). STAR.",
          "Continuous learning new AWS services (Be Curious). STAR.",
          "Committed disagreed customer wrong architecture (Disagree Commit). STAR.",
          "Responsible cloud sustainable architecture (Scale Responsibility). STAR."
        ]
      }
    }
    $$::jsonb
);
