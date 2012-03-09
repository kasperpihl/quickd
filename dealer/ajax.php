<?php
require_once('../config.php');
//echo json_encode(array('success'=>'false','error'=>'testing', 'data'=>array('method'=>$_SERVER['REQUEST_METHOD'], 'post'=>$_POST, 'get'=>$_GET)));
//die();
$result = array('success'=>'false','error'=>'no_action_match');
switch($_SERVER['REQUEST_METHOD']){
	case 'GET':
		require_once(API_DIR.'get.php');
	break;
	case 'POST':
		if(!isset($_POST['_method']) && !isset($_GET['_method'])) require_once(API_DIR.'post.php');
		else if( 
			(isset($_GET['_method']) && $_GET['_method'] == 'PUT') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'PUT')) require_once(API_DIR.'put.php');
		else if(
			(isset($_GET['_method']) && $_GET['_method'] == 'DELETE') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'DELETE')) require_once(API_DIR.'delete.php');
	break;
	case 'PUT':
		require_once(API_DIR.'put.php');
	break;
	case 'DELETE':
		require_once(API_DIR.'delete.php');
	break;
}
?>