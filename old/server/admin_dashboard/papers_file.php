<?php

require_once(__DIR__ . '/../includes/prevent_get.php');

session_start();

require_once(__DIR__ . '/../includes/config_path.php');
require_once($config_path . '/permissions.php');

// not logged in
if (!isset($_SESSION["role"])) {
  header('location: /server/logout.php?redirect=admin_dashboard');
  exit(1);
}

// logged in but doesn't have permission
if (!hasPermission('positionPapers', $_SESSION["role"])) {
  echo json_encode('You don\'t have permission to upload position papers');
  exit(2);
}

require_once(__DIR__ . '/../includes/file_util.php');

$filename = $_SERVER['HTTP_X_FILE_NAME'];
$in = fopen('php://input', 'r');
$filetype = mime_content_type($in);

if ($filetype != 'application/pdf') {
  echo json_encode('Must upload a pdf');
  exit(3);
}

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/papers/' . $filename, $in);

echo json_encode(array('success' => true));
