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
if (!hasPermission('news', $_SESSION["role"])) {
  echo json_encode('You don\'t have permission to upload News');
  exit(2);
}

require_once(__DIR__ . '/../includes/file_util.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/news/news.json', json_encode($received_data));

echo json_encode(array('success' => true));