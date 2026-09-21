import type { TPortfolio, TSectionId } from "@/types/portfolio";

export const SECTION_LABELS: Record<TSectionId, string> = {
  hero: "00 / CORE",
  work: "01 / WORK",
  experience: "02 / EXPERIENCE",
  capabilities: "03 / WHAT I WORK ON",
  about: "04 / ABOUT",
  contact: "05 / CONTACT",
};

export const portfolio: TPortfolio = {
  name: "Mohammad Almokdad",
  shortName: "MA",
  role: "Software Engineer",
  email: "almekdad.mohammad@gmail.com",
  phone: "+962 797 584 652",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammad-almokdad.vercel.app",
  resumePath: "/resume/Mohammad_Almokdad_Resume.pdf",
  whatsappUrl: "https://wa.me/962797584652",
  availability:
    "Open to software engineering opportunities in Jordan & the Gulf · Selected freelance projects",
  status: "Available for the next challenge",
  hero: {
    eyebrow: "Mohammad Almokdad · Software Engineer",
    headline: ["I build products", "beyond the interface."],
    body: "Software Engineer with 5+ years building production web products across React, Next.js, Angular and Vue, with a strong focus on frontend and product engineering, plus experience across APIs, data, performance and responsive systems.",
    primaryCta: { label: "View selected work", href: "#work" },
    secondaryCta: { label: "Let’s talk", href: "#contact" },
  },
  work: {
    headline: "Selected work.",
    body: "A few product environments where the challenge went beyond building the interface.",
    items: [
      {
        id: "product-scale",
        index: "01",
        title: "Education products with real operational complexity",
        subtitle:
          "Jo Academy · ULA · Multi-tenant LMS & school management · International curriculum",
        summary:
          "Product engineering across Saudi and international-curriculum education products, with reusable frontend systems, complex permissions, multilingual RTL UX and API-driven workflows.",
        context:
          "Jo Academy’s products span different education environments, including ULA in Saudi Arabia, a multi-tenant learning management system (LMS) and school management platform, and an international-curriculum product.",
        workedOn:
          "Shipped production features and marketing-campaign work, built reusable patterns for forms, permissions, state/cache and API integration, and delivered bilingual Arabic/English experiences with RTL support alongside product, design, backend and marketing teams.",
        challenges:
          "Keeping complex workflows maintainable across different roles, products and business rules rather than solving each screen in isolation.",
        stack: [
          "React",
          "Next.js",
          "TypeScript",
          "TanStack Query",
          "REST APIs",
          "i18n / RTL",
        ],
        tags: [
          "Product engineering",
          "Reusable systems",
          "Permissions",
          "RTL / i18n",
          "API integration",
          "Cross-functional",
        ],
        note: "Performance, SEO and WCAG/accessibility work, plus reusable Cursor Agent Skills and team AI-assisted workflows that standardize recurring engineering tasks and reduce repetitive setup.",
      },
      {
        id: "international",
        index: "02",
        title: "Production engineering for a U.S. media client",
        subtitle: "Hearst · via Optimum Partners",
        summary:
          "Worked with Hearst teams on production web experiences where frontend architecture, performance, SEO, Core Web Vitals and API/data work all mattered.",
        context:
          "Optimum Partners placed me in distributed client environments, most notably with Hearst in the U.S.",
        workedOn:
          "Reusable React systems, responsive interfaces, performance and SEO improvements, backend APIs, database work, migrations and frontend/backend integration.",
        challenges:
          "Shipping against real production constraints while collaborating across company and client boundaries.",
        stack: [
          "React",
          "Performance",
          "Core Web Vitals",
          "SEO",
          "APIs",
          "PostgreSQL",
        ],
        tags: [
          "Hearst",
          "React",
          "Performance",
          "SEO",
          "Core Web Vitals",
          "APIs / data",
        ],
      },
      {
        id: "bunyan",
        index: "03",
        title: "Product UI for an AI inference platform",
        subtitle: "Bunyan · OmniOps",
        summary:
          "Built production interfaces across React and Vue for AI inference and cloud-product experiences, translating technically dense workflows into responsive, accessible, API-connected interfaces.",
        context:
          "At OmniOps, I worked on Bunyan and the inference-cloud product experience across both React and Vue surfaces.",
        workedOn:
          "Translated product and design requirements into production interfaces with responsive behavior, API integration and accessibility/WCAG considerations, working closely with design and backend teams.",
        challenges:
          "Making technically dense AI and inference workflows feel clear and usable without oversimplifying the product.",
        stack: ["React", "Vue.js", "TypeScript", "WCAG", "API integration"],
        tags: [
          "Product UI",
          "React",
          "Vue.js",
          "WCAG",
          "API integration",
        ],
      },
    ],
    earlierBuilds: {
      label: "Earlier builds",
      items: [
        {
          id: "landing-builder",
          title: "Landing Page Builder",
          summary:
            "A two-sided system with a CMS/builder for configurable page structure and a renderer that turns that configuration into public landing pages.",
          note: "CMS / Builder → configuration → renderer → landing page",
        },
        {
          id: "wird",
          title: "Wird — Admin Dashboard",
          summary:
            "Admin dashboard supporting competition operations from registration through results publication, including filtering, reporting and reusable UI modules.",
          href: "https://wird.app/",
        },
      ],
    },
  },
  experience: {
    headline: "Experience.",
    body: "Product teams, client environments and production systems across different stages of my career.",
    resumeCta: {
      label: "View résumé",
      href: "/resume/Mohammad_Almokdad_Resume.pdf",
    },
    items: [
      {
        id: "jo-academy",
        company: "Jo Academy",
        role: "Frontend Engineer",
        period: "Aug 2025 — Present",
        summary:
          "At Jo Academy I work across several education products — ULA in Saudi Arabia, a multi-tenant LMS and school management platform, and an international-curriculum product.",
        detail:
          "A large part of the work is building the shared systems underneath those features: reusable forms and workflows, roles and permissions, server state and caching, API integration, responsive Arabic/English interfaces and RTL behavior.",
        highlightLabel: "Beyond feature delivery",
        highlight:
          "Performance, SEO and WCAG/accessibility work, plus reusable Cursor Agent Skills and team AI-assisted workflows that standardize recurring engineering tasks and reduce repetitive setup.",
        tags: ["React", "Next.js", "TypeScript", "TanStack Query", "RTL / i18n"],
        visualWeight: "primary",
      },
      {
        id: "omniops",
        company: "OmniOps",
        role: "Frontend Engineer",
        period: "Oct 2024 — Jul 2025",
        summary:
          "At OmniOps I worked on Bunyan and the inference-cloud product across React and Vue, turning dense AI/inference workflows into clear, responsive, accessible interfaces.",
        detail:
          "I worked closely with design and backend teams on API-connected flows, responsive behavior and interfaces built against accessibility and WCAG criteria.",
        tags: ["React", "Vue.js", "TypeScript", "WCAG", "API integration"],
        visualWeight: "primary",
      },
      {
        id: "optimum",
        company: "Optimum Partners",
        role: "Software Engineer",
        period: "Dec 2021 — Oct 2024",
        summary:
          "Optimum mixed distributed client work including Hearst with React and Angular, plus performance, SEO, Core Web Vitals, backend APIs and database work. I also contributed to an internal CMS/workflow platform for a Saudi government client.",
        detail:
          "My work also crossed the frontend boundary into backend APIs, database work and migrations. Separately, I contributed within a small team to an internal CMS/workflow platform supporting operational processes for a Saudi government client.",
        highlightLabel: "Client",
        highlight: "Hearst · U.S.",
        tags: ["React", "Angular", "Core Web Vitals", "APIs", "PostgreSQL"],
        visualWeight: "primary",
      },
      {
        id: "ltuc",
        company: "LTUC / Abdul Aziz Al Ghurair School of Advanced Computing",
        role: "Teaching Assistant",
        period: "2021",
        summary:
          "Reviewed student work, led programming workshops and supported students with technical and career-readiness development.",
        tags: [],
        visualWeight: "secondary",
      },
    ],
  },
  capabilities: {
    headline: "What I work on.",
    body: "The areas where I tend to contribute most deeply.",
    items: [
      {
        id: "frontends",
        index: "01",
        title: "Product Frontends",
        summary:
          "Complex product interfaces: dashboards, workflows, forms, permissions, and multilingual UX.",
      },
      {
        id: "apis",
        index: "02",
        title: "Backend Engineering",
        summary:
          "Backend services and data work: REST/GraphQL integrations, authentication, schemas, migrations, and the data layer behind the UI.",
      },
      {
        id: "quality",
        index: "03",
        title: "Performance & Quality",
        summary:
          "Core Web Vitals, SEO, accessibility, and the production polish that keeps products usable.",
      },
    ],
  },
  about: {
    headline: "Good interfaces are only the visible layer.",
    paragraphs: [
      "I’m most useful where product, design and engineering overlap — turning ambiguous requirements into reusable systems that teams can maintain after launch. Current focus is React and Next.js, with professional Angular, Vue, and practical work across APIs, backend services and data.",
    ],
    principles: [
      {
        id: "understand",
        title: "Understand the product",
        body: "Solve the actual user and business problem first.",
      },
      {
        id: "reuse",
        title: "Build for reuse",
        body: "Make the next feature easier, not harder.",
      },
      {
        id: "ship",
        title: "Ship and refine",
        body: "Use production feedback to improve the system.",
      },
    ],
    stack: [
      {
        id: "frontend",
        title: "Frontend",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Angular",
          "Vue.js",
          "TanStack Query",
        ],
      },
      {
        id: "backend",
        title: "Backend & Data",
        items: ["Node.js", "Express", "FastAPI", "Flask", "PostgreSQL", "MongoDB"],
      },
      {
        id: "quality",
        title: "Quality",
        items: [
          "Performance",
          "Core Web Vitals",
          "SEO",
          "WCAG / Accessibility",
          "Testing",
          "i18n / RTL",
        ],
      },
    ],
  },
  contact: {
    headline: "Let’s work together.",
    body: "Open to software engineering opportunities in Jordan and across the Gulf, as well as selected freelance/product work.",
    paths: [
      {
        id: "hiring",
        title: "Hiring for your team?",
        body: "Full-time software engineering opportunities in Jordan and across the Gulf.",
        cta: "Discuss a role",
        subject: "Software Engineering Opportunity — Mohammad Almokdad",
        mailBody:
          "Hi Mohammad,\n\nI’d like to talk with you about a software engineering opportunity.",
      },
      {
        id: "project",
        title: "Have a product to build?",
        body: "Selected freelance and product-development work.",
        cta: "Discuss a project",
        subject: "Project Inquiry — Mohammad Almokdad",
        mailBody: "Hi Mohammad,\n\nI’d like to discuss a project with you.",
      },
    ],
  },
  footerNote: "Designed & engineered with care.",
  seo: {
    title:
      "Mohammad Almokdad — Software Engineer | React, Next.js & Product Engineering",
    description:
      "Software Engineer with 5+ years of experience building production web products across frontend architecture, APIs, data, performance and product delivery. Open to software engineering opportunities in Jordan and across the Gulf, as well as selected freelance projects.",
    keywords: [
      "Mohammad Almokdad",
      "Software Engineer",
      "Frontend Engineer",
      "React",
      "Next.js",
      "TypeScript",
      "Angular",
      "Product engineering",
      "Web performance",
    ],
  },
  nav: [
    { label: "Work", href: "#work", sectionId: "work" },
    { label: "Experience", href: "#experience", sectionId: "experience" },
    { label: "About", href: "#about", sectionId: "about" },
    { label: "Contact", href: "#contact", sectionId: "contact" },
  ],
  social: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/mohammad-al-mokdad/",
    },
    {
      label: "GitHub",
      href: "https://github.com/mohammadalmoqdad",
    },
  ],
  commands: [
    {
      id: "home",
      label: "Home",
      hint: "Back to intro",
      action: "section",
      sectionId: "hero",
    },
    {
      id: "work",
      label: "Selected Work",
      hint: "Case studies",
      action: "section",
      sectionId: "work",
    },
    {
      id: "experience",
      label: "Experience",
      hint: "Professional timeline",
      action: "section",
      sectionId: "experience",
    },
    {
      id: "capabilities",
      label: "What I Work On",
      hint: "Product, backend, quality",
      action: "section",
      sectionId: "capabilities",
    },
    {
      id: "about",
      label: "About",
      hint: "How I work",
      action: "section",
      sectionId: "about",
    },
    {
      id: "earlier-builds",
      label: "Earlier Builds",
      hint: "Inside selected work",
      action: "section",
      href: "#earlier-builds",
    },
    {
      id: "contact",
      label: "Contact",
      hint: "Start a conversation",
      action: "section",
      sectionId: "contact",
    },
    {
      id: "copy-email",
      label: "Copy Email",
      hint: "almekdad.mohammad@gmail.com",
      action: "copy-email",
    },
    {
      id: "resume",
      label: "Résumé",
      hint: "PDF",
      action: "resume",
      href: "/resume/Mohammad_Almokdad_Resume.pdf",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      hint: "linkedin.com/in/mohammad-al-mokdad",
      action: "link",
      href: "https://www.linkedin.com/in/mohammad-al-mokdad/",
    },
    {
      id: "github",
      label: "GitHub",
      hint: "github.com/mohammadalmoqdad",
      action: "link",
      href: "https://github.com/mohammadalmoqdad",
    },
  ],
};
