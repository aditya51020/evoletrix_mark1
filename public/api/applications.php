<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';

require_method('GET', 'PUT');
require_admin();

const EVX_APPLICATION_STATUSES = ['new', 'reviewed', 'rejected', 'hired'];

$pdo = evx_db();

function evx_application_row_to_array(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'jobId' => (int) $row['job_id'],
        'jobTitle' => $row['job_title'],
        'applicantName' => $row['applicant_name'],
        'applicantEmail' => $row['applicant_email'],
        'phone' => $row['phone'],
        'coverNote' => $row['cover_note'],
        'status' => $row['status'],
        'createdAt' => str_replace(' ', 'T', (string) $row['created_at']),
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $jobId = isset($_GET['job_id']) ? (int) $_GET['job_id'] : 0;

    $sql = 'SELECT a.*, j.title AS job_title
            FROM job_applications a
            JOIN jobs j ON j.id = a.job_id';
    $params = [];

    if ($jobId > 0) {
        $sql .= ' WHERE a.job_id = :job_id';
        $params['job_id'] = $jobId;
    }

    $sql .= ' ORDER BY a.created_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $rows = array_map('evx_application_row_to_array', $stmt->fetchAll());
    json_response($rows);
}

// PUT ?id=5 { "status": "reviewed" }
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    json_error('A valid application id is required.', 422);
}

$input = json_input();
$status = (string) ($input['status'] ?? '');
if (!in_array($status, EVX_APPLICATION_STATUSES, true)) {
    json_error('Invalid status.', 422);
}

$stmt = $pdo->prepare('UPDATE job_applications SET status = :status WHERE id = :id');
$stmt->execute(['status' => $status, 'id' => $id]);

$fetch = $pdo->prepare(
    'SELECT a.*, j.title AS job_title
     FROM job_applications a
     JOIN jobs j ON j.id = a.job_id
     WHERE a.id = :id'
);
$fetch->execute(['id' => $id]);
$row = $fetch->fetch();

if (!$row) {
    json_error('Application not found.', 404);
}

json_response(evx_application_row_to_array($row));
