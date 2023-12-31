<?php

require_once(__DIR__ . '/../includes/prevent_get.php');

require_once(__DIR__ . '/../includes/config_path.php');
require_once($config_path . '/permissions.php');
require_once(__DIR__ . '/../includes/login_util.php');

// not logged in
if (!loggedIn()) {
  header('location: /server/logout.php?redirect=admin_dashboard');
  exit(1);
}

// logged in but doesn't have permission
if (!hasPermission('positionPapers', $_SESSION["user_role"])) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'You don\'t have permission to modify position papers',
  ));
  exit(1);
}

require_once(__DIR__ . '/../includes/file_util.php');

$filename = $_SERVER['HTTP_X_FILE_NAME'];
$in = fopen('php://input', 'r');
$filetype = mime_content_type($in);

if ($filetype !== 'application/pdf') {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Position paper upload must be a pdf',
  ));
  exit(1);
}

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/data/position_papers/' . $filename, $in);

echo json_encode(array(
  'success' => true,
));

exit();
