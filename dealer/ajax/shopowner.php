<?php
require_once('../../config.php');
if (isset($_POST['action']) && $_POST['action'] == 'test_username') {
	$username = strtolower($_POST['user']);
	$user = $db->key($username)->getView('dealer','getUsersByMail');
	$user = $user->rows;
	if(empty($user)) echo 'true';
	else echo 'false';
} elseif (isset($_POST['action']) && $_POST['action'] == 'test_betacode') {
	if(!isset($_POST['betacode'])) echo "false";
	$betacode = $_POST['betacode'];
	$doc = couchDocument::getInstance($db,'configuration');
	$codes = $doc->betakoder;
	if(!property_exists($codes,$betacode)) echo "false";
	else echo 'true';
} else{
	echo json_encode(array('success'=>'false','error'=>'open_login'));
}
?>