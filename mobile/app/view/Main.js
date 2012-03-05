Ext.define('QuickD.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
    requires: [
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'Ext.field.Select'
    ],
    config:{
        fullscreen: 'true',
        items: [{xtype:'deallist'}]
    },
    applyLayout: function(config) {
      config = config || {};

        if (Ext.os.is.Android) {
            config.animation = false;
        }
        return config;
    }
});
