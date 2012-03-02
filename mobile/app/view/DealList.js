function priceIt(price){
	return price + 'Dkr';
}

/**
 * Convert metre value to human readable format
 * 
 * @param  {string/int} distance the distrance in metres
 * 
 * @return {string}
 */
function humanReadableDistance(distance) {
	log(distance);
	var	dist	= parseInt(distance, 10),
		roundTo	= getRoundToVal(dist);

	return roundToNearest(dist, roundTo) + (roundTo >= 1000) ? 'm' : 'km';
}

function getRoundToVal(val, ranges) {
	var dist = parseInt(val, 10);

	if (dist < 100) return 1; // Less than 100 metres: Don't round.
	else if (dist >= 100 && dist < 500) return 25; // Between 100 and 500 metres: Round to neares 25 metres.
	else if (dist >= 500 && dist < 1000) return 50; // Between 0.5 and 1 km: Round to nearest 50 metres.
	else if (dist >= 1000 && dist < 3000) return 100; // Between 1 and 3 km: Round to nearest 100 metres.
	else if (dist > 3000) return 1000; // More than 3 km: Round to neares kilometre.

	log(dist);

	return false;
}

function roundToNearest(val, roundTo) {
	return Math.round(val / roundTo) * roundTo; // For instance: roundToNearest(65, 100) would return 100. 
}

Ext.define('QuickD.view.DealList', {
    extend: 'Ext.List',
    xtype: 'deallist',
    config: {
        title: '',
        cls: 'quickd-deals',  
		plugins:[
			{ xclass: 'Ext.plugin.PullRefresh' }
		],
        store: 'Deals',
        itemTpl: [
			'<article id="deal_{id}" class="category {category}">',
				'<img src="http://lorempixum.com/150/150/nature/" class="deal_image left" width="75" height="75" />',
				'<section class="deal-content">',
					'<h1>{title}</h1>',
					'<h2>{name} <span class="distance"> &ndash; {humanReadableDistance(distance)}</span></h2>',
					'<footer class="footer">',
						'<span class="prices">Spar: {discount}%</span> · Pris: {priceIt(deal_price)} · <time>2t42m</time>',
					'</footer>',
				'</section>',
				'</article>'
	    ].join('')
    }
});

