<?php
/**
 * Template for the private config file. Lives in /database/ (not under
 * public/) purely as a reference — it is never read at runtime. Copy it
 * to a location OUTSIDE the web root and fill in real values:
 *
 *   Production (Hostinger):
 *     /home/<user>/evoletrix-private/config.php
 *     (i.e. dirname(__DIR__, 2) . '/evoletrix-private/config.php' as seen
 *     from public_html/api/bootstrap.inc.php)
 *
 *   Local dev (`php -S localhost:8000 -t public` + XAMPP for MySQL only):
 *     Create <repo-root>/evoletrix-private/config.php. Since the PHP
 *     built-in server's docroot setting doesn't change filesystem paths,
 *     dirname(__DIR__, 2) from public/api/bootstrap.inc.php still
 *     resolves to the repo root — this mirrors the production layout
 *     exactly, no environment variable needed.
 *     Only set EVOLETRIX_CONFIG_PATH if you want your local config.php
 *     somewhere else entirely (see bootstrap.inc.php).
 *
 * Never commit the real, filled-in config.php.
 */

return [
    'db' => [
        'host'    => '127.0.0.1',
        'name'    => 'evoletrix_db',
        'user'    => 'evoletrix_user',
        'pass'    => 'change-me',
        'charset' => 'utf8mb4',
    ],

    'smtp' => [
        'host'       => 'smtp.hostinger.com',
        'port'       => 465,
        'secure'     => 'smtps', // implicit TLS on port 465
        'user'       => 'noreply@evoletrix.com',
        'pass'       => 'change-me',
        'from_email' => 'noreply@evoletrix.com',
        'from_name'  => 'Evoletrix Website',
    ],

    // Where new contact/booking/application notifications are sent.
    'admin_notify_email' => 'info@evoletrix.com',

    // Exact origin allowed to call the API with credentials (CORS).
    // Production should be the live site origin; for local dev this is
    // typically the Vite dev server origin, e.g. http://localhost:3000.
    'allowed_origin' => 'https://www.evoletrix.com',

    // Admin session cookie's Secure flag. Must be true in production
    // (HTTPS only). Set to false ONLY for local plain-HTTP dev — never
    // derived from request headers, since those are client-controlled.
    'session_secure_cookie' => true,

    // Resumes are stored outside the web root, next to this config file.
    'resumes_dir' => __DIR__ . '/resumes',
];
