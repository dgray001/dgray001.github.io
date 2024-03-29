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
if (!hasPermission('layWitness', $_SESSION["user_role"])) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'You don\'t have permission to modify Lay Witness',
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
    'error_message' => 'Lay Witness upload must be a pdf',
  ));
  exit(1);
}

$err = forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/data/lay_witness/' . $filename, $in);

if ($err) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Error attempting to create file: ' . $err,
  ));
} else {
  echo json_encode(array(
    'success' => true,
  ));
}

exit();
