//Ext.Loader.setConfig({ enabled: true });
Ext.application({
	name: 'QuickD',
	models: ['Deal'],
	stores: ['Deals'],
	statusBarStyle: 'black',
	views: ['Main'],
	controllers: ['Main','AnimationController'],
	icon: 'resources/images/icon.png',
	phoneStartupScreen: 'resources/images/phone_startup.png',
	glossOnIcon: false,
	launch: function() {
		Ext.Viewport.add({
			xclass: 'QuickD.view.Main'
		});
	}
});