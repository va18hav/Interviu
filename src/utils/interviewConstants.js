
export const ROUND_TYPES = [
    { id: 'coding', label: 'Coding' },
    { id: 'debug', label: 'Debug' },
    { id: 'design', label: 'Design' },
    { id: 'behavioral', label: 'Behavioral' },
];

export const ROLES = [
    { id: 'sde', label: 'SDE' },
    { id: 'devops', label: 'DevOps / SRE' },
];

export const EXPERIENCE_LEVELS = [
    { id: 'l3', label: 'L3 (Entry Level)' },
    { id: 'l4', label: 'L4 (Mid Level)' },
    { id: 'l5', label: 'L5 (Senior)' },
    { id: 'l6', label: 'L6 (Staff)' },
    { id: 'staff_plus', label: 'Staff+' },
    { id: 'lead', label: 'Lead' },
];

export const DOMAIN_FOCUS = [
    'Backend systems',
    'Distributed systems',
    'Data infrastructure',
    'Platform engineering',
    'Reliability engineering',
    'Cloud infrastructure',
    'Dev tooling',
    'Security',
    'Observability',
    'Mobile/backend',
    'Payments',
    'AI/ML infra',
];

export const SYSTEM_CONTEXT_SUGGESTIONS = [
    'consumer backend',
    'internal platform',
    'infra control plane',
    'data pipelines',
    'high-traffic API',
    'event streaming system',
    'CI/CD system',
    'monitoring platform',
];

export const TECH_STACKS = [
    // Languages
    'Java', 'Python', 'Go', 'C++', 'TypeScript', 'JavaScript', 'Node.js',
    'Rust', 'Ruby', 'Scala', 'Swift', 'Kotlin', 'PHP', 'C#',
    // Frameworks
    'Spring Boot', 'Django', 'FastAPI', 'Flask', 'Express', 'NestJS', 'Rails',
    'React', 'Next.js', 'GraphQL', 'gRPC', 'REST',
    // Cloud & Infra
    'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Helm',
    'Pulumi', 'Ansible', 'ArgoCD', 'Istio', 'Envoy',
    // Databases & Messaging
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB',
    'Elasticsearch', 'Kafka', 'RabbitMQ', 'Pub/Sub', 'SQS',
    // Data & Observability
    'Spark', 'Flink', 'Airflow', 'dbt', 'Prometheus', 'Grafana', 'DataDog', 'Jaeger',
];

export const PRODUCTION_MATURITY = [
    { id: 'early_stage', label: 'Early stage startup' },
    { id: 'scaling_startup', label: 'Scaling startup' },
    { id: 'mid_scale', label: 'Mid-scale production' },
    { id: 'global', label: 'Global production' },
    { id: 'regulated', label: 'Regulated production' },
];

export const YEARS_OF_EXPERIENCE = [
    { id: '2_4', label: '2–4 years' },
    { id: '4_7', label: '4–7 years' },
    { id: '7_10', label: '7–10 years' },
    { id: '10_plus', label: '10+ years' },
];

export const CANDIDATE_STRENGTHS = [
    'Coding', 'System Design', 'Debugging', 'Reliability', 'Communication'
];

export const CANDIDATE_WEAKNESSES = [
    'Concurrency', 'Scaling', 'Infra Knowledge', 'Design Depth', 'Failure Reasoning'
];

export const FAILURE_INTENSITY = [
    { id: 'mild', label: 'Mild' },
    { id: 'realistic', label: 'Realistic' },
    { id: 'severe', label: 'Severe' },
    { id: 'cascading', label: 'Cascading' },
];

export const AMBIGUITY_LEVEL = [
    { id: 'guided', label: 'Guided' },
    { id: 'moderate', label: 'Moderate Ambiguity' },
    { id: 'high', label: 'High Ambiguity (Senior)' },
];

export const INTERVIEW_STRICTNESS = [
    { id: 'supportive', label: 'Supportive' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'skeptical', label: 'Skeptical' },
    { id: 'bar_raising', label: 'Bar-raising' },
];

// Round & Role Specific Configurations
export const ROUND_SPECIFIC_CONFIG = {
    coding: {
        sde: {
            implementationDomain: [
                'backend service logic', 'distributed task processing', 'caching', 'data pipelines', 'API layer', 'infra-adjacent backend'
            ],
            systemInteraction: [
                'database heavy', 'async queue', 'event driven', 'API calls', 'multi-service coordination'
            ],
            constraintsEmphasis: [
                'latency', 'throughput', 'concurrency', 'memory', 'correctness', 'reliability', 'cost'
            ],
            failureEnvironment: [
                'retry storms', 'partial failures', 'dependency timeouts', 'race conditions', 'load spikes'
            ],
            dataInteractionType: [
                'read heavy', 'write heavy', 'mixed', 'streaming'
            ]
        },
        devops: {
            automationType: [
                'remediation', 'deployment', 'monitoring automation', 'infra orchestration', 'scaling logic', 'reliability tooling'
            ],
            infraEnvironment: [
                'Kubernetes', 'cloud (AWS/GCP/Azure)', 'on-prem', 'hybrid'
            ],
            safetyExpectations: [
                'idempotency', 'rollback', 'rate limiting', 'safe retries', 'concurrency control'
            ],
            operationalConstraints: [
                'partial observability', 'unreliable APIs', 'infra race conditions', 'state drift'
            ],
            failureEnvironment: [
                'deployment failure', 'infra API timeout', 'partial automation execution', 'cascading retries'
            ]
        }
    },
    debug: {
        sde: {
            failureSurface: [
                'service logic bug', 'concurrency issue', 'caching inconsistency', 'data corruption', 'retry amplification'
            ],
            observability: [
                'logs available', 'metrics available', 'tracing available', 'partial signals'
            ],
            dependencyEnvironment: [
                'multi-service', 'queue based', 'DB heavy', 'external API'
            ],
            failureImpact: [
                'latency spikes', 'user failures', 'data inconsistency', 'operational incidents'
            ]
        },
        devops: {
            incidentType: [
                'deployment failure', 'infra drift', 'scheduling issue', 'pipeline failure', 'monitoring outage', 'reliability incident'
            ],
            infraLayer: [
                'Kubernetes', 'CI/CD', 'cloud infra', 'networking', 'observability stack'
            ],
            signalsAvailable: [
                'logs', 'alerts', 'metrics', 'dashboards', 'partial signals'
            ],
            impactScope: [
                'single service', 'cluster', 'region', 'global'
            ]
        }
    },
    design: {
        sde: {
            systemType: [
                'API platform', 'backend service', 'distributed data system', 'messaging system', 'storage system', 'recommendation backend'
            ],
            scaleExpectation: [
                'moderate', 'high traffic', 'global'
            ],
            dataProfile: [
                'high writes', 'high reads', 'streaming', 'transactional'
            ],
            designFocus: [
                'scalability', 'consistency', 'latency', 'availability', 'cost', 'simplicity'
            ],
            failureModeling: [
                'regional failures', 'dependency collapse', 'overload', 'replication lag'
            ]
        },
        devops: {
            platformType: [
                'deployment platform', 'reliability platform', 'observability system', 'infra control plane', 'incident automation', 'capacity management'
            ],
            deploymentModel: [
                'multi cluster', 'multi region', 'hybrid infra', 'global infra'
            ],
            operationalExpectations: [
                'on-call', 'SLO driven', 'self healing', 'automation first'
            ],
            designFocus: [
                'failover', 'isolation', 'monitoring', 'incident response', 'deployment safety'
            ],
            failureModeling: [
                'region outage', 'cascading infra failure', 'monitoring blind spots', 'deployment rollback'
            ]
        }
    },
    behavioral: {
        sde: {
            experienceDomain: [
                'feature ownership', 'architecture', 'scaling systems', 'cross-team execution'
            ],
            leadershipExposure: [
                'IC', 'tech lead', 'mentoring', 'org influence'
            ],
            scenarioEmphasis: [
                'delivery pressure', 'disagreement', 'ownership failure', 'prioritization tradeoffs'
            ]
        },
        devops: {
            operationalExposure: [
                'on-call', 'incident leadership', 'reliability initiatives', 'infra ownership'
            ],
            leadershipScope: [
                'IC', 'incident commander', 'platform lead', 'org reliability initiatives'
            ],
            scenarioEmphasis: [
                'incident handling', 'cross-team coordination', 'postmortems', 'reliability vs velocity'
            ]
        }
    }
};
