define([
'views/windows/window'
],function(){
	App.views.windows.Administration = App.views.Window.extend({
		el: '#activity_administration',
		initialize: function(){
			this.template = 'administration',
			this.width = 300;
			this.init();
			this.createWindow(true);
			//this.setContent();
		},
		events:{
			'click #btn_admin_shops': 'viewShop',
			'click #btn_admin_user': 'viewUser'
		},
		render:function(){
			
		},
		viewShop: function(obj,ref){
			this.router.navigate(lang.urls.administrationShop,{trigger:true});
		},
		viewUser: function(obj,ref){
			this.router.navigate(lang.urls.administrationUser,{trigger:true});
		}
	});
});