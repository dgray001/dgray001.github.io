<?php
session_start();

require_once(__DIR__ . '/../server/includes/login_util.php');

// not logged in
if (!loggedIn()) {
  header('location: /server/logout.php?redirect=profile');
  exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="keywords" content="Catholics, United, Faith, Profile">
  <meta name="author" content="Daniel Gray">
  <title>Profile | CUF</title>
  <base href="../">
  <script type="module" src="./profile/profile_init.js"></script>
  <script src="https://www.google.com/recaptcha/api.js?render=6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1"></script>
</head>
<body>
  <cuf-header></cuf-header>
  <div class="page-content">
    <div class="actual-content">
      <header>
        <h1 class="page-title">Profile</h1>
      </header>
      <h2 class="section-title">Information</h2>
      <div class="section">
        <div class="info">
          Email Address: <span id="info-email">...</span>
        </div>
        <div class="info">
          Role: <span id="info-role">...</span>
        </div>
      </div>
      <h2 class="section-title">Account Management</h2>
      <div class="section">
        <button id="change-password">Change Password</button>
        <div id="change-password-sm"></div>
      </div>
    </div>
    <cuf-sidebar panels='page'></cuf-sidebar>
  </div>
  <cuf-footer-contact></cuf-footer-contact>
</body>
</html>
