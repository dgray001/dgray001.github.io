<?php

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}

require_once(__DIR__ . '/includes/db_connection.php');
require_once(__DIR__ . '/includes/login_util.php');

endSession();

// only allow same-origin, path-only redirect targets (never a full URL or
// protocol-relative '//host' path) to prevent this being used as an open redirect
function isSameOriginPath($target): bool {
  return is_string($target) && strlen($target) > 1 && $target[0] === '/' && $target[1] !== '/';
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  if (isset($_GET['hard_redirect']) && isSameOriginPath($_GET['hard_redirect'])) {
    header("location: " . $_GET['hard_redirect']);
  }
  else if (isset($_GET['redirect'])) {
    header("location: /login?redirect=" . $_GET['redirect']);
  }
  else {
    header("location: /login");
  }
} else {
  echo json_encode(array(
    'success' => true,
  ));
}

exit();
