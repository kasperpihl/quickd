<?php require_once('../config.php'); 
if(isset($_GET['id'])){
	$id = $_GET['id'];
	$resetPass = $db->startkey(array($id,time()))->endkey(array($id,'a'))->getView('dealer','getResetPass');
	$resetPass = $resetPass->rows;
	if(!empty($resetPass)){
		$doc_id = $resetPass[0]->value[0];
		$user = $resetPass[0]->value[1];
		try{
			if(isset($_POST['newPass'])){
				/* Validating */
				Shopowner::resetPassword($doc_id,$_POST['newPass']);
			}
			else{
				echo '
				<form action="'.$_SERVER['PHP_SELF'].'" method="POST">
					<input type="text" name="newPass" value=""/>
					<input type="submit" name="submit" value="Forny Password">
				</form>
				';
			}
			
			
			
			

		}
		catch(Exception $e){
			
		}
	}
}
?>