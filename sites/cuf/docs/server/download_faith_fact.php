<?php

require_once(__DIR__ . '/includes/prevent_get.php');

require_once(__DIR__ . '/includes/util.php');
$data = json_decode(file_get_contents('php://input'), true);
if (!validateData($data, array('category', 'filename'))) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad download faith fact data sent to server',
  ));
  exit(1);
}

require_once(__DIR__ . '/includes/login_util.php');
require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/permissions.php');

if (!loggedIn() || !hasPermission('downloadFaithFacts', $_SESSION['user_role'])) {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}

// basename() confines these to a single path segment each, closing path traversal
$ff_category = basename($data['category']);
$ff_filename = basename($data['filename']);
$name = $config_path . 'faith_fact_pdfs/' . $ff_category . '/' . $ff_filename . '.pdf';

if (!is_file($name)) {
  header('HTTP/1.0 404 Not Found', TRUE, 404);
  exit();
}

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename=faith_fact_download.pdf');
header('Pragma: no-cache');
readfile($name);

exit();
