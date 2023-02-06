<?php
session_start();

require_once("../../config/permissions.php");

// not logged in
if (!isset($_SESSION["role"])) {
  header('location: /server/logout.php?redirect=admin_dashboard');
  exit();
}

// logged in but doesn't have permission
if (!hasPermission('viewAdminDashboard', $_SESSION["role"])) {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  die(header('location: /'));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="keywords" content="Catholics, United, Faith, Admin, Dashboard">
  <meta name="author" content="Daniel Gray">
  <title>Admin Dashboard | CUF</title>
  <base href="../">
  <link rel="stylesheet" href="./admin_dashboard/admin_dashboard.css">
  <link rel="icon" type="image/png" href="./__images/logo_square.png">
  <script type="module" src="./admin_dashboard/admin_dashboard.js"></script>
  <script type="module" src="./scripts/page_layout_components.js" async></script>
  <script src="https://www.google.com/recaptcha/api.js"></script>
</head>
<body>
  <cuf-header></cuf-header>
  <div class="page-content">
    <div class="actual-content">
      <header>
        <h1 class="page-title">Admin Dashboard</h1>
      </header>
    </div>
    <cuf-sidebar panels='page'></cuf-sidebar>
  </div>
  <cuf-footer-contact></cuf-footer-contact>
</body>
</html>