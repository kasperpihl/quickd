<? 
if(!isset($db)) echo die('cant call this directly - use update.php');
try{
	$doc = couchDocument::getInstance($db,"_design/dealer");
	echo '<br/><br/>Hentede _design/dealer dokumentet <br/>';
	$filters = new stdClass();
	$history = "function(doc, req) {
		if(!doc.hasOwnProperty('history')) return false;
		if(doc._id != req.query.id) return false;
		if(doc.history.length > req.query.index) return true;
		else return false;
	}";
	$filters->history = $history;
	echo 'filters objektet klar<br/>';
	$doc->filters = $filters;
	echo 'filters sat <br/>';
	
	$updates = new stdClass();
	$registerUser =
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		if(doc) return [null,msg('user_exists')];
		var timestamp = parseInt(new Date().getTime()/1000);
		if(!req.query.hasOwnProperty('json')) return [null,msg('json_must_be_specified')];
		var query = JSON.parse(req.query.json);
		if(!query.hasOwnProperty('email') || !query.hasOwnProperty('password')) return [null, msg('email_and_password_must_be_specified')];
		if(!query.hasOwnProperty('hours')) return [null,msg('hours_must_be_specified')];
		if(!query.hasOwnProperty('privileges')) return [null, msg('privileges_must_be_specified')];
		var historyArray = new Array();
		historyArray.push({timestamp: timestamp,action:'created',type:'user','priority':2});
		var obj = {_id: req.uuid, type:'user', user: {betacode: query.betacode, privileges: parseInt(query.privileges), hours: parseInt(query.hours), email:query.email, md5_password: query.password},history:historyArray};
		
		return [obj,msg({id:req.uuid},true)];
	}";
	$updateFbInfo = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		var timestamp = parseInt(new Date().getTime()/1000);
		if(!req.query.hasOwnProperty('json')) return [null,msg('json_must_be_specified')];
		var query = JSON.parse(req.query.json);
		if(!query.hasOwnProperty('fb_info')) return [null, msg('fb_details_not_specified')];
		if (doc) {
			doc.fb_info = query.fb_info;
			var obj = doc;
		} else {
			
			if(!query.hasOwnProperty('email')) return [null, msg('email_must_be_specified')];
			if(!query.hasOwnProperty('privileges')) query.privileges=1;
			var historyArray = new Array();
			historyArray.push({timestamp: timestamp,action:'created',type:'user','priority':2});
			var obj = {_id: req.uuid, type:'user', user: {email:query.email, privileges: parseInt(query.privileges), fb_info: query.fb_info},history:historyArray};
		}
		var obj = {_id: req.uuid, type:'user', user: {betacode: query.betacode, privileges: parseInt(query.privileges), hours: parseInt(query.hours), email:query.email, md5_password: query.password},history:historyArray};
		
		return [obj,msg({id:req.uuid},true)];
	}";
	$startStopDeal = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message}; 
			 return JSON.stringify(obj);
		}
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		var timestamp = parseInt(new Date().getTime()/1000);
		var query = JSON.parse(req.query.json);
		var returnArr = {};
		if(!doc){
			if(!query.hasOwnProperty('start') || !query.hasOwnProperty('end')) return [null, msg('start_and_end_must_be_defined')];	
			if(!query.hasOwnProperty('id')) return [null,msg('id_required')];
			if(!query.hasOwnProperty('created')) return [null,msg('created_time_required')];
			if(!query.hasOwnProperty('template')) return [null, msg('template_required')];
			if(!query.hasOwnProperty('shop')) return [null, msg('shop_required')];
			if(!query.hasOwnProperty('shopowner_id')) return [null,msg('shopowner_id_required')];
			var dealObj = {};
			dealObj._id = query.id;
			dealObj.status = 'running';
			dealObj.created = query.created;
			dealObj.type = 'deal';
			dealObj.start = query.start;
			dealObj.end = query.end;
			dealObj.rev = 1;
			dealObj.shopowner_id = query.shopowner_id;
			dealObj.template = query.template;
			if(query.hasOwnProperty('image')) dealObj.template.image = query.image;
			dealObj.shop = query.shop;

			return [dealObj, msg('none',true)];
		}
		else{
			if(query.hasOwnProperty('status') && query.status == 'soldout'){
				if(query.hasOwnProperty('time')){
					var time = parseInt(query.time);
					if(time > doc.start && time < doc.end){
						doc.status = 'soldout';
						doc.rev = doc.rev +1 ;
						returnObj = {status:soldout,rev:doc.rev};
						return [doc, msg(returnObj,true)];
					}
					else return [null, msg('cant_sold_out_not_running')];
				}
				else return [null, msg('no_time_specified')];
			}
		}
		return [null,msg('ja tak')];
	}";
	$checkDeal = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message}; 
			 return JSON.stringify(obj);
		}
		function addHistory(id,timestamp){
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id, timestamp:timestamp, action:'planned', type:'deal', rev:1,priority:1};
			doc.history.push(historyObj);
		}
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		if(!doc) return [null, msg('user_not_exist')];
		if(!doc.type || doc.type != 'user') return [null, msg('request_is_not_a_user')];
		var timestamp = parseInt(new Date().getTime()/1000);
		var query = JSON.parse(req.query.json);
		var id = req.uuid;
		var returnObj = {id:id,created:timestamp};
		if(!query.hasOwnProperty('shop_id') || !query.hasOwnProperty('template_id')) return [null, msg('shop_and_template_id_required')];
		if(!doc.shops.hasOwnProperty(query.shop_id)) return [null, msg('shop_not_found')];
		if(!doc.templates.hasOwnProperty(query.template_id)) return [null, msg('template_not_found')];
		var shop = doc.shops[query.shop_id];
		var template = doc.templates[query.template_id];
		
		
		
		if(template.approved != 'approved') return [null, msg('template_not_approved')];
		if(shop.approved != 'approved') return [null, msg('shop_not_approved')];
		addHistory(id,timestamp);
		returnObj.shop = shop;
		returnObj.template = template;
		if(template.hasOwnProperty('image')){
			if(doc.images.hasOwnProperty(template.image)) returnObj.image = doc.images[template.image].n;
			
		}
		return [doc,msg(returnObj,true)];
	}";
	$sendFeedback = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message}; 
			 return JSON.stringify(obj);
		}
		function addHistory(id,timestamp,action,rev,priority){
		
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id,timestamp: timestamp,action:action,type:'feedback',rev:rev,priority:priority};
			doc.history.push(historyObj);
		}
		if(!doc) return [null,msg('user_not_exist')];
		if(!doc.type || doc.type != 'user') return [null,msg('request_is_not_a_user')];
		if(!doc.hasOwnProperty('feedback')) doc.feedback = new Array();
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		var timestamp = parseInt(new Date().getTime()/1000);
		var query = JSON.parse(req.query.json);
		if(!query.hasOwnProperty('message')) return [null, msg('message_must_be_included')];
		var index = doc.feedback.length;
		var feedbackObj = { id: index, type:'sent',rev:index,timestamp:timestamp,message:query.message};
		doc.feedback.push(feedbackObj); 
		addHistory(index,timestamp,'sent',index,1);
		return [doc,msg({id:index,rev:index},true)];
		
	}";
	$addEditShop = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		function addHistory(id,timestamp,action,rev){
		
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id,timestamp: timestamp,action:action,type:'shop',rev:rev,priority:1};
			doc.history.push(historyObj);
		}
		var timestamp = parseInt(new Date().getTime()/1000);
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		if(!doc) return [null, msg('user_not_exist')];
		if(!doc.type || doc.type != 'user') return [null, msg('request_is_not_a_user')];
		var query = JSON.parse(req.query.json);
		var index;
		if(!doc.shops){
			doc.shops = {};
			index = 1;
		}
		var returnArr = {};
		var historyArr= {};
		if(!query.id){
			if(doc.shops.hasOwnProperty(1)) return [null,msg('already_has_shop')];
			if(!index){
				var highest = 1;
				for (var i in doc.shops){
					i = parseInt(i);
					if(i >= highest) highest = i;
				}
				index = highest + 1;
			}
			if(!query.name || !query.lat || !query.long || !query.address) return [null, msg('name_lat_long_address_must_be_included')];
			var obj = {};
			obj.id = index;
			obj.name = query.name;
			obj.lat = query.lat
			obj.long = query.long
			obj.address = query.address;
			obj.approved = 'waiting';
			obj.rev = 1;
			returnArr = {id:index,approved:'waiting',rev: 1};
			doc.shops[index] = obj;
			addHistory(index,timestamp,'created',obj.rev,1);
		}
		else{
			
			if(!doc.shops.hasOwnProperty(query.id)) return [null, msg('shop_doesnt_exist')];
			var shop = doc.shops[query.id];
			if(query.name) shop.name = query.name;
			if(query.lat) shop.lat = parseFloat(query.lat); 
			if(query.long) shop.lat = parseFloat(query.lat);
			if(query.address) shop.address = query.address;
			if(query.hasOwnProperty('email')) shop.email = query.email;
			if(query.hasOwnProperty('website')) shop.website = query.website;
			if(query.hasOwnProperty('phone')) shop.phone = query.phone;
			if(query.hasOwnProperty('other')) shop.other = query.other;
			shop.rev = parseInt(shop.rev) +1;
			if(query.hasOwnProperty('name')){
				returnArr.approved = 'waiting';
				returnArr.rev = shop.rev;
				doc.shops[query.id].approved = 'waiting';
				
			}
			addHistory(query.id,timestamp,'edited',shop.rev,1);
		}
		if(!doc.history) doc.history = new Array();
		
		return [doc,msg(returnArr,true)];
		
		
	}";
	$addEditTemplate = 
	"function(doc,req){
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		function addHistory(id,timestamp,action,rev,priority){
		
			if(!doc.hasOwnProperty('history')) doc.history = new Array();
			var historyObj = {id:id,timestamp: timestamp,action:action,type:'template',rev:rev,priority:priority};
			doc.history.push(historyObj);
		}
		function testPrice(orig_price,deal_price){
			if( ((orig_price - deal_price) / orig_price * 100) < 25 ) return false;
			return true;
		}
		var timestamp = parseInt(new Date().getTime()/1000);
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		if(!doc) return [null, msg('user_not_exist')];
		if(!doc.type || doc.type != 'user') return [null, msg('request_is_not_a_user')];
		var query = JSON.parse(req.query.json);
		var index;
		if(!doc.templates){
			doc.templates = {};
			index = 1;
		}
		var returnArr = {};
		if(!query.id){
			if(!index){
				var highest = 1;
				for (var i in doc.templates){
					i = parseInt(i);
					if(i >= highest) highest = i;
				}
				index = highest + 1;
			}
			if(!query.hasOwnProperty('title') || !query.hasOwnProperty('description') || !query.hasOwnProperty('orig_price') || !query.hasOwnProperty('deal_price')) return [null, msg('title_description_prices_must_be_set')];
			var obj = {};
			obj.id = index;
			if(query.title.length < 5) return [null,msg('title_must_be_5_characters')]; 
			if(query.description.length < 5) return [null,msg('description_must_be_5_characters')];
			var orig_price = Math.abs(parseFloat(query.orig_price));
			var deal_price = Math.abs(parseFloat(query.deal_price));
			if(!testPrice(orig_price,deal_price)) return [null,msg('discount_must_be_25_percent')];
			obj.title = query.title;
			if(query.hasOwnProperty('image')) obj.image = query.image;
			if(query.category) obj.category = query.category;
			obj.description = query.description;
			obj.orig_price = orig_price;
			obj.created_at = timestamp;
			obj.deal_price = deal_price;
			obj.rev = 1;
			obj.approved = 'waiting';
			returnArr = {id:index,approved:'waiting',rev:1};
			doc.templates[index] = obj;
			addHistory(index,timestamp,'created',1,1);
		}
		else{
			if(!doc.templates.hasOwnProperty(query.id)) return [null, msg('template_doesnt_exist')];
			var temp = doc.templates[query.id];
			if(query.title && query.title.length < 5) return [null,msg('title_must_be_5_characters')]; 
			if(query.description && query.description.length < 5) return [null,msg('description_must_be_5_characters')];
			var app = false;
			if(query.title != temp.title) app = true;
			if(query.description != temp.description) app = true;
			if(query.category) obj.category = query.category;
			if(query.title) temp.title = query.title;
			if(query.description) temp.description = query.description; 
			if(query.orig_price) temp.orig_price = parseFloat(query.orig_price);
			if(query.deal_price) temp.deal_price = query.deal_price;
			if(query.hasOwnProperty('image')){
				
				if(doc.images.hasOwnProperty(query.image)){
					temp.image = query.image;
					if(doc.images[query.image].app != 'approved') app = true;
				}
			}
			temp.rev = parseInt(temp.rev) +1;
			returnArr.rev = temp.rev;
		
			if(app){
				returnArr.approved = 'waiting';
				returnArr.message = false;
				temp.approved = 'waiting';
				if(temp.hasOwnProperty('message')) temp.message = false;
			}
			addHistory(query.id,timestamp,'edited',temp.rev,1);
		}
		return [doc,msg(returnArr,true)];
		
		
	}";
	$addEditImage =
	"function(doc,req) {
		function msg(message,success){
			 if(!success) var obj = {success:'false',error:message};
			 else var obj = {success:'true',data:message};
			 
			 return JSON.stringify(obj);
		}
		if(!req.query.json) return [null,msg('json_must_be_specified')];
		if(!doc) return [null,msg('no_user')];
		if(doc.type != 'user') return [null,msg('request_is_not_a_user')];
		var query = JSON.parse(req.query.json);
		
		if(!query) return [null,msg('image_data_not_set')];
		if(!doc.images) doc.images = {};
		var index;
		var image = query;
		if(image.hasOwnProperty('id')) index = image.id;
		if(!index){
			var highest = 0;
			for (var i in doc.images){
				i = parseInt(i);
				if(i >= highest) highest = i;
			}
			if(highest > 0) index = highest + 1;
			else index = 1;
		}
		var returnArr = {};
		if(!doc.images[index]){
			if(!image.hasOwnProperty('w') || !image.hasOwnProperty('h')) return [null,msg(image)];
			if(!image.hasOwnProperty('n')) return [null, msg('name_must_be_specified')];
			if(!image.hasOwnProperty('t')) return [null, msg('thumbnail_must_be_specified')];
			if(!image.hasOwnProperty('r')) image.r = 0;
			doc.images[index] = {};
			doc.app = 'waiting';
			doc.images[index].id = index;
			doc.images[index].n = image.n;
			doc.images[index].w = image.w;
			doc.images[index].h = image.h;
			doc.images[index].rev = 0;
		}
		if(image.hasOwnProperty('t')){
			//if(!image.t.x || !image.t.y || !image.t.w || !image.t.h) return [null, msg('not_correct_thumbnail_parameters: '+JSON.stringify(image.t))];
			var obj = {};
			obj.x = image.t.x;
			obj.y = image.t.y;
			obj.w = image.t.w;
			obj.h = image.t.h;
			doc.images[index].rev = parseInt(doc.images[index].rev)+1;
			doc.images[index].t = obj;
		} 
		if(image.hasOwnProperty('r')){
			var allowedRotations = {0:0,90:90,180:180,270:270};
			if(!image.r in allowedRotations) return [null, msg('not_allowed_rotation')];
			doc.images[index].r = image.r; 
			if(image.hasOwnProperty('w')) doc.images[index].w = image.w;
			if(image.hasOwnProperty('h')) doc.images[index].h = image.h;
		} 
		
		return [doc,msg(doc.images[index],true)];
	}";
	$updates->addEditTemplate = $addEditTemplate;
	$updates->addEditImage = $addEditImage;
	$updates->addEditShop = $addEditShop;
	$updates->sendFeedback = $sendFeedback;
	$updates->checkDeal = $checkDeal;
	$updates->startStopDeal = $startStopDeal;
	$updates->registerUser = $registerUser;
	$updates->updateFbInfo = $updateFbInfo;
	echo 'updates objektet klar<br/>';
	$doc->updates = $updates;
	echo 'updates sat <br/>';
	
	
	
	$views = new stdClass();
	
	/* The view to get the shops by its shopowner */
	$getAll = 
	"function (doc) {
		if(doc.type && (doc.type == \"user\") ){
			var obj = {};
			if(doc.images) obj.images = doc.images;
			if(doc.feedback) obj.feedback = doc.feedback;
			if(doc.templates) obj.templates = doc.templates;
			if(doc.shops) obj.shops = doc.shops;
			if(doc.history) obj.historySince = doc.history.length-1;
			emit(doc._id,obj);
			
		}
		else if(doc.type == \"deal\"){
			var obj = {};
			
			obj.id = doc._id;
			obj.type = 'deal';
			obj.status = doc.status;
			obj.start = doc.start;
			obj.end = doc.end;
			obj.template = doc.template;
			obj.shop = doc.shop;
			obj.created = doc.created;
			emit(doc.shopowner_id, obj);
		}		
	}";
	$getImages = 
	"function (doc) {
		if(!doc.type || (doc.type && (doc.type != \"user\"))) return false;
		if(doc.images && typeof(doc.images) == 'object'){
			for (var key in doc.images) {
				if (doc.images.hasOwnProperty(key)) {
					emit([doc._id,parseInt(key)],doc.images[key]);
					
				}
			}
		}
	}";
	$getDealsNTemplates = array(
	"map" =>
	"function(doc){
		if ( doc.type && doc.type == \"user\") {
			if(doc.hasOwnProperty('templates')){
				for (var key in doc.templates) {
					if (doc.templates.hasOwnProperty(key)) {
						var obj = {
							id : key,
							type: 'template',
							approved: doc.templates[key].approved,
							title : doc.templates[key].title,
							orig_price : doc.templates[key].orig_price,
							deal_price : doc.templates[key].deal_price
						};
						if(doc.templates[key].hasOwnProperty('image')){
							if(doc.images.hasOwnProperty(doc.templates[key])) obj.image = doc.images[doc.templates[key].image].n;
						}
						emit([doc._id,parseInt(key)],obj);
					
					}
				}
			}
		}
		if ( doc.hasOwnProperty('type') && doc.type == \"deal\") {
			var start = parseInt(doc.start);
			var end = parseInt(doc.end);
			var obj = {
				id: doc._id,
				type: doc.type,
				status: doc.status,
				template_id: doc.template.id,
				orig_price: doc.template.orig_price,
				deal_price: doc.template.deal_price,
				end: end,
				start:start,
				title: doc.template.title
			}
			if(doc.template.hasOwnProperty('image')) obj.image = doc.template.image;
			emit([doc.shopowner_id,doc.template.id],obj);
		}
	}");
	$getCheckDeals = array(
	'map'=>
	"function(doc){
		if(doc.hasOwnProperty('type') && doc.type == 'deal'){
			emit([doc.shopowner_id,parseInt(doc.end)],{id:doc._id,template_id:doc.template.id,shop_id:doc.shop.id,start:doc.start,end:doc.end});
		}
	}");
	$getShops = "function (doc) {
		if ( doc.type && doc.type == \"user\") {
			if(doc.shops && typeof(doc.shops) == 'object'){
				for (var key in doc.shops) {
					if (doc.shops.hasOwnProperty(key)) {
						emit([doc._id,parseInt(key)],doc.shops[key]);
						
					}
				}
			}
		}
	}";
	$getHistory = array(
	'map'=>
	"function (doc) {
		if ( doc.type && doc.type == \"user\") {
			if(doc.hasOwnProperty('history')){
				for (var i = 0 ; i < doc.history.length ; i++) {
					emit([doc._id,parseInt(i)],doc.history[i]);
				}
			}
		}
	}");
	$getTemplates = 
	"function (doc) {
		if ( doc.type && doc.type == \"user\") {
			if(doc.templates && typeof(doc.templates) == 'object'){
				for (var key in doc.templates) {
					if (doc.templates.hasOwnProperty(key)) {
						emit([doc._id,parseInt(key)],doc.templates[key]);
						
					}
				}
			}
		}
	}";
	$cleanDeals = 
	array(
	"map" =>
	"function (doc) {
		if ( doc.type && doc.type == \"deal\") {
			emit(doc.shopowner_id, doc);
		}
	}");
	$getDeals = 
	"function (doc) {
		if ( doc.type && doc.type == \"deal\") {
			var obj = {};
			obj.id = doc._id;
			obj.type = 'deal';
			obj.start = doc.start;
			obj.end = doc.end;
			obj.template = doc.template;
			obj.shop = doc.shop;
			obj.created = doc.created;
			emit([doc.shopowner_id,doc._id], obj);
		}
	}";
	
	$getUsersByMail = 
	"function (doc) {
		if ( doc.type && doc.type == \"user\") {
			emit(doc.user.email,doc.user);
		}
	}";
	$getFeedback = 
	"function (doc) {
		if(!doc.hasOwnProperty('type') || (doc.type != \"user\")) return false;
		if(doc.hasOwnProperty('feedback')){
			for (var i = 0 ; i < doc.feedback.length ; i++) {
				emit([doc._id,parseInt(i)],doc.feedback[i]);
			}
		}
	}";
	$views->getImages = array("map"=>$getImages);
	$views->getAll = array("map"=>$getAll);
	$views->getShops = array("map"=>$getShops);
	$views->getTemplates = array("map"=>$getTemplates);
	$views->getDeals = array("map"=>$getDeals);
	$views->getDealsNTemplates = $getDealsNTemplates;
	$views->getCheckDeals = $getCheckDeals;
	$views->getHistory = $getHistory;
	$views->getUsersByMail = array("map"=>$getUsersByMail);
	$views->getFeedback = array("map"=>$getFeedback);
	$views->cleanDeals = $cleanDeals;
	echo 'views objektet klar <br/>';
	$doc->views = $views;
	echo 'views sat<br/>';
	
	echo 'Forlader _design/dealer';
	
}
catch(Exception $e){
	echo 'fejl i _design/dealer filen<br/>';
}
?>