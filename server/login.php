<?php

// prevent GET requests on server code
if ( $_SERVER['REQUEST_METHOD']=='GET' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {
  header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
  die( header( 'location: /' ) );
}

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

$userid = $received_data['username'];
$password = $received_data['password'];

require_once("./db_connection.php");
require_once("./login_util.php");

if (empty($userid) || !isset($password)) {
  echo json_encode('Bad login data sent to server.');
  exit(1);
}

$conn = connectToTable();

loginUser($conn, $userid, $password);

echo json_encode(array('valid' => true));
exit();