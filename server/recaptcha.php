<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data & ip address
$received_data = json_decode(file_get_contents('php://input'), true);
require_once(__DIR__ . '/includes/util.php');
$client_ip = get_ip_address();

// get recaptcha api login key
require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/recaptcha_key.php');
$post_data = 'secret=' . $recaptcha_key . '&response=' . $received_data . '&remoteip=' . $client_ip;

// Initiate curl request
$ch = curl_init();
// set parameters
curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
// receive server response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close($ch);

echo $server_output;
exit();