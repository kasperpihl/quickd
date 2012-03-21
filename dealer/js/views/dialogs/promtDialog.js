define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.PromtDialog = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.init(this.options);
			this.type = this.options.type;
			if (this.type=='confirmClose') this.template ='promtConfirmClose';
			else if (this.type=='confirm') this.template ='promtConfirm';
			else this.template = 'promt';
			this.title = this.options.title;
			this.msg = this.options.msg;
			this.confirmText = this.options.confirmText;
			this.cancelText = this.options.cancelText;
			this.router = this.options.router;
			this.width = 300;
			this.height = 100;
			this.aniTime = 200;
			this.openOnCreate=this.options.hasOwnProperty('openOnCreate')?this.options.openOnCreate:true;
			this.closable = this.options.hasOwnProperty('closable')?this.options.closable:true;
			this.callbackCid = this.options.callbackCid;
			this.windowName = this.options.windowName;
			
			this.createDialog(this);
			_.bindAll(this,'handleClick');
		},
		events: {
			'click #btn_confirm, #btn_dont_save, #btn_cancel': 'handleClick'
		},
		handleClick:function(obj) {
			var id = obj.currentTarget.id;
			var eventType = id.substr(4);
			
			this.doTrigger(eventType);
			this.closeDialog(true, true);
			return false;
		},
		onClose:function() {
			this.doTrigger('cancel');
		},
		doTrigger:function(eventType) {
			this.router.trigger('promtCallback:'+this.callbackCid, {eventType:eventType, callbackCid:this.callbackCid, type: this.type, windowName:this.windowName});
		}
	});
});