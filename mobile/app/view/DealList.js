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
	var	dist	= parseInt(distance, 10),
		roundTo	= getRoundToVal(dist),
		unit	= 'm';

	dist = roundToNearest(dist, roundTo);
	if (dist >= 1000) {
		dist = dist / 1000;
		unit = 'km';
	}

	return dist + unit;
}

function getRoundToVal(val, ranges) {
	var dist = parseInt(val, 10);

	if (dist < 100) return 1; // Less than 100 metres: Don't round.
	else if (dist >= 100 && dist < 500) return 25; // Between 100 and 500 metres: Round to neares 25 metres.
	else if (dist >= 500 && dist < 1000) return 50; // Between 0.5 and 1 km: Round to nearest 50 metres.
	else if (dist >= 1000 && dist < 5000) return 100; // Between 1 and 3 km: Round to nearest 100 metres.
	else if (dist > 5000) return 1000; // More than 3 km: Round to neares kilometre.

	log(dist);

	return false;
}
function roundToNearest(val, roundTo) {
	return Math.round(val / roundTo) * roundTo; // For instance: roundToNearest(65, 100) would return 100.
}
var myTemplate = new Ext.XTemplate(
	'<article id="deal_{id}" class="category {category}">',
		'<img src="http://lorempixum.com/150/150/nature/" class="deal_image left" width="75" height="75" />',
		'<section class="deal-content">',
			'<h1>{title}</h1>',
			'<h2>{name} <span class="distance"> &ndash; ca. {distance:this.humanReadableDistance}</span></h2>',
			'<footer class="footer">',
				'<span class="prices">Spar: {discount}%</span> · Pris: {deal_price:this.priceIt} · <time>2t42m</time>',
			'</footer>',
		'</section>',
	'</article>',
	{
		priceIt: priceIt,
		humanReadableDistance: humanReadableDistance
	}
);


Ext.define('QuickD.view.DealList', {
    extend: 'Ext.List',
    xtype: 'deallist',
    config: {
        title: 'lalala',
        cls: 'quickd-deals',
		plugins:[
			{ xclass: 'Ext.plugin.PullRefresh' }
		],
        store: 'Deals',
        itemTpl: myTemplate
    }
});

