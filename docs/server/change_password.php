<?php

require_once(__DIR__ . '/includes/prevent_get.php');

require_once(__DIR__ . '/includes/util.php');
$data = json_decode(file_get_contents('php://input'), true);
if (!validateData($data, array('user_email', 'old_password', 'new_password'))) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad change password data sent to server',
  ));
  exit(1);
}

$user_email = $data['user_email'];
$old_password = $data['old_password'];
$new_password = $data['new_password'];

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

$error = changePassword($conn, $user_email, $old_password, $new_password);

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
