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
	items: [{
        id:'content',
        config: {
            
            tpl: showDealTemplate,
            record: null
        }
    },
    {
        xtype: 'map',
        zoomControl: false,
        panControl: false,
        rotateControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoom: 13,
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        navigationControl: true,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.DEFAULT
        }
    }],
    
    loadDeal:function(record){
        this.setRecord(record);
    },
    updateRecord: function(newRecord) {
        if (newRecord) {
            this.getAt().setData(newRecord.data);
        }
    }
});
