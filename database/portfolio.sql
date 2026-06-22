-- =====================================================================
-- Personal Portfolio Management System — MySQL Schema
-- =====================================================================
-- Usage:
--   mysql -u root -p < database/portfolio.sql
--
-- This file creates the database and all tables (schema only).
-- After running this, seed the default admin + example content with:
--   cd backend && npm install && npm run seed
-- =====================================================================

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ---------------------------------------------------------------------
-- admins — Admin Dashboard login accounts
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL,
  password      VARCHAR(255)  NOT NULL,        -- bcrypt hash, never plain text
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- hero_sections — Home page Hero + Home "About Preview" content
-- Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_sections (
  id                      INT PRIMARY KEY DEFAULT 1,
  static_heading          VARCHAR(255),
  typewriter_texts        JSON,                -- string[]
  paragraph_text          TEXT,
  skills                  JSON,                -- string[]
  hero_image              VARCHAR(500),
  cv_doc                  VARCHAR(500),
  about_preview_heading   VARCHAR(255),
  about_preview_text      TEXT,
  about_preview_image     VARCHAR(500),
  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_hero_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- uploads — Asset library for every file uploaded via the Admin Dashboard
-- (images, PDFs, DOC/DOCX). Other tables store the resulting URL directly;
-- this table powers the "Uploads" grid/manager page.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploads (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  original_name  VARCHAR(255)  NOT NULL,
  file_name      VARCHAR(255)  NOT NULL,        -- name stored on disk
  file_path      VARCHAR(500)  NOT NULL,        -- absolute path on server
  file_url       VARCHAR(500)  NOT NULL,        -- public URL (/uploads/...)
  mime_type      VARCHAR(150),
  file_type      ENUM('image','pdf','doc','other') NOT NULL DEFAULT 'other',
  size_bytes     INT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMP NULL DEFAULT NULL    -- soft delete
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- about_pages — About page paragraphs / skill badges / CV link
-- Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_pages (
  id                  INT PRIMARY KEY DEFAULT 1,
  paragraphs          JSON,                    -- string[]
  skills              JSON,                    -- string[]
  cv_attachment_url   VARCHAR(500),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_about_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- about_skills — Intro paragraph shown above the Skills & Technologies
-- accordion. Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS about_skills (
  id               INT PRIMARY KEY DEFAULT 1,
  intro_paragraph  TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_about_skills_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- skill_categories — One row per accordion item on the Skills section
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
  id                     INT AUTO_INCREMENT PRIMARY KEY,
  category_name          VARCHAR(150)  NOT NULL,
  category_description   TEXT,
  sub_skills             JSON,                 -- string[]
  sort_order             INT NOT NULL DEFAULT 0,
  created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at             TIMESTAMP NULL DEFAULT NULL  -- soft delete
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- certifications — Certifications carousel on the About page
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  title               VARCHAR(200)  NOT NULL,
  issuer              VARCHAR(200),
  duration            VARCHAR(100),
  certificate_image   VARCHAR(500),
  pdf_document        VARCHAR(500),
  sort_order          INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMP NULL DEFAULT NULL  -- soft delete
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- projects — Projects page grid + Home "Recent Work" (is_recent = 1)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(200)  NOT NULL,
  description       TEXT,
  technologies      JSON,                      -- string[]
  project_image     VARCHAR(500),
  details_link      VARCHAR(500),
  is_recent         TINYINT(1)    NOT NULL DEFAULT 0,
  project_category  VARCHAR(100),
  sort_order        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL DEFAULT NULL  -- soft delete
) ENGINE=InnoDB;

CREATE INDEX idx_projects_category ON projects (project_category);
CREATE INDEX idx_projects_recent ON projects (is_recent);

-- ---------------------------------------------------------------------
-- contact_settings — Contact page copy + social/contact details
-- Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_settings (
  id                  INT PRIMARY KEY DEFAULT 1,
  contact_subtitle    TEXT,
  availability_text   TEXT,
  admin_email         VARCHAR(150),
  admin_phone         VARCHAR(50),
  admin_location      VARCHAR(150),
  linkedin_url        VARCHAR(300),
  github_url          VARCHAR(300),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_contact_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- footer_settings — Footer summary, skills list, and Join Us links
-- Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS footer_settings (
  id                    INT PRIMARY KEY DEFAULT 1,
  footer_summary_text   TEXT,
  footer_skills_list    JSON,                  -- string[]
  join_us_links         JSON,                  -- {label, url}[]
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_footer_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- messages — Contact form submissions (admin inbox)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(100)  NOT NULL,
  last_name   VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  phone       VARCHAR(50),
  message     TEXT          NOT NULL,
  is_read     TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL DEFAULT NULL        -- soft delete
) ENGINE=InnoDB;

CREATE INDEX idx_messages_is_read ON messages (is_read);

-- ---------------------------------------------------------------------
-- site_settings — Site metadata (Admin → Settings) + Projects page intro
-- Singleton table: always exactly one row, id = 1.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id                         INT PRIMARY KEY DEFAULT 1,
  site_name                  VARCHAR(150),
  site_tagline               VARCHAR(255),
  seo_description            TEXT,
  favicon                    VARCHAR(300),
  admin_email                VARCHAR(150),       -- informational contact email, NOT login credential
  projects_page_intro_text   TEXT,
  created_at                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_site_settings_singleton CHECK (id = 1)
) ENGINE=InnoDB;

-- =====================================================================
-- Done. Next step:
--   cd backend
--   npm install
--   cp .env.example .env   (edit DB credentials + admin email/password)
--   npm run seed           (creates the admin account + example content)
--   npm run dev            (starts the API on http://localhost:5000)
-- =====================================================================
