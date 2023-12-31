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
if (!hasPermission('jobsAvailable', $_SESSION["user_role"])) {
  echo json_encode(array(
    'success' => true,
    'error_message' => 'You don\'t have permission to modify jobs data',
  ));
  exit(1);
}

require_once(__DIR__ . '/../includes/file_util.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

forceFilePutContents(
  $_SERVER['DOCUMENT_ROOT'] . '/data/jobs_available/jobs_available.json',
  json_encode($received_data)
);

$data_control = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/data/data_control.json');
$json_data = json_decode($data_control, true);
$json_data['news/news.json'] = time();
forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/data/data_control.json', json_encode($json_data));

echo json_encode(array(
  'success' => true,
));

exit();
