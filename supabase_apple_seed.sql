
-- Clear existing Apple data to start fresh (as requested)
DELETE FROM popular_interviews WHERE company = 'Apple';

INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Apple Software Engineer ICT2
(
    'Apple',
    'Apple Software Engineer ICT2',
    'Entry',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'iOS Patterns', 'Memory Management', 'Optimization'],
    'Apple ICT2 interviews focus on core CS fundamentals with iOS-specific constraints. Emphasis on memory efficiency, battery impact, and real device performance. Voice-friendly logic walkthroughs over syntax.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Performance", "Privacy", "Apple Quality"],
      "behavioralFocus": "Privacy & Excellence"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Core iOS Algorithms",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Arrays", "Memory Efficiency", "Battery"],
        "overview": "Apple device constraints - memory, battery, 60fps UI. Optimization from first principles expected.",
        "questions": [
          "Two sum closest pair - O(n) hash vs O(n log n) sort battery trade-off.",
          "Longest substring no repeats - sliding window memory constant space.",
          "Minimum window substring - multi-char count tracking 16KB limit.",
          "Container most water - two pointers 60fps animation constraint.",
          "Trapping rain water - stack vs pointers memory profiling.",
          "Product except self - prefix no division iOS float precision.",
          "LRU cache - hash doubly linked list 50MB memory budget.",
          "Top k frequent elements - bucket sort O(n) space.",
          "Group anagrams - char frequency 256 ASCII optimization.",
          "Rotate array - reverse in-place no temp array.",
          "Valid sudoku - bit manipulation row/col/box 9 bits.",
          "Spiral matrix - four pointers boundary single pass.",
          "K closest points - max heap distance logarithmic.",
          "Merge intervals - sort start single pass merge.",
          "Subarray sum k - prefix hash negative scroll handling."
        ]
      },
      "techRoundTwo": {
        "title": "iOS System Patterns",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Trees", "Graphs", "UIKit"],
        "overview": "iOS framework patterns - UIKit collection views, Core Data, async patterns. ARC retain cycle awareness.",
        "questions": [
          "Validate BST - inorder successor Core Data fetch optimization.",
          "Lowest common ancestor - UITableView section index path.",
          "Serialize tree - NSCoding plist binary archival.",
          "Number islands - UIImage pixel flood fill touch ID.",
          "Course schedule - dependency injection module loading.",
          "Clone graph - copy-on-write Core Data relationships.",
          "Word ladder - keyboard swipe prediction BFS.",
          "Level order - UICollectionView waterfall layout.",
          "Diameter tree - recursive depth AVPlayer cache.",
          "Kth smallest - QuickSelect median of medians.",
          "Right side view - UITableView sticky headers.",
          "Accounts merge - iCloud Keychain unification.",
          "Pacific water flow - Metal compute shader.",
          "Rotting oranges - Game Center async spread.",
          "Max tree depth - recursion depth Instruments trace."
        ]
      },
      "techRoundThree": {
        "title": "iOS Optimization Patterns",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DP", "Async", "Instruments"],
        "overview": "Instruments profiling patterns - Time Profiler, Leaks, Core Animation. Battery drain analysis.",
        "questions": [
          "House robber - Core Animation layer eviction.",
          "Coin change - UITableView cell reuse unbounded.",
          "Longest increasing - QuickLook preview cache.",
          "Word break - UITextView auto-complete trie.",
          "Unique paths - UICollectionView prefetching.",
          "Jump game - UIScrollView paging optimization.",
          "Partition subset sum - Core Data batch upsert.",
          "Letter combinations - iMessage sticker prediction.",
          "Word search - Spotlight search indexing.",
          "Palindrome partition - autocorrect minimum edits.",
          "Edit distance - UITextField keyboard suggestions.",
          "Longest palindrome - emoji rendering optimization.",
          "Decode ways - Phone number formatting.",
          "Dungeon game - Game Center AR navigation.",
          "Best time buy sell - Stocks app chart optimization."
        ]
      },
      "behavioral": {
        "title": "Apple Excellence Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Apple behavioral emphasizes privacy, quality, and user experience obsession. Privacy by design scenarios.",
        "questions": [
          "Fixed critical battery drain pre-launch (Quality Obsession). STAR.",
          "Privacy design choice user data protection (Privacy First). STAR.",
          "60fps animation stutter production fix (Performance Excellence). STAR.",
          "User experience drove technical decision (User Obsession). STAR.",
          "Owned ambiguous iOS feature end-to-end (Ownership). STAR.",
          "Simplified complex UIKit code maintainability (Simplicity). STAR.",
          "Rapid learning new iOS framework (Learning Agility). STAR.",
          "Influenced senior engineer quality decision (Influence). STAR.",
          "Instruments profiling saved launch (Performance Debugging). STAR.",
          "Cross-team launch coordination pressure (Collaboration). STAR.",
          "Technical excellence raised team bar (Excellence Leadership). STAR.",
          "Recovered from App Store rejection (Resilience). STAR.",
          "Strategic iOS architecture investment (Strategic Thinking). STAR.",
          "Inclusive iOS accessibility implementation (Inclusion). STAR.",
          "Continuous iOS learning WWDC implementation (Continuous Learning). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Apple Software Engineer ICT4
(
    'Apple',
    'Apple Software Engineer ICT4',
    'Senior',
    '60 min',
    ARRAY['System Design', 'iOS Architecture', 'Privacy', 'Performance', 'Leadership'],
    'ICT4 interviews test iOS system architecture and leadership. Emphasis on privacy-preserving design and Apple-scale performance.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Privacy Architecture", "iOS Scale", "Leadership"],
      "behavioralFocus": "Privacy & Excellence"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Advanced iOS Algorithms",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Hard Problems", "Memory", "Real-time"],
        "overview": "Apple-hard problems with strict memory/battery constraints. Instruments profiling expected.",
        "questions": [
          "Median stream - two heaps balance iOS memory.",
          "Sliding window max - deque 60fps constraint.",
          "LFU cache eviction - iOS 50MB background limit.",
          "Serialize N-ary - SceneKit node graph.",
          "Shortest palindrome - autocorrect KMP.",
          "Minimum window - Safari content blocker.",
          "Task scheduler - Background App Refresh.",
          "Burst balloons - Game Center DP.",
          "Dungeon game - ARKit pathfinding.",
          "Wildcard matching - Files.app search.",
          "Longest parentheses - Music lyrics sync.",
          "Minimum cost tree - Core ML inference.",
          "Paint house - Color palette optimization.",
          "IPO projects - App Store optimization.",
          "Dungeon game backward - Maps navigation."
        ]
      },
      "techRoundTwo": {
        "title": "Apple System Design",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["iOS Frameworks", "Privacy", "Scale"],
        "overview": "Apple service architecture - iCloud, App Store, Siri at 1B+ devices.",
        "questions": [
          "Design iOS Photos app - HEIC processing Face ID.",
          "Design iCloud Photos - differential privacy sync.",
          "Design App Store - differential privacy ranking.",
          "Design Apple Maps - privacy-preserving navigation.",
          "Design Siri - on-device Core ML processing.",
          "Design iMessage - end-to-end encryption attachment.",
          "Design Apple Music - offline cache personalization.",
          "Design HealthKit - privacy consent data types.",
          "Design Screen Time - differential privacy aggregate.",
          "Design Find My - crowd-sourced ultra-wideband.",
          "Design CarPlay - privacy-preserving navigation.",
          "Design Apple Pay - tokenization device binding.",
          "Design RealityKit - AR privacy face tracking.",
          "Design Shortcuts - privacy-preserving automation.",
          "Design Focus modes - ML context awareness."
        ]
      },
      "techRoundThree": {
        "title": "iOS Architecture Leadership",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Architecture", "Privacy", "Migration"],
        "overview": "Technical leadership through iOS architecture decisions. Privacy and performance trade-offs.",
        "questions": [
          "iOS 14 widget privacy entitlements architecture.",
          "ARC migration manual retain release strategy.",
          "Swift Package Manager vs CocoaPods migration.",
          "Combine vs RxSwift reactive architecture.",
          "SwiftUI vs UIKit migration strategy.",
          "Privacy-preserving analytics App Analytics.",
          "Differential privacy implementation epsilon budget.",
          "HEIF vs JPEG compression trade-offs.",
          "Metal vs OpenGL ES graphics migration.",
          "Core Data CloudKit sync architecture.",
          "App Intents privacy-preserving Siri integration.",
          "StoreKit 2 vs legacy IAP migration.",
          "Push notification privacy token refresh.",
          "Biometric authentication Secure Enclave.",
          "App Clips privacy-preserving distribution."
        ]
      },
      "behavioral": {
        "title": "Apple Excellence Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Senior iOS leadership through privacy and quality excellence. Cross-team architecture scenarios.",
        "questions": [
          "Led privacy architecture iOS feature launch (Privacy Leadership). STAR.",
          "Fixed 60fps regression launch critical path (Performance Leadership). STAR.",
          "Designed privacy-preserving analytics system (Privacy Architecture). STAR.",
          "Influenced iOS framework direction (Technical Influence). STAR.",
          "Owned iOS system feature end-to-end (System Ownership). STAR.",
          "Mentored iOS engineers promotion (Technical Mentorship). STAR.",
          "Simplified complex iOS architecture (Architecture Simplification). STAR.",
          "App Store launch cross-team coordination (Launch Leadership). STAR.",
          "Privacy review board approval leadership (Privacy Governance). STAR.",
          "iOS performance culture implementation (Performance Culture). STAR.",
          "Technical excellence raised iOS standards (Excellence Leadership). STAR.",
          "Rapid SwiftUI adoption team-wide (Technology Leadership). STAR.",
          "Privacy-first design won customer trust (Customer Trust). STAR.",
          "Strategic iOS investment 3-year roadmap (Strategic Thinking). STAR.",
          "Inclusive iOS accessibility leadership (Inclusion Leadership). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Apple Data Scientist
(
    'Apple',
    'Apple Data Scientist',
    'Intermediate',
    '60 min',
    ARRAY['Privacy-Preserving', 'Experimentation', 'iOS Analytics', 'Differential Privacy', 'SQL'],
    'Apple Data Science emphasizes differential privacy and on-device analytics. No user tracking.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Differential Privacy", "On-Device", "Privacy-Preserving ML"],
      "behavioralFocus": "Privacy & Excellence"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Differential Privacy Fundamentals",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DP Math", "Epsilon", "Mechanisms"],
        "overview": "Apple differential privacy math and mechanisms. Epsilon budgeting and composition.",
        "questions": [
          "Differential privacy epsilon delta definition math.",
          "Laplace mechanism sensitivity calibration noise.",
          "Gaussian mechanism L2 sensitivity privacy loss.",
          "Epsilon composition basic advanced adaptive.",
          "Privacy budget allocation A/B testing features.",
          "Local DP randomized response mechanisms.",
          "Apple differential privacy App Analytics.",
          "Private aggregation of teacher ensembles PATE.",
          "DP-SGD gradient clipping noise addition.",
          "Privacy amplification subsampling mini-batch.",
          "Zero-concentrated DP Rényi divergence.",
          "Privacy loss distribution martingale tracking.",
          "Sequential composition vs advanced composition.",
          "Instance-level DP vs aggregate statistics.",
          "DP histogram partitioning uniform sampling."
        ]
      },
      "techRoundTwo": {
        "title": "Privacy-Preserving Experimentation",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Private A/B", "On-Device", "iOS Analytics"],
        "overview": "Apple-scale privacy-preserving experimentation. On-device metrics aggregation.",
        "questions": [
          "Private A/B testing epsilon budget allocation.",
          "On-device metrics aggregation App Analytics.",
          "Local differential privacy iPhone fleet.",
          "Privacy-preserving funnel analysis events.",
          "On-device cohort computation retention.",
          "Private ranking leaderboards percentile.",
          "Differential privacy multi-armed bandits.",
          "On-device model training federated learning.",
          "Privacy-preserving personalization frequency capping.",
          "Private time series anomaly detection.",
          "Differential privacy causal inference.",
          "On-device survival analysis censoring.",
          "Private uplift modeling two-line treatment.",
          "Differential privacy network analysis.",
          "On-device recommendation collaborative filtering."
        ]
      },
      "techRoundThree": {
        "title": "iOS Analytics SQL",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Private SQL", "iOS Events", "Optimization"],
        "overview": "Differential privacy SQL for iOS analytics. Private aggregation queries.",
        "questions": [
          "Private COUNT DISTINCT epsilon allocation.",
          "Private SUM aggregation Laplace noise.",
          "Private AVG variance estimation DP.",
          "Private JOIN cardinality estimation.",
          "Private GROUP BY partitioning DP.",
          "Private window functions ranking percentiles.",
          "Private funnel analysis sequential events.",
          "Private cohort retention period-over-period.",
          "Private RFM segmentation privacy budget.",
          "Private survival analysis Kaplan-Meier.",
          "Private market basket association rules.",
          "Private time series decomposition seasonality.",
          "Private anomaly detection z-score MAD.",
          "Private attribution multi-touch privacy.",
          "Private experimentation CUPED variance reduction."
        ]
      },
      "behavioral": {
        "title": "Apple Excellence Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Data science leadership through privacy-preserving analytics innovation.",
        "questions": [
          "Designed privacy-preserving analytics iOS feature (Privacy Innovation). STAR.",
          "Differential privacy convinced stakeholders value (Privacy Leadership). STAR.",
          "On-device analytics changed product direction (Impact). STAR.",
          "Built private experimentation platform (Platform Leadership). STAR.",
          "Privacy budget allocation cross-experiment (Privacy Governance). STAR.",
          "Rapid private A/B testing validated hypothesis (Speed + Privacy). STAR.",
          "Mentored analysts differential privacy (Teaching). STAR.",
          "Privacy-preserving ML production deployment (ML Privacy). STAR.",
          "Statistical rigor influenced privacy policy (Statistical Leadership). STAR.",
          "Cross-team privacy analytics adoption (Collaboration). STAR.",
          "Privacy-first culture organization-wide (Culture Building). STAR.",
          "Private experimentation ROI measurement (Business Impact). STAR.",
          "Differential privacy research production (Research Impact). STAR.",
          "Privacy review board leadership (Privacy Governance). STAR.",
          "Continuous privacy learning conferences (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Apple ML Engineer (Siri/ML)
(
    'Apple',
    'Apple ML Engineer (Siri/ML)',
    'Senior',
    '60 min',
    ARRAY['Core ML', 'On-Device ML', 'Privacy-Preserving', 'Neural Engine', 'Federated'],
    'Apple ML Engineer focuses on on-device Core ML and privacy-preserving training. Neural Engine optimization.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["On-Device ML", "Privacy", "Neural Engine"],
      "behavioralFocus": "Privacy & Excellence"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Core ML On-Device",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Core ML", "Neural Engine", "Optimization"],
        "overview": "Core ML model optimization for iPhone Neural Engine. INT8 quantization, pruning.",
        "questions": [
          "Core ML model conversion TensorFlow PyTorch.",
          "Neural Engine INT8 quantization post-training.",
          "Core ML model size optimization pruning.",
          "Neural Engine operator fusion convolution depthwise.",
          "Core ML Vision request single shot detection.",
          "On-device NLP BERT MobileBERT quantization.",
          "Core ML Natural Language tokenization BERT.",
          "Neural Engine memory bandwidth optimization.",
          "Core ML model versioning download updates.",
          "On-device speech recognition RNN-T streaming.",
          "Core ML Create ML training iPhone dataset.",
          "Neural Engine dynamic quantization runtime.",
          "Core ML model deployment App Store review.",
          "On-device pose estimation MediaPipe BlazePose.",
          "Core ML privacy-preserving on-device inference."
        ]
      },
      "techRoundTwo": {
        "title": "Privacy-Preserving ML",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Federated", "DP", "Secure", "Differential Privacy"],
        "overview": "Apple privacy-preserving ML techniques for Siri personalization.",
        "questions": [
          "Federated learning differential privacy aggregation.",
          "DP-SGD on-device gradient noise addition.",
          "Private set intersection Siri query matching.",
          "Secure multi-party computation model update.",
          "Differential privacy word embeddings frequency.",
          "On-device personalization frequency estimation.",
          "Federated averaging FedAvg secure aggregation.",
          "Privacy amplification mini-batch subsampling.",
          "Model poisoning defense robust aggregation.",
          "Differential privacy language model next word.",
          "Secure enclave key management model weights.",
          "On-device active learning uncertainty sampling.",
          "Federated learning non-IID data handling.",
          "Privacy budget allocation personalization features.",
          "Differential privacy recommendation collaborative."
        ]
      },
      "techRoundThree": {
        "title": "Siri ML Architecture",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Siri", "Production", "Real-time"],
        "overview": "Siri-scale on-device ML infrastructure and real-time inference.",
        "questions": [
          "Siri on-device wake word detection.",
          "Neural Engine real-time speech recognition.",
          "Core ML Siri intent classification.",
          "On-device NLU named entity recognition.",
          "Siri dialog state tracking on-device.",
          "Neural Engine streaming ASR RNN-Transducer.",
          "Core ML slot filling contextual carryover.",
          "Siri personalization on-device user profile.",
          "On-device disambiguation multiple intent ranking.",
          "Neural Engine low-latency dialog response.",
          "Core ML multi-turn conversation context.",
          "Siri privacy-preserving query understanding.",
          "On-device language switching detection.",
          "Neural Engine offline language model.",
          "Core ML Siri task completion prediction."
        ]
      },
      "behavioral": {
        "title": "Apple Excellence Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Siri ML leadership through privacy-preserving on-device innovation.",
        "questions": [
          "Shipped on-device ML iPhone feature (On-Device Impact). STAR.",
          "Privacy-preserving ML production deployment (Privacy Leadership). STAR.",
          "Core ML optimization Neural Engine perf (Performance Leadership). STAR.",
          "Federated learning Siri personalization (Federated Impact). STAR.",
          "On-device ML platform developer enablement (Platform Leadership). STAR.",
          "Mentored ML engineers Core ML best practices (Technical Mentorship). STAR.",
          "Simplified complex ML pipeline developer exp (Developer Experience). STAR.",
          "Privacy-first ML design customer trust (Customer Trust). STAR.",
          "Neural Engine optimization launch critical (Performance Critical). STAR.",
          "Cross-team ML privacy governance (Privacy Governance). STAR.",
          "On-device ML culture organization-wide (Culture Leadership). STAR.",
          "Technical excellence raised ML standards (Excellence Leadership). STAR.",
          "Rapid Core ML prototyping validated approach (Speed + Rigor). STAR.",
          "Strategic on-device ML investment roadmap (Strategic Thinking). STAR.",
          "Inclusive ML responsible AI practices (Responsible AI). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 5. Apple Hardware SWE
(
    'Apple',
    'Apple Hardware SWE',
    'Senior',
    '60 min',
    ARRAY['Embedded', 'Metal', 'DriverKit', 'Low-Level', 'Real-time'],
    'Apple Hardware SWE focuses on low-level performance, DriverKit, and Metal compute. Real-time constraints.',
    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Low-Level Performance", "Hardware Integration", "Real-time"],
      "behavioralFocus": "Privacy & Excellence"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Low-Level Optimization",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Embedded", "Bit Manipulation", "SIMD"],
        "overview": "Hardware-level optimization - bit manipulation, SIMD, cache optimization.",
        "questions": [
          "Bit manipulation single set bit position.",
          "Count set bits population count intrinsics.",
          "Reverse bits 32-bit integer rotation.",
          "Bit fields struct packing alignment padding.",
          "SIMD NEON ARM64 vector operations.",
          "Cache line alignment prefetching false sharing.",
          "Memory barriers acquire release ordering.",
          "Atomic operations lock-free CAS ABA.",
          "SIMD dot product unrolled loops.",
          "Branch prediction misprediction penalty.",
          "Instruction level parallelism dependency chains.",
          "Prefetch distance cache blocking matrix.",
          "Vectorization auto vs explicit compiler hints.",
          "NUMA locality hardware threads placement.",
          "Cache coherence MESI protocol invalidation."
        ]
      },
      "techRoundTwo": {
        "title": "DriverKit Real-time",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["DriverKit", "IOKit", "Real-time"],
        "overview": "macOS DriverKit and real-time hardware interaction patterns.",
        "questions": [
          "DriverKit user-space driver lifecycle.",
          "IOKit driver matching personality dictionary.",
          "Dext driver entitlements system extension.",
          "Real-time audio Core Audio HAL.",
          "Metal compute shader GPU dispatch.",
          "PCIe device enumeration BAR mapping.",
          "USB driver async IOKit callbacks.",
          "Thunderbolt tunneling PCIe fabric.",
          "NVMe driver queue pairs completion.",
          "HID event coalescing filtering latency.",
          "I2C driver clock stretching timeout.",
          "SPI driver chip select timing.",
          "GPIO interrupt coalescing edge level.",
          "Real-time Mach kernel priorities.",
          "Driver crash reporting panic logging."
        ]
      },
      "techRoundThree": {
        "title": "Hardware System Design",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Hardware", "Metal", "Firmware"],
        "overview": "Apple hardware system design - M-series, ProMotion, Face ID.",
        "questions": [
          "M1 Neural Engine driver architecture.",
          "ProMotion 120Hz display pipeline.",
          "Face ID Secure Enclave T2 chip.",
          "AirPods H2 chip low-latency audio.",
          "Apple Silicon unified memory GPU CPU.",
          "AV1 hardware decode Media Engine.",
          "ProRes hardware encode accelerator.",
          "Metal ray tracing BVH traversal.",
          "T2 security coprocessor firmware signing.",
          "Touch ID sensor driver calibration.",
          "LiDAR scanner RealSense depth.",
          "Ultra-wideband UWB ranging privacy.",
          "Haptic engine Taptic linear resonance.",
          "True Tone ambient light sensor.",
          "Siri Always-On audio subsystem."
        ]
      },
      "behavioral": {
        "title": "Apple Excellence Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Hardware SWE leadership through low-level performance and reliability.",
        "questions": [
          "Fixed hardware driver launch critical bug (Hardware Reliability). STAR.",
          "Low-level optimization doubled performance (Performance Leadership). STAR.",
          "Designed DriverKit driver replaced kernel extension (Architecture Leadership). STAR.",
          "Metal compute kernel launch optimization (GPU Performance). STAR.",
          "Real-time audio latency reduction (Real-time Leadership). STAR.",
          "Mentored embedded engineers DriverKit (Technical Mentorship). STAR.",
          "Hardware-software co-design optimization (Co-design Leadership). STAR.",
          "Cross-team silicon validation coordination (Silicon Validation). STAR.",
          "Technical excellence raised hardware standards (Excellence Leadership). STAR.",
          "Rapid firmware debugging production issue (Debugging Leadership). STAR.",
          "Hardware reliability culture implementation (Reliability Culture). STAR.",
          "Privacy-preserving hardware sensor design (Privacy Hardware). STAR.",
          "Strategic hardware investment roadmap (Strategic Thinking). STAR.",
          "Inclusive hardware accessibility features (Inclusion Leadership). STAR.",
          "Continuous hardware learning conferences (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
);
