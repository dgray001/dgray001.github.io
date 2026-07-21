<?php

require_once(__DIR__ . '/force_include.php');

/**
 * @return string client IP or 'unknown' if unknown
 */
function get_ip_address() {
  foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
    if (array_key_exists($key, $_SERVER) === true){
      foreach (explode(',', $_SERVER[$key]) as $ip){
        $ip = trim($ip); // just to be safe

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
          return $ip;
        }
      }
    }
  }
  return 'unknown';
}

/**
 * @param array $data data to validate
 * @param array $fields fields to validate
 * @param bool $allow_empty whether empty() will be called
 * @return bool whether all fields are valid
 */
function validateData($data, $fields, $allow_empty = false): bool {
  if (!isset($data)) {
    return false;
  }
  foreach ($fields as & $field) {
    if (!isset($data[$field])) {
      return false;
    }
    if (!$allow_empty && empty($data[$field])) {
      return false;
    }
  }
  unset($field);
  return true;
}
