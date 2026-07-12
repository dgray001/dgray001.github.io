<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$userid = $received_data['username'];
$password = $received_data['password'];

if (empty($userid) || !isset($password)) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad login data sent to server',
  ));
  exit(1);
}

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

$error = loginUser($conn, $userid, $password);

if ($error) {
  endSession();
  echo json_encode(array(
    'success' => false,
    'error_message' => $error,
  ));
} else {
  echo json_encode(array(
    'success' => true,
  ));
}

exit();
