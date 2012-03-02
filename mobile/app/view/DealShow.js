Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Container',
    xtype: 'dealshow',
	
    config: {
        title: 'QuickD',
        items: [
            {
                id: 'content',
                 tpl: [
                    '<div class="x-contacts top">',
                        '<div id="deal_{id}">',
                            '<div class="headshot" style="background-image:url(\''+IMG_URL+'thumbnail/{image}\');"></div>',
                                '<h1>{title}</h1>',
                                '<div class="prices">',
                                priceIt('{orig_price}'),
                            '</div>',
                            '<div class="footer"><span class="shop">{name}</span></div>',
                        '</div>',
                    '</div>'
                ].join('')
            }
        ],

        record: null
    },

    updateRecord: function(newRecord) {
      if (newRecord) {
            this.down('#content').setData(newRecord.data);
         }
         
    }
});
