Ext.define('QuickD.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
    requires: [
        'Ext.Panel',
        'Ext.XTemplate',
        'QuickD.view.Splash',
        'QuickD.view.NoDeals',
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'QuickD.view.Beta',
        /*'QuickD.view.DealSort',*/
        'QuickD.view.MapShow'
    ],
    config:{
        fullscreen: true,
        layout: 'card',
        items: [
            {xtype:'splash'},
            {xtype:'betaview'},
            {xtype:'nodeals'},
            {xtype:'deallist'},
            /*{xtype:'dealsort'},*/
            {xtype:'dealshow'},
            {xtype:'mapshow'}
        ]
    },
    applyLayout: function(config) {
      config = config || {};
        if (Ext.os.is.Android) {
            config.animation = false;
        }
        return config;
    }
});
