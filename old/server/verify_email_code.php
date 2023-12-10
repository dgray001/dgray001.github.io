<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$user_email = $received_data['email'];

if (empty($user_email)) {
  echo json_encode('Bad login data sent to server.');
  exit(1);
}

$expect_activated = true;
if (isset($received_data['expect_activated']) && $received_data['expect_activated'] == 'false') {
  $expect_activated = false;
}

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();

sendActivationCode($conn, $user_email, $expect_activated);

echo json_encode(array('valid' => true));
exit();
