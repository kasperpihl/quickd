define([
'views/dialogs/dialog'
],function(){
	App.views.dialogs.Refill = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.template ='refill';
			this.router = this.options.router;
			this.width = 500;
	
			this.closable = true;
			this.init(this.options);
			this.createDialog();
			//this.render();
			_.bindAll(this,'handleClick');
		},
		events: {
			'click #btn_accept': 'handleClick',
		},
		handleClick:function() {
			this.closeDialog(true);
		},
	});
});