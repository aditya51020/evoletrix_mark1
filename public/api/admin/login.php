<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.inc.php';

require_method('POST');

if (!check_rate_limit('admin_login:' . evx_client_ip(), 5, 900)) {
    json_error('Too many login attempts. Please try again later.', 429);
}

$input = json_input();
$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($email === '' || $password === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('Invalid email or password.', 401);
}

$pdo = evx_db();
$stmt = $pdo->prepare('SELECT id, email, password_hash FROM admin_users WHERE email = :email LIMIT 1');
$stmt->execute(['email' => $email]);
$admin = $stmt->fetch();

// Always run password_verify(), against a dummy hash when no account
// matches, so a non-existent email takes exactly as long to reject as
// a wrong password does — response timing can't be used to enumerate
// which emails have admin accounts.
$hashToVerify = $admin['password_hash'] ?? evx_dummy_password_hash();
$passwordValid = password_verify($password, $hashToVerify);

if (!$admin || !$passwordValid) {
    json_error('Invalid email or password.', 401);
}

// Transparently upgrade older hashes (e.g. cost-10, from PHP < 8.4) to
// the current cost-12 standard on successful login.
if (password_needs_rehash($admin['password_hash'], PASSWORD_BCRYPT, ['cost' => 12])) {
    $newHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $rehash = $pdo->prepare('UPDATE admin_users SET password_hash = :hash WHERE id = :id');
    $rehash->execute(['hash' => $newHash, 'id' => $admin['id']]);
}

evx_start_session();
session_regenerate_id(true);
$_SESSION['admin_id'] = (int) $admin['id'];
$_SESSION['admin_email'] = $admin['email'];
$_SESSION['admin_login_at'] = time();
$_SESSION['admin_last_seen'] = time();
$csrfToken = evx_new_csrf_token();

json_response([
    'admin' => ['id' => (int) $admin['id'], 'email' => $admin['email']],
    'csrfToken' => $csrfToken,
]);
