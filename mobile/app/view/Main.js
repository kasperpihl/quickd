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
        layout: 'card',
        items: [
        {
            ui:'sencha',
            id: 'topbar',
            hidden: true,
            xtype : 'toolbar',
            docked: 'top',
            items:[
            {
                xtype:'button',
                ui:'back',
                text:'Tilbage'
            },
            {
                xtype:'spacer'
            },
            {
                xtype:'selectfield',
                id:'filterButton',
                width: '150px',
                options: [
                    { text: 'Alle deals',  value: 'all' },
                    { text: 'Mad & Drikke', value: 'fooddrink' },
                    { text: 'Shopping', value: 'shopping' },
                    { text: 'Oplevelser', value: 'experience' }
                ],
                align:'left'
            }]
        },
        {
            xtype:'panel',
            html: 'splash'
        },
        {xtype:'deallist'},
        {xtype:'dealshow'}
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
