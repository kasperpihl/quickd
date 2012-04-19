define([
'views/windows/window'
],function(){
	App.views.windows.AccountSettings = App.views.Window.extend({
		el: '#activity_administration',
		initialize: function(){
			this.template = 'accountsettings';
			this.init(this.options);
			_.bindAll('cancelEdit');
			this.state='view';
			this.depth = 2;
			this.width = 425;
			this.confirmClose=true;
			this.inputPrefix = 'user_';
			this.model = App.models.shopowner;
			this.createWindow(true,{attributes:this.model.attributes,prefix:this.inputPrefix});
			
		},
		events: {
			'click #btn_edit_account': 'editAccount',
			'click input.readonly, textarea.readonly': 'editAccount',
			'click #btn_cancel_account': 'cancelEdit'
		},
		setValidator: function() {
			var thisClass = this;
			this.form = $(this.windowId).find('form');
			if (this.form) {
				this.form.formValidate({
					submitKey:'#btn_edit_account',
					rules: {
						 user_phone: "digits",
						 user_new_password: {
							 minlength: 6
						 },
						 user_old_password: {
							 required: '#user_pass_new:filled',
							 minlength: 6,
							 remote: {
								 url: ROOT_URL+"ajax/shopowner.php",
	       						 type: "post",
								 data: {
									action: 'test_userpass' 
								 }
							 }
						 }
				   },
				   messages: {
					   user_pass: {
					   	required: "Indtast nuværende password for at ændre",
					   	remote: "Det indtastede password er forkert"
					   }
				   }
			   });
			   
			   $(this.form).find('input, textarea').focus(function() {
				  thisClass.lastFocus = $(this); 
			   });
			}
		  
		},
		editAccount:function(obj){
			if(this.state == 'view'){
				$(this.windowId).formSetState('edit');
				this.state = 'edit';
				if (!this.form) this.setValidator();
				
				if ($('#'+obj.currentTarget.id).is(':button')) {
					if (this.lastFocus) this.lastFocus.focus();
					else this.form.find('input[type=text]:first').focus();
				} else obj.currentTarget.focus();
				this.important = true;
				this.router.trigger('lock',{lock:'window',me: this.cid,activityCid: this.activity.cid,depth:this.depth});
			}
			else{
				var thisClass = this;
				if ($('#wrong_pass').is(':visible')) $('#wrong_pass').slideUp();
				this.saveToModel({onChanged:function() {
					thisClass.router.trigger('settingsEdited',{event:'settingsEdited'});
				}, success:function(d,data){  
					thisClass.state = 'view';
					thisClass.model.unset('old_password', {silent:true});
					thisClass.model.unset('new_password', {silent:true});
				},error:function(d, data) {
					log("error", d, data);
					if (data.success=='false'&&data.error) {
						if (data.error=='passwords_no_match') {
							$('#user_old_password').val('');
							$('#user_new_password').val('');
							$('#wrong_pass').slideDown();
						}
					} else {
						this.important = false;
					}
					thisClass.model.unset('old_password', {silent:true});
					thisClass.model.unset('new_password', {silent:true});
				}  }  );
			}
			return false;
		},
		cancelEdit:function(){
			this.state = 'view';
			this.setContent({attributes:this.model.attributes,prefix:this.inputPrefix});
			this.router.trigger('unlock',{lock:'window',activityCid: this.activity.cid,depth:this.depth});
			return false;
		},
	});
});