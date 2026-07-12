<?php

require_once(__DIR__ . '/includes/prevent_get.php');

require_once(__DIR__ . '/includes/util.php');
$data = json_decode(file_get_contents('php://input'), true);
if (!validateData($data, array('email')) || !validateData($data, array('expect_activated', 'expect_logged_in'), true)) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad verification email data sent to server',
  ));
  exit(1);
}

$user_email = $data['email'];
$expect_activated = $data['expect_activated'];
$expect_logged_in = $data['expect_logged_in'];

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

$error = sendVerificationCode($conn, $user_email, $expect_activated, $expect_logged_in);

if ($error) {
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
