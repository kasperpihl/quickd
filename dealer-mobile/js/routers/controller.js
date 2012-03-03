App.routers.Controller = Backbone.Router.extend({
	locked: false,
	initialize: function(shopowner){
		App.collections.templates = new App.collections.Templates();
		App.collections.deals = new App.collections.Deals();
		App.collections.shops = new App.collections.Shops();
		
		
		this.addStuff(shopowner);
		_.bindAll(this,'getChanges','changes','clickedStartStop','changedState');
		this.getChanges();
		App.views.deals = new App.views.Deals({router: this});
		App.utilities.countdown = new App.utilities.Countdown();
		App.collections.deals.on('add',this.changedState);
		App.collections.deals.on('change:state',this.changedState);
		App.collections.deals.on('change:status',this.changedState);
		App.views.controlPanel = new App.views.ControlPanel({router:this});
	},
	addStuff:function(stuff){
		_.each(stuff,function(item,i){
			var document = item.value;
			var model;
			if(document.hasOwnProperty('type') && document.type == 'deal'){
				model = new App.models.Deal(document);
				App.collections.deals.add(model);
			}
			if(document.hasOwnProperty('type') && document.type == 'template'){
				model = new App.models.Template(document);
				App.collections.templates.add(model);
			}
			if(document.hasOwnProperty('historySince')) localStorage.setItem('cindex',parseInt(document.historySince,10));
			if(document.hasOwnProperty('shops')){
				_.each(document.shops,function(shop,i){
					model = new App.models.Shop(shop);
					App.collections.shops.add(model);
				});
			}
		});
	},
	changedState:function(model){
		if(parseInt(model.get('template_id'),10) == parseInt(this.activeTemplateId,10)){
			if(model.get('state') == 'current'){
				App.views.controlPanel.changed(model);
			}
			else if(model.get('state') == 'ended'){
				App.utilities.countdown.stop();
				App.views.controlPanel.changed(App.collections.templates.get(this.activeTemplateId));
			}
			else if(model.get('status') == 'soldout'){
				App.views.controlPanel.changed();
			}
		}
	},
	lock:function(){
		App.views.controlPanel.lockView();
	},
	unlock: function(){
		App.views.controlPanel.unlockView();
	},
	changedToTemplate:function(templateId){
		this.activeTemplateId = templateId;
		var startedDeal = App.collections.deals.isStartedDeal(templateId);
		startedDeal = startedDeal ? startedDeal : App.collections.templates.get(templateId);
		this.activeModel = startedDeal;
		App.views.controlPanel.changed(startedDeal);
		//log(startedDeal.toJSON());
	},
	clickedStartStop:function(time){
		var obj;
		switch(this.activeModel.get('type')){
			case 'template':
			obj = {action:'start',model:{mobile:'true',template_id:this.activeModel.get('id'),seconds: time}};
			break;
			case 'deal':
			obj = {action: 'stop',model: {id: this.activeModel.get('id'),status:'soldout'}};
			break;
		}
		$.post('ajax/deal.php?type=deals',obj,function(data){
			log(JSON.stringify(data));
			if(data.success == 'true'){
				if(data.data.id){
					var model = new App.models.Deal(data.data);
					App.collections.deals.add(model);
				}
				else {
					this.activeModel.set(data.data);
				}
				
				
			}
		},'json');
	},
	getChanges: function(){
		var thisClass = this;
		var cindex = (localStorage.getItem('cindex') != 'undefined') ? localStorage.getItem('cindex') : 0;
		var csince = (localStorage.getItem('csince') != 'undefined') ? localStorage.getItem('csince') : 0;
		$.ajax({
			type: "GET",
			url: ROOT_URL+"ajax/changes.php",
			data: 'cindex='+cindex+'&csince='+csince,
			async: true,
			cache: false,
			timeout:4000,
			success: thisClass.changes,
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				log('error changes',XMLHttpRequest,textStatus,errorThrown);
				setTimeout(thisClass.getChanges,3000);
			}
		});			
	},
	changes:function(result){
		log('result from changes',result);
		result = $.parseJSON(result);
		if(result.hasOwnProperty('csince')) localStorage.setItem('csince',result.csince);
		if(result.hasOwnProperty('success') && result.success == 'false') return setTimeout(this.getChanges,3000);
		if(result.hasOwnProperty('cindex')) localStorage.setItem('cindex',result.cindex);

		setTimeout(this.getChanges,3000);
		if(!result.data) return;
		var results = result.data;
		/*if(results.length > 0){
			var resultHandling = {};
			for(var i = results.length-1 ; i >= 0  ; i--){
				var doc = results[i].value;
				var model,newModel,collection,route;
				switch(doc.type){
					case 'template':
						route = lang.urls.templates + '/' + doc.id;
						newModel = App.models.Template;
						collection = App.collections.templates;
						model = collection.get(doc.id);
					break;
					case 'shop':
						route = lang.urls.administrationShop;
						newModel = App.models.Shop;
						collection = App.collections.shops;
						model = collection.get(doc.id);
					break;
					case 'feedback':
						route = lang.urls.overviewFeedback + '/' + doc.id;
						newModel = App.models.Feedback;
						collection = App.collections.feedback;
						model = collection.get(doc.id);
					break;
					case 'deal':
						route = lang.urls.overviewDeals + '/' + doc.id;
						newModel = App.models.Deal;
						collection = App.collections.deals;
						model = collection.get(doc.id);
					break;
					default:
						continue;
					break;
				}
				if(model && (doc.rev > model.get('rev'))){
					//log('fetched',doc.type,doc.id);
					model.fetch({success:function(d,mod){ log('response fra fetch1',d,mod); },error:function(d,d2){ log(d,d2); }});
					App.views.notifications.changesHandling(doc.type,doc.action,route);
				} 
				if(model === undefined){
					log('fetchedU',doc.type,doc.id);
					model = new newModel({id:doc.id});

					model.fetch({success:function(d,data){ log('response fra fetch2',d,data); if(data.success == 'true'){  collection.add(d); App.views.notifications.changesHandling(doc,route); } },error:function(d,d2){ log(d,d2); }});
					
				}
				
			}
		}*/
	}
	
});
App.utilities.Countdown = Backbone.Router.extend({
	time: 1000,
	count: false,
	el: '#time time',
	show:false,
	model:false,
	initialize:function(){
		_.bindAll(this,'countdown','addLeadingZero','output');

	},
	setModelAndStart:function(model){
		this.model = model;
		this.show = true;
		this.output();
		if(!this.count) this.countdown();
		this.count = true;
	},
	stop: function(){
		this.show = false;
	},
	countdown:function(){
		if(this.show) this.output();
		setTimeout(this.countdown,1000);
	},
	addLeadingZero:function(n){
		if(n.toString().length < 2) return '0' + n;
		else return n;
	},
	output: function(){
		var time_left = this.model.getCountdown();
		if(time_left < 0) return;
		var hours, minutes, seconds;
		seconds = time_left % 60;
		minutes = Math.floor(time_left / 60) % 60;
		hours = Math.floor(time_left / 3600);

		seconds = this.addLeadingZero( seconds );
		minutes = this.addLeadingZero( minutes );
		hours = this.addLeadingZero( hours );

		$(this.el).html(hours + ':' + minutes + ':' + seconds);
	}


});