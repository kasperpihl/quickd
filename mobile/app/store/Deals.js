Ext.define('QuickD.store.Deals', {
    extend: 'Ext.data.Store',

    config: {
        model: 'QuickD.model.Deal',
        sorters: 'id',
        id: 'dealStore',
        autoLoad:false,
        proxy: {
            type: 'ajax',
            url: 'ajax/getDeals.php',
            extraParams: {
            	lat: localStorage.getItem('lat'),
            	long: localStorage.getItem('long')
            }
        }
    }
});
