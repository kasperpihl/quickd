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
			console.log(this.model);
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
						 user_pass_new: {
							 minlength: 6
						 },
						 user_pass_again: {
							 equalTo: "#user_pass_new",
							 minlength: 6
						 },
						 user_pass: {
							 required: function(el) {
								if ($('#user_pass_new').val() != "" && $('#user_pass_again').val() != "") return true;
								else return false;
							 }
						 }
				   },
				   messages: {
					   user_pass: "Indtast nuværende password for verificere ændringer"
				   }
			   });
			   
			   $(this.form).find('input, textarea').focus(function() {
				  thisClass.lastFocus = $(this); 
			   });
			}
		  
		},
		editAccount:function(obj){
			log("editAccount", this.state);
			if(this.state == 'view'){
				$("#btn_edit_account").html("Gem").addClass("blue");
				$("#btn_cancel_account").css("display", "block");
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
					log("onChanged");
					thisClass.router.trigger('settingsEdited',{event:'settingsEdited'});
				}, success:function(d,data){  
					log("success");
					$("#btn_edit_account").html("Rediger").removeClass("blue");
					$("#btn_cancel_account").css("display", "none");
					thisClass.state = 'view';
				},error:function(d, data) {
					log("error", d, data);
					if (data.success=='false'&&data.error_message) {
						if (data.error_message=='wrong_password') {
							$('#user_pass').val('');
							$('#user_pass_new').val('');
							$('#user_pass_again').val('');
							$('#wrong_pass').slideDown();
						}
					} else {
						this.important = false;
					}
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
		doEdit:function(obj) {
			if (this.state=='view') {
				$(this.windowId).formSetState('edit');
				if (!this.form) this.setValidator();
				obj.currentTarget.blur();
				obj.currentTarget.focus();
				this.state = 'edit';
			}
		}
	});
});