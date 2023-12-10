<?php
session_start();

require_once(__DIR__ . '/../server/includes/config_path.php');
require_once($config_path . '/permissions.php');

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
  <script type="module" src="./admin_dashboard/admin_dashboard_init.js"></script>
</head>
<body>
  <cuf-header></cuf-header>
  <div class="page-content">
    <div class="actual-content">
      <header>
        <h1 class="page-title">Admin Dashboard</h1>
      </header>
      <?php
      if (hasPermission('layWitness', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-laywitness></cuf-admin-dashboard-laywitness>';
      }
      if (hasPermission('news', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-news></cuf-admin-dashboard-news>';
      }
      if (hasPermission('faithFacts', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-faith-facts></cuf-admin-dashboard-faith-facts>';
      }
      if (hasPermission('chapters', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-chapters></cuf-admin-dashboard-chapters>';
      }
      if (hasPermission('positionPapers', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-papers></cuf-admin-dashboard-papers>';
      }
      if (hasPermission('jobsAvailable', $_SESSION["role"])) {
        echo '<cuf-admin-dashboard-jobs></cuf-admin-dashboard-jobs>';
      }
      ?>
    </div>
  </div>
  <cuf-footer-contact></cuf-footer-contact>
</body>
</html>
