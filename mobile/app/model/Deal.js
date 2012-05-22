Ext.define('QuickD.model.Deal', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
                {name: 'id', type:'string'},
                'title',
                'description',
                'name',
                'deal_type',
                'times',
                'category',
                'distance',
                'discount',
                'start',
                'info',
                'open_hours',
                'orig_price',
                'address',
                'deal_price',
                'lat',
                'long',
                'image',
                'end'
        ]
    }
});