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

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/papers/papers.json', json_encode($received_data));


$data_control = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/__data/data_control.json');
$json_data = json_decode($data_control, true);
$json_data['papers/papers.json'] = time();
forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/data_control.json', json_encode($json_data));

echo json_encode(array('success' => 'true'));
