<?php

// prevent GET requests on server code
if ( $_SERVER['REQUEST_METHOD']=='GET' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {
    header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
    die( header( 'location: /' ) );
}

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

// get mail config
require_once(__DIR__ . "/../../config/mail_config.php");

$msg = json_encode($received_data);

// send mail
mail($contact_form_recipient, "CUF | Contact Form Submission Data", $msg);
if (mail("yodan.and.the.sixth.character@gmail.com", "CUF | Contact Form Submission Data", $msg)) {
  echo json_encode('true');
}
else {
  echo json_encode('false');
}