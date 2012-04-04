define([
'views/activities/activity'
],function(){
	App.views.activities.Administration = App.views.Activity.extend({
		initialize: function(){
			this.activityName = 'administration';
			this.init();
			_.bindAll(this,'handleEvent');
			this.appendWindow('Administration', {router:this.router});
			this.router.bind('appendWindow',this.handleEvent);
			
		},
		handleEvent:function(options){
			switch(options.window){
				case 'bruger':
					this.openUser();
				break;
				case 'butik':
					this.openShop();
				break;
				default:
					return;
				break;
			}
		},
		openShop:function(){
			var listId = 'btn_admin_shops';
			this.appendWindow('ViewShop', {router:this.router, parent:'Administration', clickId:listId});
		},
		openUser:function(){
			var listId = 'btn_admin_user';
			this.appendWindow('AccountSettings', {router:this.router, parent:'Administration', clickId:listId});
		}
	});
});