define([
'order!views/dialogs/dialog',
'order!views/entry',
'models/models',
'routers/dashboard'
],function(){
App.routers.Entry = Backbone.Router.extend({
	routes: {
		'login':		'setViewLogin',
		'register':	'setViewRegister',
		'*index': 	'setViewLogin'	
	},
	initialize: function(){	
		this.route;
		this.entryView = new App.views.Entry({router:this});
		this.model = App.models.shopowner = new App.models.Shopowner();
		this.view = 'login';
		this.box = false;
		_.bindAll(this,'doLogin','doRegister','openRegisterView', 'closeRegisterView');
	},
	setViewLogin:function(obj) {
		if(this.isLoggedIn) return false;
		this.view = 'login';
		if (this.entryView.created) this.closeRegisterView();
	},
	setViewRegister:function(obj) {
		if(this.isLoggedIn) return false;
		this.view = 'register';
		if (this.entryView.created) this.openRegisterView();
	},
	animateDashboard: function() {
		$("#body-mask").hide();
		$("#header-login").animate({top: '-700px', opacity: 1}, 500, 'easeInQuart');
		$("#footer-login").animate({bottom: '-700px', opacity: 1}, 500, 'easeInQuart');		
	},
	animateDoRegister: function() {
		$("#header-login").animate({height: $(window).height()/2 + 'px', opacity: 1}, 1200, 'easeOutQuart');
		$("#position_wrapper").animate({marginTop: '-124px'}, 1200, 'easeOutQuart');	
	},
	doLogin: function(){
		var thisClass = this;
		$.post(ROOT_URL+'api/login',{email:$('#login_username').val(),password:$('#login_password').val()},function(response){
		 	log('response from login',response);
			if(response.success == 'true'){
				thisClass.animateDashboard();
				setTimeout(function(){
					thisClass.model.set(response.dealer);
					thisClass.startDashboard(response.stuff);		
				},200);
			}
			else{
				thisClass.entryView.shakeDialog();
			}
		},'json');
	},
	doRegister: function(){
		var thisClass = this;
		//log($('#register_password').val(),'hej');
		$.post(ROOT_URL+'api/register',{email:$('#register_username').val(),password:$('#register_password').val(),betacode:$('#register_betacode').val()},function(response){
			
			log('reg',response);
			if(response.success == 'true'){
				
				$("#footer-login").fadeOut();
				$("#header-login").fadeOut();

				setTimeout(function(){
					thisClass.model.set(response.data);
					thisClass.startDashboard();
				}, 200);
				
			}
			else{
				var $errorCont = $('#error_container');
				if      (response.error == 'user_exists') $errorCont.html('Brugeren findes allerede');
				else if (response.error == 'wrong_betacode') $errorCont.html('Betanøglen er ugyldig');
				else if (response.error == 'email_not_valid') $errorCont.html('Den indtastede email er ugyldig');
				else if (response.error == "password_must_be_6_long") $errorCont.html('Det valgte password er for kort');
				$errorCont.show();
			}
		},'json');
		
	},
	doResetPass: function(email) {
		$.post(ROOT_URL+'api/reset',{model:{email:email,type:'dealer'}},function(data){
			log(data);
		},'html');
	},
	
	openRegisterView:function(){
		var $view = $('#entry_view');
		$("#header-login").animate({height: $view.outerHeight() + 'px', opacity: 1}, 1200, 'easeOutQuart', function() {
			$("#header-login").height("100%");
		});
		$("#position_wrapper").animate({marginTop: '-210px'}, 1200, 'easeOutQuart');
		$("#login_fields").animate({left: '-50%'}, 400, 'easeInQuart', function() {
			$(this).hide();
			$("#registrer").css("display", "block");
			$("#registrer").animate({right: '50%', marginRight: '-224px'}, 400, 'easeOutQuart', function() {
				$("#register_username").focus();
			});
			
		});
		this.navigate('register');
	},
	
	closeRegisterView:function() {
		var $view = $('#entry_view');
		$("#header-login").animate({height: $view.outerHeight()/2 + 'px', opacity: 1}, 1200, 'easeOutQuart', function() {
			$("#header-login").height("50%");
		});
		$("#position_wrapper").animate({marginTop: '-124px'}, 1200, 'easeOutQuart');
		
		$("#registrer").animate({right: '-50%', marginRight: '-203px'}, 400, 'easeInQuart', function() {
			$("#login_fields").show().animate({left: '50%'}, 400, 'easeOutQuart');
			$("#registrer").css("display", "none");
			$("#login_username").focus();
		});
		this.navigate('login');
		
		
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
	openResetPass:function(email) {
		var thisClass = this;
		require(['views/dialogs/resetPassword'],function(){
			thisClass.resetPassView = new App.views.dialogs.ResetPassword({router:thisClass,email:email});
			thisClass.resetPassView.openDialog();
		});
	},
	startDashboard: function(stuff){
		var obj = {};
		if(stuff) obj.stuff = stuff;
		this.isLoggedIn = true;
		App.routers.dashboard = new App.routers.Dashboard();
		App.routers.dashboard.start(obj);
		$('#footer.entry_footer').remove();
		$(function(){
			App.routers.dashboard.navigate('hjem',{trigger:true});
		});
	}
});
return App.routers.Entry;
});