define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.ResetPassword = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			_.bindAll(this,'handleKeypress','doOnOpen','handleClick');
			var thisClass = this;
			this.init(this.options);
			this.template ='resetPassword';
			this.router = this.options.router;
			this.closable = true;
			this.width = 380;
			this.height = 222;
			log(this.options);
			this.createDialog({email:this.options.email}, function() {
				$(thisClass.dialogId).formValidate();
			});
			
		},
		events: {
			'click #btn_reset_button': 'handleClick',
			'keypress #reset_email': 'handleKeypress'
		},
		handleClick: function(data){
			if(data.currentTarget.id == 'btn_reset_button'){
				this.router.doResetPass($('#reset_email').val());
			}
		},
		handleKeypress: function(e){
			if(e.keyCode == 13){
				
				this.router.doResetPass();
			}
		},
		doOnOpen:function() {
			$('#reset_email').focus();
		}
	});
});