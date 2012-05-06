<?php 
require_once('../../config.php');
if(!isset($_POST['email'])) echo die(json_encode(array('success'=>false,'error'=>'no_email_provided')));
$model = array(
	'email'=>$_POST['email']);
$result = Shopowner::register($model);
echo json_encode($result);
?>