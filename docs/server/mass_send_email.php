<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

// get mail config
require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

$conn = connectToTable();
$users = $received_data["all_users"] ?
  getAllUsers($conn) :
  getAllUsersActivated($conn, $received_data["activated"])
;
if (is_string($users)) {
  echo json_encode(array(
    'success' => false,
    'error_message' => $users,
  ));
  exit(1);
}

require_once(__DIR__ . '/includes/send_email.php');
require(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/mail_config.php');

$sent_count = 0;
$errors = [];
foreach ($users as $user) {
  if (sendEmail($user["email"], $received_data["subject"], $received_data["body"])) {
    $sent_count++;
  } else {
    $errors[] = 'Email failed to send to ' . $user["email"];
  }
}

echo json_encode(array(
  'success' => true,
  'data' => array(
    'sent_count' => $sent_count,
    'errors' => $errors,
  ),
));

exit();
