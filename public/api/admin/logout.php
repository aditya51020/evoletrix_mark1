<?php
declare(strict_types=1);
require __DIR__ . '/../bootstrap.inc.php';

require_method('POST');
require_admin();

$_SESSION = [];
session_destroy();

json_response(['success' => true]);
