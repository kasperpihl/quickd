Ext.define('QuickD.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',
    requires: [
        'QuickD.view.DealList',
        'QuickD.view.DealShow',
        'QuickD.view.MapShow',
        'Ext.field.Select'
    ],
    config: {
        navigationBar: {
            ui: 'sencha',
            title: '',
            autoDestroy:true,          
            defaultBackButtonText: 'Tilbage',
            items: [
            	{
            		xtype:'selectfield',
            		id:'filterButton',
            		width: '150px',
		            options: [
		                { text: 'Alle deals',  value: 'all' },
		                { text: 'Mad & Drikke', value: 'fooddrink' },
		                { text: 'Shopping', value: 'shopping' },
		                { text: 'Oplevelser', value: 'experience' },
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
                }
               
            ]
        },
        items: [
        	
        	{xtype:'deallist'} 
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