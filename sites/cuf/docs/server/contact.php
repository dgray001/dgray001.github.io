<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

require_once(__DIR__ . '/includes/recaptcha_util.php');
if (!requireRecaptchaVerified()) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Recaptcha verification failed, please try again',
  ));
  exit(1);
}

// get mail config
require_once(__DIR__ . '/includes/send_email.php');
require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/mail_config.php');

// send mail
if (sendEmail($contact_form_recipient, 'CUF | Contact Form Submission Data', $received_data)) {
  echo json_encode(array(
    'success' => true,
  ));
}
else {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Email failed to send',
  ));
}

exit();
