export type TSectionId =
  | "hero"
  | "work"
  | "experience"
  | "capabilities"
  | "about"
  | "contact";

export type TNavItem = {
  label: string;
  href: string;
  sectionId?: TSectionId;
};

export type TSocialLink = {
  label: string;
  href: string;
};

export type TCapability = {
  id: string;
  index: string;
  title: string;
  summary: string;
};

export type TContactPath = {
  id: string;
  title: string;
  body: string;
  cta: string;
  subject: string;
  mailBody: string;
};

export type TExperienceItem = {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  tags: string[];
  visualWeight: "primary" | "secondary";
  detail?: string;
  highlightLabel?: string;
  highlight?: string;
};

export type TCaseStudy = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  context: string;
  workedOn: string;
  challenges: string;
  stack: string[];
  tags: string[];
  note?: string;
};

export type TPersonalBuild = {
  id: string;
  title: string;
  summary: string;
  note?: string;
  href?: string;
};

export type TSkillGroup = {
  id: string;
  title: string;
  items: string[];
};

export type TPrinciple = {
  id: string;
  title: string;
  body: string;
};

export type TCommandItem = {
  id: string;
  label: string;
  hint: string;
  action: "section" | "email" | "copy-email" | "resume" | "link";
  href?: string;
  sectionId?: TSectionId;
};

export type TSeoConfig = {
  title: string;
  description: string;
  keywords: string[];
};

export type TCta = {
  label: string;
  href: string;
};

export type TPortfolio = {
  name: string;
  shortName: string;
  role: string;
  email: string;
  phone: string;
  siteUrl: string;
  resumePath: string;
  whatsappUrl: string;
  availability: string;
  status: string;
  hero: {
    eyebrow: string;
    headline: string[];
    body: string;
    primaryCta: TCta;
    secondaryCta: TCta;
  };
  work: {
    headline: string;
    body: string;
    items: TCaseStudy[];
    earlierBuilds: {
      label: string;
      items: TPersonalBuild[];
    };
  };
  experience: {
    headline: string;
    body: string;
    resumeCta: TCta;
    items: TExperienceItem[];
  };
  capabilities: {
    headline: string;
    body: string;
    items: TCapability[];
  };
  about: {
    headline: string;
    paragraphs: string[];
    principles: TPrinciple[];
    stack: TSkillGroup[];
  };
  contact: {
    headline: string;
    body: string;
    paths: TContactPath[];
  };
  footerNote: string;
  seo: TSeoConfig;
  nav: TNavItem[];
  social: TSocialLink[];
  commands: TCommandItem[];
};
