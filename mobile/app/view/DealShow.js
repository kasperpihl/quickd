Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Panel',
    xtype: 'dealshow',
	
    config: {
        tpl: '<div>2{title}</div>',
        data: {title:'test'},
        record: null
    },

    updateRecord: function(newRecord) {
        log(newRecord);
      if (newRecord) {
            this.setData(newRecord.data);
         }
         
    }
});
