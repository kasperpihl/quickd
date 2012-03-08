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
            config:{
                height:100
            },
            indicator: false,

            defaults:{
                cls: 'quickd-deal-background',
                tpl: showDealBackground,
                record:null
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
    setSlider:function(records){
        var array = [];
        var slider = this.down('#quickd-deal-slider');
        slider.removeAll(true,true);
        for(var key in records){
            slider.add({}).setData(records[key].data);
        }
    },
    loadDeal:function(record){
        log('logging data',record.getData());
        //this.down('#quickd-deal-slider').setItems(list.getItems().items);
        this.down('#quickd-deal-content').setData(record.getData());
    }
    /*updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }*/
});
