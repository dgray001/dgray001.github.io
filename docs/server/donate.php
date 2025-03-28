<?php

require_once(__DIR__ . '/includes/prevent_get.php');

// get post data
$received_data = json_decode(file_get_contents('php://input'), true);

// get authorize.net api login credentials
require_once(__DIR__ . '/includes/config_path.php');
require_once($config_path . '/authorize_login.php');
$api_cred = json_encode(array('name' => $name,
  'transactionKey' => $transactionKey), JSON_FORCE_OBJECT);

// add api credentials to post data
// because authorize.net isn't restful we need to put credentials in front
$post_data = [];
$post_data['getHostedPaymentPageRequest']['merchantAuthentication'] = json_decode($api_cred);
foreach($received_data['getHostedPaymentPageRequest'] as $k => $v) {
  $post_data['getHostedPaymentPageRequest'][$k] = $v;
}

// Initiate curl request
$ch = curl_init();
require_once($config_path . '/is_prod.php');
$url = $is_prod ?
  'https://api.authorize.net/xml/v1/request.api' :
  'https://apitest.authorize.net/xml/v1/request.api';

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post_data));

// receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

$json_str = trim(ltrim($server_output, chr(239).chr(187).chr(191)), "\x0");

if ($server_output) {
  echo json_encode(array(
    'success' => true,
    'result' => json_decode($json_str, true),
  ));
}
else {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Failed to connect to authorize.net servers',
  ));
}

exit();
