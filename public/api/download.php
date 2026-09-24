<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';

require_method('GET');
require_admin();

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    json_error('A valid application id is required.', 422);
}

$pdo = evx_db();
$stmt = $pdo->prepare('SELECT applicant_name, resume_path FROM job_applications WHERE id = :id');
$stmt->execute(['id' => $id]);
$app = $stmt->fetch();

if (!$app) {
    json_error('Application not found.', 404);
}

$filename = (string) $app['resume_path'];
if (!preg_match('/^[a-f0-9]{32}\.pdf$/', $filename)) {
    error_log('Evoletrix: application ' . $id . ' has an invalid resume_path: ' . $filename);
    json_error('Resume file not found.', 404);
}

$resumesDir = rtrim((string) evx_config()['resumes_dir'], '/\\');
$resumesRealDir = realpath($resumesDir);
$path = $resumesDir . DIRECTORY_SEPARATOR . $filename;
$realPath = realpath($path);

// $filename is already constrained to ^[a-f0-9]{32}\.pdf$ (no slashes or
// dots possible), so traversal isn't reachable from it — this containment
// check is the actual backstop. Note the trailing separator on the
// prefix: without it, a sibling dir like resumes-evil/ would also match
// a naive strpos($realPath, $resumesRealDir) === 0 check.
if (
    $resumesRealDir === false
    || $realPath === false
    || strpos($realPath, $resumesRealDir . DIRECTORY_SEPARATOR) !== 0
) {
    json_error('Resume file not found.', 404);
}

if (!is_file($realPath)) {
    json_error('Resume file not found.', 404);
}

// ASCII-only filename for the Content-Disposition header — never trust
// the applicant's name directly into a header value.
$safeName = trim((string) preg_replace('/[^A-Za-z0-9 _-]/', '', (string) $app['applicant_name']));
$downloadName = $safeName !== '' ? $safeName . '-resume.pdf' : 'resume.pdf';

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Content-Length: ' . (string) filesize($realPath));

readfile($realPath);
exit;
