<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$model = isset($_POST['model']) ? $_POST['model'] : $_POST;
if (!$model ||empty($model)) $model = file_get_contents("php://input");
if($type){
	switch($type){	
		case 'deals':
			if($action == 'soldout') $result =  Shopowner::updateDeal($model);
			else $result = Shopowner::checkDeal($model);
		break;
		default:
			$result = Shopowner::save($type,$model);
		break;	
	}
}
else if($action){
	switch($action){
		case 'register':
			$result = Shopowner::register($model, 'dealer');
		break;
		case 'login':
			$result = Shopowner::login($model,true,true);
		break;
		case 'subscribe':
			$result = Shopowner::register($model, 'subscribe');
		break;
		case 'reset':
			$result = Shopowner::resetPassword($model);
		break;
		case 'fbconnect':
			$result = Shopowner::fb_connect();
		break;
	}
}
echo json_encode($result);
?>