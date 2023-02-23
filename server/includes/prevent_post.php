<?php

require_once(__DIR__ . '/force_include.php');

// prevent all but GET requests on api code
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}