<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
//$model = isset($_POST['model']) ? $_POST['model'] : '';
//$id = isset($_GET['id']) ? $_GET['id'] : '';
$model = file_get_contents("php://input");
//echo json_encode(array('success'=>'false','error'=>'testing', 'data'=>array('PUT'=>$model)));
//die();
$result = array('success'=>'false','error'=>'no_put_type_or_data');
if($type&&$model){
  
	$result = Shopowner::save($type,$model);
}
echo json_encode($result);
?>