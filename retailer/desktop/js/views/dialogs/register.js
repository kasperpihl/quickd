define([
'views/dialogs/dialog',
],function(){
	App.views.dialogs.RegisterView = App.views.Dialog.extend({
		el: '#content',
		initialize:function(){
			var thisClass = this;
			this.template ='register';
			this.router = this.options.router;
			this.classes = "register";
			this.init(this.options);
			this.closable = true;
			
			this.createDialog({}, function() {
				thisClass.setValidator();
				//$("#body-mask").css("display", "none");
			});
			//this.render();
			_.bindAll(this,'handleKeypress', 'doRegister','setValidator','handleClick');
		},
		events: {
			'click #register_button': 'handleClick',
			'click #go_login_button': 'handleClick',
			'keypress #register_username, #register_password, #betacode': 'handleKeypress'
		},
		handleClick: function(data){
			log(this.router);
			if(data.currentTarget.id == 'register_button'){
				this.doRegister();
			}
			if(data.currentTarget.id == 'go_login_button'){
				this.router.navigate('login',{trigger:true});
			}
		},
		handleKeypress: function(e){
			if(e.keyCode == 13){
				this.doRegister();
			}
		},
		doRegister:function() {
			if (this.form && this.form.valid()) { $(this.dialogId+' input:focus').blur(); this.router.doRegister(); }
			else if (this.form) {
				this.shakeDialog();
				this.form.submit();
			}
		},
		doOnOpen:function() {
			$('#register_username').focus();
		},
		setValidator: function() {
			this.form = $(this.dialogId).find('form');
			if (this.form) {
				this.form.formValidate({
					tooltipPosition: "center right",
					tooltipOffset: -5,
					rules: {
						 user: {
							 required:true,
							 email:true,
							 remote: {
								 url: "ajax/shopowner.php",
	       						 type: "post",
								 data: {
									action: 'test_username' 
								 }
							 }
						 },
						 password: {
							 required:true,
							 minlength:6
						 },
						 betacode: {
							 required: true,
							 remote: {
								 url: "ajax/shopowner.php",
	       						 type: "post",
								 data: {
									action: 'test_betacode' 
								 }
							 }
						 }
				   },
				   messages: {
					   user: {
						   remote: jQuery.validator.format("Emailen er allerede optaget.<br /> Vælg venligst en anden email")
					   },
					   betacode: {
						   remote: jQuery.validator.format("Den indtastede betakode er ugyldig")
					   }
				   }
				   
				   
			   });
			}
		}
	});
});