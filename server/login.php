<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$userid = $received_data['username'];
$password = $received_data['password'];

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

if (empty($userid) || !isset($password)) {
  echo json_encode('Bad login data sent to server.');
  exit(1);
}

$conn = connectToTable();

loginUser($conn, $userid, $password);

echo json_encode(array('valid' => true));
exit();