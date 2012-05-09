Ext.define('QuickD.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
    requires: [
        'Ext.Panel',
        'Ext.XTemplate',
        'QuickD.view.Splash',
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'QuickD.view.BetaScreen',
        'QuickD.view.NotApp',
        /*'QuickD.view.DealSort',*/
        'QuickD.view.MapShow'
    ],
    config:{
        fullscreen: true,
        layout: 'card',
        items: [
            {xtype:'splash'},
            {xtype:'betascreen'},
            {xtype:'deallist'},
            {xtype:'notapp'},
            /*{xtype:'dealsort'},*/
            {xtype:'dealshow'},
            {xtype:'mapshow'}
        ]
    },
    maskMe:function(message,noIndicator){
        var maskObj = { xtype: 'loadmask'};
        maskObj.message = (message) ? message : 'Loader';
        maskObj.indicator = (noIndicator) ? false : true;
        this.setMasked(maskObj);
    },
    unmaskMe:function(){
        this.setMasked(false);
    },
    applyLayout: function(config) {
      config = config || {};
        if (Ext.os.is.Android) {
            config.animation = false;
        }
        return config;
    }
});
