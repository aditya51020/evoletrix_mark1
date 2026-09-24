<?php
/**
 * Shared bootstrap for every endpoint under public/api/.
 * Loads config, sets up PDO, and exposes small helpers
 * (JSON I/O, sessions, admin auth + CSRF, rate limiting).
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ---------------------------------------------------------------------
// Global error safety net — registered before anything else runs, so it
// covers config loading too. Guarantees every endpoint returns JSON,
// never an empty body or an HTML error page, even on an uncaught
// exception or a fatal error (which doesn't throw and skips normal
// exception handling entirely).
// ---------------------------------------------------------------------
set_exception_handler(function (\Throwable $e): void {
    error_log(sprintf('Evoletrix uncaught exception: %s in %s:%d', $e->getMessage(), $e->getFile(), $e->getLine()));
    json_error('Server error. Please try again later.', 500);
});

register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error === null) {
        return;
    }
    if (!in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR], true)) {
        return;
    }

    error_log(sprintf('Evoletrix fatal error: %s in %s:%d', $error['message'], $error['file'], $error['line']));

    if (!headers_sent()) {
        json_error('Server error. Please try again later.', 500);
    }
});

// ---------------------------------------------------------------------
// Config loading
//
// Production: public_html/api/bootstrap.inc.php -> dirname(__DIR__, 2)
// is one level above public_html, i.e. /home/<user>/, so the private
// dir resolves to /home/<user>/evoletrix-private/config.php.
//
// Local dev (`php -S localhost:8000 -t public`, XAMPP for MySQL only):
// the docroot flag doesn't change filesystem paths, so dirname(__DIR__, 2)
// from public/api/bootstrap.inc.php still resolves to the repo root —
// drop a config.php at <repo-root>/evoletrix-private/config.php and it's
// found automatically, no environment variable needed.
//
// EVOLETRIX_CONFIG_PATH is an escape hatch if you want your local
// config.php somewhere else entirely.
// ---------------------------------------------------------------------
$evxConfigCandidates = array_filter([
    getenv('EVOLETRIX_CONFIG_PATH') ?: null,
    dirname(__DIR__, 2) . '/evoletrix-private/config.php',
]);

$evxConfigPath = null;
foreach ($evxConfigCandidates as $evxCandidate) {
    if (is_file($evxCandidate)) {
        $evxConfigPath = $evxCandidate;
        break;
    }
}

if ($evxConfigPath === null) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    error_log('Evoletrix: no config.php found. Checked: ' . implode(', ', $evxConfigCandidates));
    echo json_encode(['error' => 'Server configuration error.']);
    exit;
}

$GLOBALS['evx_config'] = require $evxConfigPath;

function evx_config(): array
{
    return $GLOBALS['evx_config'];
}

// ---------------------------------------------------------------------
// CORS — only matters when the frontend and API are on different
// origins (local dev). In production they're same-origin, so this is
// effectively a no-op there. Never falls back to a wildcard: if the
// request Origin doesn't exactly match config, no CORS headers are
// sent at all and the browser blocks the cross-origin read.
// ---------------------------------------------------------------------
$evxAllowedOrigin = evx_config()['allowed_origin'] ?? '';
$evxRequestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($evxAllowedOrigin !== '' && $evxRequestOrigin === $evxAllowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $evxAllowedOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------------------------------------------------------------------
// PDO
// ---------------------------------------------------------------------
function evx_db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $db = evx_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $db['host'],
        $db['name'],
        $db['charset'] ?? 'utf8mb4'
    );

    try {
        $pdo = new PDO($dsn, $db['user'], $db['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $e) {
        error_log('Evoletrix DB connection failed: ' . $e->getMessage());
        json_error('Server error. Please try again later.', 500);
    }

    return $pdo;
}

// ---------------------------------------------------------------------
// JSON helpers — both always terminate the request (`never`), so a
// caller can rely on json_error(...) meaning "nothing after this runs".
// ---------------------------------------------------------------------
function json_response($data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $status = 400): never
{
    json_response(['error' => $message], $status);
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_method(string ...$allowed): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        json_error('Method not allowed.', 405);
    }
}

// ---------------------------------------------------------------------
// Session timeouts — defined before evx_start_session()/require_admin()
// since both reference them.
// ---------------------------------------------------------------------
const EVX_SESSION_IDLE_TIMEOUT = 7200;      // 2 hours of inactivity
const EVX_SESSION_ABSOLUTE_TIMEOUT = 43200; // 12 hours since login, regardless of activity

// ---------------------------------------------------------------------
// Sessions — secure cookie params, started lazily (public endpoints
// that never touch $_SESSION should not hand out a session cookie).
//
// The Secure flag comes from config (session_secure_cookie), never from
// request headers like X-Forwarded-Proto — those are client-controlled
// and must not decide cookie security.
// ---------------------------------------------------------------------
function evx_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = (bool) (evx_config()['session_secure_cookie'] ?? true);

    // Shared hosting's default session.gc_maxlifetime is commonly 1440s
    // (24 min), which would silently garbage-collect the session file
    // well before our own idle timeout fires. Force it to match, and
    // reject any session ID the client supplies that the server never
    // generated (session fixation hardening).
    ini_set('session.gc_maxlifetime', (string) EVX_SESSION_IDLE_TIMEOUT);
    ini_set('session.use_strict_mode', '1');

    session_name('evx_admin_sess');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'secure' => $secure,
        'samesite' => 'Strict',
    ]);
    session_start();
}

// ---------------------------------------------------------------------
// Admin auth + CSRF — single helper reused by every admin endpoint.
// Enforces both an idle timeout and an absolute session lifetime.
// ---------------------------------------------------------------------
function require_admin(): array
{
    evx_start_session();

    if (empty($_SESSION['admin_id'])) {
        json_error('Unauthorized.', 401);
    }

    $now = time();
    $lastSeen = (int) ($_SESSION['admin_last_seen'] ?? 0);
    $loginAt = (int) ($_SESSION['admin_login_at'] ?? 0);

    if (($now - $lastSeen) > EVX_SESSION_IDLE_TIMEOUT || ($now - $loginAt) > EVX_SESSION_ABSOLUTE_TIMEOUT) {
        $_SESSION = [];
        session_destroy();
        json_error('Session expired. Please log in again.', 401);
    }

    $_SESSION['admin_last_seen'] = $now;

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array($method, ['POST', 'PUT', 'DELETE', 'PATCH'], true)) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if ($token === '' || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
            json_error('Invalid CSRF token.', 403);
        }
    }

    return [
        'id' => (int) $_SESSION['admin_id'],
        'email' => $_SESSION['admin_email'] ?? '',
    ];
}

function evx_new_csrf_token(): string
{
    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}

// Fixed bcrypt hash (algorithm $2y$, cost 12 — matches PASSWORD_DEFAULT's
// cost on PHP 8.4+, which raised it from 10 to 12) used ONLY as the
// password_verify() comparison target when no admin account matches the
// submitted email. This is a hardcoded constant, generated once offline
// with Python's `bcrypt` package against a random 24-byte string (not a
// well-known/published example hash), then relabeled from its native
// $2b$ prefix to $2y$ — the two are byte-for-byte compatible for
// ASCII/random input, and password_verify() accepts both.
//
// It is deliberately NOT computed at request time: calling password_hash()
// here on every miss would make the missing-email path do TWICE the
// bcrypt work of the wrong-password path (a hash plus a verify, vs. just
// a verify), which is itself a timing oracle in the other direction. The
// plaintext behind this hash is irrelevant and can never be used to log
// in, since login also requires a real $admin row to exist.
//
// If the cost factor used for real admin password hashes ever changes,
// regenerate this constant to match, or the timing symmetry breaks again.
const EVX_DUMMY_PASSWORD_HASH = '$2y$12$xWcBC0SbZvrvz1JhOi282ucJJCMi30Tg1so2yadUhbQW4AgX9V5wy';

function evx_dummy_password_hash(): string
{
    return EVX_DUMMY_PASSWORD_HASH;
}

// ---------------------------------------------------------------------
// Rate limiting — MySQL-backed sliding window, shared by any endpoint.
// Usage: check_rate_limit('contact', 5, 600) => max 5 per 10 minutes.
//
// IP is read ONLY from $_SERVER['REMOTE_ADDR'] — the TCP peer address
// as seen by PHP/Apache — never from X-Forwarded-For or any other
// client-supplied header, which an attacker can set to any value to
// evade or frame another IP.
// ---------------------------------------------------------------------
function evx_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function check_rate_limit(string $bucket, int $maxAttempts, int $windowSeconds): bool
{
    $pdo = evx_db();

    $ipBin = @inet_pton(evx_client_ip());
    if ($ipBin === false) {
        $ipBin = inet_pton('0.0.0.0');
    }

    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM rate_limits
         WHERE bucket = :bucket AND ip_address = :ip
           AND created_at > (NOW() - INTERVAL :window SECOND)'
    );
    $stmt->bindValue(':bucket', $bucket, PDO::PARAM_STR);
    $stmt->bindValue(':ip', $ipBin, PDO::PARAM_STR);
    $stmt->bindValue(':window', $windowSeconds, PDO::PARAM_INT);
    $stmt->execute();
    $count = (int) $stmt->fetchColumn();

    if ($count >= $maxAttempts) {
        return false;
    }

    $insert = $pdo->prepare('INSERT INTO rate_limits (bucket, ip_address, created_at) VALUES (:bucket, :ip, NOW())');
    $insert->bindValue(':bucket', $bucket, PDO::PARAM_STR);
    $insert->bindValue(':ip', $ipBin, PDO::PARAM_STR);
    $insert->execute();

    // Occasional opportunistic sweep so the table doesn't grow forever.
    if (random_int(1, 100) === 1) {
        $pdo->exec('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL 1 DAY)');
    }

    return true;
}
