<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
$model = isset($_POST['model']) ? $_POST['model'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : '';
$result = '';
if($type){
	$result = Shopowner::save($type,$model);
}
echo json_encode($result);
?>