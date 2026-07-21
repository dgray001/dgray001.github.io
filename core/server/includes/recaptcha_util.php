<?php

require_once(__DIR__ . '/force_include.php');

/** How long a verified recaptcha stays valid for the next protected request */
function recaptchaVerifiedWindow(): int {
  return 30;
}

/** Minimum v3 score (0.0-1.0, higher = more likely human) to accept */
function recaptchaScoreThreshold(): float {
  return 0.5;
}

function ensureRecaptchaSessionStarted(): void {
  if (session_status() === PHP_SESSION_ACTIVE) {
    return;
  }
  session_name("session");
  session_start();
}

/**
 * Verifies a recaptcha token against Google's siteverify endpoint.
 * TLS verification is left on (do not disable CURLOPT_SSL_VERIFYPEER/HOST).
 */
function verifyRecaptchaToken($token, $client_ip): bool {
  if (empty($token)) {
    return false;
  }
  require_once(__DIR__ . '/config_path.php');
  require_once($config_path . '/recaptcha_key.php');

  $post_data = 'secret=' . $recaptcha_key . '&response=' . $token . '&remoteip=' . $client_ip;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTPS);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
  curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  $server_output = curl_exec($ch);
  curl_close($ch);

  if ($server_output === false) {
    return false;
  }
  $result = json_decode($server_output, true);
  return
    isset($result['success']) && $result['success'] === true &&
    isset($result['action']) && $result['action'] === 'submit' &&
    isset($result['score']) && $result['score'] >= recaptchaScoreThreshold();
}

/** Marks the current session as having just passed a recaptcha check */
function markRecaptchaVerified(): void {
  ensureRecaptchaSessionStarted();
  $_SESSION['recaptcha_verified_until'] = time() + recaptchaVerifiedWindow();
}

/**
 * Returns whether the current session passed a recaptcha check recently.
 * One-time use: consumes the flag so it can't be replayed across requests.
 */
function requireRecaptchaVerified(): bool {
  ensureRecaptchaSessionStarted();
  $verified =
    isset($_SESSION['recaptcha_verified_until']) &&
    time() < $_SESSION['recaptcha_verified_until'];
  unset($_SESSION['recaptcha_verified_until']);
  return $verified;
}
