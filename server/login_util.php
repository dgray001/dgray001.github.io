<?php

function userEmailExists($conn, $email): array|bool|null {
  $sqlCommand = "SELECT * FROM cuf_users WHERE email = ?;";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $sqlCommand)) {
    echo json_encode('Server can\'t log you in at this time.');
    exit(3);
  }
  mysqli_stmt_bind_param($stmt, "s", $email);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);
  return mysqli_fetch_assoc($result);
}

function loginUser($conn, $email, $password): void {
  $userExists = userEmailExists($conn, $email);
  if (!$userExists) {
    echo json_encode('User doesn\'t exist');
    exit(4);
  }
  $hashedPassword = $userExists["password"];
  if (!password_verify($password, $hashedPassword)) {
    echo json_encode('Password doesn\'t match');
    exit(5);
  }
  session_set_cookie_params('3600', 'www.example.com', isset($_SERVER['HTTPS']) ?
    $_SERVER['HTTPS'] !== 'off' : false, true);
  session_start();
  $_SESSION["user_id"] = $userExists["id"];
  $_SESSION["user_email"] = $userExists["email"];
}