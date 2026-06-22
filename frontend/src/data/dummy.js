// Fallback data — used for instant first paint and as a safety net if the
// API is unreachable or a table hasn't been seeded yet. Once the backend
// responds, components replace this with the real data from MySQL. Edit
// content from the Admin Dashboard, not here.
export const hero = {
  staticHeading: "Hi, I'm Asadullah Khan",
  typewriterTexts: ['Full-Stack Developer', 'React Specialist', 'UI/UX Enthusiast', 'Problem Solver'],
  paragraphText:
    "I build modern, responsive, and scalable web applications using cutting-edge technologies. Passionate about clean code, beautiful interfaces, and exceptional user experiences.",
  skills: ['React', 'Node.js', 'Tailwind CSS', 'MySQL', 'Express', 'Framer Motion'],
  heroImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop',
  cvDoc: '#',
}

export const aboutPreview = {
  aboutPreviewImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
  aboutPreviewHeading: 'About Me',
  aboutPreviewText:
    "I'm a passionate full-stack developer with 5+ years of experience crafting digital experiences. I love turning complex problems into simple, beautiful solutions.",
}

export const aboutPage = {
  aboutPageParagraphs: [
    "I'm Asadullah Khan, a full-stack developer based in Karachi, Pakistan. I specialize in building modern web applications with React, Node.js, and MySQL.",
    "Over the years I've collaborated with startups and agencies, shipping production software that handles real users and real data. I care deeply about accessibility, performance, and developer experience.",
    "When I'm not coding, you'll find me exploring open-source projects, writing technical blogs, or contributing to the developer community.",
  ],
  aboutPageSkills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Git', 'Docker'],
  cvAttachmentUrl: '#',
}

export const skillsSection = {
  skillsIntroParagraph:
    'A curated overview of the technologies, frameworks, and tools I use day to day to build production-ready software.',
  skillsCategories: [
    {
      categoryName: 'Frontend Development',
      categoryDescription: 'Building responsive, accessible, and performant user interfaces.',
      subSkills: ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    },
    {
      categoryName: 'Backend Development',
      categoryDescription: 'Designing scalable APIs and server-side architectures.',
      subSkills: ['Node.js', 'Express', 'NestJS', 'REST', 'GraphQL', 'JWT'],
    },
    {
      categoryName: 'Databases',
      categoryDescription: 'Modeling, querying, and optimizing relational and document data stores.',
      subSkills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma'],
    },
    {
      categoryName: 'Tools & DevOps',
      categoryDescription: 'Shipping software with confidence.',
      subSkills: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'AWS', 'Linux'],
    },
  ],
}

export const certifications = [
  {
    id: 1,
    title: 'Meta Front-End Developer',
    issuer: 'Meta / Coursera',
    duration: 'Jan 2024 — Jun 2024',
    certificateImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=500&fit=crop',
    pdfDocument: '#',
  },
  {
    id: 2,
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    duration: 'Aug 2023',
    certificateImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
    pdfDocument: '#',
  },
  {
    id: 3,
    title: 'Full-Stack Web Development',
    issuer: 'freeCodeCamp',
    duration: '2022',
    certificateImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop',
    pdfDocument: '#',
  },
]

export const projects = [
  { id: 1, title: 'E-Commerce Platform', description: 'A scalable storefront with cart, checkout, and admin dashboard.', technologies: ['React', 'Node.js', 'MySQL'], projectImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true, projectCategory: 'Web App' },
  { id: 2, title: 'Portfolio CMS', description: 'Headless CMS to manage portfolio content via admin panel.', technologies: ['Next.js', 'Express', 'PostgreSQL'], projectImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true, projectCategory: 'Web App' },
  { id: 3, title: 'Realtime Chat App', description: 'WebSocket-powered chat with rooms and presence indicators.', technologies: ['React', 'Socket.io', 'Redis'], projectImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true, projectCategory: 'Web App' },
  { id: 4, title: 'Fitness Tracker Mobile', description: 'Cross-platform mobile app for tracking workouts.', technologies: ['React Native', 'Firebase'], projectImage: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Mobile' },
  { id: 5, title: 'Brand Landing Page', description: 'High-converting landing page with animations.', technologies: ['React', 'Tailwind', 'Framer'], projectImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Landing Page' },
  { id: 6, title: 'Analytics Dashboard', description: 'Interactive charts and KPIs for SaaS metrics.', technologies: ['React', 'D3', 'Express'], projectImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Dashboard' },
  { id: 7, title: 'Restaurant Booking', description: 'Online table reservation with admin scheduling.', technologies: ['Vue', 'Node.js'], projectImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Web App' },
  { id: 8, title: 'Marketing Site', description: 'Static marketing site for a SaaS product.', technologies: ['Astro', 'Tailwind'], projectImage: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Landing Page' },
  { id: 9, title: 'Admin Console', description: 'Internal admin tool with role-based access.', technologies: ['React', 'NestJS', 'PostgreSQL'], projectImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Dashboard' },
]

export const contact = {
  contactSubtitle: "Have a project in mind? Let's build something amazing together.",
  availabilityText: "Currently available for freelance work and full-time opportunities.",
  adminEmail: 'asadullah@example.com',
  adminPhone: '+92 300 1234567',
  adminLocation: 'Karachi, Pakistan',
  linkedinUrl: 'https://linkedin.com/in/asadullahkhan',
  githubUrl: 'https://github.com/asadullahkhan',
}

export const projectsPage = {
  projectsPageIntroText: 'A selection of work spanning web apps, mobile, dashboards, and landing pages.',
}

export const footer = {
  footerSummaryText: 'Full-stack developer building modern web experiences with care, speed, and craft.',
  footerSkillsList: ['React', 'Node.js', 'MySQL', 'Tailwind', 'Express', 'Next.js', 'TypeScript', 'Docker', 'AWS', 'Git'],
}
