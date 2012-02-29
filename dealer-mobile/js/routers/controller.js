App.routers.Controller = Backbone.Router.extend({
	locked: false,
	initialize: function(shopowner){
		App.collections.templates = new App.collections.Templates();
		App.collections.deals = new App.collections.Deals();
		App.collections.shops = new App.collections.Shops();
		this.addStuff(shopowner);
		_.bindAll(this,'getChanges','changes','clickedStartStop');
		//this.getChanges();
		App.views.deals = new App.views.Deals({router: this});
		App.utilities.countdown = new App.utilities.Countdown();
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
	lock:function(){
		App.views.controlPanel.lockView();
	},
	unlock: function(){
		App.views.controlPanel.unlockView();
	},
	changedToTemplate:function(templateId){
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
				obj = {action:'start',model:{template_id:this.activeModel.get('id'),seconds: time}};
				log(obj);
			break;
		}
		/*$.post('ajax/deal.php?type=deals',obj},function(data){
            log(JSON.stringify(data));
            if(data.success == 'true'){
            }
        },'json');*/
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
	output: function(time_left){
		var time_left = this.model.getCountdown();
		var hours, minutes, seconds;
		seconds = time_left % 60;
		minutes = Math.floor(time_left / 60) % 60;
		hours = Math.floor(time_left / 3600);
 
		seconds = this.addLeadingZero( seconds );
		minutes = this.addLeadingZero( minutes );
		hours = this.addLeadingZero( hours );

		$(this.el).html(hours + ':' + minutes + ':' + seconds);
	},


});