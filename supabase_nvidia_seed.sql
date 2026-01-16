
-- Clear existing Nvidia data to start fresh
DELETE FROM popular_interviews WHERE company = 'Nvidia';

INSERT INTO popular_interviews (company, role, level, total_duration, skills, overview, icon_url, company_traits, rounds) 
VALUES
-- 1. Nvidia AI/ML Engineer
(
    'Nvidia',
    'Nvidia AI/ML Engineer',
    'Intermediate',
    '60 min',
    ARRAY['Deep Learning', 'CUDA Optimization', 'TensorRT', 'PyTorch', 'GPU Architecture'],
    'Nvidia AI/ML interviews test production deep learning at GPU scale with CUDA optimization focus. Emphasis on TensorRT deployment, mixed precision, and inference optimization for edge/cloud.',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["GPU Performance", "AI Acceleration", "Production Deployment"],
      "behavioralFocus": "Innovation & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Deep Learning Optimization",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Model Optimization", "Mixed Precision", "Tensor Cores"],
        "overview": "Production DL model optimization for Nvidia GPUs. TF32/FP16/INT8 trade-offs and kernel fusion.",
        "questions": [
          "TensorRT INT8 quantization calibration dynamic range.",
          "Mixed precision FP16 accumulation TF32 Tensor Cores.",
          "Automatic mixed precision AMP NaN detection loss scaling.",
          "Layer fusion conv+BN+ReLU kernel fusion latency.",
          "TensorRT builder optimization profile dynamic shapes.",
          "FP16 gradient underflow overflow mitigation strategies.",
          "Tensor Core matrix multiply accumulation utilization.",
          "Dynamic quantization per-tensor vs per-channel.",
          "Model pruning structured unstructured sparsity patterns.",
          "Knowledge distillation teacher-student logit alignment.",
          "TensorRT plugin custom op implementation.",
          "ONNX parser operator support optimization passes.",
          "Batch normalization folding inference optimization.",
          "Layer norm fusion multi-head attention optimization.",
          "FlashAttention kernel memory efficient attention."
        ]
      },
      "techRoundTwo": {
        "title": "CUDA Kernel Optimization",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["CUDA", "Memory", "Occupancy"],
        "overview": "CUDA kernel optimization patterns for compute throughput. Shared memory, warp shuffle, coalescing.",
        "questions": [
          "Coalesced global memory access 128-byte transactions.",
          "Shared memory tile matrix multiply optimization.",
          "Warp shuffle reduce sum across warp intrinsics.",
          "Thread block occupancy SM resource utilization.",
          "L1 cache vs shared memory bandwidth tradeoff.",
          "Register pressure spilling local memory performance.",
          "Memory coalescing misaligned access penalty.",
          "Warp divergence branch conditional performance.",
          "Async copy H2D/D2H pipeline overlap compute.",
          "Tensor Core WMMA fragment multiply accumulate.",
          "CUTLASS template gemm kernel configuration.",
          "CUDA graph capture replay latency reduction.",
          "NVLink peer-to-peer GPU memory access.",
          "Unified memory page fault coherence overhead.",
          "Dynamic parallelism recursive GPU launch."
        ]
      },
      "techRoundThree": {
        "title": "Production AI Systems",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Inference", "Scaling", "Multi-GPU"],
        "overview": "Production AI serving systems at Nvidia scale. Triton inference server, multi-GPU model parallelism.",
        "questions": [
          "Triton Inference Server ensemble dynamic batching.",
          "TensorRT engine plan serialization versioning.",
          "Multi-GPU pipeline parallelism microbatch scheduling.",
          "Tensor parallelism column row sharding allreduce.",
          "NCCL collective communication ring tree algorithms.",
          "GPU kernel launch latency hiding async ops.",
          "Dynamic batching sequence padding bucketing.",
          "Model parallelism activation checkpointing memory.",
          "NVLink vs PCIe peer access bandwidth latency.",
          "GPU direct storage GDS HBM SSD pipeline.",
          "Multi-node multi-GPU InfiniBand RoCE scaling.",
          "Triton model analyzer latency throughput profiling.",
          "TensorRT streaming decoder recurrent state handling.",
          "GPU memory fragmentation pool allocator mitigation.",
          "Multi-precision inference INT8 FP16 fallback."
        ]
      },
      "behavioral": {
        "title": "Innovation Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Nvidia AI innovation leadership through GPU-accelerated breakthroughs. Patentable contributions expected.",
        "questions": [
          "GPU kernel optimization 10x performance gain (Performance Leadership). STAR.",
          "Shipped TensorRT model production inference (Production Impact). STAR.",
          "CUDA algorithm invention patent filed (Innovation). STAR.",
          "Multi-GPU scaling breakthrough cluster perf (Scaling Leadership). STAR.",
          "Mixed precision training stability production (Reliability). STAR.",
          "Mentored ML engineers CUDA optimization (Technical Leadership). STAR.",
          "Built internal GPU ML platform adoption (Platform Enablement). STAR.",
          "Cross-team GPU resource allocation (Collaboration). STAR.",
          "Rapid CUDA prototyping validated approach (Speed + Rigor). STAR.",
          "GPU memory optimization saved cluster costs (Cost Leadership). STAR.",
          "Technical excellence raised GPU standards (Excellence). STAR.",
          "Production GPU incident command recovery (Crisis Leadership). STAR.",
          "Strategic GPU roadmap investment (Strategic Thinking). STAR.",
          "Inclusive GPU ML research collaboration (Inclusion). STAR.",
          "Continuous GPU learning GTC implementation (Learning Agility). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 2. Nvidia Software Engineer IC1
(
    'Nvidia',
    'Nvidia Software Engineer IC1',
    'Entry',
    '60 min',
    ARRAY['Data Structures', 'Algorithms', 'CUDA Basics', 'GPU Programming', 'Optimization'],
    'Nvidia IC1 interviews focus on core CS fundamentals with GPU programming constraints. Memory coalescing and thread divergence emphasized.',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["GPU Fundamentals", "Performance", "Parallelism"],
      "behavioralFocus": "Innovation & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "GPU Array Patterns",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Parallel Arrays", "Coalescing", "Warp"],
        "overview": "GPU-friendly array problems emphasizing memory coalescing and warp divergence minimization.",
        "questions": [
          "GPU two sum parallel prefix hash collisions.",
          "Parallel prefix sum scan inclusive exclusive.",
          "GPU histogram binning atomicAdd warp shuffle.",
          "Parallel reduction warp shuffle sum max.",
          "GPU matrix transpose coalesced vs uncoalesced.",
          "Parallel sort radix sort bitonic network.",
          "GPU merge sort parallel merge paths.",
          "Parallel min/max reduction tree reduction.",
          "GPU vector addition memory coalescing patterns.",
          "Parallel stream compaction copy-if flag array.",
          "Warp-level prefix sum intra-warp scan.",
          "GPU segmented scan multiple segments.",
          "Parallel argmax index value pairs.",
          "GPU array partitioning even odd.",
          "Parallel population count bit histogram."
        ]
      },
      "techRoundTwo": {
        "title": "GPU Tree Graph",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Parallel Traversal", "GPU Graph", "CSR"],
        "overview": "GPU parallel tree/graph traversal using CSR format and parallel BFS/DFS patterns.",
        "questions": [
          "GPU BFS level synchronous frontier expansion.",
          "Parallel tree traversal postorder preorder.",
          "GPU graph connected components Union-Find.",
          "CSR graph adjacency list GPU traversal.",
          "GPU SSSP parallel Bellman-Ford delta stepping.",
          "Parallel DFS iterative stack wavefront.",
          "GPU PageRank power iteration damping factor.",
          "Parallel graph coloring greedy coloring.",
          "GPU triangle counting wedge iteration.",
          "Parallel spanning tree Boruvka algorithm.",
          "GPU community detection Louvain parallelism.",
          "Parallel graph sampling random walk.",
          "GPU centrality betweenness approximation.",
          "Parallel strongly connected components.",
          "GPU graph coarsening aggregation METIS."
        ]
      },
      "techRoundThree": {
        "title": "CUDA Optimization Patterns",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["CUDA", "Memory Hierarchy", "Occupancy"],
        "overview": "CUDA performance optimization patterns - occupancy calculator, shared memory, instruction mix.",
        "questions": [
          "Shared memory matrix multiply tile size.",
          "Occupancy calculator registers shared memory.",
          "Warp shuffle transpose communication.",
          "Async memcpy compute overlap pipeline.",
          "L2 cache persistence read-only data.",
          "Texture memory caching vs global memory.",
          "Constant memory broadcast 64KB limit.",
          "Atomic operations CAS compare exchange.",
          "Critical sections warp voting ballot.",
          "Dynamic shared memory allocation size.",
          "Kernel launch parameters block grid.",
          "Memory fence __syncthreads() divergence.",
          "CUDA events timing GPU CPU.",
          "Profile nsight compute roofline analysis.",
          "Instruction throughput latency hiding."
        ]
      },
      "behavioral": {
        "title": "Innovation Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "Entry-level innovation through GPU performance optimization and learning agility.",
        "questions": [
          "GPU kernel optimization measurable perf gain (Performance Impact). STAR.",
          "Rapid CUDA learning production contribution (Learning Agility). STAR.",
          "Built GPU tool team productivity (Leverage Impact). STAR.",
          "Debugged complex GPU memory corruption (Debugging Excellence). STAR.",
          "Cross-team GPU collaboration success (Collaboration). STAR.",
          "Technical simplification GPU code maintainability (Simplification). STAR.",
          "Owned ambiguous GPU feature delivery (Ownership). STAR.",
          "Mentored intern GPU programming (Teaching Impact). STAR.",
          "Production GPU deployment under pressure (Execution). STAR.",
          "GPU performance culture team adoption (Culture Building). STAR.",
          "Technical excellence raised junior standards (Excellence). STAR.",
          "Customer GPU performance requirements (Customer Focus). STAR.",
          "Strategic GPU learning investment (Strategic Thinking). STAR.",
          "Inclusive GPU team environment (Inclusion). STAR.",
          "Continuous GPU learning conferences (Continuous Learning). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 3. Nvidia CUDA Developer
(
    'Nvidia',
    'Nvidia CUDA Developer',
    'Senior',
    '60 min',
    ARRAY['Advanced CUDA', 'CUTLASS', 'Kernel Fusion', 'Multi-GPU', 'Nsight'],
    'CUDA Developer interviews test expert-level GPU programming. CUTLASS gemm, Tensor Core WMMA, multi-node scaling.',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["Expert CUDA", "Kernel Engineering", "GPU Architecture"],
      "behavioralFocus": "Innovation & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "Advanced CUDA Patterns",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["CUTLASS", "Tensor Cores", "WMMA"],
        "overview": "CUTLASS template metaprogramming and Tensor Core WMMA fragment programming.",
        "questions": [
          "CUTLASS gemm threadblock swizzle layout.",
          "WMMA tensor core fragment load matrix.",
          "Tensor Core mma sync accumulate layout.",
          "CUTLASS epilogue fusion bias add ReLU.",
          "Warp specializations mma load store sync.",
          "SMEM pipe access sequence double buffering.",
          "CUTLASS iterator tensorop multistage pipeline.",
          "Gemm universal swizzle 2D block mapping.",
          "Tensor Core fp16 input tf32 accumulate.",
          "CUTLASS profiler kernel cycle accuracy.",
          "WMMA fragment shape m16n16k16 MMA.",
          "Shared memory tensor core copy tile.",
          "Cutlass execution policy threadblock shape.",
          "Epilogue complex fusion depthwise conv.",
          "Gemm splitK multiple CTA reduction."
        ]
      },
      "techRoundTwo": {
        "title": "Multi-GPU CUDA Systems",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["NVLink", "NCCL", "Multi-Node"],
        "overview": "Multi-GPU multi-node CUDA programming patterns. NVLink P2P, NCCL collectives.",
        "questions": [
          "NVLink P2P memory access cudaMemcpyPeer.",
          "NCCL allreduce ring algorithm latency hiding.",
          "Multi-GPU pipeline microbatch scheduling.",
          "Tensor model parallelism NVLink sharding.",
          "NCCL broadcast tree algorithm fan-in fan-out.",
          "GPU direct RDMA GPUDirect RDMA RoCE.",
          "Multi-node NCCL IBverbs UCX transport.",
          "NVSwitch full mesh NVLink topology.",
          "Multi-GPU memory pool unified allocator.",
          "NCCL communicator bootstrap network topology.",
          "GPU affinity core CPU pinning.",
          "Multi-GPU checkpoint fault tolerance.",
          "NVLink error detection retry mechanism.",
          "Multi-stream dependency CUDA graph.",
          "GPUDirect storage NVMe direct HBM."
        ]
      },
      "techRoundThree": {
        "title": "GPU Performance Engineering",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Nsight", "Roofline", "Bottleneck"],
        "overview": "Nsight Compute/Systems performance analysis. Roofline model, bottleneck identification.",
        "questions": [
          "Nsight Compute roofline arithmetic intensity.",
          "SM utilization occupancy metrics analysis.",
          "L1 cache hit rate shared memory bank conflicts.",
          "Warp scheduler issue stalls instruction mix.",
          "Memory dependency stalls latency hiding.",
          "Tensor Core utilization smem pipe.",
          "NDRange kernel launch overhead analysis.",
          "GPU utilization sustained peak performance.",
          "IPC instructions per cycle throughput.",
          "Sustained vs eligible warp scheduler.",
          "Dram bandwidth utilization roofline bound.",
          "Source correlator SASS instruction mapping.",
          "Metrics discovery kernel introspection.",
          "Nsight Systems CPU GPU timeline.",
          "GPU reset hang detection recovery."
        ]
      },
      "behavioral": {
        "title": "Innovation Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "CUDA expert leadership through kernel innovation and GPU architecture contributions.",
        "questions": [
          "Invented CUDA kernel industry standard (Kernel Innovation). STAR.",
          "CUTLASS contribution upstream merged (Open Source Impact). STAR.",
          "GPU kernel 100x perf production (Performance Leadership). STAR.",
          "Multi-GPU scaling world record (Scaling Leadership). STAR.",
          "Mentored CUDA experts publications (Technical Leadership). STAR.",
          "GPU architecture influenced silicon design (Architecture Influence). STAR.",
          "Built CUDA platform team adoption (Platform Leadership). STAR.",
          "Production CUDA incident command (Crisis Leadership). STAR.",
          "Cross-team CUDA standardization (Standardization Leadership). STAR.",
          "Rapid CUDA prototyping validated silicon (Speed + Rigor). STAR.",
          "CUDA cost optimization cluster savings (Cost Leadership). STAR.",
          "Technical excellence raised CUDA standards (Excellence). STAR.",
          "GTC keynote CUDA contribution (Thought Leadership). STAR.",
          "Inclusive CUDA research collaboration (Inclusion). STAR.",
          "Strategic CUDA roadmap investment (Strategic Thinking). STAR."
        ]
      }
    }
    $$::jsonb
),
-- 4. Nvidia Data Engineer
(
    'Nvidia',
    'Nvidia Data Engineer',
    'Intermediate',
    '60 min',
    ARRAY['GPU Data Processing', 'RAPIDS', 'Dask', 'cuDF', 'Multi-GPU ETL'],
    'Nvidia Data Engineer interviews test GPU-accelerated data processing with RAPIDS cuDF/cuML. Multi-GPU Dask clusters.',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    $$
    {
      "interviewStyle": "pragmatic",
      "emphasis": ["GPU Data Processing", "RAPIDS", "Scale-out"],
      "behavioralFocus": "Innovation & Execution"
    }
    $$::jsonb,
    $$
    {
      "techRoundOne": {
        "title": "RAPIDS cuDF Processing",
        "id": "tech-1",
        "type": "technical",
        "duration": "15 min",
        "focus": ["cuDF", "GPU SQL", "Dataframes"],
        "overview": "GPU DataFrame processing with cuDF. GPU SQL, joins, aggregations at 100x CPU speed.",
        "questions": [
          "cuDF GPU DataFrame lazy evaluation spill.",
          "RAPIDS cuSQL GPU accelerated SQL joins.",
          "Multi-GPU Dask DataFrame partitioning.",
          "cuDF string operations regex GPU kernels.",
          "GPU hash join partition spilling bloom filter.",
          "RAPIDS cuML GPU ML feature engineering.",
          "cuDF groupby aggregation GPU reduction.",
          "GPU window functions row_number rank().",
          "cuDF pivot melt reshape operations.",
          "RAPIDS cuXfilter GPU interactive viz.",
          "GPU time series resampling rolling windows.",
          "cuDF merge join performance GPU memory.",
          "RAPIDS cuIO Parquet ORC CSV reading.",
          "GPU data validation schema inference.",
          "cuDF UDF Python CUDA kernel interop."
        ]
      },
      "techRoundTwo": {
        "title": "GPU ETL Pipelines",
        "id": "tech-2",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Multi-GPU", "Dask", "Pipeline"],
        "overview": "Multi-GPU ETL pipelines with Dask RAPIDS. Fault tolerance, spill to CPU/NVMe.",
        "questions": [
          "Dask RAPIDS cluster multi-GPU worker pool.",
          "GPU data pipeline fault tolerance checkpoint.",
          "RAPIDS memory manager spill GPU CPU NVMe.",
          "Multi-GPU Dask shuffle hash merge join.",
          "GPU data quality checks nulls duplicates.",
          "RAPIDS cuML feature store online serving.",
          "GPU streaming Kafka cuDF Dask DataFrame.",
          "Multi-GPU model training cuML distributed.",
          "RAPIDS fault tolerant execution lineage replay.",
          "GPU data lineage tracking RAPIDS AI.",
          "Dask scheduler GPU worker health monitoring.",
          "RAPIDS cuDF Parquet partitioning Z-order.",
          "GPU incremental processing CDC change data.",
          "Multi-GPU Dask dashboard monitoring metrics.",
          "RAPIDS integration Spark Pandas interop."
        ]
      },
      "techRoundThree": {
        "title": "GPU Data Infrastructure",
        "id": "tech-3",
        "type": "technical",
        "duration": "15 min",
        "focus": ["Scale-out", "Cost", "Production"],
        "overview": "Production GPU data infrastructure at Nvidia scale. Cost optimization, observability.",
        "questions": [
          "Multi-node RAPIDS cluster Kubernetes Helm.",
          "GPU cluster cost optimization spot MIG.",
          "RAPIDS memory profiling GPU HBM usage.",
          "Dask RAPIDS autoscaling GPU worker pool.",
          "GPU data mesh domain-oriented ownership.",
          "RAPIDS feature store serving online offline.",
          "GPU data catalog metadata lineage RAPIDS.",
          "Multi-GPU Dask job queue priority QoS.",
          "RAPIDS integration Snowflake BigQuery external tables.",
          "GPU data governance PII masking DP.",
          "RAPIDS observability Prometheus Grafana metrics.",
          "Multi-GPU Dask security Kerberos TLS.",
          "GPU data lake S3 Parquet Z-order MOR.",
          "RAPIDS A/B testing experimentation platform.",
          "GPU data platform self-service developer."
        ]
      },
      "behavioral": {
        "title": "Innovation Deep Dive",
        "id": "behavioral-1",
        "type": "behavioral",
        "duration": "15 min",
        "overview": "GPU data engineering leadership through RAPIDS acceleration and cost optimization.",
        "questions": [
          "RAPIDS pipeline 100x faster production (Acceleration Impact). STAR.",
          "Built GPU data platform team adoption (Platform Impact). STAR.",
          "GPU data pipeline reliability production (Reliability Leadership). STAR.",
          "RAPIDS cost optimization cluster savings (Cost Leadership). STAR.",
          "Mentored data engineers GPU acceleration (Technical Leadership). STAR.",
          "Multi-GPU Dask cluster scaling breakthrough (Scaling Leadership). STAR.",
          "Rapid RAPIDS prototyping validated approach (Speed + Rigor). STAR.",
          "Cross-team GPU data platform adoption (Change Management). STAR.",
          "GPU data quality automated testing (Quality Leadership). STAR.",
          "Production GPU data incident command (Crisis Leadership). STAR.",
          "RAPIDS integration enterprise data warehouse (Integration Leadership). STAR.",
          "GPU data culture organization-wide (Culture Building). STAR.",
          "Technical excellence raised data standards (Excellence Leadership). STAR.",
          "Strategic GPU data investment roadmap (Strategic Thinking). STAR.",
          "Inclusive GPU data engineering practices (Inclusion Leadership). STAR."
        ]
      }
    }
    $$::jsonb
);
