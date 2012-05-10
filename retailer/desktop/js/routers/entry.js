define([
'order!views/dialogs/dialog',
'order!views/entry',
'common/models/models',
'routers/dashboard'
],function(){
App.routers.Entry = Backbone.Router.extend({
	routes: {
		'login':		'setViewLogin',
		'register':	'setViewRegister',
		'*index':	'setViewLogin'
	},
	initialize: function(){	
		this.route = false;
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
		if(this.lockAction) return false;
		var thisClass= this,
			username = $('#login_username').val(),
			password = $('#login_password').val();
		if (!username || !password) {
			thisClass.entryView.shakeDialog();
			return false;
		}
		this.lockAction = true;
		var obj = {stuff:true,email:username,password:password};
		if($('#stay_signed_in_check:checked').length > 0) obj.remember =true;
		log('url',API_URL+'login');
		$.post(API_URL+'login',obj,function(response){
			log('log',response);
			if(response.success == 'true'){
				thisClass.animateDashboard();
				thisClass.lockAction = false;
				setTimeout(function(){
					thisClass.model.set(response.dealer);
					thisClass.startDashboard(response.stuff);		
				},200);
			}
			else{
				thisClass.entryView.shakeDialog();
				setTimeout(function(){
					thisClass.lockAction = false;
				},400);
			}
		},'json');
	},
	doRegister: function(){
		if(this.lockAction) return false;
		this.lockAction = true;
		var thisClass = this;
		//log($('#register_password').val(),'hej');
		$.post(API_URL+'register',{email:$('#register_username').val(),password:$('#register_password').val(),betacode:$('#register_betacode').val()},function(response){
			
			//log('reg',response);
			if(response.success == 'true'){
				$("#footer-login").fadeOut();
				$("#header-login").fadeOut();

				setTimeout(function(){
					thisClass.lockAction = false;
					thisClass.model.set(response.data);
					thisClass.startDashboard();
				}, 200);
				
			}
			else{
				setTimeout(function(){
					thisClass.lockAction = false;
				},400);
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
		if(this.lockAction) return false;
		this.lockAction = true;
		var thisClass = this;
		$.post(API_URL+'reset',{model:{email:email,type:'dealer'}},function(data){
			//log(data);
			if(data.success == 'true'){
				if(thisClass.resetPassView) thisClass.resetPassView.success();
				thisClass.lockAction = false;
			}
			else{
				if(thisClass.resetPassView) thisClass.resetPassView.error();
				setTimeout(function(){
					thisClass.lockAction = false;
				},400);
			}
		},'json');
	},
	
	openRegisterView:function(){
		var $view = $('#entry_view');
		$("#header-login").animate({height: $view.outerHeight() + 'px', opacity: 1}, 1200, 'easeOutQuart', function() {
			$("#header-login").height("100%");
		});
		$("#position_wrapper").animate({marginTop: '-210px'}, 1200, 'easeOutQuart');
		$("#login-wrapper").animate({left: '-100%'}, 400, 'easeInQuart', function() {
			$(this).hide();
			$("#register-wrapper").css({left: '100%', display:'block'}).animate({left: '0%'}, 400, 'easeOutQuart', function() {
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
		
		$("#register-wrapper").animate({left: '100%'}, 400, 'easeInQuart', function() {
			$(this).hide();
			$("#login-wrapper").css({left:'-100%', display:'block'}).animate({left: '0%'}, 400, 'easeOutQuart');
			$("#login_username").focus();
		});
		this.navigate('login');
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