<?php

require_once(__DIR__ . '/force_include.php');

// prevent all but POST requests on api code
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}

require_once(__DIR__ . '/util.php');
require_once(__DIR__ . '/db_connection.php');
require_once(__DIR__ . '/rate_limit_util.php');

$conn = connectToTable();
$rate_limit_error = enforceApiRateLimit($conn, get_ip_address());
if ($rate_limit_error) {
  echo json_encode(array(
    'success' => false,
    'error_message' => $rate_limit_error,
  ));
  exit(1);
}
