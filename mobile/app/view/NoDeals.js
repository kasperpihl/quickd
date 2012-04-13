Ext.define('QuickD.view.NoDeals', {
    extend: 'Ext.Panel',
    requires:[
        'Ext.Toolbar',
        'Ext.Button'
    ],
    initialize: function() {
        this.callParent(arguments);
    },
    xtype: 'nodeals',
    config: {
        layout: 'vbox',
        items: [{
            ui:'sencha',
            xtype : 'toolbar',
            title: 'Ingen Deals',
            docked: 'top',
            items:[{
                xtype:'spacer'
            },{
                xtype:'button',
                id: 'refreshDeals',
                iconMask:true,
                iconCls: 'refresh'
            }]
        },
        {
            xtype:'panel',
            html:'SPLASH'
        }]
    }
});