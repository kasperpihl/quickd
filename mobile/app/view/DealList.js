var myTemplate = new Ext.XTemplate(
	'<article id="deal_{id}" style="z-index: 5;" class="category {category} {discount:this.iad} clearfix">',
		'<img src="' + IMG_URL +'thumbnail/{image}" class="deal_image left" width="72" height="72" />',
		//'<img src="http://lorempixum.com/150/150/food/" class="deal_image left" width="72" height="72" />',
		'<section class="deal-content">',
			'<h1>{title}</h1>',
			'<h2>{name}</h2>',
			'<footer class="footer">',
				'<span class="price">{deal_price},-</span> <time>{end:this.humanReadableTime}</time>',
				'<span class="awesome-badge"><span class="value">{discount}%</span></span>',
			'</footer>',
		'</section>',
	'</article>',
	{
		priceIt: priceIt,
		iad: isAwesomeDeal,
		humanReadableDistance: humanReadableDistance,
		humanReadableTime: humanReadableTime
	}
);
Ext.define('QuickD.view.DealList', {
    extend: 'Ext.List',
    xtype: 'deallist',
    requires:[
        'Ext.plugin.PullRefresh',
        'Ext.Toolbar',
        'Ext.Button'
    ],
    config: {
        zIndex:1,
        id: 'quickd-deals',
		plugins:[
			{ xclass: 'Ext.plugin.PullRefresh', id: 'fedt-mand-spa', pullRefreshText: 'Træk for satan!' }
		],
		items:[{
            ui:'sencha',
            id: 'quickd-list-topbar',
            hidden: false,
            xtype : 'toolbar',
            docked: 'top',
            items:[
            /*{
                xtype:'spacer'
            },
            {
                xtype:'button',
                id: 'sortButton',
                hidden: false,
                text:'Sorter'
            }*/]
        }],
        store: 'Deals',
        itemTpl: myTemplate
    }
});

