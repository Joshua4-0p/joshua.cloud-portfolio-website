// ALL site copy. Every fact comes from /plan.md (owner-confirmed 6 Nov 2026). Do not add facts here that aren't there.

const REPO = 'https://github.com/Joshua4-0p/joshua.cloud-portfolio-website';

export const profile = {
  name: 'Tiaya Fotseu Josue',
  shortName: 'Josue Fotseu',
  titlesPrimary: ['Cloud & DevOps Engineer', 'Serverless Developer'],
  titlesSecondary: ['Community Builder', 'Blogger', 'Speaker'],
  status: '4th-year B.Eng Computer Engineering student, University of Buea',
  location: 'Buea, Cameroon',
  origin: 'from Bafoussam',
  tagline: 'Before SNS, there was the drum.',
  hint: 'The drum has a message for you — tap it',
  email: 'josuefotseu02@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/josu%C3%A9-fotseu',
    github: 'https://github.com/Joshua4-0p',
    devto: 'https://dev.to/joshuaer',
    repo: REPO,
  },
  builderCenterHandle: '@josuefotseu02',
  aboutLead:
    'I build serverless systems on AWS that carry messages from one place to many — the modern version of what a drummer has always done.',
  aboutStory:
    "I was born in Bafoussam and did my O-Levels there, then moved to Dschang for A-Level science. Today I'm in Buea, a 4th-year Computer Engineering student at the University of Buea, building and shipping serverless applications on AWS. I grew up bilingual in English and French, and that made me flexible: I can work with very different groups of people. I play drums, and I write.",
  now: [
    'Software Engineer at DIGISOL Group',
    'Technical Community Program Manager at Cloud Builders Africa',
    'Educloud Academy Ambassador',
    'AWS Certified Cloud Practitioner',
  ],
  languages: 'English / French (B2 / B2)',
  degree: 'B.Eng Computer Engineering (Software Engineering), University of Buea — expected Dec 2026',
};

export const recommendation = {
  quote: 'Josué is a quick learner who grasps development concepts rapidly, making collaboration a joy.',
  author: 'Amarachukwu Godlove Ahanonu',
  context: 'Mentor, LinkedIn recommendation, Jul 2025',
};

export const experience: { org: string; role: string; period: string; summary: string }[] = [
  {
    org: 'DIGISOL Group, Buea',
    role: 'Software Engineer (full-time)',
    period: 'Aug 2025 – present',
    summary:
      'System design and architecture for company projects (data models, API structures, service boundaries, design documents and architecture diagrams); full-stack development (REST APIs, database schemas, responsive UIs, code reviews); on-site IT infrastructure deployments (CCTV, internet-over-satellite, IT labs) for schools, universities, offices and government facilities. Started as intern and Lead Intern; mentors fellow interns in cloud computing.',
  },
  {
    org: 'Cloud Builders Africa',
    role: 'Technical Community Program Manager',
    period: 'Aug 2026 – present',
    summary:
      'Runs "The Way To My Cloud Journey", a 10-month virtual cloud training programme: 46 sessions in 6 phases (core infrastructure, DevOps/IaC, serverless, GenAI/ML on AWS), with AWS Heroes and community experts as speakers and gates aligned with AWS SAA-C03, DVA-C02 and AIF-C01. Hosts workshops on AWS CDK and serverless.',
  },
  {
    org: 'Educloud Academy',
    role: 'ECA Ambassador (first in Cameroon)',
    period: 'Jun 2026 – present',
    summary: 'Cloud and AI literacy at the University of Buea: workshops, live architecture demos, mentoring, technical articles.',
  },
  {
    org: 'Codveda Technologies (India, remote)',
    role: 'Full-Stack Developer Intern',
    period: 'Oct 2025 – Apr 2026',
    summary: 'REST APIs, database design and integrations; responsive front ends.',
  },
];

export const superpowers: { index: string; title: string; skills: string[]; proofs: { label: string; href: string }[] }[] = [
  {
    index: '00-1',
    title: 'Cloud & Serverless',
    skills: ['AWS Lambda', 'Amazon RDS', 'Amazon Cognito', 'AWS CDK', 'Amazon API Gateway', 'Amazon DynamoDB', 'Amazon SNS', 'AWS Amplify Hosting', 'Amazon CloudWatch'],
    proofs: [
      { label: 'HIS project', href: '#project-his' },
      { label: 'DailyReport AI', href: '#project-dailyreport-ai' },
      { label: 'This portfolio', href: '#project-talking-drum' },
    ],
  },
  {
    index: '00-2',
    title: 'Security & Resilience',
    skills: ['AWS KMS', 'AWS Secrets Manager', 'Security Groups', 'NACLs', 'High availability & disaster recovery patterns', 'Observability'],
    proofs: [
      { label: 'Talk: The Unbreakable Cloud', href: '#talks' },
      { label: 'Apache / SSL / Nagios', href: '#project-apache-nagios' },
    ],
  },
  {
    index: '00-3',
    title: 'DevOps & Monitoring',
    skills: ['Linux (Ubuntu, Kali)', 'Apache', 'SSL/TLS', 'Nagios', 'CI/CD (Amplify)', 'Infrastructure as Code (CDK)'],
    proofs: [
      { label: 'Apache + Nagios project', href: '#project-apache-nagios' },
      { label: 'This portfolio', href: '#project-talking-drum' },
    ],
  },
  {
    index: '00-4',
    title: 'Full-Stack',
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'React Native', 'Tailwind CSS', 'Bootstrap', 'Node.js', 'Express', 'Laravel', 'WordPress', 'MongoDB', 'MySQL', 'HTML', 'CSS'],
    proofs: [
      { label: 'AfriPay', href: '#project-afripay' },
      { label: 'Tech Chantier bootcamp', href: '#achievements' },
      { label: 'DIGISOL', href: '#experience' },
    ],
  },
  {
    index: '00-5',
    title: 'People',
    skills: ['Leadership & teamwork', 'Communication', 'Project management', 'Mentoring', 'Event operations'],
    proofs: [
      { label: 'AWS Cloud Club UB', href: '#community' },
      { label: 'GDG on Campus UB', href: '#community' },
      { label: 'Hult Prize UB', href: '#community' },
      { label: 'AWS Community Day', href: '#community' },
    ],
  },
];

export const alsoSkills = [
  'Programming & data: C, C++, Java, Python (NumPy, scikit-learn, PyMySQL, Jupyter)',
  'Quality: Behaviour-Driven Development (Cucumber, Gherkin)',
];

export type Project = {
  slug: string;
  name: string;
  period: string;
  problem: string;
  role: string;
  stack: string[];
  decisions: string;
  outcome: string;
  links: { label: string; href: string }[];
  learning: boolean;
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: 'his',
    name: 'Healthcare Information System on AWS',
    period: 'May – Jul 2026',
    problem:
      '"Design and Implementation of a Scalable Cloud-Based Architecture for Healthcare Data Collection, Processing and Virtualisation" — clinical data from several hospitals, managed in one system.',
    role: 'Solo project.',
    stack: ['React', 'AWS Lambda', 'Amazon RDS', 'Amazon Cognito', 'AWS CDK'],
    decisions: 'Serverless functions on AWS Lambda, relational data in Amazon RDS, sign-in and role-based access with Amazon Cognito, infrastructure defined in AWS CDK.',
    outcome: 'A multi-hospital clinical management system: patient records, lab results, analytics and role-based access.',
    links: [{ label: 'Demo video', href: 'https://drive.google.com/file/d/1yzI4BuCMItVMBluur4mY0p3v2MI3mXcx/view?usp=sharing' }],
    learning: false,
    tags: ['AWS', 'Serverless', 'Healthcare'],
  },
  {
    slug: 'dailyreport-ai',
    name: 'DailyReport AI',
    period: 'Jul 2026 – present',
    problem: 'Raw daily work notes are not a report anyone wants to read.',
    role: 'Builder (in progress).',
    stack: ['AI', 'Serverless AWS', 'PDF generation'],
    decisions: 'Runs on serverless AWS infrastructure.',
    outcome: 'An AI-powered web app that turns raw daily work notes into branded, professional PDF reports.',
    links: [{ label: 'Repo', href: 'https://github.com/Joshua4-0p/Daily_Report_Generator' }],
    learning: false,
    tags: ['AI', 'Serverless'],
  },
  {
    slug: 'afripay',
    name: 'AfriPay',
    period: 'May 2025 – present',
    problem: 'Cross-border payments for merchants across Africa.',
    role: 'Builder (in progress).',
    stack: ['Next.js', 'Tailwind CSS', 'Node.js', 'Express'],
    decisions: 'Merchant payments go through the Nkwa Pay aggregator; a blockchain-based wallet handles user ↔ merchant transfers.',
    outcome: 'Live web app for merchant payments across Africa.',
    links: [{ label: 'Live site', href: 'https://afripay-kappa.vercel.app/' }],
    learning: false,
    tags: ['Fintech', 'Full-stack'],
  },
  {
    slug: 'docusmart',
    name: 'DocuSmart',
    period: 'Jun 2026 – present',
    problem: 'Career documents built for the Cameroonian and Central-West African market.',
    role: 'Builder (in progress).',
    stack: ['AI'],
    decisions: 'An AI-powered builder for CVs, cover letters and portfolios.',
    outcome: 'In progress. The repo is private for now.',
    links: [],
    learning: false,
    tags: ['AI', 'Product'],
  },
  {
    slug: 'apache-nagios',
    name: 'Apache hardening + Nagios monitoring',
    period: 'Nov 2024 – Jan 2025',
    problem: 'A public web server has to stay secure and its health has to be visible.',
    role: 'Learning project.',
    stack: ['Apache', 'Ubuntu', 'SSL/TLS', 'Nagios'],
    decisions: 'Apache on Ubuntu with SSL certificates and security hardening; Nagios watches it.',
    outcome: 'Monitoring of uptime, traffic and server health.',
    links: [],
    learning: true,
    tags: ['Linux', 'Security', 'Monitoring'],
  },
  {
    slug: 'talking-drum',
    name: 'This portfolio — The Talking Drum',
    period: 'Nov 2026',
    problem: 'A portfolio that is also a working AWS messaging system.',
    role: 'Design, build and deploy.',
    stack: ['Next.js', 'AWS Amplify Hosting', 'Amazon API Gateway', 'AWS Lambda', 'Amazon DynamoDB', 'Amazon SNS', 'Amazon CloudWatch Synthetics', 'AWS CDK'],
    decisions: 'Static Next.js site on AWS Amplify Hosting; the Drum Telegraph runs on API Gateway + Lambda + DynamoDB + SNS; monitored by CloudWatch Synthetics; infrastructure in AWS CDK.',
    outcome: 'Play the drum below and your rhythm is published through Amazon SNS.',
    links: [{ label: 'Repo', href: REPO }],
    learning: false,
    tags: ['AWS', 'Serverless', 'Creative'],
  },
];

export const moreProjects = [
  'Microfinance customer segmentation with K-means (Python, Nov 2024 – Feb 2025)',
  'Behaviour-Driven Development with Cucumber (Nov 2024 – Feb 2025)',
];

export const achievements: { name: string; issuer: string; date: string; href?: string }[] = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Oct 2026', href: 'https://www.credly.com/badges/b7d15f04-a22c-493a-8009-329815d638e9' },
  { name: '3rd place — Dev War', issuer: 'Hustlers Community', date: '' },
  { name: '5G Basics', issuer: 'Huawei', date: '31 May 2025', href: 'https://www.credly.com/badges/47b51132-394c-49cf-93b6-74631061a79a/public_url' },
  { name: 'Development and Basic Concepts of Cloud Computing', issuer: 'Huawei', date: '6 Jun 2025', href: 'https://www.credly.com/badges/2dfc4b74-def6-41ba-ab25-15400b04c638' },
  { name: 'React & React Native Bootcamp 2024, Cohort 4', issuer: 'Tech Chantier', date: 'Apr 2025' },
  { name: 'Spoken English', issuer: 'GreatLearning Academy', date: 'Sep 2023' },
];

export const community: { org: string; role: string; period: string; summary: string }[] = [
  {
    org: 'AWS Student Builder Group, University of Buea (AWS Cloud Club UB)',
    role: 'Core team · volunteer & onsite lead',
    period: 'Nov 2025 – Nov 2026',
    summary: 'Recruits, trains and manages volunteers; runs onsite operations; moderates a 500+ member WhatsApp community.',
  },
  {
    org: 'AWS Community Day Cameroon',
    role: 'Event logistics & operations volunteer',
    period: '2025 – 2026',
    summary: 'Volunteer since the 2nd edition (2025); again at AWS Community Day Cameroon 2026, Yaoundé, 25 July 2026 (logistics, attendee check-in).',
  },
  {
    org: 'PyCon Cameroon 2026',
    role: 'Event logistics & operations volunteer',
    period: '17–19 Sep 2026',
    summary: 'The first PyCon Cameroon, Yaoundé.',
  },
  {
    org: 'GDG on Campus University of Buea',
    role: 'Core team · Education team',
    period: 'Oct 2025 – present',
    summary: 'Runs workshops and training sessions on campus.',
  },
  {
    org: 'Hult Prize at University of Buea',
    role: 'Core organizing team',
    period: 'Oct 2025 – present',
    summary: 'Organizes the Hult Prize on campus.',
  },
  {
    org: 'Orange Digital Center Club, Buea',
    role: 'Onsite sessions with AWS Cloud Club UB',
    period: 'Jan 2026',
    summary: 'Hands-on cloud sessions for students.',
  },
];

export const talks: { title: string; host: string; date: string; format: string }[] = [
  {
    title: 'The Unbreakable Cloud — Observability & Disaster Recovery on AWS',
    host: 'Cloud Builders Africa × educloud academy',
    date: '31 Oct 2026',
    format: 'Guest speaker, online — security on AWS (KMS, Secrets Manager, Security Groups, NACLs) and HA & DR patterns',
  },
];

export const writing: { title: string; date: string; href: string }[] = [
  {
    title: 'When Your Data Breaks on AWS (HA & DR Part 1): Aurora Backtrack, Idempotency, and the Delta Problem',
    date: '5 Nov 2026',
    href: 'https://dev.to/joshuaer/when-your-data-breaks-on-aws-ha-dr-part-1-aurora-backtrack-idempotency-and-the-delta-problem-o14',
  },
  {
    title: 'Getting Started with AWS CDK: Build a Serverless API with DynamoDB, Lambda, and API Gateway in Python',
    date: '19 Aug 2026',
    href: 'https://dev.to/joshuaer/getting-started-with-aws-cdk-build-a-serverless-api-with-dynamodb-lambda-and-api-gateway-in-4l66',
  },
  {
    title: 'Building a Serverless CRUD API on AWS with JavaScript (Lambda + DynamoDB + API Gateway)',
    date: '13 Aug 2026',
    href: 'https://dev.to/joshuaer/building-a-serverless-crud-api-on-aws-with-javascript-lambda-dynamodb-api-gateway-3ep1',
  },
];

export const photos: { src: string; alt: string; caption: string }[] = [
  { src: '/images/odc-talk-1', alt: 'Josue presenting a cloud session to students at Orange Digital Center Club, Buea', caption: 'Orange Digital Center Club, Buea — Jan 2026' },
  { src: '/images/odc-talk-2', alt: 'Josue speaking during an onsite session at Orange Digital Center Club, Buea', caption: 'Onsite session with AWS Cloud Club UB — Jan 2026' },
  { src: '/images/odc-talk-3', alt: 'Josue teaching in the computer lab at Orange Digital Center Club, Buea', caption: 'Teaching at ODC Club, Buea — Jan 2026' },
  { src: '/images/community-day-2026', alt: 'A group of volunteers holding educloud academy T-shirts at AWS Community Day Cameroon 2026, Yaoundé', caption: 'AWS Community Day Cameroon, Yaoundé — 25 Jul 2026' },
  { src: '/images/community-day-booth', alt: 'Standing between the AWS Community Day Cameroon and AWS User Groups Douala banners at the booth', caption: 'AWS Community Day Cameroon booth — 2026' },
];

export const DRUM_MESSAGES: readonly string[] = [
  "I started drumming in Lower Sixth. Years later I'm still sending messages, now they travel through the cloud.",
  'Guitar came later: I started learning it in Level 300 at the University of Buea.',
  'Before I wrote code, I drew cartoons and manga.',
  'Bafoussam, after classes: FIFA matches with friends, then GTA 5 tournaments.',
  'Upper Sixth biology in Dschang: dissecting a fish, a rabbit, a fowl to see how each organ does its job.',
  "My parents spoke French and English at home, and I've studied in the English section since childhood. Bilingual by default.",
  'My first code: C in Level 200, on Code::Blocks. Switch-case and for-loops beat me, until they didn\'t. Next day I was first to the board.',
  "I'm onsite lead of the AWS Student Builder Group at UB: 500+ members, one WhatsApp group, a lot of messages delivered.",
] as const;

export const PUNCHLINE =
  'Before SNS, there was the drum. Drummer = publisher, rhythm = message, villages = subscribers. I build the modern version on AWS →';
export const SECRET_PHRASE = 'LLHL';
export const CULTURAL_FRAMING = 'inspired by the talking-drum and slit-drum traditions of Cameroon and West & Central Africa';
export const LAST_UPDATED = '6 Nov 2026';
// Live Amplify URL (Task 4 sets it; also used by canonical, OG, sitemap).
export const SITE_URL = 'https://example.amplifyapp.com';
