Ext.Loader.setConfig({ enabled: true });
Ext.application({
    name: 'QuickD',
	models: ['Deal'],
    stores: ['Deals'],
    views: ['Main','DealList'],
    controllers: ['Main'],
	icon: 'resources/images/icon.png',
    phoneStartupScreen: 'resources/images/phone_startup.png',
    glossOnIcon: false,
    launch: function() {
        Ext.Viewport.add({
            xclass: 'QuickD.view.Main',
        });
        this.sortMenu = Ext.Viewport.add({
		    xtype: 'panel',
		    left: 0,
		    top: 0,
		    modal: true,
		    hidden: true,
		    height: 300,
		    width: 300,
		    contentEl: 'content',
		    styleHtmlContent: true,
		    scrollable: true,
		    items: [
		        {
		            docked: 'top',
		            xtype: 'toolbar',
		            title: 'Overlay Title'
		        }
		    ]
		});
    }
});