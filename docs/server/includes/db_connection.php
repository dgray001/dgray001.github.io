<?php

require_once(__DIR__ . '/force_include.php');

function connectToTable() {
  require_once(__DIR__ . '/config_path.php');
  require_once($config_path . '/db_login.php');
  $conn = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName);
  if (!$conn) {
    error_log("Database connection failed with error: " .
      mysqli_connect_error() . "\n");
    echo json_encode('Server cannot log you in at this time.');
    exit(2);
  }
  return $conn;
}

function connectToTableWithConfigPath($config_path) {
  require_once($config_path . '/db_login.php');
  $conn = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName);
  if (!$conn) {
    error_log("Database connection failed with error: " .
      mysqli_connect_error() . "\n");
    echo json_encode('Server cannot log you in at this time.');
    exit(2);
  }
  return $conn;
}
