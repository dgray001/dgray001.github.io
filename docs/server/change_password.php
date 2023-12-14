<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$user_email = $received_data['email'];
$old_password = $received_data['old_password'];
$new_password = $received_data['new_password'];

if (empty($user_email) || empty($old_password) || empty($new_password)) {
  echo json_encode('Bad login data sent to server.');
  exit(1);
}

session_start();

// not logged in as correct person
if (!isset($_SESSION["user_email"]) || $_SESSION['user_email'] != $user_email) {
  echo json_encode("Not logged in as $user_email.");
  exit(2);
}

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

changePassword($conn, $user_email, $old_password, $new_password);

echo json_encode(array('valid' => true));
exit();
