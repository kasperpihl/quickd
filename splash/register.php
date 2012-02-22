<?php
header('Content-Type: application/json');
require_once('../config.php');

if(isset($_POST['email'])){
	
	$email = strtolower($_POST['email']);

	$doc = new stdClass();
	$doc->_id = $email;
	$doc->email = $email;
	$doc->type = "bruger";
	
	try {
	    $db_subscribers->storeDoc($doc);
	    echo json_encode(array('success'=>true));
	} catch ( Exception $e ) {
	   echo json_encode(array('success'=>false));
	}
	
}
else{
	echo json_encode(array('success'=>false));
}

?>