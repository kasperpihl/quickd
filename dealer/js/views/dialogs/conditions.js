define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.Conditions = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.init(this.options);
			this.template ='conditions';
			this.router = this.options.router;
			this.width = 600;
			this.height = 600;
	
			this.closable = true;
			
			this.createDialog();
			//this.render();
		}
	});
});