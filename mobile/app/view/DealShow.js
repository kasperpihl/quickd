var showDealTemplate = new Ext.XTemplate(
    '<div id="quickd-deal-background">{title}',
    '</div>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
var showDealSliderObj = new Ext.XTemplate(
    '<div class="dealBackground">',
        '<div class="leftPanel">',
            '<img src="http://lorempixum.com/170/170/food/" />',
        '</div>',
        '<div class="rightPanel">',
            '<div class="infoBox">',
                '<div class="title">PRIS</div>',
                '<div class="information"> <span class="linethrough">{orig_price},-</span> {deal_price},-</div>',
            '</div>',
            '<div class="infoBox">',
                '<div class="title">DU SPARER</div>',
                '<div class="information">{discount}%</div>',
            '</div>',
            '<div class="infoBox">',
                '<div class="title">AFSTAND</div>',
                '<div class="information">{distance:this.humanReadableDistance}</div>',
            '</div>',
        '</div>',
    '</div>',
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
        },
        items: [{
            xtype: 'carousel',
            id: 'quickd-deal-slider',

            indicator: false,
            defaults:{
                cls: 'quickd-deal-background',
                tpl: showDealSliderObj,
                record:null
            },
            items:[

            ]
        },
        {
            xtype: 'panel',
            id: 'quickd-deal-content',
            tpl: showDealTemplate,
            flex:2
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
        //log('logging data',record.getData().end);
        //this.down('#quickd-deal-slider').setItems(list.getItems().items);
        this.down('#quickd-deal-content').setData(record.getData());
    }
    /*updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }*/
});
