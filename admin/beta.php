<?php require_once('../config.php'); 
require_admin();
header('Content-Type: text/html; charset=utf8');
try{
	$doc = couchDocument::getInstance($db,'configuration');	
	$codes = $doc->betakoder;
}
catch(Exception $e){
	print_r($e);
}
if(isset($_POST['action']) && $_POST['action'] == 'add_beta'){
	if(isset($_POST['code'],$_POST['name'])){
		$code = $_POST['code'];
		$name = $_POST['name'];
		if(property_exists($codes,$code)){
			$_SESSION['message'] = 'Koden findes allerede';
			redirect($_SERVER['PHP_SELF']);
		}
		$codes->$code = $_POST['name'];
		$doc->set(array('betakoder'=>$codes));
		$_SESSION['message'] = 'Koden blev oprettet';
		redirect($_SERVER['PHP_SELF']);
	}
	else $_SESSION['message'] = 'Navn og kode skal indtastes';
}
else if(isset($_GET['action'])){
	switch($_GET['action']){
		case 'delete':
			$code = $_GET['code'];
			if(property_exists($codes,$code)){
				unset($codes->$code);
				$doc->set(array('koder'=>$codes));
				$_SESSION['message'] = 'Koden blev slettet';
				redirect($_SERVER['PHP_SELF']);
			}
		break;
	}
}


$codes = (array)$codes;
asort($codes);

?>
<?php if(isset($_SESSION['message'])){
	echo '<div>'.$_SESSION['message'].'</div>';
	unset($_SESSION['message']);
}?>
<style>
	td,th{
		padding:5px;
		text-align:center;
		border-bottom:1px solid;
		border-right:1px solid;
	}
</style>
<form action="<?php echo $_SERVER['PHP_SELF'];?>" method="post">
	<input type="hidden" name="action" value="add_beta"/>
	<input type="text" name="name" value="" placeholder="Navn"/>
	<input type="text" name="code" value="" placeholder="Indtast betakode"/>
	<input type="submit" value="Opret beta kode"/>
</form>
<table>
	<thead><tr><th>Navn</th><th>Kode</th><th>Slet</th></tr></thead>
	<tbody>
	<?php foreach($codes as $key => $code){
		echo '<tr><td>'.$code.'</td><td>'.$key.'</td><td><a href="'.$_SERVER['PHP_SELF'].'?action=delete&code='.$key.'">slet</a></td></tr>';
	}?>
	</tbody>
</table>