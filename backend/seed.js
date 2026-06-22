// Seeds the database so the site is never empty:
//  1. `ensureAdminSeed()` is imported by server.js and runs on every boot —
//     it creates the default admin (from .env) ONLY if the admins table is empty.
//  2. Running this file directly (`npm run seed`) additionally seeds example
//     content (hero, about, skills, certifications, projects, contact, footer,
//     site settings) — again, only into tables that are currently empty, so
//     it is safe to run more than once and will never overwrite real edits
//     made later from the Admin Dashboard.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool, testConnection } = require('./config/db');
const Admin = require('./models/Admin');

async function ensureAdminSeed() {
  try {
    const count = await Admin.count();
    if (count > 0) return;

    const name = process.env.ADMIN_NAME || 'Admin';
    const email = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const passwordHash = await bcrypt.hash(password, 10);

    await Admin.create({ name, email, passwordHash });
    console.log(`👤 Default admin created — email: ${email}`);
    console.log('   Log in at /admin/login, then change the password from Settings.');
  } catch (err) {
    console.error('⚠️  Admin seed check failed:', err.message);
  }
}

async function rowCount(table) {
  const [rows] = await pool.query(`SELECT COUNT(*) AS c FROM ${table}`);
  return rows[0].c;
}

async function seedContent() {
  // ---- hero_sections (+ home about-preview) ---------------------------
  if ((await rowCount('hero_sections')) === 0) {
    await pool.query(
      `INSERT INTO hero_sections
        (id, static_heading, typewriter_texts, paragraph_text, skills, hero_image, cv_doc,
         about_preview_heading, about_preview_text, about_preview_image)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Hi, I'm Asadullah Khan",
        JSON.stringify(['Full-Stack Developer', 'React Specialist', 'UI/UX Enthusiast', 'Problem Solver']),
        'I build modern, responsive, and scalable web applications using cutting-edge technologies. Passionate about clean code, beautiful interfaces, and exceptional user experiences.',
        JSON.stringify(['React', 'Node.js', 'Tailwind CSS', 'MySQL', 'Express', 'Framer Motion']),
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop',
        '#',
        'About Me',
        "I'm a passionate full-stack developer with 5+ years of experience crafting digital experiences. I love turning complex problems into simple, beautiful solutions.",
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      ]
    );
    console.log('  ↳ seeded hero_sections');
  }

  // ---- about_pages ------------------------------------------------------
  if ((await rowCount('about_pages')) === 0) {
    await pool.query(
      `INSERT INTO about_pages (id, paragraphs, skills, cv_attachment_url) VALUES (1, ?, ?, ?)`,
      [
        JSON.stringify([
          "I'm Asadullah Khan, a full-stack developer based in Karachi, Pakistan. I specialize in building modern web applications with React, Node.js, and MySQL.",
          "Over the years I've collaborated with startups and agencies, shipping production software that handles real users and real data. I care deeply about accessibility, performance, and developer experience.",
          "When I'm not coding, you'll find me exploring open-source projects, writing technical blogs, or contributing to the developer community.",
        ]),
        JSON.stringify(['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express', 'MySQL', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Git', 'Docker']),
        '#',
      ]
    );
    console.log('  ↳ seeded about_pages');
  }

  // ---- about_skills (intro) + skill_categories --------------------------
  if ((await rowCount('about_skills')) === 0) {
    await pool.query(`INSERT INTO about_skills (id, intro_paragraph) VALUES (1, ?)`, [
      'A curated overview of the technologies, frameworks, and tools I use day to day to build production-ready software.',
    ]);
    console.log('  ↳ seeded about_skills');
  }

  if ((await rowCount('skill_categories')) === 0) {
    const categories = [
      ['Frontend Development', 'Building responsive, accessible, and performant user interfaces.', ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'Framer Motion', 'TypeScript']],
      ['Backend Development', 'Designing scalable APIs and server-side architectures.', ['Node.js', 'Express', 'NestJS', 'REST', 'GraphQL', 'JWT']],
      ['Databases', 'Modeling, querying, and optimizing relational and document data stores.', ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma']],
      ['Tools & DevOps', 'Shipping software with confidence.', ['Git', 'GitHub Actions', 'Docker', 'Vercel', 'AWS', 'Linux']],
    ];
    for (let i = 0; i < categories.length; i++) {
      const [name, desc, subSkills] = categories[i];
      await pool.query(
        'INSERT INTO skill_categories (category_name, category_description, sub_skills, sort_order) VALUES (?, ?, ?, ?)',
        [name, desc, JSON.stringify(subSkills), i]
      );
    }
    console.log('  ↳ seeded skill_categories');
  }

  // ---- certifications -----------------------------------------------------
  if ((await rowCount('certifications')) === 0) {
    const certs = [
      ['Meta Front-End Developer', 'Meta / Coursera', 'Jan 2024 — Jun 2024', 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=500&fit=crop', '#'],
      ['AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Aug 2023', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop', '#'],
      ['Full-Stack Web Development', 'freeCodeCamp', '2022', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop', '#'],
    ];
    for (let i = 0; i < certs.length; i++) {
      const [title, issuer, duration, certificateImage, pdfDocument] = certs[i];
      await pool.query(
        'INSERT INTO certifications (title, issuer, duration, certificate_image, pdf_document, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [title, issuer, duration, certificateImage, pdfDocument, i]
      );
    }
    console.log('  ↳ seeded certifications');
  }

  // ---- projects -------------------------------------------------------------
  if ((await rowCount('projects')) === 0) {
    const projects = [
      ['E-Commerce Platform', 'A scalable storefront with cart, checkout, and admin dashboard.', ['React', 'Node.js', 'MySQL'], 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', '#', 1, 'Web App'],
      ['Portfolio CMS', 'Headless CMS to manage portfolio content via admin panel.', ['Next.js', 'Express', 'PostgreSQL'], 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop', '#', 1, 'Web App'],
      ['Realtime Chat App', 'WebSocket-powered chat with rooms and presence indicators.', ['React', 'Socket.io', 'Redis'], 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=400&fit=crop', '#', 1, 'Web App'],
      ['Fitness Tracker Mobile', 'Cross-platform mobile app for tracking workouts.', ['React Native', 'Firebase'], 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=600&h=400&fit=crop', '#', 0, 'Mobile'],
      ['Brand Landing Page', 'High-converting landing page with animations.', ['React', 'Tailwind', 'Framer'], 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop', '#', 0, 'Landing Page'],
      ['Analytics Dashboard', 'Interactive charts and KPIs for SaaS metrics.', ['React', 'D3', 'Express'], 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop', '#', 0, 'Dashboard'],
      ['Restaurant Booking', 'Online table reservation with admin scheduling.', ['Vue', 'Node.js'], 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', '#', 0, 'Web App'],
      ['Marketing Site', 'Static marketing site for a SaaS product.', ['Astro', 'Tailwind'], 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop', '#', 0, 'Landing Page'],
      ['Admin Console', 'Internal admin tool with role-based access.', ['React', 'NestJS', 'PostgreSQL'], 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', '#', 0, 'Dashboard'],
    ];
    for (let i = 0; i < projects.length; i++) {
      const [title, description, technologies, projectImage, detailsLink, isRecent, projectCategory] = projects[i];
      await pool.query(
        'INSERT INTO projects (title, description, technologies, project_image, details_link, is_recent, project_category, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, JSON.stringify(technologies), projectImage, detailsLink, isRecent, projectCategory, i]
      );
    }
    console.log('  ↳ seeded projects');
  }

  // ---- contact_settings -------------------------------------------------------
  if ((await rowCount('contact_settings')) === 0) {
    await pool.query(
      `INSERT INTO contact_settings
        (id, contact_subtitle, availability_text, admin_email, admin_phone, admin_location, linkedin_url, github_url)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "Have a project in mind? Let's build something amazing together.",
        'Currently available for freelance work and full-time opportunities.',
        'asadullah@example.com',
        '+92 300 1234567',
        'Karachi, Pakistan',
        'https://linkedin.com/in/asadullahkhan',
        'https://github.com/asadullahkhan',
      ]
    );
    console.log('  ↳ seeded contact_settings');
  }

  // ---- footer_settings -------------------------------------------------------
  if ((await rowCount('footer_settings')) === 0) {
    await pool.query(
      `INSERT INTO footer_settings (id, footer_summary_text, footer_skills_list, join_us_links) VALUES (1, ?, ?, ?)`,
      [
        'Full-stack developer building modern web experiences with care, speed, and craft.',
        JSON.stringify(['React', 'Node.js', 'MySQL', 'Tailwind', 'Express', 'Next.js', 'TypeScript', 'Docker', 'AWS', 'Git']),
        JSON.stringify([
          { label: 'LinkedIn', url: 'https://linkedin.com/in/asadullahkhan' },
          { label: 'GitHub', url: 'https://github.com/asadullahkhan' },
          { label: 'Email', url: 'mailto:asadullah@example.com' },
        ]),
      ]
    );
    console.log('  ↳ seeded footer_settings');
  }

  // ---- site_settings -------------------------------------------------------
  if ((await rowCount('site_settings')) === 0) {
    await pool.query(
      `INSERT INTO site_settings
        (id, site_name, site_tagline, seo_description, favicon, admin_email, projects_page_intro_text)
       VALUES (1, ?, ?, ?, ?, ?, ?)`,
      [
        'Asadullah Khan — Portfolio',
        'Full-Stack Developer',
        'Personal portfolio of Asadullah Khan — full-stack developer building modern web experiences.',
        '/favicon.ico',
        'admin@portfolio.com',
        'A selection of work spanning web apps, mobile, dashboards, and landing pages.',
      ]
    );
    console.log('  ↳ seeded site_settings');
  }
}

// `node seed.js` (or `npm run seed`) — full setup. Importing this module
// elsewhere (server.js) only exposes ensureAdminSeed, it does NOT auto-run.
if (require.main === module) {
  (async () => {
    await testConnection();
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
