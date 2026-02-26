// Design Component Schema for System Design Interview~
// Defines all available components and their configuration fields

export const COMPONENT_TYPES = {
    // Basic Infrastructure
    CLIENT: 'client',
    API_GATEWAY: 'api_gateway',
    LOAD_BALANCER: 'load_balancer',
    SERVICE: 'service',
    BACKGROUND_WORKER: 'background_worker',
    CACHE: 'cache',
    DATABASE: 'database',
    MESSAGE_QUEUE: 'message_queue',
    OBJECT_STORAGE: 'object_storage',
    SEARCH_INDEX: 'search_index',
    CDN: 'cdn',
    AUTH_SERVICE: 'auth_service',
    RATE_LIMITER: 'rate_limiter',
    CONFIG_SERVICE: 'config_service',

    // Reliability Layer
    CIRCUIT_BREAKER: 'circuit_breaker',
    RETRY_HANDLER: 'retry_handler',
    DEAD_LETTER_QUEUE: 'dead_letter_queue',
    FAILOVER_ROUTER: 'failover_router',
    REPLICATION_CONTROLLER: 'replication_controller',
    BACKPRESSURE_CONTROLLER: 'backpressure_controller',

    // Observability Layer
    METRICS_PIPELINE: 'metrics_pipeline',
    LOGGING_PIPELINE: 'logging_pipeline',
    DISTRIBUTED_TRACING: 'distributed_tracing',
    ALERTING_ENGINE: 'alerting_engine',
    MONITORING_DASHBOARD: 'monitoring_dashboard',

    // Traffic Engineering Layer
    EDGE_ROUTER: 'edge_router',
    GEO_ROUTER: 'geo_router',
    SERVICE_MESH: 'service_mesh',
    API_THROTTLER: 'api_throttler',
    LOAD_SHEDDER: 'load_shedder',

    // Data Processing Layer
    STREAM_PROCESSOR: 'stream_processor',
    BATCH_PROCESSOR: 'batch_processor',
    ETL_PIPELINE: 'etl_pipeline',
    SHARDING_MANAGER: 'sharding_manager',
    INDEX_BUILDER: 'index_builder',

    // Deployment / Infra Ops
    CICD_PIPELINE: 'cicd_pipeline',
    CANARY_CONTROLLER: 'canary_controller',
    FEATURE_ROLLOUT: 'feature_rollout',
    SECRETS_MANAGER: 'secrets_manager',

    // AI / ML Ops
    MODEL_TRAINING: 'model_training',
    MODEL_SERVING: 'model_serving',
    FEATURE_STORE: 'feature_store',
    MODEL_REGISTRY: 'model_registry',
    VECTOR_DB: 'vector_db',

    // Specialized Storage
    TIME_SERIES_DB: 'time_series_db',
    GRAPH_DB: 'graph_db',
    DATA_WAREHOUSE: 'data_warehouse',

    // Advanced Infrastructure
    DNS: 'dns',
    FIREWALL: 'firewall',
    SERVERLESS: 'serverless',
    DISTRIBUTED_LOCK: 'distributed_lock',

    // Annotations & Grouping
    BOUNDING_BOX: 'bounding_box',
    TEXT_NOTE: 'text_note'
};

export const COMPONENT_METADATA = {
    // --- Basic Infrastructure ---
    [COMPONENT_TYPES.CLIENT]: {
        label: 'Client / API Consumer',
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        color: '#2563EB', // Blue 600
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.API_GATEWAY]: {
        label: 'API Gateway',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
        color: '#059669', // Emerald 600
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.LOAD_BALANCER]: {
        label: 'Load Balancer',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png',
        color: '#7C3AED', // Violet 600
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.SERVICE]: {
        label: 'Service (Stateless)',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920230.png',
        color: '#475569', // Slate 600
        category: 'Compute'
    },
    [COMPONENT_TYPES.BACKGROUND_WORKER]: {
        label: 'Background Worker',
        icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png',
        color: '#D97706', // Amber 600
        category: 'Compute'
    },
    [COMPONENT_TYPES.CACHE]: {
        label: 'Cache',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920235.png',
        color: '#EAB308', // Yellow 500
        category: 'Storage'
    },
    [COMPONENT_TYPES.DATABASE]: {
        label: 'Database',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920231.png',
        color: '#0D9488', // Teal 600
        category: 'Storage'
    },
    [COMPONENT_TYPES.MESSAGE_QUEUE]: {
        label: 'Message Queue',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920239.png',
        color: '#EC4899',
        category: 'Messaging'
    },
    [COMPONENT_TYPES.OBJECT_STORAGE]: {
        label: 'Object Storage',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920232.png',
        color: '#8B5CF6',
        category: 'Storage'
    },
    [COMPONENT_TYPES.SEARCH_INDEX]: {
        label: 'Search Index',
        icon: 'https://cdn-icons-png.flaticon.com/512/751/751463.png',
        color: '#06B6D4',
        category: 'Storage'
    },
    [COMPONENT_TYPES.CDN]: {
        label: 'CDN',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920242.png',
        color: '#14B8A6',
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.AUTH_SERVICE]: {
        label: 'Auth Service',
        icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png',
        color: '#EF4444',
        category: 'Security'
    },
    [COMPONENT_TYPES.RATE_LIMITER]: {
        label: 'Rate Limiter',
        icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281307.png',
        color: '#F59E0B',
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.CONFIG_SERVICE]: {
        label: 'Config Service',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920277.png',
        color: '#6366F1',
        category: 'Management'
    },

    // --- Reliability Layer ---
    [COMPONENT_TYPES.CIRCUIT_BREAKER]: {
        label: 'Circuit Breaker',
        icon: 'https://cdn-icons-png.flaticon.com/512/9358/9358686.png',
        color: '#DC2626',
        category: 'Reliability'
    },
    [COMPONENT_TYPES.RETRY_HANDLER]: {
        label: 'Retry Handler',
        icon: 'https://cdn-icons-png.flaticon.com/512/9636/9636184.png',
        color: '#EA580C',
        category: 'Reliability'
    },
    [COMPONENT_TYPES.DEAD_LETTER_QUEUE]: {
        label: 'Dead Letter Queue',
        icon: 'https://cdn-icons-png.flaticon.com/512/983/983020.png',
        color: '#374151',
        category: 'Reliability'
    },
    [COMPONENT_TYPES.FAILOVER_ROUTER]: {
        label: 'Failover Router',
        icon: 'https://cdn-icons-png.flaticon.com/512/954/954591.png',
        color: '#B91C1C',
        category: 'Reliability'
    },
    [COMPONENT_TYPES.REPLICATION_CONTROLLER]: {
        label: 'Replication Controller',
        icon: 'https://cdn-icons-png.flaticon.com/512/3630/3630138.png',
        color: '#047857',
        category: 'Reliability'
    },
    [COMPONENT_TYPES.BACKPRESSURE_CONTROLLER]: {
        label: 'Backpressure Ctrl',
        icon: 'https://cdn-icons-png.flaticon.com/512/3587/3587099.png',
        color: '#7C3AED',
        category: 'Reliability'
    },

    // --- Observability Layer ---
    [COMPONENT_TYPES.METRICS_PIPELINE]: {
        label: 'Metrics Pipeline',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920286.png',
        color: '#2563EB',
        category: 'Observability'
    },
    [COMPONENT_TYPES.LOGGING_PIPELINE]: {
        label: 'Logging Pipeline',
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920302.png',
        color: '#4B5563',
        category: 'Observability'
    },
    [COMPONENT_TYPES.DISTRIBUTED_TRACING]: {
        label: 'Distributed Tracing',
        icon: 'https://cdn-icons-png.flaticon.com/512/1179/1179069.png',
        color: '#DB2777',
        category: 'Observability'
    },
    [COMPONENT_TYPES.ALERTING_ENGINE]: {
        label: 'Alerting Engine',
        icon: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png',
        color: '#EF4444',
        category: 'Observability'
    },
    [COMPONENT_TYPES.MONITORING_DASHBOARD]: {
        label: 'Monitoring Dashboard',
        icon: 'https://cdn-icons-png.flaticon.com/512/2328/2328966.png',
        color: '#059669',
        category: 'Observability'
    },

    // --- Traffic Engineering Layer ---
    [COMPONENT_TYPES.EDGE_ROUTER]: {
        label: 'Edge Router',
        icon: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png',
        color: '#0891B2',
        category: 'Traffic'
    },
    [COMPONENT_TYPES.GEO_ROUTER]: {
        label: 'Geo Router',
        icon: 'https://cdn-icons-png.flaticon.com/512/814/814513.png',
        color: '#0284C7',
        category: 'Traffic'
    },
    [COMPONENT_TYPES.SERVICE_MESH]: {
        label: 'Service Mesh',
        icon: 'https://cdn-icons-png.flaticon.com/512/2576/2576629.png',
        color: '#6D28D9',
        category: 'Traffic'
    },
    [COMPONENT_TYPES.API_THROTTLER]: {
        label: 'API Throttler',
        icon: 'https://cdn-icons-png.flaticon.com/512/10328/10328637.png',
        color: '#D97706',
        category: 'Traffic'
    },
    [COMPONENT_TYPES.LOAD_SHEDDER]: {
        label: 'Load Shedder',
        icon: 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
        color: '#BE123C',
        category: 'Traffic'
    },

    // --- Data Processing Layer ---
    [COMPONENT_TYPES.STREAM_PROCESSOR]: {
        label: 'Stream Processor',
        icon: 'https://cdn-icons-png.flaticon.com/512/2823/2823521.png',
        color: '#3B82F6',
        category: 'Data Processing'
    },
    [COMPONENT_TYPES.BATCH_PROCESSOR]: {
        label: 'Batch Processor',
        icon: 'https://cdn-icons-png.flaticon.com/512/4149/4149661.png',
        color: '#6366F1',
        category: 'Data Processing'
    },
    [COMPONENT_TYPES.ETL_PIPELINE]: {
        label: 'ETL Pipeline',
        icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
        color: '#8B5CF6',
        category: 'Data Processing'
    },
    [COMPONENT_TYPES.SHARDING_MANAGER]: {
        label: 'Sharding Manager',
        icon: 'https://cdn-icons-png.flaticon.com/512/3521/3521943.png',
        color: '#10B981',
        category: 'Data Processing'
    },
    [COMPONENT_TYPES.INDEX_BUILDER]: {
        label: 'Index Builder',
        icon: 'https://cdn-icons-png.flaticon.com/512/2857/2857434.png',
        color: '#F43F5E',
        category: 'Data Processing'
    },

    // --- Deployment / Infra Ops ---
    [COMPONENT_TYPES.CICD_PIPELINE]: {
        label: 'CI/CD Pipeline',
        icon: 'https://cdn-icons-png.flaticon.com/512/6403/6403566.png',
        color: '#16A34A',
        category: 'Deployment'
    },
    [COMPONENT_TYPES.CANARY_CONTROLLER]: {
        label: 'Canary Controller',
        icon: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
        color: '#FBBF24',
        category: 'Deployment'
    },
    [COMPONENT_TYPES.FEATURE_ROLLOUT]: {
        label: 'Feature Rollout',
        icon: 'https://cdn-icons-png.flaticon.com/512/1162/1162499.png',
        color: '#4F46E5',
        category: 'Deployment'
    },
    [COMPONENT_TYPES.SECRETS_MANAGER]: {
        label: 'Secrets Manager',
        icon: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png',
        color: '#374151',
        category: 'Security' // Or Deployment
    },

    // --- AI / ML Ops ---
    [COMPONENT_TYPES.MODEL_TRAINING]: {
        label: 'Model Training',
        icon: '', // SVG handled in DesignIcons
        color: '#8B5CF6', // Violet
        category: 'AI / ML Ops'
    },
    [COMPONENT_TYPES.MODEL_SERVING]: {
        label: 'Model Serving',
        icon: '',
        color: '#6366F1', // Indigo
        category: 'AI / ML Ops'
    },
    [COMPONENT_TYPES.FEATURE_STORE]: {
        label: 'Feature Store',
        icon: '',
        color: '#EC4899', // Pink
        category: 'AI / ML Ops'
    },
    [COMPONENT_TYPES.MODEL_REGISTRY]: {
        label: 'Model Registry',
        icon: '',
        color: '#14B8A6', // Teal
        category: 'AI / ML Ops'
    },
    [COMPONENT_TYPES.VECTOR_DB]: {
        label: 'Vector DB',
        icon: '',
        color: '#F59E0B', // Amber
        category: 'AI / ML Ops'
    },

    // --- Specialized Storage ---
    [COMPONENT_TYPES.TIME_SERIES_DB]: {
        label: 'Time Series DB',
        icon: '',
        color: '#84CC16', // Lime
        category: 'Storage'
    },
    [COMPONENT_TYPES.GRAPH_DB]: {
        label: 'Graph DB',
        icon: '',
        color: '#D946EF', // Fuchsia
        category: 'Storage'
    },
    [COMPONENT_TYPES.DATA_WAREHOUSE]: {
        label: 'Data Warehouse',
        icon: '',
        color: '#3B82F6', // Blue
        category: 'Storage'
    },

    // --- Advanced Infrastructure ---
    [COMPONENT_TYPES.DNS]: {
        label: 'DNS',
        icon: '',
        color: '#94A3B8', // Slate 400
        category: 'Basic Infrastructure'
    },
    [COMPONENT_TYPES.FIREWALL]: {
        label: 'Firewall / WAF',
        icon: '',
        color: '#EF4444', // Red
        category: 'Security'
    },
    [COMPONENT_TYPES.SERVERLESS]: {
        label: 'Serverless Func',
        icon: '',
        color: '#F97316', // Orange
        category: 'Compute'
    },
    [COMPONENT_TYPES.DISTRIBUTED_LOCK]: {
        label: 'Distributed Lock',
        icon: '',
        color: '#64748B', // Slate 500
        category: 'Reliability'
    },

    // --- Annotations & Grouping ---
    [COMPONENT_TYPES.BOUNDING_BOX]: {
        label: 'Bounding Box / Group',
        icon: '',
        color: '#9CA3AF', // Gray 400
        category: 'Logical'
    },
    [COMPONENT_TYPES.TEXT_NOTE]: {
        label: 'Text Note',
        icon: '',
        color: '#FDE047', // Yellow 300
        category: 'Logical'
    }
};


// --- Common Field Definitions ---

// --- Common Field Definitions ---

const FIELD_GROUPS = {
    CORE: 'Core Configuration',
    SCALING: 'Scaling & Strategy'
};

// Simplified: Removed Workload, State, Observability, Cost, Reliability common groups per L5+ requirements.
// We focus on High-Signal architectural decisions.

const COMMON_SCALING_FIELDS = [
    { key: 'scale_type', label: 'Scaling Model', type: 'select', options: ['Manual', 'Horizontal (Auto)', 'Vertical (Resize)'], group: FIELD_GROUPS.SCALING },
    { key: 'scale_min_instances', label: 'Min Instances', type: 'text', placeholder: '1', group: FIELD_GROUPS.SCALING },
    { key: 'scale_max_instances', label: 'Max Instances', type: 'text', placeholder: '10', group: FIELD_GROUPS.SCALING }
];

// Helper to spread common fields (Only Scaling is injected now)
const withCommonFields = (fields, includeScaling = true) => {
    let result = fields.map(f => ({ ...f, group: f.group || FIELD_GROUPS.CORE }));
    if (includeScaling) result = [...result, ...COMMON_SCALING_FIELDS];
    return result;
};

// Configuration schema for each component type
export const COMPONENT_CONFIG_SCHEMA = {
    // --- Basic Infrastructure ---
    [COMPONENT_TYPES.CLIENT]: {
        fields: withCommonFields([
            { key: 'client_type', label: 'Client Type', type: 'select', options: ['Web Browser', 'Mobile App', 'Desktop App', 'IoT Device', 'Third-party API'] },
            { key: 'request_pattern', label: 'Request Pattern', type: 'select', options: ['Synchronous', 'Asynchronous', 'Polling', 'WebSocket', 'SSE'] },
            { key: 'expected_concurrency', label: 'Expected Concurrency', type: 'text', placeholder: 'e.g., 10K concurrent users' },
            { key: 'retry_strategy', label: 'Retry Strategy', type: 'select', options: ['Exponential Backoff', 'Linear Retry', 'No Retry', 'Circuit Breaker'] }
        ], false) // No scaling fields for client
    },
    [COMPONENT_TYPES.API_GATEWAY]: {
        fields: withCommonFields([
            { key: 'routing_strategy', label: 'Routing Strategy', type: 'select', options: ['Path-based', 'Header-based', 'Query-based', 'Content-based'] },
            { key: 'authentication', label: 'Authentication', type: 'select', options: ['JWT', 'OAuth2', 'API Key', 'mTLS', 'None'] },
            { key: 'rate_limiting', label: 'Rate Limiting', type: 'select', options: ['Token Bucket', 'Leaky Bucket', 'Fixed Window', 'Sliding Window', 'None'] },
            { key: 'timeout', label: 'Request Timeout', type: 'text', placeholder: 'e.g., 30s' },
            { key: 'caching', label: 'Response Caching', type: 'select', options: ['Enabled', 'Disabled'] }
        ])
    },
    [COMPONENT_TYPES.LOAD_BALANCER]: {
        fields: withCommonFields([
            { key: 'algorithm', label: 'LB Algorithm', type: 'select', options: ['Round Robin', 'Least Connections', 'IP Hash', 'Weighted Round Robin'] },
            { key: 'health_check', label: 'Health Check', type: 'select', options: ['HTTP Ping', 'TCP Check', 'Active Probe'] },
            { key: 'session_affinity', label: 'Sticky Sessions', type: 'select', options: ['Enabled', 'Disabled'] },
            { key: 'layer', label: 'OSI Layer', type: 'select', options: ['Layer 4 (Transport)', 'Layer 7 (Application)'] }
        ])
    },
    [COMPONENT_TYPES.SERVICE]: {
        fields: withCommonFields([
            { key: 'service_name', label: 'Service Name', type: 'text', placeholder: 'e.g., User Service' },
            { key: 'language', label: 'Runtime', type: 'select', options: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'C++', 'Other'] },
            { key: 'instance_type', label: 'Instance Type', type: 'text', placeholder: 'e.g., t3.medium' },
            { key: 'deployment_strategy', label: 'Deployment', type: 'select', options: ['Blue-Green', 'Canary', 'Rolling', 'Recreate'] }
        ])
    },
    [COMPONENT_TYPES.BACKGROUND_WORKER]: {
        fields: withCommonFields([
            { key: 'worker_type', label: 'Worker Type', type: 'select', options: ['Queue Consumer', 'Cron Job', 'Event Processor'] },
            { key: 'concurrency', label: 'Concurrency', type: 'select', options: ['Single-threaded', 'Multi-threaded', 'Async IO'] },
            { key: 'idempotency', label: 'Idempotency', type: 'select', options: ['Guaranteed', 'Best Effort', 'None'] }
        ])
    },
    [COMPONENT_TYPES.CACHE]: {
        fields: withCommonFields([
            { key: 'cache_type', label: 'Implementation', type: 'select', options: ['Redis', 'Memcached', 'In-Memory', 'CDN Edge'] },
            { key: 'eviction_policy', label: 'Eviction', type: 'select', options: ['LRU', 'LFU', 'FIFO', 'TTL', 'Random'] },
            { key: 'ttl', label: 'Default TTL', type: 'text', placeholder: 'e.g., 5m, 1h' },
            { key: 'persistence', label: 'Persistence', type: 'select', options: ['None (Ephemeral)', 'AOF', 'RDB/Snapshot'] }
        ])
    },
    [COMPONENT_TYPES.DATABASE]: {
        fields: withCommonFields([
            { key: 'db_type', label: 'DB Engine', type: 'select', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra', 'DynamoDB', 'Redis', 'Neo4j'] },
            { key: 'data_model', label: 'Data Model', type: 'textarea', placeholder: 'Schema or key structure' },
            { key: 'sharding_strategy', label: 'Sharding', type: 'select', options: ['None', 'Hash', 'Range', 'Geo', 'Directory'] },
            { key: 'read_write_ratio', label: 'R/W Ratio', type: 'text', placeholder: 'e.g., 80:20' },
            { key: 'consistency_model', label: 'Consistency', type: 'select', options: ['Strong', 'Eventual', 'Causal', 'Tunable'] },
            { key: 'replication_scope', label: 'Replication', type: 'select', options: ['Single AZ', 'Multi-AZ', 'Multi-Region', 'Global'] }
        ])
    },
    [COMPONENT_TYPES.MESSAGE_QUEUE]: {
        fields: withCommonFields([
            { key: 'queue_type', label: 'Engine', type: 'select', options: ['Kafka', 'RabbitMQ', 'SQS', 'SNS', 'Pulsar'] },
            { key: 'ordering', label: 'Ordering', type: 'select', options: ['None', 'Strict FIFO', 'Partition Key'] },
            { key: 'delivery', label: 'Delivery Semantics', type: 'select', options: ['At-least-once', 'At-most-once', 'Exactly-once'] },
            { key: 'retention', label: 'Retention', type: 'text', placeholder: 'e.g., 7 days' }
        ])
    },
    [COMPONENT_TYPES.OBJECT_STORAGE]: {
        fields: withCommonFields([
            { key: 'storage_type', label: 'Provider', type: 'select', options: ['S3', 'GCS', 'Azure Blob', 'MinIO'] },
            { key: 'access_tier', label: 'Access Tier', type: 'select', options: ['Hot', 'Cool', 'Cold/Archive'] },
            { key: 'versioning', label: 'Versioning', type: 'select', options: ['Enabled', 'Disabled'] },
            { key: 'encryption', label: 'Encryption', type: 'select', options: ['Server-side', 'Client-side', 'None'] }
        ])
    },
    [COMPONENT_TYPES.SEARCH_INDEX]: {
        fields: withCommonFields([
            { key: 'search_engine', label: 'Engine', type: 'select', options: ['Elasticsearch', 'Solr', 'Algolia', 'Meilisearch'] },
            { key: 'indexing_latency', label: 'Indexing Latency', type: 'select', options: ['Real-time', 'Near-real-time', 'Batch'] },
            { key: 'sharding', label: 'Index Sharding', type: 'text', placeholder: 'Number of shards' }
        ])
    },
    [COMPONENT_TYPES.CDN]: {
        fields: withCommonFields([
            { key: 'provider', label: 'Provider', type: 'select', options: ['CloudFront', 'Cloudflare', 'Akamai', 'Fastly'] },
            { key: 'cache_behavior', label: 'Cache Behavior', type: 'select', options: ['Static Content', 'Dynamic Content', 'Whole Site'] },
            { key: 'pop_distribution', label: 'PoP Distribution', type: 'select', options: ['Global', 'North America', 'Europe', 'APAC'] }
        ])
    },
    [COMPONENT_TYPES.AUTH_SERVICE]: {
        fields: withCommonFields([
            { key: 'auth_protocol', label: 'Protocol', type: 'select', options: ['OAuth2 / OIDC', 'SAML', 'LDAP', 'Custom Token'] },
            { key: 'token_store', label: 'Token Store', type: 'select', options: ['JWT (Stateless)', 'Redis (Stateful)', 'DB'] }
        ])
    },
    [COMPONENT_TYPES.RATE_LIMITER]: {
        fields: withCommonFields([
            { key: 'algorithm', label: 'Algorithm', type: 'select', options: ['Token Bucket', 'Leaky Bucket', 'Fixed Window', 'Sliding Log'] },
            { key: 'storage', label: 'State Storage', type: 'select', options: ['Redis', 'In-Memory (Local)', 'Database'] },
            { key: 'scope', label: 'Limit Scope', type: 'select', options: ['User ID', 'IP Address', 'API Key'] }
        ])
    },
    [COMPONENT_TYPES.CONFIG_SERVICE]: {
        fields: withCommonFields([
            { key: 'config_type', label: 'Function', type: 'select', options: ['Static Config', 'Feature Flags', 'Secrets'] },
            { key: 'propagation', label: 'Update Propagation', type: 'select', options: ['Poll', 'Push/Socket', 'Restart'] }
        ])
    },

    // --- Reliability Layer ---
    [COMPONENT_TYPES.CIRCUIT_BREAKER]: {
        fields: withCommonFields([
            { key: 'threshold', label: 'Failure Threshold', type: 'text', placeholder: 'e.g., 50%' },
            { key: 'timeout', label: 'Reset Timeout', type: 'text', placeholder: 'e.g., 30s' },
            { key: 'fallback', label: 'Fallback Action', type: 'select', options: ['Return Error', 'Default Value', 'Cache'] }
        ], false)
    },
    [COMPONENT_TYPES.RETRY_HANDLER]: {
        fields: withCommonFields([
            { key: 'max_retries', label: 'Max Retries', type: 'text', placeholder: 'e.g., 3' },
            { key: 'backoff', label: 'Backoff Algo', type: 'select', options: ['Exponential', 'Linear', 'Fixed', 'Jitter'] }
        ], false)
    },
    [COMPONENT_TYPES.DEAD_LETTER_QUEUE]: {
        fields: withCommonFields([
            { key: 'redrive_policy', label: 'Redrive Policy', type: 'select', options: ['Manual Inspection', 'Auto-Retry'] },
            { key: 'alerting', label: 'Alert On Depth', type: 'text', placeholder: 'Count > X' }
        ], false)
    },
    [COMPONENT_TYPES.FAILOVER_ROUTER]: {
        fields: withCommonFields([
            { key: 'trigger', label: 'Failover Trigger', type: 'select', options: ['Health Check Fail', 'High Latency', 'Manual (Switch)'] },
            { key: 'secondary', label: 'Secondary Target', type: 'text', placeholder: 'Region/Zone' }
        ], false)
    },
    [COMPONENT_TYPES.REPLICATION_CONTROLLER]: {
        fields: withCommonFields([
            { key: 'sync_mode', label: 'Sync Mode', type: 'select', options: ['Async', 'Sync', 'Semi-Sync'] },
            { key: 'lag_threshold', label: 'Lag Threshold', type: 'text', placeholder: 'ms or records' }
        ], false)
    },
    [COMPONENT_TYPES.BACKPRESSURE_CONTROLLER]: {
        fields: withCommonFields([
            { key: 'strategy', label: 'Strategy', type: 'select', options: ['Reject New', 'Drop Oldest', 'Rate Limit'] },
            { key: 'queue_depth', label: 'Max Queue Depth', type: 'text', placeholder: 'requests' }
        ], false)
    },

    // --- Observability Layer ---
    [COMPONENT_TYPES.METRICS_PIPELINE]: {
        fields: withCommonFields([
            { key: 'backend', label: 'Backend', type: 'select', options: ['Prometheus', 'Datadog', 'CloudWatch', 'Graphite'] },
            { key: 'interval', label: 'Scrape Interval', type: 'text', placeholder: 'e.g. 15s' }
        ], true)
    },
    [COMPONENT_TYPES.LOGGING_PIPELINE]: {
        fields: withCommonFields([
            { key: 'stack', label: 'Log Stack', type: 'select', options: ['ELK', 'Splunk', 'CloudWatch Logs', 'Loki'] },
            { key: 'structure', label: 'Format', type: 'select', options: ['JSON', 'Raw Text', 'Syslog'] }
        ], true)
    },
    [COMPONENT_TYPES.DISTRIBUTED_TRACING]: {
        fields: withCommonFields([
            { key: 'standard', label: 'Standard', type: 'select', options: ['OpenTelemetry', 'OpenTracing', 'Proprietary'] },
            { key: 'backend', label: 'Backend', type: 'select', options: ['Jaeger', 'Zipkin', 'Tempo', 'X-Ray'] }
        ], true)
    },
    [COMPONENT_TYPES.ALERTING_ENGINE]: {
        fields: withCommonFields([
            { key: 'integrations', label: 'Integrations', type: 'select-multi', options: ['PagerDuty', 'Slack', 'Email', 'OpsGenie'] },
            { key: 'grouping', label: 'Alert Grouping', type: 'select', options: ['By Service', 'By Severity', 'None'] }
        ], false)
    },
    [COMPONENT_TYPES.MONITORING_DASHBOARD]: {
        fields: withCommonFields([
            { key: 'tool', label: 'Tool', type: 'select', options: ['Grafana', 'Kibana', 'Datadog', 'CloudWatch'] }
        ], false)
    },

    // --- Traffic Layer ---
    [COMPONENT_TYPES.EDGE_ROUTER]: {
        fields: withCommonFields([
            { key: 'features', label: 'Key Features', type: 'select-multi', options: ['WAF', 'DDoS Protection', 'Compression', 'SSL Termination'] }
        ], true)
    },
    [COMPONENT_TYPES.GEO_ROUTER]: {
        fields: withCommonFields([
            { key: 'dns_provider', label: 'DNS Provider', type: 'select', options: ['Route53', 'Cloudflare', 'NS1'] }
        ], true)
    },
    [COMPONENT_TYPES.SERVICE_MESH]: {
        fields: withCommonFields([
            { key: 'mesh_tech', label: 'Technology', type: 'select', options: ['Istio', 'Linkerd', 'Consul', 'AWS App Mesh'] },
            { key: 'mtls', label: 'mTLS Mode', type: 'select', options: ['Strict', 'Permissive'] }
        ], true)
    },
    [COMPONENT_TYPES.API_THROTTLER]: {
        fields: withCommonFields([
            { key: 'scope', label: 'Throttle Scope', type: 'select', options: ['Global', 'Per-Service'] }
        ], true)
    },
    [COMPONENT_TYPES.LOAD_SHEDDER]: {
        fields: withCommonFields([
            { key: 'shed_trigger', label: 'Shed Trigger', type: 'select', options: ['CPU High', 'Memory High', 'Latency High'] }
        ], false)
    },

    // --- Data Processing Layer ---
    [COMPONENT_TYPES.STREAM_PROCESSOR]: {
        fields: withCommonFields([
            { key: 'framework', label: 'Framework', type: 'select', options: ['Flink', 'Spark Streaming', 'Kafka Streams', 'Storm'] },
            { key: 'guarantee', label: 'Processing Guarantee', type: 'select', options: ['Exactly-once', 'At-least-once'] }
        ], true)
    },
    [COMPONENT_TYPES.BATCH_PROCESSOR]: {
        fields: withCommonFields([
            { key: 'framework', label: 'Framework', type: 'select', options: ['Spark', 'Hadoop MapReduce', 'AWS Batch'] },
            { key: 'schedule', label: 'Frequency', type: 'text', placeholder: 'Cron or Trigger' }
        ], true)
    },
    [COMPONENT_TYPES.ETL_PIPELINE]: {
        fields: withCommonFields([
            { key: 'orchestrator', label: 'Orchestrator', type: 'select', options: ['Airflow', 'Prefect', 'Dagster', 'AWS Step Functions'] }
        ], true)
    },
    [COMPONENT_TYPES.SHARDING_MANAGER]: {
        fields: withCommonFields([
            { key: 'algorithm', label: 'Algorithm', type: 'select', options: ['Consistent Hashing', 'Directory Service'] }
        ], true)
    },
    [COMPONENT_TYPES.INDEX_BUILDER]: {
        fields: withCommonFields([
            { key: 'source', label: 'Data Source', type: 'text', placeholder: 'DB or Stream' }
        ], true)
    },

    // --- Deployment Layer ---
    [COMPONENT_TYPES.CICD_PIPELINE]: {
        fields: withCommonFields([
            { key: 'tool', label: 'Platform', type: 'select', options: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI'] }
        ], false)
    },
    [COMPONENT_TYPES.CANARY_CONTROLLER]: {
        fields: withCommonFields([
            { key: 'metrics', label: 'Success Metric', type: 'text', placeholder: 'Error Rate < 1%' }
        ], false)
    },
    [COMPONENT_TYPES.FEATURE_ROLLOUT]: {
        fields: withCommonFields([
            { key: 'tool', label: 'Service', type: 'select', options: ['LaunchDarkly', 'Optimizely', 'Custom'] }
        ], false)
    },
    [COMPONENT_TYPES.SECRETS_MANAGER]: {
        fields: withCommonFields([
            { key: 'provider', label: 'Provider', type: 'select', options: ['HashiCorp Vault', 'AWS Secrets Manager', 'K8s Secrets'] }
        ], false)
    },

    // --- AI / ML Ops ---
    [COMPONENT_TYPES.MODEL_TRAINING]: {
        fields: withCommonFields([
            { key: 'framework', label: 'Framework', type: 'select', options: ['PyTorch', 'TensorFlow', 'JAX', 'Scikit-learn'] },
            { key: 'hardware', label: 'Hardware', type: 'select', options: ['GPU (H100)', 'TPU', 'CPU Cluster'] },
            { key: 'strategy', label: 'Strategy', type: 'select', options: ['Data Parallel', 'Model Parallel', 'Federated'] }
        ], true)
    },
    [COMPONENT_TYPES.MODEL_SERVING]: {
        fields: withCommonFields([
            { key: 'runtime', label: 'Runtime', type: 'select', options: ['Triton', 'TorchServe', 'ONNX Runtime', 'FastAPI'] },
            { key: 'batching', label: 'Dynamic Batching', type: 'select', options: ['Enabled', 'Disabled'] },
            { key: 'autoscaling', label: 'Metric', type: 'select', options: ['QPS', 'GPU Util', 'Latency'] }
        ], true)
    },
    [COMPONENT_TYPES.FEATURE_STORE]: {
        fields: withCommonFields([
            { key: 'provider', label: 'Provider', type: 'select', options: ['Feast', 'Tecton', 'AWS Feature Store'] },
            { key: 'sync', label: 'Offline-Online Sync', type: 'select', options: ['Real-time', 'Batch'] }
        ], true)
    },
    [COMPONENT_TYPES.MODEL_REGISTRY]: {
        fields: withCommonFields([
            { key: 'format', label: 'Model Format', type: 'select', options: ['MLflow', 'Pickle', 'ONNX', 'SavedModel'] },
            { key: 'versioning', label: 'Versioning', type: 'select', options: ['Semantic', 'Hash-based', 'Timestamp'] }
        ], false)
    },
    [COMPONENT_TYPES.VECTOR_DB]: {
        fields: withCommonFields([
            { key: 'engine', label: 'Engine', type: 'select', options: ['Milvus', 'Pinecone', 'Weaviate', 'Qdrant', 'Pgvector'] },
            { key: 'index_type', label: 'Index Type', type: 'select', options: ['HNSW', 'IVF_FLAT', 'DiskANN'] },
            { key: 'dimensions', label: 'Dimensions', type: 'text', placeholder: 'e.g., 1536' }
        ], true)
    },

    // --- Specialized Storage ---
    [COMPONENT_TYPES.TIME_SERIES_DB]: {
        fields: withCommonFields([
            { key: 'engine', label: 'Engine', type: 'select', options: ['InfluxDB', 'Prometheus', 'TimescaleDB', 'QuestDB'] },
            { key: 'retention', label: 'Data Retention', type: 'text', placeholder: 'e.g., 90 days' },
            { key: 'downsampling', label: 'Downsampling', type: 'select', options: ['Enabled', 'Disabled'] }
        ], true)
    },
    [COMPONENT_TYPES.GRAPH_DB]: {
        fields: withCommonFields([
            { key: 'engine', label: 'Engine', type: 'select', options: ['Neo4j', 'Amazon Neptune', 'JanusGraph', 'TigerGraph'] },
            { key: 'query_lang', label: 'Query Language', type: 'select', options: ['Cypher', 'Gremlin', 'SPARQL'] }
        ], true)
    },
    [COMPONENT_TYPES.DATA_WAREHOUSE]: {
        fields: withCommonFields([
            { key: 'engine', label: 'Platform', type: 'select', options: ['Snowflake', 'BigQuery', 'Redshift', 'ClickHouse'] },
            { key: 'storage_format', label: 'Format', type: 'select', options: ['Columnar', 'Row-based'] }
        ], true)
    },

    // --- Advanced Infrastructure ---
    [COMPONENT_TYPES.DNS]: {
        fields: withCommonFields([
            { key: 'provider', label: 'Provider', type: 'select', options: ['Route53', 'Cloudflare', 'Bind'] },
            { key: 'routing', label: 'Routing Policy', type: 'select', options: ['Simple', 'Weighted', 'Latency', 'Failover', 'Geolocation'] },
            { key: 'ttl', label: 'TTL', type: 'text', placeholder: 'e.g., 60s' }
        ], false)
    },
    [COMPONENT_TYPES.FIREWALL]: {
        fields: withCommonFields([
            { key: 'type', label: 'Type', type: 'select', options: ['WAF', 'Network ACL', 'Security Group'] },
            { key: 'rules', label: 'Rule Set', type: 'select', options: ['OWASP Top 10', 'Custom'] }
        ], false)
    },
    [COMPONENT_TYPES.SERVERLESS]: {
        fields: withCommonFields([
            { key: 'platform', label: 'Platform', type: 'select', options: ['AWS Lambda', 'Cloud Functions', 'Azure Functions', 'OpenFaaS'] },
            { key: 'runtime', label: 'Runtime', type: 'select', options: ['Node.js', 'Python', 'Go', 'Java', 'Custom'] },
            { key: 'timeout', label: 'Timeout', type: 'text', placeholder: 'e.g., 15m' }
        ], true)
    },
    [COMPONENT_TYPES.DISTRIBUTED_LOCK]: {
        fields: withCommonFields([
            { key: 'backend', label: 'Backing Store', type: 'select', options: ['ZooKeeper', 'Etcd', 'Redis (Redlock)', 'Consul'] },
            { key: 'lease', label: 'Lease Time', type: 'text', placeholder: 'e.g., 10s' }
        ], false)
    },

    // --- Annotations & Grouping ---
    [COMPONENT_TYPES.BOUNDING_BOX]: {
        fields: [
            { key: 'group_type', label: 'Group Type', type: 'select', options: ['VPC / Network', 'Region / Zone', 'Kubernetes Cluster', 'Logical Boundary'], group: 'Core Configuration' },
            { key: 'subnet_type', label: 'Network Access', type: 'select', options: ['Public', 'Private', 'Isolated', 'N/A'], group: 'Core Configuration' },
            { key: 'size', label: 'Box Size', type: 'select', options: ['Small', 'Medium', 'Large', 'Extra Large'], group: 'Core Configuration' }
        ]
    },
    [COMPONENT_TYPES.TEXT_NOTE]: {
        fields: [
            { key: 'content', label: 'Note Text', type: 'textarea', placeholder: 'Enter assumptions, math, or notes here...', group: 'Core Configuration' }
        ]
    }
};

// --- Connection Configuration Schema ---

export const CONNECTION_CONFIG_SCHEMA = {
    groups: {
        CORE: 'Core Configuration'
    },
    fields: [
        {
            key: 'protocol',
            label: 'Protocol',
            type: 'select',
            options: ['HTTP/REST', 'gRPC', 'GraphQL', 'AMQP (Queue)', 'Kafka (Stream)', 'WebSocket'],
            group: 'Core Configuration'
        },
        {
            key: 'interaction_type',
            label: 'Communication Style',
            type: 'select',
            options: ['Sync Request/Response', 'Async Fire-and-Forget', 'Async Request/Ack', 'Bidirectional Stream'],
            group: 'Core Configuration'
        },
        {
            key: 'resilience',
            label: 'Resilience Strategy',
            type: 'select',
            options: ['None', 'Retries Only', 'Circuit Breaker', 'Retries + Circuit Breaker', 'Dead Letter Queue'],
            group: 'Core Configuration'
        },
        {
            key: 'sequence_number',
            label: 'Sequence Step (1, 2, 3...)',
            type: 'text',
            placeholder: 'e.g., 1',
            group: 'Core Configuration'
        }
    ]
};
