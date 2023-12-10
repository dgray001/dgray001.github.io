<?php

require_once(__DIR__ . '/includes/prevent_post.php');

session_start();

setcookie(session_name(), session_id(), time(), '/');
setcookie('email', '', time(), '/');
setcookie('role', '', time(), '/');

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
