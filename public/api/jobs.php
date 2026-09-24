<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.inc.php';

require_method('GET', 'POST', 'PUT', 'DELETE');

$method = $_SERVER['REQUEST_METHOD'];

// Converts a DB row into the JSON shape the frontend expects. The public
// shape matches CareersPage.jsx's original hardcoded `jobs` array field
// names exactly (including `workMode`); the admin shape adds the fields
// the dashboard needs on top of that.
function evx_job_row_to_array(array $row, bool $admin = false): array
{
    $job = [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'department' => $row['department'],
        'location' => $row['location'],
        'experience' => $row['experience'],
        'workMode' => $row['work_mode'],
        'about' => $row['about'],
        'responsibilities' => json_decode((string) $row['responsibilities'], true) ?? [],
        'requirements' => json_decode((string) $row['requirements'], true) ?? [],
    ];

    if ($admin) {
        $job['isPublished'] = (bool) $row['is_published'];
        $job['applicantCount'] = isset($row['applicant_count']) ? (int) $row['applicant_count'] : 0;
        $job['createdAt'] = $row['created_at'];
        $job['updatedAt'] = $row['updated_at'];
    }

    return $job;
}

// Shared validation for POST (create) and PUT (full replace) — both send
// the complete job shape, so both go through the same checks.
function evx_validate_job_input(array $input): array
{
    $title = trim((string) ($input['title'] ?? ''));
    $department = trim((string) ($input['department'] ?? ''));
    $location = trim((string) ($input['location'] ?? ''));
    $experience = trim((string) ($input['experience'] ?? ''));
    $workMode = trim((string) ($input['workMode'] ?? ''));
    $about = trim((string) ($input['about'] ?? ''));
    $isPublished = !empty($input['isPublished']);

    if ($title === '' || mb_strlen($title) > 190) {
        json_error('A valid title is required.', 422);
    }
    if ($department === '' || mb_strlen($department) > 120) {
        json_error('A valid department is required.', 422);
    }
    if ($location === '' || mb_strlen($location) > 120) {
        json_error('A valid location is required.', 422);
    }
    if ($experience === '' || mb_strlen($experience) > 120) {
        json_error('A valid experience level is required.', 422);
    }
    if ($workMode === '' || mb_strlen($workMode) > 60) {
        json_error('A valid work mode is required.', 422);
    }
    if ($about === '' || mb_strlen($about) > 5000) {
        json_error('A role description is required (max 5000 characters).', 422);
    }

    $cleanList = function ($items): array {
        if (!is_array($items)) {
            return [];
        }
        $cleaned = [];
        foreach ($items as $item) {
            $item = trim((string) $item);
            if ($item !== '' && mb_strlen($item) <= 500) {
                $cleaned[] = $item;
            }
        }
        return $cleaned;
    };

    $responsibilities = $cleanList($input['responsibilities'] ?? []);
    $requirements = $cleanList($input['requirements'] ?? []);

    if (count($responsibilities) === 0) {
        json_error('At least one responsibility is required.', 422);
    }
    if (count($requirements) === 0) {
        json_error('At least one requirement is required.', 422);
    }

    return [
        'title' => $title,
        'department' => $department,
        'location' => $location,
        'experience' => $experience,
        'work_mode' => $workMode,
        'about' => $about,
        'responsibilities' => json_encode($responsibilities, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        'requirements' => json_encode($requirements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        'is_published' => $isPublished ? 1 : 0,
    ];
}

$pdo = evx_db();

// ---------------------------------------------------------------------
// GET — public by default (published jobs only). ?all=1 additionally
// requires an admin session and includes unpublished jobs + applicant
// counts, for the dashboard's Jobs list.
// ---------------------------------------------------------------------
if ($method === 'GET') {
    $wantAll = ($_GET['all'] ?? '') === '1';

    if ($wantAll) {
        require_admin();
        // Correlated subquery instead of LEFT JOIN + GROUP BY j.id: the
        // latter only works because MySQL tolerates non-aggregated columns
        // in the SELECT list when ONLY_FULL_GROUP_BY is off (not guaranteed
        // on every host/config), and ON DELETE RESTRICT below means a job
        // with zero applications never even has a join row to worry about.
        $stmt = $pdo->query(
            'SELECT j.*,
                (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = j.id) AS applicant_count
             FROM jobs j
             ORDER BY j.created_at DESC'
        );
        $jobs = array_map(fn($row) => evx_job_row_to_array($row, true), $stmt->fetchAll());
        json_response($jobs);
    }

    $stmt = $pdo->query('SELECT * FROM jobs WHERE is_published = 1 ORDER BY created_at DESC');
    $jobs = array_map(fn($row) => evx_job_row_to_array($row, false), $stmt->fetchAll());
    json_response($jobs);
}

// Everything below (create/update/delete) is admin-only.
require_admin();

// ---------------------------------------------------------------------
// POST — create a job.
// ---------------------------------------------------------------------
if ($method === 'POST') {
    $data = evx_validate_job_input(json_input());

    $stmt = $pdo->prepare(
        'INSERT INTO jobs (title, department, location, experience, work_mode, about, responsibilities, requirements, is_published, created_at, updated_at)
         VALUES (:title, :department, :location, :experience, :work_mode, :about, :responsibilities, :requirements, :is_published, NOW(), NOW())'
    );
    $stmt->execute($data);
    $id = (int) $pdo->lastInsertId();

    $fetch = $pdo->prepare('SELECT * FROM jobs WHERE id = :id');
    $fetch->execute(['id' => $id]);
    $row = $fetch->fetch();
    $row['applicant_count'] = 0;

    json_response(evx_job_row_to_array($row, true), 201);
}

// PUT and DELETE both act on a single job identified by ?id=
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    json_error('A valid job id is required.', 422);
}

// ---------------------------------------------------------------------
// PUT — full replace of a job's fields (this is also how the dashboard's
// publish/unpublish toggle works: it PUTs the job it already has in
// memory with only `isPublished` flipped, rather than a separate
// toggle-only endpoint).
// ---------------------------------------------------------------------
if ($method === 'PUT') {
    $data = evx_validate_job_input(json_input());
    $data['id'] = $id;

    $stmt = $pdo->prepare(
        'UPDATE jobs SET
            title = :title, department = :department, location = :location, experience = :experience,
            work_mode = :work_mode, about = :about, responsibilities = :responsibilities,
            requirements = :requirements, is_published = :is_published, updated_at = NOW()
         WHERE id = :id'
    );
    $stmt->execute($data);

    $fetch = $pdo->prepare(
        'SELECT j.*,
            (SELECT COUNT(*) FROM job_applications a WHERE a.job_id = j.id) AS applicant_count
         FROM jobs j WHERE j.id = :id'
    );
    $fetch->execute(['id' => $id]);
    $row = $fetch->fetch();

    if (!$row) {
        json_error('Job not found.', 404);
    }

    json_response(evx_job_row_to_array($row, true));
}

// ---------------------------------------------------------------------
// DELETE — refuses to delete a job that has any applications (the FK is
// ON DELETE RESTRICT and would reject it anyway, but this returns a
// clear, actionable message instead of a raw DB constraint error).
// ---------------------------------------------------------------------
if ($method === 'DELETE') {
    $countStmt = $pdo->prepare('SELECT COUNT(*) FROM job_applications WHERE job_id = :id');
    $countStmt->execute(['id' => $id]);
    $applicantCount = (int) $countStmt->fetchColumn();

    if ($applicantCount > 0) {
        json_error('This job has applicants. Unpublish it instead.', 409);
    }

    $stmt = $pdo->prepare('DELETE FROM jobs WHERE id = :id');
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() === 0) {
        json_error('Job not found.', 404);
    }

    json_response(['success' => true]);
}
