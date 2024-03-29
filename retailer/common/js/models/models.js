App.models.Deal = Backbone.Model.extend({
	urlRoot: API_URL+'retailer/deals',
	initialize:function(obj) {
		this.setState();
		//log("deal init", obj, this.state);
	},
	parse:function(response){
		if (response.success == 'true' && response.data) this.setState(response.data.start, response.data.end);
		return response.data;
	},
	getCountdown:function(){
		var timestamp = parseInt(new Date().getTime()/1000,10);
		var end = parseInt(this.get('end'),10);
		return end-timestamp;
	},
	isStarted:function(){
		var start = this.get("start");
		var end = this.get("end");
		if (start && end) {
			var now = (new Date()).getTime()/1000;
			if(end < now) return false;
			if(start > now) return false;
			return true;
		}
		else return false;
	},
	setState:function(start, end) {
		if (!start) start = this.get("start");
		if (!end)   end = this.get("end");
		if (this.get('deal_type') && this.get('deal_type')=='regular') this.set({state:"regular"});
		else if (start && end) {
			var now = (new Date()).getTime()/1000;
			if (end < now) this.set({state: "ended"}, {silent: true});
			else if (start < now) this.set({state: "current"}, {silent: true});
			else this.set({state: "planned"}, {silent: true});
			
			var timeOut = 0;
			if (this.get('state') == 'planned') timeOut = Math.round(start-now);
			else if(this.get('state') == 'current') timeOut = Math.round(end-now);
			
			if (timeOut > 0) {
				var thisClass = this;
				//log("setTimeOut", this.get('state'), timeOut);
				setTimeout(function() {
					//log("timedOut", thisClass.get('state'));
					if (thisClass.get('state') == 'planned') {
						thisClass.set('state', 'current');
						now = (new Date()).getTime()/1000;
						setTimeout(function() { thisClass.set('state', 'ended') }, (thisClass.get('end')-now)*1000);
					} else if(thisClass.get('state') == 'current') thisClass.set('state', 'ended');
				}, timeOut*1000);
			}
		}
	}
});
App.models.Image = Backbone.Model.extend({
	urlRoot: API_URL+'retailer/images',
	parse:function(response){
		return response.data;
	},
	rotate:function(direction,callback){
		var thisModel = this;
		$.get(ROOT_URL+'ajax/image.php',{action:'rotate',direction:direction,index:this.get('id')},function(data){
			if(data.success == 'true'){
				thisModel.set(data.data);		
			}
			else {
				log('error rotating',data.error);
				switch(data.error){
					
				}
			}
		},'json');
	},
	editThumb:function(newCoords){
		log(newCoords);
	},
	getUrl: function(folder){
		return IMG_URL + folder + '/' + this.get('n')+'?'+this.get('rev');
	}
});
App.models.Feedback = Backbone.Model.extend({
	urlRoot: API_URL+'retailer/feedback',
	parse:function(response){
		return response.data;
	}
});
App.models.Shop = Backbone.Model.extend({
	urlRoot: API_URL+'retailer/shops',
	parse:function(response){
		return response.data;
	}
});
App.models.Shopowner = Backbone.Model.extend({
	url: API_URL+'retailer',
	getNotifications:function(){
		
	},
	parse:function(response){
		return response;
		return response.data;
	}
});
App.models.Template = Backbone.Model.extend({
	urlRoot: API_URL+'retailer/templates',
	parse: function(response) {
		return response.data;
	},
	isApproved:function(){
		return (this.get('approved') == 'approved');
	}
});