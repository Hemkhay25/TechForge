export type Skill = {
  slug: string;
  title: string;
  category: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  commitment: string;
  icon: string;
  color: string;
};

export type LearningPath = {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  icon: string;
  color: string;
  modules: { title: string; lessons: string[] }[];
};

export const categories = [
  { name: "Software & Web", icon: "</>", color: "mint", count: "Build for the web" },
  { name: "Data & AI", icon: "⌘", color: "violet", count: "Find patterns in data" },
  { name: "Design & Creativity", icon: "◒", color: "coral", count: "Create useful experiences" },
  { name: "Cybersecurity & IT", icon: "⌑", color: "blue", count: "Keep systems resilient" },
  { name: "Cloud & Infrastructure", icon: "☁", color: "amber", count: "Power modern technology" },
  { name: "Digital Business", icon: "↗", color: "pink", count: "Grow ideas online" },
];

export const skills: Skill[] = [
  { slug: "frontend-development", title: "Frontend development", category: "Software & Web", description: "Build the interfaces people use every day with HTML, CSS, JavaScript, and modern frameworks.", level: "Beginner", commitment: "6–9 months", icon: "</>", color: "mint" },
  { slug: "backend-development", title: "Backend development", category: "Software & Web", description: "Design the APIs, data models, and services that make applications work behind the scenes.", level: "Beginner", commitment: "8–12 months", icon: "{ }", color: "blue" },
  { slug: "ui-ux-design", title: "UI/UX design", category: "Design & Creativity", description: "Research user needs and turn them into clear, accessible digital experiences.", level: "Beginner", commitment: "4–7 months", icon: "◒", color: "coral" },
  { slug: "data-analysis", title: "Data analysis", category: "Data & AI", description: "Use spreadsheets, SQL, and visualisation to answer practical questions with data.", level: "Beginner", commitment: "4–8 months", icon: "⌁", color: "violet" },
  { slug: "cybersecurity", title: "Cybersecurity", category: "Cybersecurity & IT", description: "Learn defensive security fundamentals, risk awareness, and how to protect systems.", level: "Beginner", commitment: "8–12 months", icon: "⌑", color: "amber" },
  { slug: "cloud-computing", title: "Cloud computing", category: "Cloud & Infrastructure", description: "Understand cloud platforms, networking, deployment, and reliable infrastructure.", level: "Intermediate", commitment: "6–10 months", icon: "☁", color: "blue" },
  { slug: "mobile-development", title: "Mobile development", category: "Software & Web", description: "Create useful apps for phones and tablets, from interface to release.", level: "Intermediate", commitment: "6–10 months", icon: "▯", color: "pink" },
  { slug: "digital-marketing", title: "Digital marketing", category: "Digital Business", description: "Plan ethical digital campaigns and measure what helps an audience take action.", level: "Beginner", commitment: "3–6 months", icon: "↗", color: "coral" },
];

export const paths: LearningPath[] = [
  {
    slug: "web-development-foundations", title: "Web development foundations", description: "Go from your first line of HTML to publishing a responsive, accessible website.", category: "Software & Web", level: "Beginner", duration: "12 weeks", lessons: 18, icon: "</>", color: "mint",
    modules: [
      { title: "How the web works", lessons: ["The internet and the web", "Set up your workspace", "Your first HTML page"] },
      { title: "Structure and style", lessons: ["Semantic HTML", "CSS fundamentals", "Responsive layouts"] },
      { title: "Make it interactive", lessons: ["JavaScript essentials", "Events and the DOM", "Accessible interactions"] },
      { title: "Build and share", lessons: ["Plan a small project", "Test your website", "Publish your work"] },
    ],
  },
  {
    slug: "data-analysis-starter", title: "Data analysis starter", description: "Ask better questions, work with tidy datasets, and communicate findings with confidence.", category: "Data & AI", level: "Beginner", duration: "10 weeks", lessons: 15, icon: "⌁", color: "violet",
    modules: [
      { title: "Think with data", lessons: ["Questions and evidence", "Data types and quality", "Spreadsheets that help"] },
      { title: "Query and explore", lessons: ["SQL foundations", "Filtering and grouping", "Find a useful pattern"] },
      { title: "Tell the story", lessons: ["Choose a clear chart", "Explain your findings", "Publish a portfolio case study"] },
    ],
  },
  {
    slug: "product-design-basics", title: "Product design basics", description: "Explore a user-centred design process and make a thoughtful prototype.", category: "Design & Creativity", level: "Beginner", duration: "8 weeks", lessons: 12, icon: "◒", color: "coral",
    modules: [
      { title: "Understand people", lessons: ["What product design solves", "Interview with care", "Map a user journey"] },
      { title: "Shape an idea", lessons: ["Sketch possible solutions", "Wireframes and hierarchy", "Design for accessibility"] },
      { title: "Test and improve", lessons: ["Build a prototype", "Run a usability session", "Share a design case study"] },
    ],
  },
  {
    slug: "cybersecurity-first-steps", title: "Cybersecurity first steps", description: "Build safe, defensive security habits and learn the language of digital protection.", category: "Cybersecurity & IT", level: "Beginner", duration: "10 weeks", lessons: 14, icon: "⌑", color: "amber",
    modules: [
      { title: "Security mindset", lessons: ["Threats and risk", "Protect personal accounts", "Responsible security practice"] },
      { title: "Systems and networks", lessons: ["Operating system basics", "Network fundamentals", "Logs and signals"] },
      { title: "Defend and communicate", lessons: ["Security hygiene checklist", "Incident response basics", "Write a clear security report"] },
    ],
  },
  {
    slug: "backend-api-fundamentals", title: "Backend and API fundamentals", description: "Understand how servers, APIs, and databases support modern applications.", category: "Software & Web", level: "Beginner", duration: "12 weeks", lessons: 16, icon: "{ }", color: "blue",
    modules: [
      { title: "Server-side thinking", lessons: ["Requests and responses", "HTTP in practice", "Design an API"] },
      { title: "Work with data", lessons: ["Relational data basics", "Write safe queries", "Validate input"] },
      { title: "Build responsibly", lessons: ["Authentication concepts", "Test an API", "Deploy and monitor"] },
    ],
  },
  {
    slug: "cloud-computing-essentials", title: "Cloud computing essentials", description: "Learn the building blocks behind cloud platforms, deployment, and reliability.", category: "Cloud & Infrastructure", level: "Intermediate", duration: "9 weeks", lessons: 13, icon: "☁", color: "blue",
    modules: [
      { title: "Cloud concepts", lessons: ["What cloud services provide", "Regions and availability", "Shared responsibility"] },
      { title: "Deploy thoughtfully", lessons: ["Compute and storage", "Networking basics", "Configuration and secrets"] },
      { title: "Operate reliably", lessons: ["Observe a service", "Backups and recovery", "Cost-aware design"] },
    ],
  },
];

export const projects = [
  { slug: "personal-portfolio", title: "A personal portfolio that tells your story", category: "Software & Web", level: "Beginner", effort: "1–2 weeks", description: "Create an accessible portfolio site with a clear introduction, selected work, and contact details.", skills: ["HTML", "CSS", "Responsive design"], outcome: "A published portfolio you can keep improving." },
  { slug: "community-data-story", title: "A community data story", category: "Data & AI", level: "Beginner", effort: "1 week", description: "Choose a public dataset, ask a focused question, and explain one useful finding with a chart.", skills: ["Spreadsheets", "Data cleaning", "Visualisation"], outcome: "A short, evidence-led case study." },
  { slug: "accessible-signup-flow", title: "An accessible sign-up flow", category: "Design & Creativity", level: "Beginner", effort: "1–2 weeks", description: "Design and test a simple account creation journey, including clear form feedback.", skills: ["User research", "Wireframes", "Accessibility"], outcome: "A prototype with documented usability improvements." },
  { slug: "security-habits-guide", title: "A practical security habits guide", category: "Cybersecurity & IT", level: "Beginner", effort: "3–5 days", description: "Create a plain-language guide to safer account and device practices for a chosen audience.", skills: ["Threat awareness", "Research", "Communication"], outcome: "A useful defensive security checklist." },
  { slug: "api-reading-list", title: "A small reading-list API", category: "Software & Web", level: "Intermediate", effort: "2–3 weeks", description: "Plan an API for saving and organising reading links, with validation and clear error responses.", skills: ["HTTP", "Data modelling", "Testing"], outcome: "A documented API design or working prototype." },
];

export const faqs = [
  { question: "Do I need previous experience to start?", answer: "No. Several learning paths begin with the fundamentals. Each path describes its level and expected commitment so you can choose a sensible starting point." },
  { question: "Is TechForge free to use?", answer: "The public skill guides and free learning content are available at no charge. Paid plans are not currently configured, and this site does not collect subscription payments." },
  { question: "Will completing a path guarantee me a job?", answer: "No. Learning can help you build skills and evidence of your work, but employment outcomes depend on many factors and are never guaranteed." },
  { question: "How much time should I set aside?", answer: "Every path gives an estimated duration. Your pace will vary; consistent practice matters more than rushing through lessons." },
];

export const findSkill = (slug: string) => skills.find((skill) => skill.slug === slug);
export const findPath = (slug: string) => paths.find((path) => path.slug === slug);
