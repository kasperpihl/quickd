App.models.Deal = Backbone.Model.extend({
	urlRoot: 'api/shopowner/deals',
	
	initialize:function(obj) {
		this.setState();
		//log("deal init", obj, this.state);
	},
	parse:function(response){
		if (response.success == 'true' && response.data) this.setState(response.data.start, response.data.end);
		return response.data;
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
		if (start && end) {
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
App.models.Shop = Backbone.Model.extend({
	urlRoot: 'api/shopowner/shops',
	parse:function(response){
		return response.data;
	}
});
App.models.Shopowner = Backbone.Model.extend({
	urlRoot: 'api/shopowner',
	getNotifications:function(){
		
	},
	parse:function(response){
		return response.data;
	}
});
App.models.Template = Backbone.Model.extend({
	urlRoot: 'api/shopowner/templates',
	parse: function(response) {
    	return response.data;
  	}
});