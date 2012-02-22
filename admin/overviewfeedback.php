<?php require_once('../config.php'); 
require_admin();
header('Content-Type: text/html; charset=utf8');
try{		
	$res = $db->getView('admin','getFeedback');
	$res = $res->rows;
	if(!empty($res)){
		
	}
	else{
		
	}
}
catch(Exception $e){
	print_r($e);
}
echo '<table><thead><th>Ejer</th><th>Ubesvarede beskeder</th><th>Besvar</th></thead><tbody>';
foreach($res as $feedbackDocs){
	$id = $feedbackDocs->id;
	$owner = $feedbackDocs->value->shopowner_id;
	if(!isset($feedbackDocs->value->unread)) $unread = 'Nej';
	else $unread = $feedbackDocs->value->unread;
	echo '<tr><td>'.$owner.'</td><td>'.$unread.'</td><td><a href="feedback?id='.$id.'">Se beskeder</a></td></tr>';
}
echo '</tbody></table>';
?>
<style>
	td,th{
		text-align:center;
	}
</style>