<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';
require __DIR__ . '/mailer.inc.php';

require_method('POST');

$input = json_input();

// Honeypot: real users never fill this (hidden via CSS, not type="hidden",
// so autofill can't touch it either). Bots often fill every field blindly.
// Reject silently with a fake success so scrapers don't learn anything.
if (trim((string) ($input['hp_field_x'] ?? '')) !== '') {
    json_response(['success' => true, 'message' => 'Thank you! We will get in touch shortly for a coffee chat.']);
}

if (!check_rate_limit('contact:' . evx_client_ip(), 5, 600)) {
    json_error('Too many submissions. Please try again in a few minutes.', 429);
}

$email = trim((string) ($input['email'] ?? ''));
$name = trim((string) ($input['name'] ?? ''));
$message = trim((string) ($input['message'] ?? ''));

if ($email === '' || mb_strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('A valid email address is required.', 422);
}
if (mb_strlen($name) > 190) {
    json_error('Name is too long.', 422);
}
if (mb_strlen($message) > 3000) {
    json_error('Message is too long.', 422);
}

$pdo = evx_db();
$stmt = $pdo->prepare(
    "INSERT INTO contact_submissions (type, name, email, message, created_at)
     VALUES ('contact', :name, :email, :message, NOW())"
);
$stmt->execute([
    'name' => $name !== '' ? $name : null,
    'email' => $email,
    'message' => $message !== '' ? $message : null,
]);

$body = '<h2>New "let\'s connect over coffee" request</h2>'
    . '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>';
if ($name !== '') {
    $body .= '<p><strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</p>';
}
if ($message !== '') {
    $body .= '<p><strong>Message:</strong><br>' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</p>';
}

// Submission is already saved above; a failed notification email must
// never turn into a failed request for the person who just submitted.
$sent = evx_send_mail('New coffee chat request from ' . $email, $body, $email, $name !== '' ? $name : null);
if (!$sent) {
    error_log('Evoletrix: contact notification email failed for submission from ' . $email);
}

json_response(['success' => true, 'message' => 'Thank you! We will get in touch shortly for a coffee chat.']);
