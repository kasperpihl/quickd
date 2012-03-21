<?php require_once('../config.php');
if(isset($_POST['email'])){
	Mail::sendBetaConfirmation($_POST['email'],'Kasper');
	echo 'mail blev sendt';
}

?>
<form method="POST">
	<input type="text" name="email">
	<input type="submit" value="send">
</form>