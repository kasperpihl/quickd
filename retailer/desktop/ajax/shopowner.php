<?php
require_once('../../../config.php');
if (isset($_POST['action']) && $_POST['action'] == 'test_username') {
	$email = strtolower($_POST['register_username']);
	if (!$email) echo 'false';
	else {
		$user = (object) json_decode(Shopowner::checkEmail($email));
		if($user->success=='true' && $user->data->value->privileges>1) echo 'false';
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
} elseif (isset($_POST['action']) && $_POST['action'] == 'test_userpass') {
	if(!isset($_POST['user_old_password']) || !$session->logged_dealer()) echo "false";
	else {
		$result = (object) Shopowner::testPassword($_POST['user_old_password']);
		if(isset($result->success) && $result->success==='true') echo 'true';
		else echo 'false';
	}
} else{
	echo 'false';
}
?>