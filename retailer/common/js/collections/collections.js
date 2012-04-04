App.collections.Deals = Backbone.Collection.extend({
	url: ROOT_URL+'api/shopowner/deals',
	parse: function(response) {
		return response.data;
	},
	comparator: function(deal) {
		return deal.get('start');
	},
	isStartedDeal:function(templateId){
		var now = parseInt((new Date()).getTime()/1000,10);
		var startedNow = this.filter(function(item){
			if( templateId != item.get('template_id')) return false;
			if(item.get('start') > now) return false;
			if(item.get('end') < now) return false;
			return true;
		});
		if(startedNow.length > 0) return startedNow[0];
		else return false;
	},
	model: App.models.Deal
});
App.collections.Images = Backbone.Collection.extend({
	url: ROOT_URL+'api/shopowner/images',
	parse: function(response){
		return response.results;
	},
	comparator:function(model){
		return -parseInt(model.get('id'),10);
	},
	getUrl:function(id, type) {
		var standard = IMG_URL+type+'/noimage.png';
		if (!id) return standard;
		if (!type) type = 'thumbnail';
		
		var img = this.get(id);
		if (img) return img.getUrl(type);
		else return standard;
	},
	model: App.models.Image
});
App.collections.Feedback = Backbone.Collection.extend({
	url: ROOT_URL+'api/shopowner/feedback',
	parse: function(response){
		return response.data;
	},
	model: App.models.Image
});
App.collections.Shops = Backbone.Collection.extend({
	url: ROOT_URL+'api/shopowner/shops',
	parse: function(response) {
		return response.data;
	},
	model: App.models.Shop
});
App.collections.Templates = Backbone.Collection.extend({
	url: ROOT_URL+'api/shopowner/templates',
	parse: function(response) {
		return response.data;
	},
	comparator: function(template) {
		return -template.get('created_at');
	},
	getApproved:function() {
		var approved = [];
		this.each(function(tpl) {
			if(tpl.get('approved')==='approved') approved.push(tpl.toJSON());
		});
		return approved;
	},
	model: App.models.Template
});