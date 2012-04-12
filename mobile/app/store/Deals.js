Ext.define('QuickD.store.Deals', {
    extend: 'Ext.data.Store',

    config: {
        model: 'QuickD.model.Deal',
        sorters: 'id',
        id: 'dealStore',
        autoSync:false,
        autoLoad:false,
        filters:[{
            filterFn: function(item) {
                var time = parseInt(new Date().getTime()/1000);
                //log('filtering',item.get('end'),time);
                return (item.get('end') > time);
            }
        }],
        proxy: {
            type: 'ajax',
            url: 'ajax/getDeals.php',
            extraParams: {
               lat: localStorage.getItem('lat'),
               long: localStorage.getItem('long')
           }
       }
   }
});
Ext.define('App.model.Test', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type:'string'},
            'title',
            'end'
        ]
    }
});
Ext.define('App.store.Test', {
    extend: 'Ext.data.Store',

    config: {
        model: 'App.model.Test',
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: 'ajax/getDeals.php',
            extraParams: {
               lat: 52.10,
               long: 10.0
           }
       }
   }
});
