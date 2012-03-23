<? 
if(!isset($db)) echo die('cant call this directly - use update.php');
try{
	$doc = couchDocument::getInstance($db,"_design/admin");
	echo '<br/><br/>Hentede _design/admin dokumentet <br/>';
	
	$updates = new stdClass();
	$feedbackResponse = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message}; 
			 return JSON.stringify(obj);
		}
		function addHistory(id,hours,rev){
			var timestamp = parseInt(new Date().getTime()/1000);
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id,timestamp: timestamp,action:'response',type:'feedback',rev:rev,priority:2};
			doc.history.push(historyObj);
		}
		if(!doc) return [null,msg('user_not_exist')];
		if(!doc.type || doc.type != 'user') return [null,msg('request_is_not_a_user')];
		if(!doc.hasOwnProperty('feedback')) doc.feedback = new Array();
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		var timestamp = parseInt(new Date().getTime()/1000);
		var query = JSON.parse(req.query.json);
		if(!query.hasOwnProperty('message')) return [null, msg('message_must_be_included')];
		if(!query.hasOwnProperty('hours')) return [null, msg('hours_must_be_included')];
		var index = doc.feedback.length;
		var hours = parseInt(query.hours);
		doc.user.hours = doc.user.hours + hours;
		var feedbackObj = { id: index, type:'response',rev:index,timestamp:timestamp,hours:hours,message:query.message};
		doc.feedback.push(feedbackObj); 
		addHistory(index,index);
		return [doc,msg('response',true)];
		
	}";
	$approve = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		function addHistory(id,timestamp,type,action,rev){
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id,timestamp: timestamp,action:action,type:type,rev:rev,priority:2};
			doc.history.push(historyObj);
		}
		
		var timestamp = parseInt(new Date().getTime()/1000);
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		if(!doc) return [null, msg('user_not_exist')];
		if(!doc.hasOwnProperty('type') || doc.type != 'user') return [null, msg('request_is_not_a_user')];
		var query = JSON.parse(req.query.json);
		if(!query.hasOwnProperty('index')) return [null, msg('index_must_be_specified')];
		if(!query.hasOwnProperty('type')) return [null, msg('type_not_specified')];
		var id = query.index;
		var action = query.approved;
		var target,type,action;
		switch(query.type){
			case 'template':
				target = doc.templates;
				type = 'template';
			break;
			case 'shop':
				target = doc.shops;
				type = 'shop';
			break;
			default:
				return [null,msg('type_not_found')];
			break;
		}
		
		
		if(!target.hasOwnProperty(id)) return [null, msg('target_doesnt_exist')];
		target = target[id];
		target.approved = action;
		if(target.hasOwnProperty('image') && action == 'approved'){
			doc.images[target.image].app = 'approved';
		}
		if(query.hasOwnProperty('message')) var message = query.message;
		else var message = false;
		if(message) target.message = message
		target.rev = parseInt(target.rev) + 1;
		addHistory(id,timestamp,type,action,target.rev,message);
		return [doc,msg(action,true)];
		
		
	}";
	$updates->approve = $approve;
	$updates->feedbackResponse = $feedbackResponse;
	echo 'updates objektet klar<br/>';
	$doc->updates = $updates;
	echo 'updates sat <br/>';
	
	$views = new stdClass();

	/* The view to get the shops by its shopowner */
	$getAdminsByMail = 
	"function (doc) {
		 if (!doc.hasOwnProperty('type') || doc.type != \"user\") return false;
		 if (!doc.hasOwnProperty('user') || !doc.user.hasOwnProperty('privileges')) return false;
		 if(parseInt(doc.user.privileges) < 5) return false;
		 emit(doc.user.email,{privileges: doc.user.privileges,id: doc._id,password:doc.user.md5_password});
	}";
	$getFeedback =
	"function (doc) {
		if(doc.type && (doc.type == \"user\") ){
			if(doc.hasOwnProperty('feedback')){
				var lastIndex = doc.feedback.length -1;
				if(doc.feedback[lastIndex].type == 'sent') emit(doc._id,doc.feedback);
			}
		}		
	}";
	$getStuff = 
	"function (doc) {
		if(doc.hasOwnProperty('type') && (doc.type === \"user\") ){

			if(doc.hasOwnProperty('templates')){
				for (var key in doc.templates) {
					if(doc.templates[key].hasOwnProperty('approved') && doc.templates[key].approved == 'waiting'){
						var obj = {};
						if(doc.templates[key].hasOwnProperty('image')){
							if(doc.hasOwnProperty('images') && doc.images.hasOwnProperty(doc.templates[key].image)){
								obj.image = doc.images[doc.templates[key].image].n;
							}
							
						}
						obj.template = doc.templates[key];
						emit([doc._id,'template',key],obj);
					}
					
				}
			}
		}
		if(doc.hasOwnProperty('shops')){
			for (var key in doc.shops) {
				if (doc.shops.hasOwnProperty(key)) {
					if(doc.shops[key].hasOwnProperty('approved') && doc.shops[key].approved == 'waiting')
						emit([doc._id,'shop',key],doc.shops[key]);
				}
			}
		}
	}";
	$getStatistics = 
	"function (doc) {
		if ( doc.type && doc.type == \"user\") {
			emit(doc.history[0].timestamp,doc.user);
		}
	}";
	$views->getStatistics = array("map"=>$getStatistics);
	$views->getAdminsByMail = array("map"=>$getAdminsByMail);
	$views->getStuff = array("map"=>$getStuff);
	$views->getFeedback = array("map"=>$getFeedback);
	echo 'views objektet klar <br/>';
	$doc->views = $views;
	echo 'views sat<br/>';
	
	echo 'Forlader _design/admin';
	
}
catch(Exception $e){
	echo 'fejl i _design/admin filen<br/>';
}
?>