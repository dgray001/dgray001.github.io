<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

// get mail config
require_once(__DIR__ . '/includes/send_email.php');
require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/mail_config.php');

// send mail
if (sendEmail($donate_form_recipient, 'CUF | Donate Form Submission Data', $received_data)) {
  echo json_encode('true');
}
else {
  echo json_encode('false');
}
exit();
