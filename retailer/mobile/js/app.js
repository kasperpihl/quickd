// Enable logging without breaking dumb browsers. Use log('whatever'), not console.log('whatever').
window.log=function(){
	log.history=log.history || [];
	log.history.push(arguments);
	if(this.console){
		arguments.callee=arguments.callee.caller;
		var a=[].slice.call(arguments);
		(typeof console.log==="object" ? log.apply.call(console.log,console,a) : console.log.apply(console,a))
	}
};
$(document).bind('pageinit', function() {
	 App.routers.controller = new App.routers.Controller(shopowner);
	 log('initializing router and start history');
	 Backbone.history.start(historyObj);
});