import type { Project, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'Jeptha',
  handle: 'jeptha',
  role: 'Senior Full-Stack & Systems Engineer',
  systemName: 'JEPTHA-OS',
  kernelVersion: 'v2.4.0-release',
  uptime: '99.98%',
  status: 'Ready for High-Impact Projects',
  location: 'Singapore (UTC+8) • Remote Worldwide',
  email: 'jeptha.dev@gmail.com',
  github: 'https://github.com/jeptha',
  linkedin: 'https://linkedin.com/in/jeptha',
  twitter: 'https://x.com/jepthadev',
  philosophy: 'Make it work, make it elegant, make it fast. Keep blast radius minimal, respect the platform, and write code that reads like well-authored literature.',
  bio: `Senior Software Engineer passionate about low-latency distributed systems, modern reactive frontend architectures, and developer tooling. 
Over 6 years of experience transforming complex technical problems into reliable, high-performing software systems. 
Advocate for type-safe codebases, local-first web applications, and resilient distributed state machines.`
};

export const PROJECTS: Project[] = [
  {
    id: 'aether-db',
    title: 'AetherDB',
    tagline: 'Embedded Distributed Key-Value Engine',
    category: 'Systems',
    description: 'High-throughput, log-structured merge-tree (LSM) embedded storage engine built in Rust with Raft consensus and zero-copy io_uring serialization.',
    problem: 'Existing distributed KV stores had excessive tail latency (p99 > 35ms) and high memory footprint under bursty microservice ingestion workloads.',
    solution: 'Engineered an LSM engine featuring segmented WAL, Bloom filter cache indexing, asynchronous io_uring syscall execution, and lock-free thread queues.',
    metrics: '120,000 ops/sec • <1.2ms p99 latency • 40% RAM reduction',
    techStack: ['Rust', 'Tokio', 'io_uring', 'Raft', 'gRPC', 'Protobuf'],
    demoUrl: 'https://github.com/jeptha/aether-db',
    repoUrl: 'https://github.com/jeptha/aether-db',
    featured: true,
    architectureSteps: [
      'Client issue write over high-throughput gRPC socket',
      'Tokio thread pool worker receives and verifies payload integrity',
      'Asynchronous segmented WAL write executed via Linux io_uring',
      'In-memory skiplist MemTable update and Bloom filter index compute',
      'Raft consensus log broadcast to peer quorum replica nodes',
      'Background asynchronous tiered SSTable compaction on NVMe'
    ],
    benchmark: {
      opsSec: '120,400 ops/sec',
      p99Latency: '1.18 ms',
      memoryFootprint: '38.4 MB',
      concurrency: '512 workers',
      summary: 'Outperformed baseline RocksDB by 2.4x under bursty 95% write load.'
    }
  },
  {
    id: 'nexus-hyperflow',
    title: 'Nexus Hyperflow',
    tagline: 'Real-Time CRDT Collaborative Spatial Canvas',
    category: 'Web',
    description: 'Ultra-responsive collaborative infinite whiteboard with conflict-free replicated data types, WebRTC peer meshes, and WebGL hardware-accelerated rendering.',
    problem: 'Frequent conflict desynchronization and sluggish 15fps canvas stutter during large multi-user planning sessions with 50+ concurrent participants.',
    solution: 'Designed a hybrid CRDT synchronization topology using WebSockets for room presence and WebRTC data channels for low-latency cursor tracking, powered by a 60fps WebGL viewport.',
    metrics: '50+ concurrent editors • 60 FPS viewport • <10ms sync latency',
    techStack: ['TypeScript', 'React 19', 'WebGL', 'CRDT / Yjs', 'WebSockets', 'WebRTC', 'Tailwind CSS'],
    demoUrl: 'https://github.com/jeptha/nexus-hyperflow',
    repoUrl: 'https://github.com/jeptha/nexus-hyperflow',
    featured: true,
    architectureSteps: [
      'Spatial canvas vector draw event triggered on client UI',
      'Local Yjs CRDT delta encoded into compact binary buffer',
      'WebRTC direct data channel broadcast to active viewport peers',
      'Server WebSocket state vector verification & fallback broadcast',
      'Hardware-accelerated WebGL viewport re-render with zero jank'
    ],
    benchmark: {
      opsSec: '60 FPS stable',
      p99Latency: '7.8 ms',
      memoryFootprint: '24.2 MB',
      concurrency: '64 peers',
      summary: 'Maintained 60fps and zero state drift across 10,000 synthetic multi-cursor inputs.'
    }
  },
  {
    id: 'kubepulse',
    title: 'KubePulse Telemetry',
    tagline: 'eBPF-Powered Zero-Overhead Kubernetes Observability',
    category: 'Systems',
    description: 'Next-gen Linux kernel telemetry daemon that monitors container socket lifecycles, TCP retransmits, and syscall latency using eBPF probes without userspace context-switching.',
    problem: 'Legacy APM sidecars consumed 15% to 20% of CPU capacity on resource-constrained Kubernetes worker nodes.',
    solution: 'Created in-kernel ring-buffer probes using Cilium eBPF, streaming condensed protocol metrics to Prometheus and Grafana dashboards with minimal CPU wakeups.',
    metrics: '<0.8% CPU footprint • Zero-loss packet trace • Sub-millisecond alert triage',
    techStack: ['Go', 'eBPF / Cilium', 'Linux Kernel', 'Kubernetes', 'Prometheus', 'Grafana'],
    demoUrl: 'https://github.com/jeptha/kubepulse',
    repoUrl: 'https://github.com/jeptha/kubepulse',
    featured: true,
    architectureSteps: [
      'Kernel socket lifecycle hook triggered via kprobe / tracepoint',
      'Raw packet latency calculation in kernel space with zero context switch',
      'Lockless ring-buffer batch streaming to userspace Go collector',
      'Prometheus pull endpoint metrics publication and Grafana dashboard stream'
    ],
    benchmark: {
      opsSec: '450,000 pkts/sec',
      p99Latency: '0.04 ms',
      memoryFootprint: '14.2 MB',
      concurrency: 'Kernel space',
      summary: 'Demonstrated 95% CPU savings compared to standard user-space daemonset proxies.'
    }
  },
  {
    id: 'synapse-devtools',
    title: 'Synapse DevTools',
    tagline: 'Polyglot AST & Dependency Graph Analyzer',
    category: 'Tools',
    description: 'Interactive static analysis suite that parses codebases into interactive force-directed dependency graphs, detecting circular imports and architectural boundary violations.',
    problem: 'Engineers struggled to understand deep circular imports and refactor monoliths safely without visual dependency architecture maps.',
    solution: 'Compiled Tree-sitter parsers to WebAssembly for client-side parallel AST parsing, visualising dependency trees with D3.js and instant pathfinding.',
    metrics: 'Parsed 100k LOC in 180ms • 24 cyclic loops detected • Zero server requirement',
    techStack: ['TypeScript', 'Rust (Wasm)', 'Tree-sitter', 'D3.js', 'Vite', 'Tailwind CSS'],
    demoUrl: 'https://github.com/jeptha/synapse-devtools',
    repoUrl: 'https://github.com/jeptha/synapse-devtools',
    featured: false,
    architectureSteps: [
      'Source files scanned in parallel via Web Workers',
      'Tree-sitter Rust parser compiled to WebAssembly evaluates grammar',
      'Directed acyclic graph (DAG) node matrix constructed in memory',
      'Tarjan cycle detection algorithm isolates circular references',
      'Force-directed canvas graph rendered with interactive zoom/pan'
    ],
    benchmark: {
      opsSec: '100k LOC / 180ms',
      p99Latency: '12.4 ms',
      memoryFootprint: '18.9 MB',
      concurrency: '4 Web Workers',
      summary: '100% client-side execution with zero backend infrastructure needed.'
    }
  },
  {
    id: 'aura-ui',
    title: 'Aura UI Toolkit',
    tagline: 'Ultra-Lightweight Headless Accessible Component Engine',
    category: 'Web',
    description: 'Zero-dependency design system library prioritizing 100% WAI-ARIA keyboard navigation, compound component patterns, and sub-12KB bundle footprint.',
    problem: 'Mainstream component libraries bloated bundles by 300KB+ and had brittle keyboard trap bugs in complex modal dialogs.',
    solution: 'Built modular state machines using standard DOM primitives with zero runtime styling overhead and 100% test coverage.',
    metrics: '11.4KB gzip • 100/100 Lighthouse • 99.8% test coverage',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Radix Primitives', 'Vitest'],
    demoUrl: 'https://github.com/jeptha/aura-ui',
    repoUrl: 'https://github.com/jeptha/aura-ui',
    featured: false,
    architectureSteps: [
      'State machine initialized with headless ARIA attributes',
      'Focus trapping and keyboard event capture registered',
      'Tailwind CSS tokens applied via compound slot hierarchy',
      'Zero-runtime overhead DOM nodes rendered with instant response'
    ],
    benchmark: {
      opsSec: '100/100 Lighthouse',
      p99Latency: '0.2 ms',
      memoryFootprint: '11.4 KB gzip',
      concurrency: 'Unlimited',
      summary: 'Zero accessibility warnings in automated axe-core audits.'
    }
  },
  {
    id: 'edgeforge-gateway',
    title: 'EdgeForge AI Gateway',
    tagline: 'Edge Cache & Dynamic LLM Router',
    category: 'Systems',
    description: 'Edge-deployed reverse proxy performing semantic similarity caching, fallback failover across model providers, and real-time streaming token budgeting.',
    problem: 'Repetitive developer and agent prompts inflated API costs and suffered 1.5s cold latency on cloud models.',
    solution: 'Deployed on Cloudflare Workers edge nodes with Vectorize semantic embeddings, returning cached completions in 18ms and saving 42% on API quotas.',
    metrics: '42% cost reduction • 18ms cached response • 99.99% uptime',
    techStack: ['TypeScript', 'Cloudflare Workers', 'Vectorize', 'Redis', 'OpenAI API', 'Anthropic API'],
    demoUrl: 'https://github.com/jeptha/edgeforge',
    repoUrl: 'https://github.com/jeptha/edgeforge',
    featured: false,
    architectureSteps: [
      'Incoming prompt request hits Cloudflare edge PoP',
      'Semantic embedding calculated via Vectorize index',
      'Cosine similarity lookup checks for high-confidence cache hit',
      'Cache hit: return streamed token stream in 18ms',
      'Cache miss: route to optimal upstream LLM with budget throttling'
    ],
    benchmark: {
      opsSec: '18 ms cache hit',
      p99Latency: '32 ms edge proxy',
      memoryFootprint: '4.8 MB edge RAM',
      concurrency: '10,000+ edge req/s',
      summary: 'Saved 42% on API billing across 2.5 million test agent prompt calls.'
    }
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    description: 'Core programming languages leveraged for systems and modern web applications',
    skills: [
      { name: 'TypeScript / JavaScript', level: 96, experience: '6+ yrs', status: 'Core', tag: 'ES2024 / Node / Browser' },
      { name: 'Rust', level: 88, experience: '4 yrs', status: 'Core', tag: 'Systems / Tokio / Wasm' },
      { name: 'Go (Golang)', level: 85, experience: '3+ yrs', status: 'Advanced', tag: 'Microservices / eBPF' },
      { name: 'Python', level: 82, experience: '5 yrs', status: 'Advanced', tag: 'FastAPI / PyTorch / Data' },
      { name: 'SQL & Query Design', level: 90, experience: '6 yrs', status: 'Core', tag: 'Postgres / ClickHouse' },
      { name: 'HTML5 & Modern CSS', level: 95, experience: '6+ yrs', status: 'Core', tag: 'Tailwind / Responsive' }
    ]
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libraries',
    description: 'Modern reactive component frameworks, state libraries, and backend runtimes',
    skills: [
      { name: 'React 19 & Next.js', level: 95, experience: '5+ yrs', status: 'Core', tag: 'RSC / Hooks / Suspense' },
      { name: 'Node.js & Bun', level: 92, experience: '5+ yrs', status: 'Core', tag: 'Asynchronous Event Loop' },
      { name: 'Tailwind CSS v4', level: 96, experience: '4 yrs', status: 'Core', tag: 'Utility-First / JIT' },
      { name: 'Tokio & Axum (Rust)', level: 84, experience: '3 yrs', status: 'Advanced', tag: 'High-Throughput Async' },
      { name: 'FastAPI & Pydantic', level: 86, experience: '4 yrs', status: 'Advanced', tag: 'Type-Safe Async REST' },
      { name: 'Vite & Vitest', level: 94, experience: '4 yrs', status: 'Core', tag: 'Lightning Build Tooling' }
    ]
  },
  {
    id: 'architecture',
    name: 'Architecture & Distributed Systems',
    description: 'Engineering paradigms for high availability, fault tolerance, and concurrency',
    skills: [
      { name: 'Distributed Systems & Raft', level: 86, experience: '3+ yrs', status: 'Advanced', tag: 'Consensus / Replication' },
      { name: 'Event-Driven (Kafka / RabbitMQ)', level: 88, experience: '4 yrs', status: 'Core', tag: 'Pub/Sub & CQRS' },
      { name: 'CRDT & Local-First State', level: 87, experience: '2+ yrs', status: 'Advanced', tag: 'Yjs / Automerge / Offline' },
      { name: 'RESTful & GraphQL & gRPC', level: 94, experience: '5+ yrs', status: 'Core', tag: 'Contract-First API Design' },
      { name: 'Database Indexing & LSM-Trees', level: 88, experience: '4 yrs', status: 'Advanced', tag: 'B-Tree / LSM / WAL' },
      { name: 'Microservices & Domain Design', level: 90, experience: '5 yrs', status: 'Core', tag: 'Boundaries / Fault Isolation' }
    ]
  },
  {
    id: 'tooling',
    name: 'Tooling, Cloud & DevOps',
    description: 'Infrastructure automation, containerization, and observability pipelines',
    skills: [
      { name: 'Docker & Podman', level: 92, experience: '5+ yrs', status: 'Core', tag: 'Multi-stage / Alpine' },
      { name: 'Kubernetes & Helm', level: 84, experience: '3+ yrs', status: 'Advanced', tag: 'Ingress / Deployments' },
      { name: 'Linux System Administration', level: 92, experience: '6+ yrs', status: 'Core', tag: 'POSIX / Systemd / Bash' },
      { name: 'Git & Trunk Development', level: 98, experience: '6+ yrs', status: 'Core', tag: 'Rebase / Bisect / Hooks' },
      { name: 'CI/CD (GitHub Actions)', level: 92, experience: '5 yrs', status: 'Core', tag: 'Matrix Builds / Cache' },
      { name: 'Prometheus & Grafana & OpenTelemetry', level: 85, experience: '3+ yrs', status: 'Advanced', tag: 'Metrics / Traces / Alerts' }
    ]
  }
];

export const ABOUT_FILE_CONTENT = `// =============================================================================
// FILE: About.txt
// AUTHOR: Jeptha (Senior Software Engineer)
// KERNEL: JepthaOS 2.4.0 (x86_64-retro-web)
// =============================================================================

1. TECHNICAL OVERVIEW
--------------------------------------------------------------------------------
Greetings, traveler. I am Jeptha, a Senior Full-Stack and Systems Engineer.
I focus on building distributed engines, low-latency APIs, and polished,
delightful user interfaces that respect computational resources.

I believe modern software should be:
  [x] Fast without requiring exorbitant cloud hardware.
  [x] Resilient in the face of network degradation or unexpected partition.
  [x] Beautiful and intuitive, treating user attention as a scarce resource.

2. CURRENT FOCUS AREAS
--------------------------------------------------------------------------------
- High-Performance Embedded Storage: Developing LSM-tree architectures in Rust.
- Local-First Web Applications: Real-time collaborative state using CRDTs.
- Autonomous Agents & Telemetry: Kernel-space eBPF observability & safe LLM routing.
- Micro-interaction Design: Crafting sensory-rich desktop UI paradigms on the web.

3. WORK EXPERIENCE SUMMARY
--------------------------------------------------------------------------------
* 2022 - Present: Lead Systems & Platform Engineer
  - Architected distributed ingestion pipeline processing 40M+ events/day.
  - Reduced p99 latency by 68% through zero-copy buffer pools and io_uring.
  - Mentored 8 junior and mid-level engineers across frontend & systems tracks.

* 2020 - 2022: Senior Full-Stack Engineer
  - Built real-time collaborative telemetry dashboard using WebSockets and React.
  - Implemented CI/CD caching strategies cutting test pipeline runtime by 50%.

* 2018 - 2020: Software Engineer
  - Developed RESTful microservices in Go and Python with PostgreSQL.
  - Refactored legacy UI monolith to component-driven design system.

4. CORE PHILOSOPHY
--------------------------------------------------------------------------------
"Make it work, make it elegant, make it fast.
Keep blast radius minimal, respect the platform,
and write code that reads like well-authored literature."

5. STATUS & AVAILABILITY
--------------------------------------------------------------------------------
[ONLINE] Available for select high-impact engineering roles and technical advisory.
Type 'contact' in the terminal or run Contact.sh to initiate communications.
`;
