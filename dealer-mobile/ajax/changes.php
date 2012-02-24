<?php require_once('../../config.php'); 
if(!isset($dealer) || !$dealer) echo die(json_encode(array('success'=>'false','error'=>'not_logged_in')));
$csince = (int)(isset($_GET['csince']) ? $_GET['csince'] : (isset($_SESSION['csince']) ? $_SESSION['csince'] : 0));
$cindex = (int)(isset($_GET['cindex']) ? $_GET['cindex'] : (isset($_SESSION['cindex']) ? $_SESSION['cindex'] : 0));
try{
	$res = $db->since($csince)->filter('dealer/history',array('id'=>$dealer,'index'=>$cindex))->getChanges();
	$results = isset($res->results) ? $res->results : array();
	$_SESSION['csince'] = $csince = $res->last_seq;
	if(empty($results)) echo die(json_encode(array('success'=>'false','error'=>'no_results','csince'=>$csince,'cindex'=>$cindex)));
	$data = $db->startkey(array($dealer,$cindex))->endkey(array($dealer,'a'))->getView('dealer','getHistory');
	$data = $data->rows;
	if(empty($data)) echo die(json_encode(array('success'=>'false','error'=>'no_data_updates','csince'=>$csince,'cindex'=>$cindex)));
	
	$cindex = end($data)->key[1]+1;
	$_SESSION['cindex'] = $cindex;
	echo die(json_encode(array('success'=>'true','csince'=>$csince,'cindex'=>$cindex,'data'=>$data,'results'=>$results)));
}
catch(Exception $e){
	echo die(json_encode(array('success'=>'false','error'=>'error_database')));
}
?>