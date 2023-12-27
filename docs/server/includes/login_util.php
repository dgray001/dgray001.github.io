<?php


require_once(__DIR__ . '/force_include.php');


/** Inactivity before automatically logged out */
function inactivityTime(): int {
  return 60 * 30;
}


function startSession(): void {
  session_name("session");
  session_start();
}


/** Refresh session cookies to prevent session from expiring */
function refreshCookies(): void {
  $expire = time() + inactivityTime(); // refresh cookies
  $secure = isset($_SERVER["HTTPS"]) ? $_SERVER["HTTPS"] !== "off" : false;
  $path = "/";
  $domain = "";
  $http_only = false; // setting to true will break frontend cookie lookup

  setcookie(session_name(), session_id(), $expire, $path, $domain, $secure, $http_only);
  setcookie("email", $_SESSION["user_email"], $expire, $path, $domain, $secure, $http_only);
  setcookie("role", $_SESSION["user_role"], $expire, $path, $domain, $secure, $http_only);

  $_SESSION["session_expire"] = $expire;
}


function loggedIn(): bool {
  startSession();
  $loggedIn =
    isset($_SESSION["session_expire"]) &&
    isset($_SESSION["user_id"]) &&
    isset($_SESSION["user_email"]) &&
    isset($_SESSION["user_role"])
  ;

  if (!$loggedIn) {
    return false;
  }
  if (time() > $_SESSION["session_expire"]) {
    endSession(); // session expired
    return false;
  }

  refreshCookies();
  session_write_close();
  return true;
}


/**
 * Ends current session, example from:
 * https://www.php.net/manual/en/function.session-destroy.php#refsect1-function.session-destroy-examples
 */
function endSession(): void {
  startSession();

  $params = session_get_cookie_params();
  setcookie(session_name(), "", time(), $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  setcookie("email", "", time(), $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  setcookie("role", "", time(), $params["path"], $params["domain"], $params["secure"], $params["httponly"]);

  $_SESSION = array();
  session_destroy();
}


/** Returns tuple of result and string error message */
function userEmailExists($conn, $email): array {
  $sqlCommand = "SELECT * FROM cuf_users WHERE email = ?;";
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $sqlCommand)) {
    return array(null, 'Server can\'t log you in at this time');
  }
  if (!mysqli_stmt_bind_param($stmt, "s", $email)) {
    return array(null, 'Parameter binding failed');
  }
  if (!mysqli_stmt_execute($stmt)) {
    return array(null, 'Command execution failed');
  }

  $user = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
  if (is_null($user)) {
    return array(null, 'User doesn\'t exist');
  } else if (!$user) {
    return array(null, 'SQL server error');
  }

  return array($user, '');
}


/** Returns error message */
function loginUser($conn, $email, $password): string {
  if (loggedIn()) {
    return 'Already logged in';
  }
  list($user, $error) = userEmailExists($conn, $email);
  if ($error) {
    endSession();
    return $error;
  }
  if (!isset($user['activated']) || !$user['activated']) {
    endSession();
    return 'Account not activated';
  }
  $hashedPassword = $user["password_hash"];
  if (password_verify($password, $hashedPassword)) {
    endSession();
    return 'Password doesn\'t match';
  }
  $_SESSION["user_id"] = $user["id"];
  $_SESSION["user_email"] = $user["email"];
  $_SESSION["user_role"] = $user["role"];
  refreshCookies();
  return '';
}

/** Returns error message */
function sendActivationCode($conn, $email, $expect_activated): string {
  list($user, $error) = userEmailExists($conn, $email);
  if ($error) {
    return $error;
  }
  if ($expect_activated && !$user['activated']) {
    return 'Account not activated';
  }
  else if (!$expect_activated && $user['activated']) {
    return 'Account already activated';
  }
  $code = bin2hex(random_bytes(3));
  $expiration = time() + 60 * 10;
  require_once(__DIR__ . '/send_email.php');

  $cmd = 'UPDATE cuf_users SET activation_code = ?, activation_code_expiration = ? WHERE email = ?';
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $cmd)) {
    return 'Server send activation code at this time';
  }
  $hashed_code = password_hash($code, PASSWORD_DEFAULT);
  if (!mysqli_stmt_bind_param($stmt, "sds", $hashed_code, $expiration, $email)) {
    return 'Parameter binding failed';
  }
  if (!mysqli_stmt_execute($stmt)) {
    return 'Command execution failed';
  }
  $result = mysqli_stmt_affected_rows($stmt);
  if ($result != 1) {
    return 'Command did not affect a single row';
  }

  $email_body = "
  <html>
    <head>
      <title>CUF Single Use Email Verification Code</title>
    </head>
    <body>
      <p>
        Below is your single-use email verification code. This code will expire in 10 minutes. If you did not request this code, someone may be trying to access your CUF.org account
      </p>
        $code
      <p>
      </p>
    </body>
  </html>
  ";
  if (!sendEmail($email, 'CUF Single Use Email Verification Code', $email_body)) {
    return 'Email didn\'t send';
  }
  return '';
}

function verifyEmail($conn, $email, $code, $expect_activated): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if ($expect_activated && !$user['activated']) {
    echo json_encode('Account not activated');
    exit(22);
  }
  else if (!$expect_activated && $user['activated']) {
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

function resetPassword($conn, $email, $code, $password): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if (!$user['activated']) {
    echo json_encode('Account not activated');
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

  $cmd = 'UPDATE cuf_users SET password_hash = ? WHERE email = ?';
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $cmd)) {
    echo json_encode('Server can\'t activate account at this time.');
    exit(25);
  }
  $hashed_password = password_hash($password, PASSWORD_DEFAULT);
  if (!mysqli_stmt_bind_param($stmt, "ss", $hashed_password, $email)) {
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

function changePassword($conn, $email, $old_password, $new_password): void {
  $user = userEmailExists($conn, $email);
  if (!$user) {
    echo json_encode('User doesn\'t exist');
    exit(21);
  }
  if (!$user['activated']) {
    echo json_encode('Account not activated');
    exit(22);
  }
  if (!password_verify($old_password, $user['password_hash'])) {
    echo json_encode('Incorrect old password');
    exit(23);
  }

  $cmd = 'UPDATE cuf_users SET password_hash = ? WHERE email = ?';
  $stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($stmt, $cmd)) {
    echo json_encode('Server can\'t activate account at this time.');
    exit(24);
  }
  $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
  if (!mysqli_stmt_bind_param($stmt, "ss", $hashed_password, $email)) {
    echo json_encode('Parameter binding failed.');
    exit(25);
  }
  if (!mysqli_stmt_execute($stmt)) {
    echo json_encode('Command execution failed.');
    exit(26);
  }
  $result = mysqli_stmt_affected_rows($stmt);
  if ($result != 1) {
    echo json_encode('Command did not affect a single row.');
    exit(27);
  }
}