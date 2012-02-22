define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.Feedback = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.template ='feedbackReadmore';
			this.router = this.options.router;
			this.width = 500;
	
			this.closable = true;
			this.init(this.options);
			this.createDialog();
			//this.render();
		}
	});
});