<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data & ip address
$received_data = json_decode(file_get_contents('php://input'), true);
require_once(__DIR__ . '/includes/util.php');
$client_ip = get_ip_address();

require_once(__DIR__ . '/includes/recaptcha_util.php');

if (verifyRecaptchaToken($received_data, $client_ip)) {
  markRecaptchaVerified();
  echo json_encode(array(
    'success' => true,
  ));
} else {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Recaptcha verification failed',
  ));
}

exit();
