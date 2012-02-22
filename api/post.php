<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : '';
$model = isset($_POST['model']) ? $_POST['model'] : $_POST;
if($type){
	switch($type){	
		case 'deals':
			$result = Shopowner::checkDeal($model);
		break;
		default:
			$result = Shopowner::save($type,$model);
		break;	
	}
}
if($action){
	switch($action){
		case 'register':
			$result = Shopowner::register($model);
		break;
		case 'login':
			$result = Shopowner::login($model);
		break;
	}
}
echo json_encode($result);
?>