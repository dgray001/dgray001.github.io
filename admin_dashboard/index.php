<?php
session_start();

require_once(__DIR__ . '/../../config/permissions.php');

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
        echo '<cuf-admin-dashboard-laywitness></cuf-admin-dashboard-laywitness>';
      }
      if (hasPermission('news', $_SESSION["role"])) {
        echo '<div class="section" id="news">';
        echo '<h2 class="section-title">News</h2>';
        echo '<div class="news-body" style="display: none;">';
        echo '<button id="edit-news-button">Edit News</button>';
        echo '<div id="current-news" style="display: none;">';
        echo '</div>';
        echo '<button id="new-news-button">Add News</button>';
        echo '<form id="news-form" action="javascript:submitNewsForm()">';
        echo '<cuf-form-section-news id="section-news"></cuf-form-section-news>';
        echo '<button class="form-submit-button" id="news-form-button" onclick="submitNewsFormButton() "type="button">Upload News</button>';
        echo '</form>';
        echo '<div id="news-form-status-message"></div>';
        echo '</div></div>';
      }
      if (hasPermission('positionPapers', $_SESSION["role"])) {
        echo '<div class="section" id="positionPapers">';
        echo '<h2 class="section-title">Position Papers</h2>';
        echo '<div class="papers-body" style="display: none;">';
        echo '<label for="papers-file-upload">Upload PDF:</label><br>';
        echo '<input id="papers-file-upload" type="file" accept="application/pdf">';
        echo '<form id="papers-form" action="javascript:submitPaperForm()">';
        echo '<cuf-form-section-paper id="section-papers"></cuf-form-section-paper>';
        echo '<button class="form-submit-button" id="papers-form-button" onclick="submitPaperFormButton()"type="button">Upload Position Paper</button>';
        echo '</form>';
        echo '<div id="papers-form-status-message"></div>';
        echo '</div></div>';
      }
      if (hasPermission('jobsAvailable', $_SESSION["role"])) {
        echo '<div class="section" id="jobsAvailable">';
        echo '<h2 class="section-title">Jobs Available</h2>';
        echo '<div class="jobs-body" style="display: none;">';
        echo '<button id="edit-jobs-button">Edit Jobs</button>';
        echo '<div id="current-jobs" style="display: none;">';
        echo '</div>';
        echo '<button id="new-jobs-button">Add Job</button>';
        echo '<form id="jobs-form" action="javascript:submitJobsForm()">';
        echo '<cuf-form-section-job id="section-jobs"></cuf-form-section-job>';
        echo '<button class="form-submit-button" id="jobs-form-button" onclick="submitJobsFormButton() "type="button">Upload Job</button>';
        echo '</form>';
        echo '<div id="jobs-form-status-message"></div>';
        echo '</div></div>';
      }
      ?>
    </div>
  </div>
  <cuf-footer-contact></cuf-footer-contact>
</body>
</html>