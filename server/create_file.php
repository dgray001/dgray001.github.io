<?php

/**
 * create file with content, and create folder structure if doesn't exist 
 * @param string $filepath
 * @param string $content
 */
function forceFilePutContents($filepath, $content) {
  try {
    $isInFolder = preg_match("/^(.*)\/([^\/]+)$/", $filepath, $filepathMatches);
    if($isInFolder) {
      $folderName = $filepathMatches[1];
      if (!is_dir($folderName)) {
        mkdir($folderName, 0777, true);
      }
    }
    file_put_contents($filepath, $content);
  } catch (Exception $e) {
    echo "ERR: error writing '$content' to '$filepath', ". $e->getMessage();
  }
}