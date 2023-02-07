<?php

// prevent all but POST requests on server code
if ($_SERVER['REQUEST_METHOD'] != 'POST' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'])) {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  die(header('location: /'));
}

session_start();

require_once('../../../config/permissions.php');

// not logged in
if (!isset($_SESSION["role"])) {
  header('location: /server/logout.php?redirect=admin_dashboard');
  exit(1);
}

// logged in but doesn't have permission
if (!hasPermission('viewAdminDashboard', $_SESSION["role"])) {
  echo json_encode('You don\'t have permission to upload Lay Witness');
  exit(2);
}

require_once('../create_file.php');

$filename = $_SERVER['HTTP_X_FILE_NAME'];
$in = fopen('php://input', 'r');
$filetype = mime_content_type($in);

if ($filetype != 'application/pdf') {
  echo json_encode('Must upload a pdf');
  exit(3);
}

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/lay_witness/' . $filename, $in);

echo json_encode(array('success' => true));