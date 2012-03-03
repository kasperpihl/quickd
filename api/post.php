<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');
$model = isset($_POST['model']) ? $_POST['model'] : $_POST;
if($type){
	switch($type){	
		case 'deals':
			if($action == 'stop') $result =  Shopowner::updateDeal($model);
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
			$result = Shopowner::register($model);
		break;
		case 'login':
			$result = Shopowner::login($model);
		break;
	}
}
echo json_encode($result);
?>