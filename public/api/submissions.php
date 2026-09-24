<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';

require_method('GET', 'PUT');

// Admin-only end to end: this exposes visitor-submitted contact details.
require_admin();

$pdo = evx_db();

function evx_submission_row_to_array(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'type' => $row['type'],
        'name' => $row['name'],
        'email' => $row['email'],
        'message' => $row['message'],
        'bookingDate' => $row['booking_date'],
        'bookingTime' => $row['booking_time'],
        'isRead' => (bool) $row['is_read'],
        // MySQL's "Y-m-d H:i:s" (space-separated) isn't reliably parsed by
        // JS's `new Date()` across browsers; swap in a "T" so the frontend
        // gets the extended ISO form the spec actually guarantees parsing for.
        'createdAt' => str_replace(' ', 'T', (string) $row['created_at']),
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $type = $_GET['type'] ?? '';
    if ($type !== '' && !in_array($type, ['contact', 'booking'], true)) {
        json_error('Invalid type filter.', 422);
    }

    if ($type !== '') {
        $stmt = $pdo->prepare('SELECT * FROM contact_submissions WHERE type = :type ORDER BY created_at DESC');
        $stmt->execute(['type' => $type]);
    } else {
        $stmt = $pdo->query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    }

    $rows = array_map('evx_submission_row_to_array', $stmt->fetchAll());
    json_response($rows);
}

// PUT ?id=5 { "isRead": true } — mark a submission read/unread.
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    json_error('A valid submission id is required.', 422);
}

$input = json_input();
$isRead = !empty($input['isRead']);

$stmt = $pdo->prepare('UPDATE contact_submissions SET is_read = :is_read WHERE id = :id');
$stmt->execute(['is_read' => $isRead ? 1 : 0, 'id' => $id]);

$fetch = $pdo->prepare('SELECT * FROM contact_submissions WHERE id = :id');
$fetch->execute(['id' => $id]);
$row = $fetch->fetch();

if (!$row) {
    json_error('Submission not found.', 404);
}

json_response(evx_submission_row_to_array($row));
