<?php 
require_once('../config.php');
if(isset($admin) && $admin) redirect('dashboard.php');
if(isset($_POST['email']) && isset($_POST['password'])){
	$email = $_POST['email'];
	$password = $_POST['password'];
	try{		
		$admins = $db->key($email)->getView('admin','getAdminsByMail');
		$admins = $admins->rows;
		if(!empty($admins)){
			$admin = $admins[0]->value;
			if($admin->password == md5(MD5_STRING.$password)){
				$session->login($admin->id,$admin->privileges);
				redirect('dashboard.php');
			}
		}
	}
	catch(Exception $e){
		print_r($e);
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> 
		<title>QuickD</title>
		<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic&subset=latin,latin-ext" rel="stylesheet" type="text/css" />
		<script src="https://maps.googleapis.com/maps/api/js?v=3.5&sensor=false" type="text/javascript"></script>
		<script language="javascript" src="<?= LIBS_URL ?>jquery/jquery-min.js" type="text/javascript"></script> 	
	</head>
	<body>
		<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
			<input type="text" name="email" value=""/>
			<input type="password" name="password" value=""/>
			<input type="submit" value="Logind"/>
		</form>
	</body>
</html>