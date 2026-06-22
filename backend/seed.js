require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const Admin = require('./models/Admin');
const Hero = require('./models/Hero');
const AboutPage = require('./models/AboutPage');
const AboutSkills = require('./models/AboutSkills');
const SkillCategory = require('./models/SkillCategory');
const Certification = require('./models/Certification');
const Project = require('./models/Project');
const ContactSettings = require('./models/ContactSettings');
const FooterSettings = require('./models/FooterSettings');
const SiteSettings = require('./models/SiteSettings');

async function ensureAdminSeed() {
  try {
    const count = await Admin.count();
    if (count > 0) return;

    const name     = process.env.ADMIN_NAME     || 'Admin';
    const email    = (process.env.ADMIN_EMAIL   || 'admin@portfolio.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.create({ name, email, passwordHash });
    console.log(`👤 Default admin created — email: ${email}`);
    console.log('   Log in at /admin/login, then change the password from Settings.');
  } catch (err) {
    console.error('⚠️  Admin seed check failed:', err.message);
  }
}

async function seedContent() {
  // hero
  const hero = await Hero.get();
  if (!hero) {
    await Hero.update({
      staticHeading:       "Hi, I'm Asadullah Khan",
      typewriterTexts:     ['Full-Stack Developer', 'React Specialist', 'UI/UX Enthusiast', 'Problem Solver'],
      paragraphText:       'I build modern, responsive, and scalable web applications using cutting-edge technologies.',
      skills:              ['React', 'Node.js', 'Tailwind CSS', 'MySQL', 'Express', 'Framer Motion'],
      heroImage:           'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop',
      cvDoc:               '#',
      aboutPreviewHeading: 'About Me',
      aboutPreviewText:    "I'm a passionate full-stack developer with 5+ years of experience crafting digital experiences.",
      aboutPreviewImage:   'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    });
    console.log('  ↳ seeded hero');
  }

  // about page
  const aboutPage = await AboutPage.get();
  if (!aboutPage) {
    await AboutPage.update({
      aboutPageParagraphs: [
        "I'm Asadullah Khan, a full-stack developer based in Karachi, Pakistan.",
        "Over the years I've collaborated with startups and agencies, shipping production software.",
        "When I'm not coding, you'll find me exploring open-source projects.",
      ],
      aboutPageSkills:  ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'PostgreSQL', 'Tailwind CSS'],
      cvAttachmentUrl:  '#',
    });
    console.log('  ↳ seeded about page');
  }

  // about skills intro
  const intro = await AboutSkills.getIntro();
  if (!intro) {
    await AboutSkills.updateIntro('A curated overview of the technologies, frameworks, and tools I use day to day.');
    console.log('  ↳ seeded about skills intro');
  }

  // skill categories
  const cats = await SkillCategory.findAll();
  if (cats.length === 0) {
    const categories = [
      { categoryName: 'Frontend Development', categoryDescription: 'Building responsive, accessible UIs.', subSkills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript'] },
      { categoryName: 'Backend Development',  categoryDescription: 'Designing scalable APIs.',             subSkills: ['Node.js', 'Express', 'NestJS', 'REST', 'GraphQL', 'JWT'] },
      { categoryName: 'Databases',            categoryDescription: 'Modeling and querying data stores.',   subSkills: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Prisma'] },
      { categoryName: 'Tools & DevOps',       categoryDescription: 'Shipping software with confidence.',   subSkills: ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'AWS', 'Linux'] },
    ];
    for (const cat of categories) await SkillCategory.create(cat);
    console.log('  ↳ seeded skill categories');
  }

  // certifications
  const certs = await Certification.findAll();
  if (certs.length === 0) {
    const certsData = [
      { title: 'Meta Front-End Developer',       issuer: 'Meta / Coursera',       duration: 'Jan 2024 — Jun 2024', certificateImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=500&fit=crop', pdfDocument: '#' },
      { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', duration: 'Aug 2023',            certificateImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop', pdfDocument: '#' },
      { title: 'Full-Stack Web Development',     issuer: 'freeCodeCamp',          duration: '2022',                certificateImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop', pdfDocument: '#' },
    ];
    for (const cert of certsData) await Certification.create(cert);
    console.log('  ↳ seeded certifications');
  }

  // projects
  const projects = await Project.findAll();
  if (projects.length === 0) {
    const projectsData = [
      { title: 'E-Commerce Platform',   description: 'A scalable storefront with cart, checkout, and admin.',  technologies: ['React', 'Node.js', 'MySQL'],         projectImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true,  projectCategory: 'Web App' },
      { title: 'Portfolio CMS',         description: 'Headless CMS to manage portfolio content.',               technologies: ['Next.js', 'Express', 'PostgreSQL'],   projectImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true,  projectCategory: 'Web App' },
      { title: 'Realtime Chat App',     description: 'WebSocket-powered chat with rooms.',                      technologies: ['React', 'Socket.io', 'Redis'],        projectImage: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=400&fit=crop', detailsLink: '#', isRecent: true,  projectCategory: 'Web App' },
      { title: 'Analytics Dashboard',  description: 'Interactive charts and KPIs for SaaS metrics.',           technologies: ['React', 'D3', 'Express'],             projectImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Dashboard' },
      { title: 'Brand Landing Page',   description: 'High-converting landing page with animations.',            technologies: ['React', 'Tailwind', 'Framer'],        projectImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', detailsLink: '#', isRecent: false, projectCategory: 'Landing Page' },
    ];
    for (const p of projectsData) await Project.create(p);
    console.log('  ↳ seeded projects');
  }

  // contact settings
  const contact = await ContactSettings.get();
  if (!contact) {
    await ContactSettings.update({
      contactSubtitle:  "Have a project in mind? Let's build something amazing together.",
      availabilityText: 'Currently available for freelance work and full-time opportunities.',
      adminEmail:       'asadullah@example.com',
      adminPhone:       '+92 300 1234567',
      adminLocation:    'Karachi, Pakistan',
      linkedinUrl:      'https://linkedin.com/in/asadullahkhan',
      githubUrl:        'https://github.com/asadullahkhan',
    });
    console.log('  ↳ seeded contact settings');
  }

  // footer settings
  const footer = await FooterSettings.get();
  if (!footer) {
    await FooterSettings.update({
      footerSummaryText: 'Full-stack developer building modern web experiences with care, speed, and craft.',
      footerSkillsList:  ['React', 'Node.js', 'MongoDB', 'Tailwind', 'Express', 'Next.js', 'TypeScript', 'Docker'],
      joinUsLinks:       [
        { label: 'LinkedIn', url: 'https://linkedin.com/in/asadullahkhan' },
        { label: 'GitHub',   url: 'https://github.com/asadullahkhan' },
        { label: 'Email',    url: 'mailto:asadullah@example.com' },
      ],
    });
    console.log('  ↳ seeded footer settings');
  }

  // site settings
  const site = await SiteSettings.get();
  if (!site) {
    await SiteSettings.update({
      siteName:              'Asadullah Khan — Portfolio',
      siteTagline:           'Full-Stack Developer',
      seoDescription:        'Personal portfolio of Asadullah Khan — full-stack developer.',
      favicon:               '/favicon.ico',
      adminEmail:            'admin@portfolio.com',
      projectsPageIntroText: 'A selection of work spanning web apps, mobile, dashboards, and landing pages.',
    });
    console.log('  ↳ seeded site settings');
  }
}

if (require.main === module) {
  (async () => {
    await connectDB();
    console.log('🌱 Seeding database...');
    await ensureAdminSeed();
    await seedContent();
    console.log('✅ Seed complete.');
    process.exit(0);
  })().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { ensureAdminSeed, seedContent };
