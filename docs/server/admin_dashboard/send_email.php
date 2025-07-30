<?php

require_once(__DIR__ . '/../includes/prevent_get.php');

require_once(__DIR__ . '/../includes/config_path.php');
require_once($config_path . '/permissions.php');
require_once(__DIR__ . '/../includes/login_util.php');

// not logged in
if (!loggedIn()) {
  header('location: /server/logout.php?redirect=admin_dashboard');
  exit(1);
}

// logged in but doesn't have permission
if (!hasPermission('sendEmail', $_SESSION["user_role"])) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'You don\'t have permission to send email',
  ));
  exit(1);
}

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

require_once(__DIR__ . '/../includes/send_email.php');

if (sendEmail($received_data["email"], $received_data["subject"], $received_data["body"])) {
  echo json_encode(array(
    'success' => true,
  ));
} else {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Error sending email',
  ));
}

exit();
