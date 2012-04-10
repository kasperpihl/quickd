<? 

if(!isset($db)) echo die('cant call this directly - use update.php');
try{
	$doc = couchDocument::getInstance($db,"configuration");
	echo '<br/><br/>Hentede configuration dokumentet <br/>';
	echo 'Forlader configuration';
	
}
catch(Exception $e){
	echo '<br/><br/>fejl i configuration filen<br/>';
}
?>

	














