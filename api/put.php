<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
//$model = isset($_POST['model']) ? $_POST['model'] : '';
//$id = isset($_GET['id']) ? $_GET['id'] : '';
$model = file_get_contents("php://input");
//echo json_encode(array('success'=>'false','error'=>'testing', 'data'=>array('PUT'=>$model)));
//die();
if($type&&$model){
  
	$result = Shopowner::save($type,$model);
}
?>