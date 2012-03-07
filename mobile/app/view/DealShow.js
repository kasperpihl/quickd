var showDealTemplate = new Ext.XTemplate(
    '<div id="quickd-deal-background">{title}',
    '</div>s',
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
        height:'100%',
        zIndex: 3,
        tpl: showDealTemplate,
        record: null
    },
    
    loadDeal:function(record){
        this.setData(record.data);
    },
    updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }
});
