define([
'models/models'
],function(){
	App.collections.Deals = Backbone.Collection.extend({
		url: ROOT_URL+'api/shopowner/deals',
		parse: function(response) {
			return response.data;
	  	},
		comparator: function(deal) {
			return deal.get('start');
		},
		model: App.models.Deal,
	});
	App.collections.Images = Backbone.Collection.extend({
		url: ROOT_URL+'api/shopowner/images',
		parse: function(response){
			return response.results;
		},
		comparator:function(model){
			return -parseInt(model.get('id'));
		},
		getUrl:function(id, type) {
			var standard = ROOT_URL+'styles/stylesheets/i/no_image_small.png';
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
});