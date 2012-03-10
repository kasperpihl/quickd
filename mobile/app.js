Ext.Loader.setConfig({ enabled: true });
Ext.application({
	name: 'QuickD',
	models: ['Deal'],
	stores: ['Deals'],
	views: ['Main'],
	controllers: ['Main','SortController', 'AnimationController'],
	icon: 'resources/images/icon.png',
	phoneStartupScreen: 'resources/images/phone_startup.png',
	glossOnIcon: false,
	launch: function() {
		Ext.Viewport.add({
			xclass: 'QuickD.view.Main'
		});

	}
});