// Enable logging without breaking dumb browsers. Use log('whatever'), not console.log('whatever').
  	window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){arguments.callee=arguments.callee.caller;var a=[].slice.call(arguments);(typeof console.log==="object"?log.apply.call(console.log,console,a):console.log.apply(console,a))}};
	(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
	{console.log();return window.console;}catch(err){return window.console={};}})());

$(document).bind("mobileinit", function(){
	// Set up jQuery Mobile: http://jquerymobile.com/demos/1.0/docs/api/globalconfig.html
	$.extend(  $.mobile , {
		pushStateEnabled: true,
		touchOverflowEnabled: false,
		loadingMessage: 'Henter data',
		pageLoadErrorMessage: 'Øv, noget gik galt. Prøv igen om lidt.'
		
	});
});