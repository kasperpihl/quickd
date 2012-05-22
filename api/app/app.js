window.App = {
	view:{},
	controller:{},
	model:{},
	collection:{}
};
Backbone.Router = Backbone.Router.extend({
	init:function(){
	}
});
Backbone.Model = Backbone.Model.extend({
	init:function(){

	}
});
Backbone.Collection = Backbone.Collection.extend({
	init:function(){

	}
});
Backbone.View = Backbone.View.extend({
	init:function(){
		this.router = this.options.router;
	},
	getTemplate:function(name){
		var file_url = 'templates/'+name + '.html';
		var template;
		$.ajax(file_url,{
			async:false,
			dataType: 'html',
			success:function(data){
				template = data;
			}
		});
		return template;
	},
	template:function(element,template,data){
		var obj = data ? {data:data} : '';
		$(element).html(_.template(template,obj));
	}
});
App.controller.Router = Backbone.Router.extend({
	initialize:function(){
		this.init();
		this.instantiate();
	},
	instantiate:function(){
		App.view.testApi = new App.view.TestApi({router:this});
		App.view.api = new App.view.Api({router:this});
	},
	routes:{
		'test':'testApi',
		'check':'checkApi'
	},
	callApi:function(method,url,parameters){
		
		log(url);
		$.ajax(url,{
			dataType: 'html',
			type:method,
			success:App.view.testApi.gotResponse,
			data:parameters
		});
		localStorage.setItem('api_method',method);
		localStorage.setItem('api_request',url);
		localStorage.setItem('api_parameters',parameters);
	},
	testApi:function(){

	},
	checkApi:function(url){

	}
});
App.view.TestApi = Backbone.View.extend({
	el: '#apiTestSuite',
	initialize:function(){
		this.init();
		this.render();
	},
	events:{
		'click #apiTestBtn': 'clicker'
	},
	gotResponse:function(data){

		$('#response').append('2. Response: <br>' + data);
	},
	clicker:function(event){
		var method = $('#method').val();
		var request = $('#apiRequestTxt').val();
		if(request.charAt(0) == '/') request = request.substring(1);
		var url = API_URL + request;
		log(url);
		var parameters = $('#apiDataString').val().split(/\n/);
		var obj = {};
		for (var i = 0; i < parameters.length ; i++){
			var index;
			if((index = parameters[i].indexOf('=')) != -1){
				var array = parameters[i].split("=",2);
				if(array[1].trim().charAt(0) == '{'){
					array[1] = array[1].replace(/\'/g,"\"");
					log(array[1]);
					try{ obj[array[0]] = $.parseJSON(array[1]); }
					catch(err){alert('fejl i json, kunne ikke parse');}
				}
				else {
					obj[array[0]] = array[1];
				}
			}
			else {
				continue;
			}
			//if(parameters[i].indexOf(':') != -1) 
		}

		$('#response').html('1. Contacting api: '+url+ '<br>Success<br><br>');
		this.router.callApi(method,url,obj);
	},
	render:function(){

	}
});
App.view.Api = Backbone.View.extend({
	initialize:function(){
		this.init();
		this.render();
	},
	render:function(){
		var template = this.getTemplate('api');
		//$('header').html(this.template('header',template,api[0]));
	}
});
$(function(){
	App.controller.router = new App.controller.Router();
});
var api = [{
	'url': '/login',
	'actions': {
		'POST':{
			'title': 'Login to the system',
			'description': '',
			'parameters': {
				'email' : {'description': 'The email to log in'},
				'password': {'description' : 'The password to log in with'}
			},
			'return': [
				{'name':'success'}
			]
		}
	}
},{
	'url': '/offer/:id',
	'actions': {
		'GET':{
			'title': 'Retrieves the offer :id',
			'description': '',
			'parameters': [
				
			],
			'return': [
				{'name':'success'}
			]
		},
		'POST': {
			'title': 'Updates the offer :id',
			'description': '',
			'parameters': {
				'model': { 'description': 'hej' }
			}
		}
	}
}];