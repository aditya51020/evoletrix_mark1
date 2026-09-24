<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.inc.php';

require_method('GET');
$admin = require_admin();

// Hand back a fresh CSRF token too, so a dashboard page reload (which
// re-checks the session here) always has a valid token to work with.
$csrfToken = $_SESSION['csrf_token'] ?? evx_new_csrf_token();

json_response([
    'admin' => $admin,
    'csrfToken' => $csrfToken,
]);
