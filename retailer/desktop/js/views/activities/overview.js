define([
'views/activities/activity'
],function(){
	App.views.activities.Overview = App.views.Activity.extend({
		activityName: 'overview',
		initialize: function(){
			this.init();
			this.appendWindow('Overview', {router:this.router});
			_.bindAll(this,'handleEvent');
			this.router.bind('appendWindow',this.handleEvent);
		},
		handleEvent:function(options){
			switch(options.window){
				case 'feedback':
					this.openFeedback();
				break;
				case 'deals':
					var id = false;
					if(options.hasOwnProperty('id')) id = options.id;
					this.openDeals(id);
				break;
				default:
					return;
				break;
			}
		},
		openDeals: function(id){
			var listId = 'btn_view_deals';
			if (id) {
				if (this.windows['MyDeals']) this.windows['MyDeals'].showDeal(id, true);
				else this.appendWindow('MyDeals',{router:this.router, parent:'Overview',clickId: listId, dealId: id});
			} else {
				if (this.windows['MyDeals']) this.windows['MyDeals'].showList();
				else this.appendWindow('MyDeals',{router:this.router, parent:'Overview',clickId: listId});
			}
		},
		openFeedback:function(){
			var listId = 'btn_view_feedback';
			this.appendWindow('Feedback', {router:this.router, parent:'Overview', clickId:listId});
		}
	});
});