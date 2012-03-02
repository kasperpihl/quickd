Ext.define('QuickD.model.Deal', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
        	{name: 'id', type:'string'},
        	'title',
        	'description',
        	'name',
        	'category',
        	'distance',
        	'discount',
        	'orig_price',
        	'deal_price',
        	'lat',
        	'long',
        	'image',
        	'end'
        ]
    }
});