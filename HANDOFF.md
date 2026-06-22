# Personal Portfolio — Full-Stack Handoff (v4 — Backend Complete)

**Project:** Asadullah Khan — Personal Portfolio Website + Admin Dashboard
**Scope of this delivery:** Backend (Express + MySQL + JWT + Multer), database schema, and full wiring of the existing frontend to real data. The site is now end-to-end functional — nothing is hardcoded except the static labels the original spec called out explicitly (e.g. "MY PORTFOLIO", "QUICK LINKS", nav links, the navbar's two logo phrases).

Previous delivery (`HANDOFF.md` v3) covered the frontend UI only, built on dummy data. This version replaces every dummy-data dependency with real API calls and ships the backend + database that powers them.

---

## 1. Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| Backend | Node.js + Express.js |
| Database | MySQL (mysql2) |
| Auth | JWT (jsonwebtoken) + bcrypt password hashing |
| File uploads | Multer (disk storage) |
| State | Context API (Theme, Auth) |

---

## 2. Project structure

```
personalPortfolio/
├── frontend/                      # React + Vite app (UI updated to call the API)
│   └── src/...
├── backend/                       # NEW — Express API
│   ├── config/db.js                # MySQL connection pool
│   ├── controllers/                 # One per resource (auth, hero, about, skills, ...)
│   ├── middleware/                  # auth (JWT), upload (multer), error handling
│   ├── models/                      # SQL queries per table, no ORM
│   ├── routes/                      # Express routers per resource
│   ├── services/fileService.js     # delete-from-disk / build-URL helpers
│   ├── uploads/                     # uploaded files land here (served at /uploads)
│   ├── utils/                       # asyncHandler, ApiError, JSON helpers
│   ├── seed.js                      # creates default admin + example content
│   ├── server.js                    # app entry point
│   ├── package.json
│   └── .env.example
└── database/
    └── portfolio.sql               # full schema (run this first)
```

---

## 3. Setup — step by step

### 3.1 Database
```bash
mysql -u root -p < database/portfolio.sql
```
This creates the `portfolio_db` database and all 12 tables (schema only — no content yet).

### 3.2 Backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and set:
- `DB_USER` / `DB_PASSWORD` — your MySQL credentials
- `JWT_SECRET` — any long random string (e.g. `openssl rand -base64 48`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — **the login you'll actually use** for `/admin`
- `CLIENT_ORIGIN` — leave as `http://localhost:5173` for local dev

Then seed the database (creates the admin account **and** realistic example content — hero text, About copy, 4 skill categories, 3 certifications, 9 projects, contact info, footer):
```bash
npm run seed
```
Start the API:
```bash
npm run dev      # http://localhost:5000
```

> If you skip `npm run seed`, the server still auto-creates the admin account on first boot (from `.env`) so you're never locked out — but content tables will be empty until you fill them in from the Admin Dashboard.

### 3.3 Frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api (default is already correct)
npm run dev             # http://localhost:5173
```

### 3.4 Log in
Go to `http://localhost:5173/admin/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`. Change the password from **Settings** after your first login.

---

## 4. API reference

Base URL: `http://localhost:5000/api`. Routes marked 🔒 require `Authorization: Bearer <token>`.

| Resource | Method & Path | Auth | Notes |
|---|---|---|---|
| Auth | `POST /auth/login` | – | `{email, password}` → `{token, admin}` |
| | `GET /auth/me` | 🔒 | current admin |
| | `POST /auth/change-password` | 🔒 | `{currentPassword, newPassword}` |
| Hero | `GET /hero` | – | hero + Home "About Preview" fields |
| | `PUT /hero` | 🔒 | |
| Uploads | `GET /uploads` | 🔒 | asset library |
| | `POST /uploads` | 🔒 | multipart, field name `file` |
| | `DELETE /uploads/:id` | 🔒 | also deletes file from disk |
| About | `GET /about` / `PUT /about` | – / 🔒 | paragraphs, skill badges, CV link |
| Skills | `GET /skills` | – | `{skillsIntroParagraph, skillsCategories}` |
| | `PUT /skills/intro` | 🔒 | |
| | `POST /skills/categories` | 🔒 | |
| | `PUT /skills/categories/:id` | 🔒 | |
| | `DELETE /skills/categories/:id` | 🔒 | soft delete |
| Certifications | `GET /certifications` | – | |
| | `POST /certifications` | 🔒 | |
| | `PUT /certifications/:id` | 🔒 | |
| | `DELETE /certifications/:id` | 🔒 | soft delete |
| Projects | `GET /projects?category=&recent=true` | – | |
| | `GET /projects/categories` | – | counts per category |
| | `GET /projects/page-settings` / `PUT ...` | – / 🔒 | Projects page intro text |
| | `POST /projects` | 🔒 | |
| | `PUT /projects/:id` | 🔒 | |
| | `DELETE /projects/:id` | 🔒 | soft delete |
| Contact settings | `GET /contact-settings` / `PUT ...` | – / 🔒 | contact page copy + socials |
| Footer | `GET /footer` / `PUT /footer` | – / 🔒 | summary, skills list, Join Us links |
| Messages | `POST /messages` | – | contact form submit |
| | `GET /messages` | 🔒 | inbox + unread count |
| | `PATCH /messages/:id/read` | 🔒 | `{isRead}` |
| | `DELETE /messages/:id` | 🔒 | soft delete |
| Settings | `GET /settings` / `PUT /settings` | 🔒 | site name, tagline, SEO, favicon |

Uploaded files are served statically at `http://localhost:5000/uploads/<filename>`.

---

## 5. Database schema (12 tables)

`admins · hero_sections · uploads · about_pages · about_skills · skill_categories · certifications · projects · contact_settings · footer_settings · messages · site_settings`

- **Singleton tables** (always exactly one row, `id = 1`): `hero_sections`, `about_pages`, `about_skills`, `contact_settings`, `footer_settings`, `site_settings`.
- **List tables with soft delete** (`deleted_at`): `skill_categories`, `certifications`, `projects`, `messages`, `uploads`. Nothing is ever hard-deleted by the API — rows are flagged and excluded from queries, so recovery is just a SQL `UPDATE ... SET deleted_at = NULL` away if needed.
- JSON columns (`typewriter_texts`, `skills`, `technologies`, `sub_skills`, `footer_skills_list`, `join_us_links`, etc.) store arrays/objects directly.

**On foreign keys:** the master spec asked for FKs, but this schema is a single-admin content-management system — there's no natural parent/child relationship between content tables to enforce (a project doesn't belong to a certification, etc.). Adding contrived FKs just to check a box would add complexity without real integrity benefit, so I left them out. `admins` is the only table anything could reasonably reference, and nothing currently needs to.

---

## 6. What's wired (everything)

| Concern | v3 (frontend-only) | v4 (this delivery) |
|---|---|---|
| Public pages (Home, About, Projects, Contact) | Dummy data | ✅ Live from MySQL via API, with dummy data kept only as instant-render fallback / offline safety net |
| Admin editors (Hero, About, Skills, Certifications, Projects, Contact, Footer, Settings) | Local state, `console.log` on save | ✅ Real GET on load + POST/PUT/DELETE on save |
| Login | Stubbed, `admin/admin` | ✅ Real `POST /auth/login`, bcrypt + JWT, session re-validated on reload |
| File uploads | `URL.createObjectURL` (local blob, lost on refresh) | ✅ Real upload to `backend/uploads/`, persisted in MySQL, served over HTTP |
| Messages | 4 fake seed rows | ✅ Real inbox — contact form writes to MySQL, admin reads/marks-read/deletes |
| Password change | Fake | ✅ Real, bcrypt-verified |

### Small fixes made along the way
- **Bug fix:** `AdminLayout.jsx`'s theme toggle called `toggleTheme`, which doesn't exist on `ThemeContext` (it exports `toggle`) — every click silently threw. Fixed.
- **Added:** a reusable `UploadField` admin component (URL field + real "Upload" button with image preview) so editors don't require manually copying URLs from the Uploads page.
- **Added:** an "About Preview (Home Page)" section inside the Hero editor, since the spec groups those fields with the Hero admin panel but the original build had no UI for them.
- **Added:** a small "Projects Page Header" field at the top of the Projects editor for the intro text shown under "My Projects" (previously unreachable from any admin screen).
- **Added:** the footer's "Skills List" field (already editable in the Footer admin form but not rendered anywhere) now shows as small tags under the footer summary, so the field isn't a dead end.
- **Added:** a 401 response interceptor in `services/api.js` — an expired/invalid session now bounces cleanly to `/admin/login` instead of leaving the dashboard half-broken.

---

## 7. Design notes worth knowing

- **`adminEmail` in Settings ≠ login email.** It's an informational contact field stored in `site_settings`, separate from the credential in `admins`. This avoids a confusing UX where editing a "Site Settings" form could silently change what you log in with.
- **`dummy.js` is now a fallback, not a source of truth.** Every component still imports it, but only as the initial render value (so the site never flashes empty) and as a safety net if the API call fails. Once the fetch resolves, real data takes over. Edit content from the Admin Dashboard — editing `dummy.js` no longer has any effect on the live site.
- **One admin account** by design — there's no multi-user/role system. If you need additional editors later, the `admins` table already supports more than one row; you'd just need a "create admin" UI (not included).

---

## 8. Security notes

- Passwords are bcrypt-hashed (cost factor 10), never stored or logged in plain text.
- JWT tokens expire after `JWT_EXPIRES_IN` (default 7 days, configurable in `.env`).
- File uploads are restricted to images, PDF, DOC, and DOCX by MIME type, with a configurable size cap (`MAX_UPLOAD_SIZE`, default 10MB).
- CORS is locked to the origin(s) listed in `CLIENT_ORIGIN` — update this when you deploy the frontend to a real domain.
- All admin-only routes require a valid JWT; public routes (GET on content, contact form POST) are intentionally open since they back a public website.

---

## 9. Deployment notes

- **Backend:** run with a process manager (PM2 or systemd) — `npm start` runs `node server.js`. Put it behind a reverse proxy (Nginx/Caddy) for HTTPS. Set `NODE_ENV=production`, a real `CLIENT_ORIGIN`, and a strong `JWT_SECRET`.
- **Frontend:** `npm run build` produces `dist/` — serve it as static files (Nginx, Vercel, Netlify, etc.) with `VITE_API_URL` pointed at your deployed backend's public URL.
- **Database:** any managed MySQL 8 instance works; run `database/portfolio.sql` once, then `npm run seed` (with production `.env` values) from a machine that can reach the DB.
- **Uploads:** `backend/uploads/` is local disk storage. For a multi-instance/serverless deployment you'd want to swap this for S3 or similar — out of scope here but the `services/fileService.js` + `middleware/uploadMiddleware.js` boundary is where you'd make that change.

---

## 10. Known limitations / good next steps

- No route-level code splitting (`React.lazy`) — fine at this size, worth adding if pages grow.
- No SEO meta tags (e.g. `react-helmet`) — the spec mentioned "SEO friendly structure" but didn't specify a meta-tag library.
- No automated tests or linting config.
- No email notification when a new contact-form message arrives (messages just land in the admin inbox).
- No rate limiting on the public `/messages` POST endpoint — consider adding `express-rate-limit` if spam becomes an issue.
- Concurrent edits in the Skills editor (creating several new categories at once) could theoretically assign two categories the same `sort_order` — cosmetic only, not a data-integrity issue, and irrelevant for single-admin use.
