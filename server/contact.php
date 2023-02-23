<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

// get mail config
require_once(__DIR__ . "/../../config/mail_config.php");

$msg = $received_data;

$headers[] = 'X-Mailer: PHP/' . phpversion();
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=iso-8859-1';

// send mail
$sent = mail($contact_form_recipient, "CUF | Contact Form Submission Data", $msg, implode("\r\n", $headers));
if ($sent) {
  echo json_encode('true');
}
else {
  echo json_encode('false');
}
exit();