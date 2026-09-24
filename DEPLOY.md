# Deploying to Hostinger

Target: Hostinger shared hosting, PHP 8.x + MySQL/MariaDB, Apache with `.htaccess`. No Node.js, no Composer, no SSH required.

## 1. Database

1. In hPanel → **Databases → MySQL Databases**, create a database and a DB user with full privileges on it. Note the host (usually `localhost`), database name, username, and password.
2. Open **phpMyAdmin** from hPanel, select the new database, go to **Import**.
3. Import `database/schema.sql`.
4. Import `database/jobs_seed.sql` (optional but recommended — seeds the 8 job listings that used to be hardcoded, so the Careers page isn't empty on first launch).
5. Create the first admin account:
   - Generate a bcrypt hash locally (cost 12, matching what the app itself uses):
     ```
     php -r "echo password_hash('your-password-here', PASSWORD_BCRYPT, ['cost' => 12]), PHP_EOL;"
     ```
   - In phpMyAdmin's **SQL** tab, run:
     ```sql
     INSERT INTO admin_users (email, password_hash) VALUES ('you@evoletrix.com', '<paste-hash-here>');
     ```

## 2. Private config + resumes folder (outside the web root)

Using hPanel's **File Manager**:

1. Navigate to `/home/<your-username>/` — one level *above* `public_html`.
2. Create a folder named `evoletrix-private`.
3. Inside it, create `config.php`. Use `database/config.example.php` as the template and fill in real values:
   - `db` — host/name/user/pass from step 1
   - `smtp` — `smtp.hostinger.com`, port `465`, `smtps`, your mailbox's real username/password, `from_email`/`from_name`
   - `admin_notify_email` — where contact/booking/application notifications should land
   - `allowed_origin` — `https://evoletrix.com` (apex, no `www` — matches the `.htaccess` redirect)
   - `session_secure_cookie` — `true`
   - `resumes_dir` — leave as `__DIR__ . '/resumes'` (resolves to `evoletrix-private/resumes`)
4. `apply.php` creates the `resumes/` subfolder automatically on first upload (mode `0750`) if it doesn't exist — no action needed, but you can pre-create it and set its permissions to `750` if you'd rather.
5. Confirm `evoletrix-private/` is **not** reachable by URL (it must sit outside `public_html`, not inside it).

## 3. Build and upload

1. Locally: `npm run build`.
2. Upload the **contents** of `dist/` (not the `dist` folder itself) into `public_html/`, so `public_html/index.html`, `public_html/assets/`, and `public_html/api/` all sit directly under `public_html/`.
3. Confirm `public_html/.htaccess` made it into the upload (it comes from `public/.htaccess`, copied into `dist/` automatically by Vite since it lives under `public/`).
4. Confirm `public_html/api/lib/PHPMailer/` (the 3 vendored files) made it into the upload.

## 4. Verify

- [ ] `https://evoletrix.com` loads the site
- [ ] `http://evoletrix.com` redirects to `https://evoletrix.com`
- [ ] `https://www.evoletrix.com` redirects to `https://evoletrix.com`
- [ ] `/api/jobs.php` returns published jobs as JSON
- [ ] `/api/jobs.php?all=1` returns `401` when logged out
- [ ] `/#careers-page` shows the jobs list with no console errors
- [ ] "Get in touch" (CTA) form: success message shows, email arrives at `admin_notify_email`, row appears in `contact_submissions`
- [ ] Booking form: same checks, plus try a past date/time — should be rejected
- [ ] Apply to a job with a real PDF under 5 MB: success message, notification email arrives, row in `job_applications`, file appears in `evoletrix-private/resumes/`
- [ ] Try applying with a non-PDF file — rejected with a clear error
- [ ] `/#admin-login` loads; log in with the admin account from step 1
- [ ] Jobs screen: create, edit, publish-toggle, and delete a test job (delete should be blocked once it has an applicant, with a clear message)
- [ ] Applications screen: filter by job, change status, view cover note, download the resume PDF
- [ ] Submissions screen: filter by type, mark read/unread
- [ ] Log out, then request `/api/jobs.php?all=1` directly — `401`
- [ ] Directly request `/api/bootstrap.inc.php` or `/api/lib/PHPMailer/PHPMailer.php` — both blocked, not served
- [ ] Response headers include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Requesting a nonexistent `/api/whatever.php` returns a real 404, not the SPA HTML shell

## Local development recap

- `php -S localhost:8000 -t public` from the repo root (serves the API; XAMPP is only needed for MySQL locally)
- `<repo-root>/evoletrix-private/config.php` (gitignored) — mirrors the production layout exactly, no environment variable needed
- `npm run dev` (Vite proxies `/api` → `http://localhost:8000`, configurable via `VITE_API_PROXY_TARGET` in `.env.local`)
