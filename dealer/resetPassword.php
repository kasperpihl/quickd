<?php require_once('../config.php'); 
if(isset($_GET['id'])){
	$id = $_GET['id'];
	try{
		$resetPass = $db->key($id)->getView('dealer','getResetPass');
		$resetPass = $resetPass->rows;

		if(!empty($resetPass)){
			$doc_id = $resetPass[0]->value[0];
			$user = $resetPass[0]->value[1];
			$endtime = $user->newPass->endtime;
			if($endtime > time()){
				if(isset($_POST['newPass'])){
					/* Validating */
					$reset = Shopowner::resetPassword($doc_id,$_POST['newPass']);
					if($reset->success == 'true') redirect(ROOT_URL.'index.php');
				}
				else{
					echo '
					<form action="http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].'" method="POST">
						<h1>Indtast dit nye password og klik fortsæt</h1>
						<input type="password" name="newPass" value=""/>
						<input type="submit" name="submit" value="Fortsæt">
					</form>
					';
				}
			}
			else{
				echo '<h1>Linket er desværre udløbet. Prøv igen</h1>';
			}
			
		}
		else {
			echo '<h1>Linket blev ikke fundet</h1>';
		}
	}
	catch(Exception $e){
			
	}
}
?>