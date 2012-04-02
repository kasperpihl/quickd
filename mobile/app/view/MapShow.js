Ext.define('QuickD.view.MapShow', {
    extend: 'Ext.Panel',
    requires:[
        'Ext.Map',
        'Ext.Toolbar',
        'Ext.Button'
    ],
    xtype: 'mapshow',
    config: {
	layout: 'fit',
        items: [
        {  
            ui:'sencha',
            id: 'quickd-map-topbar',
            hidden: false,
            xtype : 'toolbar',
            title: 'Kort',
            docked: 'top',
            items:[
            {
                xtype:'button',
                id: 'backFromMapButton',
                text:'Tilbage'
            },
            {xtype:'spacer'},
            {
                xtype: 'button',
                ui: 'confirm',
                text: 'Find vej',
            }]
        },
        {
            xtype: 'map',
            disableDefaultUI: true
            /*zoomControl: false,
            panControl: false,
            rotateControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoom: 13,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.DEFAULT
            }*/

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
