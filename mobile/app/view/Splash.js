Ext.define('QuickD.view.Splash', {
    extend: 'Ext.Panel',
    requires:[
    ],
    xtype: 'splash',
    config: {
        layout:'fit',
        id:'quickd-splash-screen',
        items: [{
            xtype:'panel',
            html:''
        }]
    }
});