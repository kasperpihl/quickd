var showDealTemplate = new Ext.XTemplate(
    '<div id="quickd-deal-background">{title}',
    '</div>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
var showDealBackground = new Ext.XTemplate(
    
    '<span class="orig_price">{orig_price}</span><span class="deal_price">{deal_price}</span>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Panel',
    xtype: 'dealshow',
    requires:[
        'Ext.Carousel'
    ],
    config: {
        layout:'vbox',
        defaults:{
            flex:1
        },
        items: [{
            xtype: 'carousel',
            id: 'quickd-deal-slider',
            height:200,
            indicator: false,
            defaults:{
                cls: 'quickd-deal-background',
                tpl: showDealBackground
            },
            items:[
        
            ]
        },
        {
            xtype: 'panel',
            id: 'quickd-deal-content',
            tpl: showDealTemplate
        }]
    },
    
    loadDeal:function(record,list){
        this.down('#quickd-deal-slider').setItems(list.getItems().items);
        this.down('#quickd-deal-content').setData(record.data);
    }
    /*updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }*/
});
