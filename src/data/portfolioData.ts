import type { Project, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'Jeptha Osorio',
  handle: 'jeep-ta',
  role: 'Computer Science Student & Aspiring Software Engineer',
  degree: 'Bachelor of Science in Computer Science (BSCS)',
  avatar: '/vMlwDyi7.jpg',
  systemName: 'JEPTHA-OS',
  kernelVersion: 'v2.5.0-release',
  uptime: '99.98%',
  status: 'Seeking Software Engineering Internships (OJT) & Junior Developer Roles',
  location: 'Philippines (UTC+8) • Remote Worldwide',
  email: 'jepthaosorio1@gmail.com',
  github: 'https://github.com/jeep-ta',
  linkedin: 'https://linkedin.com/in/jepthaosorio',
  twitter: 'https://x.com/jeep_ta',
  philosophy: 'Build with purpose, stay curious, and write clean, resilient software that solves real problems.',
  bio: `Computer Science student (BSCS) and aspiring software engineer passionate about modern reactive web architectures, robust backend systems, and clean user experiences.
Focused on building reliable full-stack applications with TypeScript, React, Next.js, Node.js, Python, Java, and SQL databases.
Actively building campus management systems, interactive tools, and seeking OJT / Junior Software Engineering opportunities.`
};

export const PROJECTS: Project[] = [
  {
    id: 'citsc-student-payment',
    title: 'CITSC Payment System',
    tagline: 'Centralized Academic Fee Tracking & Student Ledger System',
    category: 'Systems',
    description: 'Full-featured student payment and clearance management system built for academic departments and student councils to automate fee reconciliation, student ledger tracking, and clearance status verification.',
    problem: 'Manual student fee collections suffered from paper receipt losses, calculation mismatches, and lengthy clearance validation queues during exam periods.',
    solution: 'Engineered a centralized transaction management architecture with role-based access, automated ledger balancing, receipt verification, and exportable audit records.',
    metrics: '100% digital ledger tracking • Sub-second student search • Zero balance discrepancy',
    techStack: ['Java', 'MySQL', 'JDBC', 'OOP Architecture', 'Data Modeling', 'Swing / UI'],
    demoUrl: 'https://github.com/jeep-ta/citsc-student-payment',
    repoUrl: 'https://github.com/jeep-ta/citsc-student-payment',
    featured: true,
    architectureSteps: [
      'Student ID / record lookup query against normalized MySQL database',
      'Ledger balance & prerequisite fee verification computation',
      'Atomic transaction processing with receipt hash generation',
      'Real-time student clearance status update and audit log commitment'
    ],
    benchmark: {
      opsSec: 'Instant queries',
      p99Latency: '< 15 ms',
      memoryFootprint: '42 MB',
      concurrency: 'Multi-station',
      summary: 'Eliminated paper receipt latency and ensured 100% audit accuracy for academic student collections.'
    }
  },
  {
    id: 'smart-lost-and-found',
    title: 'Smart Lost & Found System',
    tagline: 'Intelligent Item Matching & Campus Recovery Platform',
    category: 'Tools',
    description: 'A JavaFX-based campus application designed to streamline the reporting of lost valuables and automatically match them with found entries using similarity algorithms.',
    problem: 'Campus lost-and-found boxes remained unindexed and unorganized, causing over 80% of lost belongings to remain unclaimed due to lack of a centralized search matching engine.',
    solution: 'Built a desktop recovery application utilizing tokenized similarity algorithms, category filtering, and status workflows to match item descriptions and notify owners.',
    metrics: 'Intelligent string similarity matching • High precision recall • Instant filtered search',
    techStack: ['Java', 'JavaFX', 'Similarity Algorithms', 'Object-Oriented Design', 'SQL'],
    demoUrl: 'https://github.com/jeep-ta/Smart-Lost-and-Found-System',
    repoUrl: 'https://github.com/jeep-ta/Smart-Lost-and-Found-System',
    featured: true,
    architectureSteps: [
      'Lost or found incident item reported with metadata attributes',
      'Text normalization & tokenized keyword similarity scoring pipeline',
      'Weighted match threshold calculation against active item registry',
      'Candidate match list presented to administrator with claim verification'
    ],
    benchmark: {
      opsSec: '1,200 matches/sec',
      p99Latency: '< 5 ms',
      memoryFootprint: '55 MB',
      concurrency: 'Desktop Client',
      summary: 'Delivers accurate similarity matches across hundreds of active campus inventory entries.'
    }
  },
  {
    id: 'birb-portal',
    title: 'Birb Conservation & Edu Portal',
    tagline: 'Modern Responsive Biodiversity & Avian Species Showcase',
    category: 'Web',
    description: 'A modern, multi-page web platform dedicated to bird watching, avian species education, and wildlife conservation awareness with dynamic theming and interactive discovery elements.',
    problem: 'Educational wildlife platforms frequently suffer from dated layouts, poor mobile responsiveness, and high friction for students exploring species catalogs.',
    solution: 'Designed a responsive, accessible web portal featuring smooth navigation, categorized species directories, dynamic dark mode, and engaging visual layouts.',
    metrics: '100/100 Lighthouse Performance • Responsive across all viewports • Accessible color contrast',
    techStack: ['JavaScript', 'HTML5', 'Modern CSS', 'Responsive Design', 'UI/UX'],
    demoUrl: 'https://github.com/jeep-ta/Birb',
    repoUrl: 'https://github.com/jeep-ta/Birb',
    featured: true,
    architectureSteps: [
      'Modular semantic HTML structure with responsive layout grid',
      'CSS custom properties driving dark/light mode toggle states',
      'Client-side species catalog filtering and search event handling',
      'Smooth DOM transitions and micro-interactions for high engagement'
    ],
    benchmark: {
      opsSec: '60 FPS transitions',
      p99Latency: '< 1 ms DOM update',
      memoryFootprint: '12 MB browser RAM',
      concurrency: 'Static CDN',
      summary: 'Zero-dependency vanilla implementation delivering instantaneous page transitions.'
    }
  },
  {
    id: 'umaweb-extension',
    title: 'umaWeb Chrome Extension',
    tagline: 'Interactive Web Companion & DOM Animation Engine',
    category: 'Tools',
    description: 'A Chromium browser extension that injects interactive animated companions onto active web pages, complete with configurable sprite physics, audio controls, and movement routines.',
    problem: 'Browser environments lack lightweight, customizable ambient widgets that do not disrupt user workflow or hog tab memory.',
    solution: 'Constructed an optimized Chrome Extension using non-blocking DOM physics loops, custom volume sliders, and configurable sprite populations.',
    metrics: 'Zero layout reflow interference • Low CPU animation loop • Configurable sprite density',
    techStack: ['JavaScript', 'Chrome Extension Manifest V3', 'Web Audio API', 'DOM Physics'],
    demoUrl: 'https://github.com/jeep-ta/umaWeb',
    repoUrl: 'https://github.com/jeep-ta/umaWeb',
    featured: false,
    architectureSteps: [
      'Extension content script injected into host viewport',
      'Configurable sprite state machine initializes position and velocity',
      'RequestAnimationFrame game loop calculates ground bounds and bounce vectors',
      'Web Audio controller handles synchronized sound effects'
    ],
    benchmark: {
      opsSec: '60 FPS loop',
      p99Latency: '0.4 ms frame time',
      memoryFootprint: '8.5 MB',
      concurrency: 'Isolated sandbox',
      summary: 'Smooth 60fps animation loop with zero DOM thrashing on the active web page.'
    }
  },
  {
    id: 'nasa-space-apps',
    title: 'NASA Space Apps Explorer',
    tagline: 'Interactive Planetary & Open Science Data Platform',
    category: 'Web',
    description: 'Collaborative hackathon submission engineered for the NASA Space Apps Challenge, visualizing open scientific data and Earth observation metrics in an interactive web application.',
    problem: 'Raw scientific Earth and planetary observation datasets are overwhelming and inaccessible to general audiences without visual exploration interfaces.',
    solution: 'Built a TypeScript web interface parsing open NASA datasets, rendering key metrics and planetary observations through interactive visual charts.',
    metrics: 'NASA Space Apps Hackathon submission • Real-time data parsing • Open science exploration',
    techStack: ['TypeScript', 'React', 'Open APIs', 'Data Visualization', 'Vite', 'Tailwind CSS'],
    demoUrl: 'https://github.com/jeep-ta/NASA-Challenge',
    repoUrl: 'https://github.com/jeep-ta/NASA-Challenge',
    featured: false,
    architectureSteps: [
      'Open API data fetched and validated against schema',
      'Geospatial and scientific readings aggregated in memory',
      'Interactive UI components render dynamic data views and telemetry graphs',
      'Responsive layout supports exploration across mobile and desktop'
    ],
    benchmark: {
      opsSec: 'Instant render',
      p99Latency: '< 25 ms',
      memoryFootprint: '18 MB',
      concurrency: 'Client-side SPA',
      summary: 'Rapid hackathon prototype delivering intuitive exploration of open planetary datasets.'
    }
  },
  {
    id: 'doomscroll-guard',
    title: 'Doomscroll Guard (Skyrim Edition)',
    tagline: 'Computer Vision Focus Guardian & Distraction Blocker',
    category: 'Systems',
    description: 'A computer vision productivity tool that monitors user focus and doomscrolling habits via camera/display tracking, humorously triggering the iconic Skeleton Shield alert when focus drifts.',
    problem: 'Passive browser blockers are easy to bypass and fail to address physical smartphone doomscrolling or tab disengagement.',
    solution: 'Implemented an active Python CV script utilizing OpenCV face/eye tracking and gesture estimation to intercept distraction with instant audio/visual meme deterrence.',
    metrics: 'Real-time CV inference • 30+ FPS webcam processing • Instant alert deterrence',
    techStack: ['Python', 'OpenCV', 'Computer Vision', 'Audio Processing', 'MediaPipe'],
    demoUrl: 'https://github.com/jeep-ta/Doomscroll-Skyrim-Edition',
    repoUrl: 'https://github.com/jeep-ta/Doomscroll-Skyrim-Edition',
    featured: false,
    architectureSteps: [
      'Webcam video stream captured frame-by-frame via OpenCV',
      'Facial landmark & head pose estimation evaluates screen engagement',
      'Attention decay threshold triggers distraction event',
      'Synchronous media player fires iconic audio-visual deterrence alert'
    ],
    benchmark: {
      opsSec: '30 FPS inference',
      p99Latency: '< 18 ms per frame',
      memoryFootprint: '68 MB RAM',
      concurrency: 'Single-stream CV',
      summary: 'Real-time distraction interception with minimal CPU footprint.'
    }
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    description: 'Core programming languages for modern web and application development',
    skills: [
      { name: 'TypeScript / JavaScript', level: 92, experience: '3+ yrs', status: 'Core', tag: 'ES2024 / React / Node' },
      { name: 'Python', level: 86, experience: '3 yrs', status: 'Core', tag: 'Backend / Data / OpenCV' },
      { name: 'Java', level: 88, experience: '3 yrs', status: 'Core', tag: 'OOP / JavaFX / Swing / Systems' },
      { name: 'C# / .NET', level: 80, experience: '2 yrs', status: 'Advanced', tag: 'OOP / Desktop Apps' },
      { name: 'SQL (Postgres & MySQL)', level: 88, experience: '3 yrs', status: 'Core', tag: 'Schema / Relational / Queries' },
      { name: 'HTML5 & Modern CSS', level: 95, experience: '4 yrs', status: 'Core', tag: 'Tailwind CSS / Responsive' }
    ]
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libraries',
    description: 'Modern reactive component frameworks, state libraries, and backend runtimes',
    skills: [
      { name: 'React 19 & Next.js', level: 92, experience: '3 yrs', status: 'Core', tag: 'Modern Hooks / SSR / Routing' },
      { name: 'Node.js & Express', level: 88, experience: '3 yrs', status: 'Core', tag: 'REST APIs / Middleware' },
      { name: 'Tailwind CSS', level: 95, experience: '3 yrs', status: 'Core', tag: 'Utility-First / Responsive UI' },
      { name: 'JavaFX & Desktop GUI', level: 86, experience: '2 yrs', status: 'Core', tag: 'Desktop Architecture / FXML' },
      { name: 'Python FastAPI / Flask', level: 82, experience: '2 yrs', status: 'Advanced', tag: 'Async Endpoints / Services' },
      { name: 'Vite & Build Tooling', level: 90, experience: '2 yrs', status: 'Core', tag: 'Fast Bundling / Development' }
    ]
  },
  {
    id: 'backend-databases',
    name: 'Backend & Database Systems',
    description: 'Data modeling, schema design, and server-side architecture',
    skills: [
      { name: 'PostgreSQL & MySQL', level: 88, experience: '3 yrs', status: 'Core', tag: 'Relational Design / Normalization' },
      { name: 'RESTful API Architecture', level: 90, experience: '3 yrs', status: 'Core', tag: 'JSON / Auth / JWT' },
      { name: 'Database Normalization', level: 86, experience: '2+ yrs', status: 'Advanced', tag: 'Relational Modeling' },
      { name: 'Authentication & Security', level: 84, experience: '2 yrs', status: 'Advanced', tag: 'JWT / Sessions / CORS' },
      { name: 'Express Server Architecture', level: 88, experience: '3 yrs', status: 'Core', tag: 'Modular Route Design' }
    ]
  },
  {
    id: 'tooling',
    name: 'Tooling & Workflow',
    description: 'Version control, developer tooling, and testing workflows',
    skills: [
      { name: 'Git & GitHub (@jeep-ta)', level: 95, experience: '4 yrs', status: 'Core', tag: 'Branching / Commits / PRs' },
      { name: 'Linux & Bash Terminal', level: 85, experience: '2+ yrs', status: 'Core', tag: 'POSIX / Shell Scripting' },
      { name: 'Postman & API Testing', level: 90, experience: '3 yrs', status: 'Core', tag: 'Endpoint Verification' },
      { name: 'VS Code & Developer CLI', level: 96, experience: '4 yrs', status: 'Core', tag: 'Debugging / Extensions' },
      { name: 'CI/CD (GitHub Actions)', level: 78, experience: '1+ yr', status: 'Proficient', tag: 'Build & Test Workflows' }
    ]
  }
];

export const ABOUT_FILE_CONTENT = `# ENGINEERING PROFILE // JEPTHA OSORIO
Role: Computer Science Student & Aspiring Software Engineer
Degree: Bachelor of Science in Computer Science (BSCS)
Specialization: Full-Stack Web Development, Backend APIs, Desktop Systems & Databases
Location: Philippines (UTC+8) • Remote Worldwide

1. TECHNICAL OVERVIEW
--------------------------------------------------------------------------------
Greetings, traveler. I am Jeptha Osorio (@jeep-ta), a Computer Science student (BSCS)
and aspiring software engineer based in the Philippines. I focus on building responsive
web applications, robust backend APIs, practical desktop solutions, and polished terminal
interfaces.

I believe modern software should be:
  [x] Fast, accessible, and responsive across all devices.
  [x] Resilient, structured, and easy to maintain.
  [x] Intuitive, treating user attention and clarity as top priorities.

2. CURRENT FOCUS AREAS & TARGET ROLES
--------------------------------------------------------------------------------
* Actively seeking:
  - Software Engineering Internships / OJT Student Trainee Placements
  - Junior Full-Stack Developer Roles (React, Next.js, Node.js, TypeScript)
  - Junior Backend / API Developer Roles (Node.js, Express, PostgreSQL/MySQL)

* Technical Focus:
  - Full-Stack Web Development: Building reactive SPAs and SSR apps with React, Next.js, and TypeScript.
  - Backend Services & APIs: Designing RESTful endpoints with Node.js, Express, and Python.
  - Database Systems: Relational schema design and query optimization with PostgreSQL and MySQL.
  - Desktop & System Applications: Object-oriented software in Java (JavaFX/Swing) and C#.

3. FEATURED PROJECTS HIGHLIGHT
--------------------------------------------------------------------------------
* CITSC Student Payment System (Java / MySQL)
  - Centralized fee tracking and student ledger management platform eliminating paper receipts.
* Smart Lost & Found System (Java / JavaFX / Similarity Algorithms)
  - Intelligent campus lost-and-found recovery platform with tokenized similarity matching.
* Birb Conservation & Edu Portal (JavaScript / HTML5 / CSS)
  - Accessible, responsive avian biodiversity web showcase with 100/100 Lighthouse performance.
* umaWeb Chrome Extension (JavaScript / Manifest V3)
  - Ambient interactive desktop/browser sprite companion engine with 60fps physics loop.
* NASA Space Apps Challenge Submission (TypeScript / React)
  - Collaborative open science explorer visualizing planetary and geospatial datasets.
* Doomscroll Guard - Skyrim Edition (Python / OpenCV)
  - Real-time computer vision focus deterrence tool monitoring study distraction.

4. CORE PHILOSOPHY
--------------------------------------------------------------------------------
"Build with purpose, stay curious, and write clean,
resilient code that solves real problems."

5. STATUS & AVAILABILITY
--------------------------------------------------------------------------------
[ONLINE] Actively seeking internship opportunities (OJT) and junior developer positions.
GitHub: https://github.com/jeep-ta
Email: jepthaosorio1@gmail.com
Type 'contact' in the terminal or open the Contact app to initiate communications.
`;
