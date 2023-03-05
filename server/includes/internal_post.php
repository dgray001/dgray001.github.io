<?php

require_once(__DIR__ . '/force_include.php');

function curlPost($data, $path): bool {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://' . $_SERVER['HTTP_HOST'] . $path);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
  curl_setopt($ch, CURLOPT_VERBOSE, TRUE);
  $result = curl_exec($ch);
  curl_close($ch);
  return boolval($result);
}
