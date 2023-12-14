<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$user_email = $received_data['email'];
$user_code = $received_data['code'];
$new_password = $received_data['password'];

if (empty($user_email) || empty($user_code) || empty($new_password)) {
  echo json_encode('Bad login data sent to server.');
  exit(1);
}

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

resetPassword($conn, $user_email, $user_code, $new_password);
loginUser($conn, $user_email, $new_password);

echo json_encode(array('valid' => true));
exit();