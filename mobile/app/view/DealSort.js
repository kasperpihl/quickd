Ext.define('QuickD.view.DealSort', {
    extend: 'Ext.Panel',
    xtype: 'dealsort',
    test:false,
    requires:[
        'Ext.field.Checkbox',
        'Ext.Toolbar',
        'Ext.Button'
    ],
    config: {
        items:[ {
            ui:'sencha',
            id: 'quickd-sort-topbar',
            hidden: false,
            xtype : 'toolbar',
            title: 'Sorter',
            docked: 'top',
            items:[
            {
                xtype:'button',
                id: 'backFromSortButton',
                text:'Tilbage'
            }]
        },
        {
            xtype: 'panel',
            items:[
                {
                    xtype:'checkboxfield',
                    name: 'fooddrink',
                    label: 'Mad & drikke',
                    checked:true
                },
                {
                    xtype:'checkboxfield',
                    name: 'shopping',
                    label: 'Shopping',
                    checked:true
                },
                {
                    xtype:'checkboxfield',
                    name: 'health',
                    label: 'Forkælelse',
                    checked:true
                },
                {
                    xtype:'checkboxfield',
                    name: 'experience',
                    label: 'Oplevelser',
                    checked: true
                }
            ]
        }]
    }
});