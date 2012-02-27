
App.views.Deals = Backbone.View.extend({
	el: '#rSS',
	initialize:function(){
		_.bindAll(this,'render');
		this.router = this.options.router;
		this.deals = App.collections.deals;
		this.templates = App.collections.templates;
		this.render();
	},
	render: function(){
		var thisClass = this;
		var data = {templates: this.templates.toJSON(), deals: this.deals.toJSON()};
		log(data);
		$.get('templates/deals.html',function(template){
			$(thisClass.el).html(_.template(template,data));
			thisClass.router.trigger('dealsLoaded');
		},'html');
	}	
});