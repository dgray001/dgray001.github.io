<?php

if(__FILE__ === $_SERVER["SCRIPT_FILENAME"]) {
  header('HTTP/1.0 403 Forbidden', TRUE, 403);
  exit();
}