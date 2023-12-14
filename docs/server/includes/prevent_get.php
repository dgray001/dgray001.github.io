<?php

require_once(__DIR__ . '/force_include.php');

// prevent all but POST requests on api code
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}
