<?php

require_once(__DIR__ . '/force_include.php');

set_error_handler(function($errno, $errstr, $errfile, $errline) {
  if (0 === error_reporting()) {
      return false;
  }
  throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

/**
 * delete file given the filepath
 * @param string $filepath
 * @return string error message
 */
function deleteFile($filepath): string {
  try {
    $deleted = unlink($filepath);
    if (!$deleted) {
      return 'An unknown error occurred trying to delete a file';
    }
    return '';
  } catch (Exception $e) {
    return $e -> getMessage();
  }
}

/**
 * create file with content, and create folder structure if doesn't exist 
 * @param string $filepath
 * @param string $content
 * @return string error message
 */
function forceFilePutContents($filepath, $content): string {
  try {
    $isInFolder = preg_match("/^(.*)\/([^\/]+)$/", $filepath, $filepathMatches);
    if ($isInFolder) {
      $folderName = $filepathMatches[1];
      if (!is_dir($folderName)) {
        mkdir($folderName, 0777, true);
      }
    }
    $success = file_put_contents($filepath, $content);
    if (!$success) {
      return 'An unknown error occurred trying to create a file';
    }
    return '';
  } catch (Exception $e) {
    return "ERR: error writing '$content' to '$filepath', ". $e->getMessage();
  }
}
