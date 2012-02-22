<?php
require_once('../config.php');
switch($_SERVER['REQUEST_METHOD']){
	case 'GET':
		require_once('get.php');
	break;
	case 'POST':
		if(!isset($_POST['method'],$_GET['method'])) require_once('post.php');
		else if( 
			(isset($_GET['_method']) && $_GET['_method'] == 'PUT') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'PUT')) require_once('put.php');
		else if(
			(isset($_GET['_method']) && $_GET['_method'] == 'DELETE') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'DELETE')) require_once('delete.php');
	break;
	case 'PUT':
		require_once('put.php');
	break;
	case 'DELETE':
		require_once('delete.php');
	break;
}
?>