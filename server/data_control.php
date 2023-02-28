<?php

require_once(__DIR__ . '/includes/prevent_get.php');

session_start();

require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/permissions.php');

require_once(__DIR__ . '/includes/file_util.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

forceFilePutContents($_SERVER['DOCUMENT_ROOT'] . '/__data/data_control.json', json_encode($received_data));

echo json_encode(array('success' => true));