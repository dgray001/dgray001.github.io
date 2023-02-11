<?php

// prevent POST requests on server code
if ( $_SERVER['REQUEST_METHOD']=='POST' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {
  header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
  die( header( 'location: /' ) );
}

session_start();

setcookie(session_name(), session_id(), time(), '/');
setcookie('email', $user["email"], time(), '/');
setcookie('role', $user["role"], time(), '/');

session_unset();
session_destroy();

if (isset($_GET['hard_redirect'])) {
  header("location: " . $_GET['hard_redirect']);
}
else if (isset($_GET['redirect'])) {
  header("location: ../login?redirect=" . $_GET['redirect']);
}
else {
  header("location: ../login");
}

exit();