<?php

require_once(__DIR__ . '/force_include.php');

/**
 * Assumed api_rate_limits table schema (inferred, not yet reviewed against a
 * real database): ip_address (unique), request_count, window_start
 *
 * Fails open (never blocks a request) if the table is missing or a query
 * fails, so this can ship before the table exists on a given site's database.
 */

function apiRateLimitWindow(): int {
  return 60 * 15; // 15 minutes
}

function apiRateLimitMaxRequests(): int {
  return 60;
}

/** Returns an error message if this IP has exceeded the request rate, else '' */
function enforceApiRateLimit($conn, $ip_address): string {
  $now = time();
  $window_start_cutoff = $now - apiRateLimitWindow();

  $select_cmd = 'SELECT request_count, window_start FROM api_rate_limits WHERE ip_address = ?';
  $select_stmt = mysqli_stmt_init($conn);
  if (!mysqli_stmt_prepare($select_stmt, $select_cmd) || !mysqli_stmt_bind_param($select_stmt, "s", $ip_address) || !mysqli_stmt_execute($select_stmt)) {
    return '';
  }
  $row = mysqli_fetch_assoc(mysqli_stmt_get_result($select_stmt));

  if (!$row || $row['window_start'] < $window_start_cutoff) {
    $cmd = 'REPLACE INTO api_rate_limits (ip_address, request_count, window_start) VALUES (?, 1, ?)';
    $stmt = mysqli_stmt_init($conn);
    if (mysqli_stmt_prepare($stmt, $cmd)) {
      mysqli_stmt_bind_param($stmt, "sd", $ip_address, $now);
      mysqli_stmt_execute($stmt);
    }
    return '';
  }

  $new_count = $row['request_count'] + 1;
  if ($new_count > apiRateLimitMaxRequests()) {
    $seconds_left = $row['window_start'] + apiRateLimitWindow() - $now;
    $minutes_left = (int) ceil(max(1, $seconds_left) / 60);
    return "Too many requests. Please try again in $minutes_left minute(s).";
  }

  $cmd = 'UPDATE api_rate_limits SET request_count = ? WHERE ip_address = ?';
  $stmt = mysqli_stmt_init($conn);
  if (mysqli_stmt_prepare($stmt, $cmd)) {
    mysqli_stmt_bind_param($stmt, "ds", $new_count, $ip_address);
    mysqli_stmt_execute($stmt);
  }
  return '';
}
