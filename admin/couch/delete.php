<?php require_once('../../config.php');
require_admin();
function setBetaUserKeys(){
	global $db;
	$array = $db->getView('quickd','getUsers');
	$usedKeys = array();
	foreach($array->rows as $item){
		$user_id = $item->value;
		do {
			$userbeta = strtolower(substr(md5(time().rand(1,1000000).rand(1,1000000)),0,8));
		} while (in_array($userbeta,$usedKeys));
		$usedKeys[] = $userbeta;
		$model = array('userbeta'=>$userbeta);
		$result = $db->updateDocFullAPI('quickd','setBetaUser',array('doc_id'=>$user_id, 'params'=>array('json'=>json_encode($model))));
		print_r($result.'<br/>');
	}
}
setBetaUserKeys();
// print_r($array);
//$db->deleteDocs($ret);
?>