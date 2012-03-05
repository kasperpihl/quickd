Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Panel',
    xtype: 'dealshow',
	
    config: {
        tpl: '<div>{title}</div>',
        record: null
    },
    loadDeal:function(record){
        this.setRecord(record);
    },
    updateRecord: function(newRecord) {
        if (newRecord) {
            this.setData(newRecord.data);
        }
    }
});
