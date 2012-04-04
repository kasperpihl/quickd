define([
'views/windows/window'
],function(){
	App.views.windows.Overview = App.views.Window.extend({
		el: '#activity_overview',
		template: 'overview',
		width: 300,
		initialize: function(){
			this.template = 'overview';
			this.init();
			this.createWindow(true);
			//this.setContent();
		},
		events:{
			'click #btn_view_feedback': 'viewFeedback',
			'click #btn_view_deals': 'viewDeals'
		},
		render:function(){
			
		},
		viewDeals: function(data){
			this.router.navigate(lang.urls.overviewDeals,{trigger:true});
		},
		viewFeedback: function(data){
			this.router.navigate(lang.urls.overviewFeedback,{trigger:true});
		},
	});
});