define(function(){
	start = function(){
		if(shopowner){
			require(['routers/dashboard'],function(){
				$(function(){
					App.routers.dashboard = new App.routers.Dashboard().start(shopowner);
				 	Backbone.history.start(historyObj); 
				});
			});
		}else{
			require(['routers/entry'],function(tst){				
				$(function(){ 
					App.routers.entry = new App.routers.Entry();	
					Backbone.history.start(historyObj); 			
				});
			});
			
		}
		
		
	};
	return {start:start};
});
