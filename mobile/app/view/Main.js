Ext.define('QuickD.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
    requires: [
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'QuickD.view.DealSort',
        'QuickD.view.MapShow'
    ],
    config:{
        fullscreen: 'true',
        layout: 'card',
        items: [
        {
            xtype:'panel',
            html: 'splash'
        },
        {xtype:'deallist'},
        {xtype:'dealsort'},
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
