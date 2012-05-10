<?php
if(isset($_GET['type'])) {
	if(isset($_GET['id']) && $_GET['id']) $id = $_GET['id'];
	else $id = false;
	$result = Shopowner::get($_GET['type'],$id);
} 
?>