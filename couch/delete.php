<?php require_once('../config.php');
$array = $db->getView('dealer','cleanDeals');
$ret = array();
foreach($array->rows as $item){
	$ret[] = $item->value;
}
$db->deleteDocs($ret);
?>