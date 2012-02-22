define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.ConfirmClose = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.template ='confirm_close';
			this.init(this.options);
			this.router = this.options.router;
			this.width = 300;
			this.height = 100;
			this.aniTime = 200;
			this.openOnCreate=true;
			this.closable = true;
			this.activity = this.options.activity;
			this.windowCid = this.options.windowCid;
			this.windowName = this.options.windowName;
			
			this.createDialog();
			//this.render();
			_.bindAll(this,'handleClick');
		},
		events: {
			'click #btn_save, #btn_dont_save, #btn_cancel': 'handleClick'
		},
		handleClick:function(obj) {
			var id = obj.currentTarget.id;
			var eventType = id.substr(4);
			
			this.router.trigger('confirmCallback', {eventType:eventType, activity:this.activity, windowName:this.windowName, windowCid:this.windowCid});
			this.closeDialog(true, true);
		},
		onClose:function() {
			this.router.trigger('confirmCallback', {eventType:'cancel', activity:this.activity, windowName:this.windowName, windowCid:this.windowCid});
		}
	});
});