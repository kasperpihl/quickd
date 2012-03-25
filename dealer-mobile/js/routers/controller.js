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
				obj = {action: 'soldout',model: {id: this.activeModel.get('id'),status:'soldout'}};
			break;
		}
		log(obj);
		var thisClass = this;
		$.post('ajax/deal.php?type=deals',obj,function(data){
			log(data);
			if(data.success == 'true'){
				if(data.data.id){
					var model = new App.models.Deal(data.data);
					App.collections.deals.add(model,{silent:true});
					thisClass.changedState(model);
				}
				else {
					thisClass.activeModel.set(data.data);
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
		//log('result from changes',result);
		result = $.parseJSON(result);
		if(result.hasOwnProperty('csince')) localStorage.setItem('csince',result.csince);
		if(result.hasOwnProperty('success') && result.success == 'false') return setTimeout(this.getChanges,3000);
		if(result.hasOwnProperty('cindex')) localStorage.setItem('cindex',result.cindex);

		setTimeout(this.getChanges,3000);
		if(!result.data) return;
		var results = result.data;
		if(results.length > 0){
			var resultHandling = {};
			for(var i = results.length-1 ; i >= 0  ; i--){
				var doc = results[i].value;
				var model,newModel,collection;
				log(doc.type);
				switch(doc.type){
					
					case 'template':
						newModel = App.models.Template;
						collection = App.collections.templates;
						model = collection.get(doc.id);
						if(model === undefined) break;
						log(doc.action);
						switch(doc.action){
							case 'approved':
							case 'edited':
							case 'declined':
								model.set('approved',doc.action);
							break;
						}
					break
					case 'deal':
						newModel = App.models.Deal;
						collection = App.collections.deals;
						model = collection.get(doc.id);
						if(model === undefined) break;
					break;
					default:
						continue;
					break;
				}
				/*if(model && (doc.rev > model.get('rev'))){
					//log('fetched',doc.type,doc.id);
					model.fetch({success:function(d,mod){ log('response fra fetch1',d,mod); },error:function(d,d2){ log(d,d2); }});
					App.views.notifications.changesHandling(doc.type,doc.action,route);
				} */
				if(model === undefined){
					log('fetchedU',doc.type,doc.id);
					model = new newModel({id:doc.id});
					model.fetch({success:function(d,data){ log('response fra fetch2',d,data); if(data.success == 'true'){  collection.add(d); } },error:function(d,d2){ log(d,d2); }});
					
				}
				
			}
		}
	}
	
});