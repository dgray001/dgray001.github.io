<?php

require_once(__DIR__ . '/includes/prevent_get.php');

require_once(__DIR__ . '/includes/util.php');
$data = json_decode(file_get_contents('php://input'), true);
if (
  !validateData($data, array('email', 'verification_code', 'password')) ||
  !validateData($data, array('expect_activated', 'expect_logged_in'), true)
) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad verify email data sent to server',
  ));
  exit(1);
}

$user_email = $data['email'];
$user_code = $data['verification_code'];
$new_password = $data['password'];
$expect_activated = $data['expect_activated'];
$expect_logged_in = $data['expect_logged_in'];

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

$error = activateAccount($conn, $user_email, $user_code, $new_password, $expect_activated, $expect_logged_in);

if ($error) {
  endSession();
  echo json_encode(array(
    'success' => false,
    'error_message' => $error,
  ));
} else {
  $error = loginUser($conn, $user_email, $new_password);
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
}

exit();