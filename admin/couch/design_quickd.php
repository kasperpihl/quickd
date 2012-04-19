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
	$views->getUsers = 
	array('map'=>
	"function(doc){
		if(!doc.hasOwnProperty('user')) return;
		//if(!doc.user.hasOwnProperty('userbeta')) return;
		emit(doc._id,doc._id);
	}");
	$views->getBetaUser = 
	array('map'=>
	"function(doc){
		if(!doc.hasOwnProperty('user')) return;
		if(!doc.user.hasOwnProperty('userbeta')) return;
		var obj = {id:doc._id,email:doc.user.email};
		if(doc.user.hasOwnProperty('sendmail') && doc.user.sendmail) obj.sendmail = true;
		emit(doc.user.userbeta,obj);
	}");
	$views->getDeals = array("map"=>$getDeals);
	echo 'views objektet klar <br/>';
	$doc->views = $views;
	echo 'views sat<br/>';
	
	$updates = new stdClass();
	$updates->setBetaUser =
	"function(doc,req){
		if(!req.query.hasOwnProperty('json')) return [null,'json_must_be_specified'];
		var query = JSON.parse(req.query.json);

		if (doc && doc.hasOwnProperty('user')) var user = doc.user;
		if(!query.hasOwnProperty('userbeta')) return [null,'userbeta_must_be_specified'];
		doc.user.userbeta = query.userbeta;
		return[doc,'success'];
	}";
	$updates->updateUser = 
	"function(doc,req){
		if(!req.query.hasOwnProperty('json')) return [null,'json_must_be_specified'];
		var query = JSON.parse(req.query.json);
		if(query.hasOwnProperty('sendmail')) doc.user.sendmail = query.sendmail;
		return [doc,'success'];
	}";
	$doc->updates = $updates;
	echo 'Forlader _design/quickd';
}
catch(Exception $e){
	echo 'fejl i _design/quickd filen<br/>';
}
?>