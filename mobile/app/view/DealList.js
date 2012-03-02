function priceIt(price){
	//price = parseInt(price);
	//price = parseFloat(price);
	return price + 'Dkr';
}
Ext.define('QuickD.view.DealList', {
    extend: 'Ext.List',
    xtype: 'deallist',
    config: {
    	ui: 'round',
        title: '',
        cls: 'quickd-deals',  
		plugins:[
			{ xclass: 'Ext.plugin.PullRefresh' }
		],
        store: 'Deals',
        itemTpl: [
			'<article id="deal_{id}" class="category {category}">',
				//'<img src="' + IMG_URL + 'thumbnail/{image}" class="deal_image left" width="75" height="75" />',
				'<img src="http://lorempixum.com/150/150/nature/" class="deal_image left" width="75" height="75" />',
				'<section class="deal-content">',
					'<h1>{title}</h1>',
					'<h2>{name} <span class="distance"> &ndash; ' + parseInt(Math.random() * 100) + 'm</span></h2>',
					'<footer class="footer">',
						'<span class="prices">Spar: {discount}%</span> · Pris: ' + priceIt('{deal_price}') + ' · <time>2t42m</time>',
					'</footer>',
				'</section>',
				'</article>'
	    ].join('')
    }
});