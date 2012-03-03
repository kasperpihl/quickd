Ext.define('QuickD.view.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',
    requires: [
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'QuickD.view.MapShow',
        'Ext.field.Select'
    ],
    config:{
        fullscreen: 'true',
        items: [
        /*{
            ui:'sencha',
            xtype : 'toolbar',
            docked: 'top',
            title: 'QuickD',
            items:[
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
                align:'right'
            },
            {
                xtype:'button',
                id:'mapButton',
                align:'right',
                text: 'Kort',
                hidden:true  
            },
            {
                xtype:'button',
                id:'actionButton',
                iconCls: 'action', 
                iconMask: true,
                align:'right',
                hidden:true  
            }]
        },*/
        {xtype:'deallist'}]
    },
applyLayout: function(config) {
  config = config || {};

  if (Ext.os.is.Android) {
    config.animation = false;
}

return config;
}
});
