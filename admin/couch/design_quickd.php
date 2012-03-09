<? 
if(!isset($db)) echo die('cant call this directly - use update.php');
try{
	$doc = couchDocument::getInstance($db,"_design/quickd");
	echo '<br/><br/>Hentede _design/quickd dokumentet <br/>';
	$views = new stdClass();
	$getDeals = 
	"function (doc) {
		if ( doc.hasOwnProperty('type') && doc.type == \"deal\") {
			var timestamp = parseInt(new Date().getTime()/1000);
			var start = parseInt(doc.start);
			var end = parseInt(doc.end);
			emit(end,doc);
		}
	}";
	$views->getDeals = array("map"=>$getDeals);
	echo 'views objektet klar <br/>';
	$doc->views = $views;
	echo 'views sat<br/>';
	
	echo 'Forlader _design/quickd';
}
catch(Exception $e){
	echo 'fejl i _design/quickd filen<br/>';
}
?>