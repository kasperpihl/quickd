<?php
header('Content-Type: application/json');

require_once('../config.php');

$doc = new stdClass();
$doc->_id = $_POST['email'];
$doc->email = $_POST['email'];
try {
    $db_subscribers->storeDoc($doc);
    echo json_encode(array('success'=>true));
} catch ( Exception $e ) {
    die("Unable to store the document : ".$e->getMessage());
}

?>