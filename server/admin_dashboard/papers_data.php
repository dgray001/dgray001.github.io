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
if (!hasPermission('positionPapers', $_SESSION["role"])) {
  echo json_encode('You don\'t have permission to upload position papers');
  exit(2);
}

require_once('../create_file.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/papers/papers.json', json_encode($received_data));

echo json_encode(array('success' => true));