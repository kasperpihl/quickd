	App.routers.Controller = Backbone.Router.extend({
	initialize: function(shopowner){
		App.collections.templates = new App.collections.Templates();
		App.collections.deals = new App.collections.Deals();
		App.collections.shops = new App.collections.Shops();
		this.addStuff(shopowner);
		_.bindAll(this,'getChanges','changes');
		//this.getChanges();
		App.views.deals = new App.views.Deals({router: this});
		App.views.controlPanel = new App.views.ControlPanel({router:this});
	},
	test:function(){

	},
	addStuff:function(stuff){
		_.each(stuff,function(item,i){
			var document = item.value;
			
			if(document.hasOwnProperty('type') && document.type == 'deal'){
				var model = new App.models.Deal(document);
				App.collections.deals.add(model);
			}
			if(document.hasOwnProperty('type') && document.type == 'template'){
				var model = new App.models.Template(document);
				App.collections.templates.add(model);
			}
			if(document.hasOwnProperty('historySince')) localStorage.setItem('cindex',parseInt(document.historySince));
			if(document.hasOwnProperty('shops')){
				_.each(document.shops,function(shop,i){
					var model = new App.models.Shop(shop);
					App.collections.shops.add(model);
				});
			}
		});
	},
	changedToTemplate:function(templateId){
		var startedDeal = App.collections.deals.isStartedDeal(templateId);
		startedDeal = startedDeal ? startedDeal : App.collections.templates.get(templateId);
		App.views.controlPanel.changed(startedDeal.toJSON());
		//log(startedDeal.toJSON());
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
	}
	
});