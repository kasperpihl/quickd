Ext.define('QuickD.view.MapShow', {
    extend: 'Ext.Panel',
    requires:[
    	'Ext.Map'
    ],
    xtype: 'mapshow',
    config: {
    	layout: 'fit',
        items: [
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
                
            },
            {
            	xtype: 'toolbar',
            	ui: 'sencha',
            	docked: 'bottom',
            	items: [
            		{
            			xtype: 'button',
            			ui: 'confirm',
            			text: 'Få rutevejledning hertil',   
            			centered:true       			
            		}
            	]
            }
        ],

        record: null
    },
    updateRecord: function(newRecord) {
        if (newRecord) {           
            var position = new google.maps.LatLng(newRecord.data.lat, newRecord.data.long);
            var map = this.down('map');
            map.setMapCenter(position);
            var marker = new google.maps.Marker({
                position: position,
                title : 'Deal',
                map: map.getMap()
            });
        }
    }
});
