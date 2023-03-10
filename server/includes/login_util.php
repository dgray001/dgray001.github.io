<?php

require_once(__DIR__ . '/force_include.php');

function loggedIn(): bool {
  return isset($_SESSION["user_id"]) && isset($_SESSION["user_email"]) && isset($_SESSION["role"]);
}

function userEmailExists($conn, $email): array|bool|null {
  $sqlCommand = "SELECT * FROM cuf_users WHERE email = ?;";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $sqlCommand)) {
    echo json_encode('Server can\'t log you in at this time.');
    exit(11);
  }
  if (!mysqli_stmt_bind_param($stmt, "s", $email)) {
    echo json_encode('Parameter binding failed.');
    exit(12);
  }
  if (!mysqli_stmt_execute($stmt)) {
    echo json_encode('Command execution failed.');
    exit(13);
  }
  $result = mysqli_stmt_get_result($stmt);
  return mysqli_fetch_assoc($result);
}

function loginUser($conn, $email, $password): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if (!$user['activated']) {
    echo json_encode('Account not activated');
    exit(22);
  }
  $hashedPassword = $user["password_hash"];
  if (!password_verify($password, $hashedPassword)) {
    echo json_encode('Password doesn\'t match');
    exit(23);
  }
  $session_lifetime = 60 * 60; // 1 hour until relogin required
  session_set_cookie_params($session_lifetime, '/', $_SERVER['SERVER_NAME'],
    isset($_SERVER['HTTPS']) ? $_SERVER['HTTPS'] !== 'off' : false, true);
  session_start();
  $_SESSION["user_id"] = $user["id"];
  $_SESSION["user_email"] = $user["email"];
  $_SESSION["role"] = $user["role"];
  // set session lifetime here since doesn't work in session_set_cookie_params
  setcookie(session_name(), session_id(), time() + $session_lifetime, '/');
  setcookie('email', $user["email"], time() + $session_lifetime, '/');
  setcookie('role', $user["role"], time() + $session_lifetime, '/');
}

function sendActivationCode($conn, $email): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if ($user['activated']) {
    echo json_encode('Account already activated');
    exit(22);
  }
  $code = bin2hex(random_bytes(3));
  $expiration = time() + 60 * 10;
  require_once(__DIR__ . '/send_email.php');

  $cmd = 'UPDATE cuf_users SET activation_code = ?, activation_code_expiration = ? WHERE email = ?';
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $cmd)) {
    echo json_encode('Server send activation code at this time.');
    exit(23);
  }
  $hashed_code = password_hash($code, PASSWORD_DEFAULT);
  if (!mysqli_stmt_bind_param($stmt, "sds", $hashed_code, $expiration, $email)) {
    echo json_encode('Parameter binding failed.');
    exit(24);
  }
  if (!mysqli_stmt_execute($stmt)) {
    echo json_encode('Command execution failed.');
    exit(25);
  }
  $result = mysqli_stmt_affected_rows($stmt);
  if ($result != 1) {
    echo json_encode('Command did not affect a single row.');
    exit(26);
  }

  if (!sendEmail($email, 'CUF Single Use Email Verification Code', $code)) {
    echo json_encode('Email didn\'t send');
    exit(27);
  }
}

function verifyEmail($conn, $email, $code): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if ($user['activated']) {
    echo json_encode('Account already activated');
    exit(22);
  }
  if (time() > $user['activation_code_expiration']) {
    echo json_encode('Single use code expired');
    exit(23);
  }
  if (!password_verify($code, $user['activation_code'])) {
    echo json_encode('Incorrect code');
    exit(24);
  }
}

function activateAccount($conn, $email, $code, $password): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if ($user['activated']) {
    echo json_encode('Account already activated');
    exit(22);
  }
  if (time() > $user['activation_code_expiration']) {
    echo json_encode('Single use code expired');
    exit(23);
  }
  if (!password_verify($code, $user['activation_code'])) {
    echo json_encode('Incorrect code');
    exit(24);
  }

  $cmd = 'UPDATE cuf_users SET password_hash = ?, activated = ? WHERE email = ?';
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $cmd)) {
    echo json_encode('Server can\'t activate account at this time.');
    exit(25);
  }
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);
  $activated = 1;
  if (!mysqli_stmt_bind_param($stmt, "sds", $hashed_password, $activated, $email)) {
    echo json_encode('Parameter binding failed.');
    exit(26);
  }
  if (!mysqli_stmt_execute($stmt)) {
    echo json_encode('Command execution failed.');
    exit(27);
  }
  $result = mysqli_stmt_affected_rows($stmt);
  if ($result != 1) {
    echo json_encode('Command did not affect a single row.');
    exit(28);
  }
}