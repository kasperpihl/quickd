define([
],function(){
	App.views.Entry = Backbone.View.extend({
		el: '#content',
		initialize:function(){
			_.bindAll(this,'handleKeypress','doOnOpen','handleClick');
			var thisClass = this;
			this.router = this.options.router;
			this.render();
			
		},
		events: {
			'click #login_button, #btn_read_conditions,#btn_forgot_pass,#go_register_button,#do_register_button,#cancel_register_button': 'handleClick',			
			'keypress #login_username, #login_password': 'handleKeypress'
		},
		render: function(){
			var tpl = 'text!templates/entry.html';
			var thisClass = this;
			require([tpl],function(template){
				$('#content').append(_.template(template));
				$('#entry_view').formValidate();
				$('#login_username').focus();
			});
		},
		shakeDialog:function(){
			log('shaking');
			$('#shadow-wrapper').shakeBox();
		},
		
		handleClick: function(data){
			log(data.currentTarget.id);
			switch(data.currentTarget.id){
				case 'btn_forgot_pass':
					this.router.openResetPass($('#login_username').val());
				break;
				case 'btn_read_conditions':
					this.router.openConditionsView();
				break;
				case 'login_button':
					this.router.doLogin();
				break;
				case 'go_register_button':
					this.router.openRegisterView();
				break;
				case 'do_register_button':
					this.router.doRegister();
				break;
				case 'cancel_register_button':
					this.router.closeRegisterView();
				break;
			}
		},
		handleKeypress: function(e){
			if(e.keyCode == 13){
				this.router.doLogin();
			}
		},
		doOnOpen:function() {
			$('#login_username').focus();
		}
	});
});