<?php

require_once(__DIR__ . '/force_include.php');

/** Returns whether the email was sent */
function sendEmail($recipient, $title, $body): bool {
  $headers[] = 'X-Mailer: PHP/' . phpversion();
  $headers[] = 'MIME-Version: 1.0';
  $headers[] = 'Content-type: text/html; charset=iso-8859-1';
  $headers[] = 'From: The St. Joseph Foundation <noreply@stjosephcanonlaw.com>';
  return mail($recipient, $title, $body, implode("\r\n", $headers));
}
