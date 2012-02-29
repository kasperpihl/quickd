define([
'order!views/dialogs/dialog',
'order!views/dialogs/register',
'order!views/entry',
'models/models'
],function(){
App.routers.Entry = Backbone.Router.extend({
	routes: {
		
		//'login':				'openLoginView',
		//'register':				'openRegisterView',
	},
	initialize: function(){	
		this.dashReady = false;
		this.entryView = new App.views.Entry({router:this});
		/*this.loginView = new App.views.dialogs.LoginView({router: this});*/
		this.registerView = new App.views.dialogs.RegisterView({router:this});
		this.model = App.models.shopowner = new App.models.Shopowner();
		this.view;
		this.box = false;
		_.bindAll(this,'doLogin','doRegister','openRegisterView', 'closeRegisterView', 'makeDashReady');
		this.makeDashReady();
	},
	dealer:function(){
		log('dealing');
	},
	doLogin: function(){
		var thisClass = this;
		$.post('api/login',{email:$('#login_username').val(),password:$('#login_password').val()},function(response){
		 	log('response from login',response);
			if(response.success == 'true'){
				thisClass.entryView.r
				$("#body-mask").hide();
				$("#header-login").animate({top: '-700px', opacity: 1}, 500, 'easeInQuart');
				$("#footer-login").animate({bottom: '-700px', opacity: 1}, 500, 'easeInQuart');
				
				
				setTimeout(function() {
					thisClass.model.set(response.dealer);
					thisClass.startDashboard(response.stuff);
				}, 200);
			}
			else{
				thisClass.entryView.shakeDialog();
			}
		},'json');
	},
	doRegister: function(){
		var thisClass = this;
		log($('#register_username'));
		$.post('api/register',{email:$('#register_username').val(),password:$('#register_password').val(),betacode:$('#betacode').val()},function(response){
			
			log('reg',response);
			if(response.success == 'true'){
				log("response from register", response);
				thisClass.model.set(response.data);
				thisClass.startDashboard();
			}
			else{
				if(response.error == 'user_exists') {
					thisClass.registerView.shakeDialog();
					alert('Brugeren findes allerede');
				} else if (response.error == 'wrong_beta'){
					thisClass.registerView.shakeDialog();
					alert('Forkert betakode');
				}
			}
		},'json');
		
	},
	doResetPass: function() {
		log("DO RESET PASSWORD HERE!?!");
	},
	
	openRegisterView:function(){
		//this.registerView.openDialog();
		$("#header-login").animate({height: $(window).height() + 'px', opacity: 1}, 1200, 'easeOutQuart');
		$("#position_wrapper").animate({marginTop: '-175px'}, 1200, 'easeOutQuart');
		$("#login_fields").animate({left: '-50%'}, 400, 'easeInQuart', function() {
			$("#registrer").css("display", "block");
			$("#registrer").animate({right: '50%', marginRight: '-203px'}, 400, 'easeOutQuart');
		});
		
		//$("#registrer").fadeIn('slow');
		//$("#register_background").fadeIn('slow');
		
		
		

	},
	
	closeRegisterView:function() {
		$("#header-login").animate({height: $(window).height()/2 + 'px', opacity: 1}, 1200, 'easeOutQuart');
		$("#position_wrapper").animate({marginTop: '-124px'}, 1200, 'easeOutQuart');
		
		$("#registrer").animate({right: '-50%', marginRight: '-203px'}, 400, 'easeInQuart', function() {
			$("#login_fields").animate({left: '50%'}, 400, 'easeOutQuart');
			$("#registrer").css("display", "none");
		});
		
		
		
		//$("#login_fields").fadeIn('slow');
		//$("#registrer").fadeOut('slow');
		//$("#register_background").fadeOut('slow');
	},

	openConditionsView:function() {
		var thisClass = this;
		require(['views/dialogs/conditions'],function(){
			thisClass.conditionsView = new App.views.dialogs.Conditions({router:thisClass});
			thisClass.conditionsView.openDialog();
		});
	},
	openResetPass:function() {
		var thisClass = this;
		require(['views/dialogs/resetPassword'],function(){
			thisClass.resetPassView = new App.views.dialogs.ResetPassword({router:thisClass});
			thisClass.resetPassView.openDialog();
		});
	},
	makeDashReady:function(){
		var thisClass = this;
		require(['routers/dashboard'],function(){
			log('dash ready');
			thisClass.dashReady = true;
			App.routers.dashboard = new App.routers.Dashboard();
		});
	},
	startDashboard: function(stuff){
		alert("dashboard started");
		if(!this.dashReady){
			setTimeout(this.startDashboard(stuff),200);
			return;
		}
		var obj = {};
		if(stuff) obj.stuff = stuff;
		/*this.loginView.closeDialog(true);
		this.registerView.closeDialog(true);*/
		$('#footer.entry_footer').remove();
		require(['routers/dashboard'],function(){
			App.routers.dashboard.start(obj);
			Backbone.history.start(historyObj); 
			$(function(){
				App.routers.dashboard.navigate('hjem',{trigger:true});
			});
		});
	}
});
return App.routers.Entry;
});