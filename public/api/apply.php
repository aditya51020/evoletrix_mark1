<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';
require __DIR__ . '/mailer.inc.php';

require_method('POST');

const EVX_MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB
const EVX_DUPLICATE_WINDOW_DAYS = 30;

// Honeypot: real users never fill this. Multipart requests put it in
// $_POST like every other field. Reject silently with a fake success.
if (trim((string) ($_POST['hp_field_x'] ?? '')) !== '') {
    json_response(['success' => true, 'message' => "Application received! We'll review it and get back to you if it's a good fit."]);
}

if (!check_rate_limit('apply:' . evx_client_ip(), 3, 3600)) {
    json_error('Too many applications submitted. Please try again later.', 429);
}

$jobId = isset($_POST['job_id']) ? (int) $_POST['job_id'] : 0;
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$coverNote = trim((string) ($_POST['cover_note'] ?? ''));

if ($jobId <= 0) {
    json_error('A valid job is required.', 422);
}
if ($name === '' || mb_strlen($name) > 190) {
    json_error('A valid name is required.', 422);
}
if ($email === '' || mb_strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_error('A valid email address is required.', 422);
}
if (mb_strlen($phone) > 40) {
    json_error('Phone number is too long.', 422);
}
if (mb_strlen($coverNote) > 2000) {
    json_error('Cover note is too long (max 2000 characters).', 422);
}

$pdo = evx_db();

// job_id must reference a real, currently-published job.
$jobStmt = $pdo->prepare('SELECT id, title FROM jobs WHERE id = :id AND is_published = 1');
$jobStmt->execute(['id' => $jobId]);
$job = $jobStmt->fetch();
if (!$job) {
    json_error('This job is no longer accepting applications.', 422);
}

// Same email + same job within the window = duplicate.
$dupStmt = $pdo->prepare(
    'SELECT COUNT(*) FROM job_applications
     WHERE job_id = :job_id AND applicant_email = :email
       AND created_at > (NOW() - INTERVAL ' . EVX_DUPLICATE_WINDOW_DAYS . ' DAY)'
);
$dupStmt->execute(['job_id' => $jobId, 'email' => $email]);
if ((int) $dupStmt->fetchColumn() > 0) {
    json_error("You've already applied for this role.", 409);
}

// ---------------------------------------------------------------------
// Resume file — validate everything about it before touching disk.
// ---------------------------------------------------------------------
if (!isset($_FILES['resume'])) {
    json_error('A resume file is required.', 422);
}
$file = $_FILES['resume'];

switch ($file['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_NO_FILE:
        json_error('A resume file is required.', 422);
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        json_error('Resume file is too large (max 5 MB).', 422);
    case UPLOAD_ERR_PARTIAL:
        json_error('Resume upload was interrupted. Please try again.', 422);
    case UPLOAD_ERR_NO_TMP_DIR:
    case UPLOAD_ERR_CANT_WRITE:
    case UPLOAD_ERR_EXTENSION:
        error_log('Evoletrix: resume upload server error, code ' . $file['error']);
        json_error('Server error while receiving the file. Please try again.', 500);
    default:
        json_error('Resume upload failed. Please try again.', 422);
}

if (!is_uploaded_file($file['tmp_name'])) {
    json_error('Invalid file upload.', 422);
}

if ($file['size'] <= 0 || $file['size'] > EVX_MAX_RESUME_BYTES) {
    json_error('Resume file is too large (max 5 MB).', 422);
}

// PDF ONLY — checked three ways: real MIME sniff, magic-byte header, and
// (above) size. Extension/client-reported type are never trusted alone.
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
if ($mime !== 'application/pdf') {
    json_error('Only PDF resumes are accepted.', 422);
}

$handle = fopen($file['tmp_name'], 'rb');
$header = $handle !== false ? fread($handle, 5) : '';
if ($handle !== false) {
    fclose($handle);
}
if ($header !== '%PDF-') {
    json_error('Only PDF resumes are accepted.', 422);
}

// ---------------------------------------------------------------------
// Everything validated — now touch disk. Random filename, never the
// original name; directory/file permissions locked down since this
// lives outside the web root but resumes are still sensitive PII.
// ---------------------------------------------------------------------
$resumesDir = rtrim((string) evx_config()['resumes_dir'], '/\\');

if (!is_dir($resumesDir)) {
    if (!mkdir($resumesDir, 0750, true) && !is_dir($resumesDir)) {
        error_log('Evoletrix: failed to create resumes directory: ' . $resumesDir);
        json_error('Server error. Please try again later.', 500);
    }
}
@chmod($resumesDir, 0750);

$filename = bin2hex(random_bytes(16)) . '.pdf';
$destPath = $resumesDir . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    error_log('Evoletrix: move_uploaded_file failed for ' . $destPath);
    json_error('Server error while saving the file. Please try again.', 500);
}
@chmod($destPath, 0640);

// Original filename is stored as metadata only (never used to build a
// filesystem path) — strip null bytes and cap to the column width.
$originalName = mb_substr(str_replace("\0", '', (string) $file['name']), 0, 255);

// ---------------------------------------------------------------------
// DB row. If this fails, the moved file must not become an orphan.
// ---------------------------------------------------------------------
try {
    $stmt = $pdo->prepare(
        'INSERT INTO job_applications
            (job_id, applicant_name, applicant_email, phone, cover_note, resume_path, resume_original_name, status, created_at)
         VALUES (:job_id, :name, :email, :phone, :cover_note, :resume_path, :resume_original_name, "new", NOW())'
    );
    $stmt->execute([
        'job_id' => $jobId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone !== '' ? $phone : null,
        'cover_note' => $coverNote !== '' ? $coverNote : null,
        'resume_path' => $filename,
        'resume_original_name' => $originalName,
    ]);
} catch (\Throwable $e) {
    @unlink($destPath);
    error_log('Evoletrix: job application insert failed: ' . $e->getMessage());
    json_error('Server error. Please try again later.', 500);
}

// ---------------------------------------------------------------------
// Notification email — admin mailbox only, no attachment (the resume is
// only ever reachable through the admin-authenticated download.php).
// Best-effort: the application is already saved, so a failed send here
// must not fail the request.
// ---------------------------------------------------------------------
$dashboardUrl = rtrim((string) (evx_config()['allowed_origin'] ?? ''), '/') . '/#admin';
$body = '<h2>New job application</h2>'
    . '<p><strong>Job:</strong> ' . htmlspecialchars($job['title'], ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</p>'
    . '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</p>';
if ($phone !== '') {
    $body .= '<p><strong>Phone:</strong> ' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '</p>';
}
$body .= '<p><a href="' . htmlspecialchars($dashboardUrl, ENT_QUOTES, 'UTF-8') . '">Review in the admin dashboard</a></p>';

$sent = evx_send_mail('New application: ' . $job['title'] . ' — ' . $name, $body, $email, $name);
if (!$sent) {
    error_log('Evoletrix: application notification email failed for ' . $email);
}

json_response(['success' => true, 'message' => "Application received! We'll review it and get back to you if it's a good fit."]);
