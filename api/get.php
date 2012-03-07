<?php require_once('../config.php');
if(isset($_GET['type'])) {
	if(isset($_GET['id']) && $_GET['id']) $id = $_GET['id'];
	else $id = false;
	echo json_encode(Shopowner::get($_GET['type'],$id));
} 
else {
	echo json_encode(array('success'=>'false','error'=>'not_a_get_request'));
}
?>