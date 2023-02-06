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
  <script type="module" src="./scripts/form_components.js" async></script>
  <script src="https://www.google.com/recaptcha/api.js?render=6LcRVAwkAAAAABsESBOrqe69rI_U6J5xEhI2ZBI1"></script>
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
        echo '<div class="section" id="layWitness">';
        echo '<h2 class="section-title">Lay Witness</h2>';
        echo '<label for="laywitness-file-upload">Upload PDF:</label><br>';
        echo '<input id="laywitness-file-upload" type="file" accept="application/pdf">';
        echo '<form id="laywitness-form" action="javascript:submitForm()">';
        echo '<cuf-form-section-laywitness id="section-laywitness"></cuf-form-section-laywitness>';
        echo '<button class="form-submit-button" id="laywitness-form-button" onclick="submitLaywitnessFormButton()"type="button">Upload Laywitness</button>';
        echo '</form>';
        echo '<div id="laywitness-form-status-message"></div>';
        echo '</div>';
      }
      if (hasPermission('news', $_SESSION["role"])) {
        echo '<div class="section" id="news">';
        echo '<h2 class="section-title">News</h2>';
        echo '</div>';
      }
      if (hasPermission('positionPapers', $_SESSION["role"])) {
        echo '<div class="section" id="positionPapers">';
        echo '<h2 class="section-title">Position Papers</h2>';
        echo '</div>';
      }
      if (hasPermission('jobsAvailable', $_SESSION["role"])) {
        echo '<div class="section" id="jobsAvailable">';
        echo '<h2 class="section-title">Jobs Available</h2>';
        echo '</div>';
      }
      ?>
    </div>
  </div>
  <cuf-footer-contact></cuf-footer-contact>
</body>
</html>