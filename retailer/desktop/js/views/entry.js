define([
],function(){
	App.views.Entry = Backbone.View.extend({
		el: 'body',
		initialize:function(){
			_.bindAll(this,'doOnOpen','handleClick');
			var thisClass = this;
			this.router = this.options.router;
			this.created = false;
			this.render();
			
		},
		events: {
			'click #login_button, #btn_read_conditions,#btn_forgot_pass,#go_register_button,#do_register_button,#cancel_register_button': 'handleClick',
			'keypress #login_username, #login_password': 'handleKeypressLogin',
			'keypress #register_username, #register_password, #register_betacode': 'handleKeypressRegister',

		},
		render: function(){
			var tpl = 'text!templates/entry.html';
			var thisClass = this;
			require([tpl],function(template){
				$('body').append(_.template(template, {view: thisClass.router.view}));
				thisClass.form = $('#register-form');
				$('#entry_view').formValidate({
					rules: {
						 register_username: {
							 required:true,
							 email:true,
							 remote: {
								 url: ROOT_URL+"ajax/shopowner.php",
	       						 type: "post",
								 data: {
									action: 'test_username' 
								 }
							 }
						 },
						 register_password: {
							 required:true,
							 minlength:6
						 },
						 register_betacode: {
							 required: true,
							 remote: {
								 url: "ajax/shopowner.php",
	       						 type: "post",
								 data: {
									action: 'test_betacode' 
								 }
							 }
						 },
						 register_accept_terms: {
						 	required:true
						 }
				   },
				   messages: {
					   register_username: {
						   remote: jQuery.validator.format("Den indtastede email er allerede registreret<br /> Log ind eller vælg en anden")
					   },
					   register_betacode: {
						   remote: jQuery.validator.format("Den indtastede betakode er ugyldig")
					   },
					   register_accept_terms: {
					   	required: jQuery.validator.format('Betingelser skal godkendes')
					   }
				   },
				   errorPlacement: function(error, element) {
						  var parent = element.closest('.field');
						  if (parent) error.appendTo(parent);
						  else error.insertAfter(element);
						  var top = element.position().top + (element.outerHeight()-error.outerHeight())/2 + 1;
						  var left = -(error.outerWidth()+15);
						  error.css({
						 		top: top+'px',
						 		left: left+'px'
						 	});
						}

				});
				if (thisClass.router.view=='register') $('#register_username').focus();
				else $('#login_username').focus();
				thisClass.created = true;
			});
		},
		shakeDialog:function(){
			$('#login .login_fields').shakeBox(false);
		},
		
		handleClick: function(data){
			//log(data.currentTarget.id);
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
					//this.router.openRegisterView();
					this.router.navigate('register', {trigger:true});
				break;
				case 'do_register_button':
					if (this.form && this.form.valid()) {
						this.router.doRegister();
					} 
					//else this.form.submit();
				break;
				case 'cancel_register_button':
					//this.router.closeRegisterView();
					this.router.navigate('login', {trigger:true});
				break;
			}
			return false;
		},
		handleKeypressLogin: function(e) {
			if(e.keyCode == 13) {
				this.router.doLogin();
			}
		},
		handleKeypressRegister: function(e) {
			if(e.keyCode == 13) {
				if (this.form && this.form.valid()) {
					this.router.doRegister();
				} else this.form.submit();
			}
		},
		doOnOpen:function() {
			$('#login_username').focus();
		}
	});
});