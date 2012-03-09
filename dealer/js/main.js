//Backbone.emulateJSON = true;
//Backbone.emulateHTTP = true;
App = {
	views: {
		dashboard: {},
		activities: {},
		windows: {},
		startdeals: {},
		routers: {},
		dialogs:{},
		components: {}
	},
	models: {},
	collections: {},
	routers: {}
	
};
require.config({
	paths: {
		/* Plugins to require.js*/
		text: LIBS_URL+'require/text',
		order: LIBS_URL+'require/order',
		
		/* Main libraries */
		jquery: LIBS_URL+'jquery',
		underscore: LIBS_URL+'underscore',
		backbone: LIBS_URL+'backbone',
		raphael: LIBS_URL+'raphael',
		
		
		templates: '../templates',
		libs: LIBS_URL
		
	}
});

require([
	'app'
	
],function(App){
	App.start();
});