define([
'views/activities/activity',
'views/windows/feedback'
],function(){
	App.views.activities.Feedback = App.views.Activity.extend({
		activityName: 'feedback',
		initialize: function(){
			this.init();
			this.appendWindow('Feedback', {router:this.router,clickId:'btn_view_feedback'});
		}
	});
});