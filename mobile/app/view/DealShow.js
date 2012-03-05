var showDealTemplate = new Ext.XTemplate(
    '<div>{title}</div>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Panel',
    requires:[
        'Ext.Map'
    ],
    xtype: 'dealshow',
    config: {
        
        tpl: showDealTemplate,
        record: null
    },
    
    loadDeal:function(record){
        this.setRecord(record);
    },
    updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }
});
