Ext.define('QuickD.view.Splash', {
    extend: 'Ext.Panel',
    requires:[
    ],
    xtype: 'splash',
    config: {
        layout:'fit',
        items: [{
            xtype:'panel',
            html:'SPLASH'
        }]
    }
});