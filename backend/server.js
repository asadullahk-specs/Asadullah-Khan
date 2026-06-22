require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { ensureAdminSeed } = require('./seed');

const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const certificationsRoutes = require('./routes/certificationsRoutes');
const projectsRoutes = require('./routes/projectsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const footerRoutes = require('./routes/footerRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

// ── Core middleware ──────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Database Connection Middleware for Serverless ─────────────────
if (require.main !== module) {
  let dbReady = false;
  app.use(async (req, res, next) => {
    try {
      if (!dbReady) {
        await connectDB();
        await ensureAdminSeed();
        dbReady = true;
      }
      next();
    } catch (err) {
      next(err);
    }
  });
}

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

// ── API routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact-settings', contactRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/settings', settingsRoutes);

// ── 404 + error handling (must be last) ────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  // Local dev: connect DB then start listener
  async function start() {
    await connectDB();
    await ensureAdminSeed();
    app.listen(PORT, () => {
      console.log(`✅ Portfolio API running on http://localhost:${PORT}`);
    });
  }
  start();
}

module.exports = app;
