<?php
require_once('../../config.php');
if (isset($_POST['action']) && $_POST['action'] == 'test_username') {
	$email = strtolower($_POST['register_username']);
	if (!$email) echo 'false';
	else {
		$user = (object) json_decode(Shopowner::checkEmail($email));
		if($user->success=='true') echo 'false';
		else echo 'true';
	}
} elseif (isset($_POST['action']) && $_POST['action'] == 'test_betacode') {
	if(!isset($_POST['register_betacode'])) echo "false";
	else {
		$betacode = $_POST['register_betacode'];
		$doc = couchDocument::getInstance($db,'configuration');
		$codes = $doc->betakoder;
		if(!property_exists($codes,$betacode)) echo "false";
		else echo 'true';
	}
} else{
	echo false;
}
?>