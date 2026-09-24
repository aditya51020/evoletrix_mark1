-- Evoletrix backend schema (Phase 1)
-- Run this once in phpMyAdmin (or `mysql < schema.sql`) against a fresh
-- InnoDB / utf8mb4 database. Safe to re-run: every statement is guarded
-- with IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS jobs (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(190) NOT NULL,
  department       VARCHAR(120) NOT NULL,
  location         VARCHAR(120) NOT NULL,
  experience       VARCHAR(120) NOT NULL,
  work_mode        VARCHAR(60)  NOT NULL,
  about            TEXT NOT NULL,
  responsibilities JSON NOT NULL,
  requirements     JSON NOT NULL,
  is_published     TINYINT(1) NOT NULL DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_jobs_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_applications (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  job_id                INT UNSIGNED NOT NULL,
  applicant_name        VARCHAR(190) NOT NULL,
  applicant_email       VARCHAR(190) NOT NULL,
  phone                 VARCHAR(40) NULL,
  cover_note            TEXT NULL,
  resume_path           VARCHAR(255) NOT NULL,
  resume_original_name  VARCHAR(255) NOT NULL,
  status                ENUM('new','reviewed','rejected','hired') NOT NULL DEFAULT 'new',
  created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_apps_job (job_id),
  KEY idx_apps_status (status),
  -- RESTRICT, not CASCADE: deleting a job must never silently destroy
  -- applicant records. jobs.php enforces this at the app layer too
  -- (refuses the delete with a clear message before it ever reaches
  -- the DB), but the FK is the backstop if that check is ever bypassed.
  CONSTRAINT fk_apps_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type         ENUM('contact','booking') NOT NULL,
  name         VARCHAR(190) NULL,
  email        VARCHAR(190) NOT NULL,
  message      TEXT NULL,
  booking_date DATE NULL,
  booking_time VARCHAR(20) NULL,
  is_read      TINYINT(1) NOT NULL DEFAULT 0,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_submissions_type (type),
  KEY idx_submissions_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Generic per-IP, per-endpoint sliding-window rate limiter.
-- ip_address is stored via inet_pton() (binary), works for IPv4 and IPv6.
CREATE TABLE IF NOT EXISTS rate_limits (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bucket      VARCHAR(64) NOT NULL,
  ip_address  VARBINARY(16) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rate_bucket_ip_time (bucket, ip_address, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
