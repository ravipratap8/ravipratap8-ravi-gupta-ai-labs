// Personal brand and portfolio data for Ravi Gupta.
// Keep this focused on capability and professional development rather than CV-style chronology.

export const PROFILE = {
  name: 'Ravi Gupta',
  location: 'Auckland, New Zealand',
  status: 'NZ Permanent Resident',
  role: 'Quality Engineering Leader | AI Engineering Practitioner | Technology Delivery',
  tagline: 'Quality Engineering • Applied AI • Test Leadership',
  intro:
    'I lead quality across complex enterprise systems and build practical AI-enabled workflows, learning labs and engineering prototypes focused on governance, testability and human control.',
  photo:
    'https://customer-assets.emergentagent.com/job_79f6bd31-046c-4b35-871f-1a3b2a3031ac/artifacts/l4ogjdym_Ravi%20Gupta%20Profile%20Picture.jpeg',
  email: 'ravi@ravigupta.dev',
  linkedin: 'https://www.linkedin.com/',
  currentRole: 'Test Lead, enterprise supply chain technology',
}

export const ABOUT = [
  '19+ years across quality engineering, test leadership, delivery governance, automation and enterprise transformation, including complex integration and supply-chain platforms.',
  'My current focus is the intersection of AI and quality engineering: designing AI-assisted workflows with confidence scoring, risk assessment, human approval, auditability and explicit test controls.',
  'This site is my engineering lab. I use it to turn ideas into working demonstrations, learning modules, governance patterns and reusable test assets rather than presenting a traditional online CV.',
]

export const STATS = [
  { value: '19+', label: 'Years in quality engineering' },
  { value: 'AI + QE', label: 'Current engineering focus' },
  { value: 'HITL', label: 'Human-in-the-loop by design' },
  { value: 'MCP', label: 'Agent-ready architecture' },
]

export const SKILLS = [
  {
    group: 'Quality Leadership',
    items: ['Test Strategy & Governance', 'Risk-Based Testing', 'Delivery Assurance', 'QA Leadership', 'Release Readiness'],
  },
  {
    group: 'Automation & APIs',
    items: ['Playwright', 'Selenium', 'Cypress', 'Rest Assured', 'TOSCA', 'API & Contract Testing'],
  },
  {
    group: 'Enterprise Engineering',
    items: ['SAP WMS / TMS / EWM', 'Integration Testing', 'CI/CD Quality Gates', 'Observability', 'Test Data Strategy'],
  },
  {
    group: 'Applied AI',
    items: ['AI Workflow Design', 'Prompt Governance', 'Human-in-the-loop', 'AI Evaluation', 'RAG / Grounding Concepts', 'MCP-ready Tools'],
  },
]

export const EDUCATION = [
  {
    title: 'Master of Management',
    status: 'In progress',
    detail: 'Second degree focused on management, finance, project delivery, research and the wider New Zealand business environment.',
    highlight: 'Scholarship recipient',
  },
  {
    title: 'Continuous AI & Engineering Learning',
    status: 'Ongoing',
    detail: 'Hands-on study through working prototypes, AI governance experiments, test automation, API quality, prompt evaluation and agent-ready architecture.',
    highlight: 'Build to learn',
  },
]

export const CERTIFICATIONS = [
  { name: 'ISTQB Certified Test Manager', issuer: 'ISTQB', icon: 'BadgeCheck' },
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', icon: 'Cloud' },
  { name: 'Certified ScrumMaster (CSM)', issuer: 'Scrum Alliance', icon: 'Users' },
]

export const LEARNING_MODULES = [
  {
    title: 'AI Workflow & Governance Lab',
    eyebrow: 'Interactive AI learning',
    description: 'Work through confidence, risk, grounding and human-approval decisions using realistic business AI scenarios.',
    href: '/learning/ai',
    level: 'Applied',
    lessons: '4 exercises',
    tags: ['AI Governance', 'HITL', 'Evaluation'],
  },
  {
    title: 'Playwright Test Automation Lab',
    eyebrow: 'Interactive automation',
    description: 'Practice selectors, assertions, test design and reliability decisions without turning automation into a record-and-playback exercise.',
    href: '/learning/playwright',
    level: 'Beginner → Practical',
    lessons: '4 exercises',
    tags: ['Playwright', 'UI Testing', 'Reliability'],
  },
  {
    title: 'API Testing Beyond Status Codes',
    eyebrow: 'Interactive API quality',
    description: 'Test contracts, negative paths, state transitions and business invariants instead of stopping at HTTP 200.',
    href: '/learning/api-testing',
    level: 'Practical',
    lessons: '4 exercises',
    tags: ['API Testing', 'Contracts', 'Risk'],
  },
]

export const PROJECTS = [
  {
    title: 'AI EventOps Assistant',
    category: 'Applied AI Workflow',
    description:
      'An event-operations demonstration where AI classifies enquiries, drafts grounded responses and generates content while confidence, risk, approval and audit controls remain visible.',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    tags: ['Next.js', 'AI Governance', 'Human-in-the-loop', 'MCP-ready'],
    href: '/dashboard',
    featured: true,
  },
  {
    title: 'Interactive Engineering Learning Lab',
    category: 'Learning by Doing',
    description:
      'Scenario-based learning for AI governance, Playwright automation and API testing. Each module asks the learner to make an engineering decision and explains the trade-off.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI Learning', 'Playwright', 'API Testing'],
    href: '/learning',
  },
  {
    title: 'AI Governance & Evaluation Patterns',
    category: 'Responsible AI Engineering',
    description:
      'Reusable patterns for confidence scoring, prompt risk, safe fallback, human approval, auditability and testing AI behaviour before an action reaches production.',
    image:
      'https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    tags: ['Evaluation', 'Risk Controls', 'Auditability'],
    href: '/dashboard/governance',
  },
  {
    title: 'Enterprise Quality Engineering',
    category: 'Delivery & Test Leadership',
    description:
      'Quality strategy for integrated enterprise systems, combining risk-based testing, automation, API validation, release evidence and clear quality signals for delivery teams.',
    image:
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Enterprise QA', 'SAP', 'Integration', 'Automation'],
    href: '#skills',
  },
]

export const HERO_BG =
  'https://images.unsplash.com/photo-1604011237320-8e0506614fdf?auto=format&fit=crop&w=1800&q=85'
