<?php

require_once(__DIR__ . '/includes/prevent_get.php');

require_once(__DIR__ . '/includes/util.php');
$data = json_decode(file_get_contents('php://input'), true);
if (!validateData($data, array('category', 'filename'))) {
  echo json_encode(array(
    'success' => false,
    'error_message' => 'Bad download faith fact data sent to server',
  ));
  exit(1);
}

$ff_category = $data['category'];
$ff_filename = $data['filename'];

require_once(__DIR__ . '/includes/config_path.php');
$name = $config_path . 'faith_fact_pdfs/' . $ff_category . '/' . $ff_filename . '.pdf';
echo $name;

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename=faith_fact_download.pdf');
header('Pragma: no-cache');
readfile($name);

exit();
