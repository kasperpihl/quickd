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
    },
    showNoDeals:function(mail){
        var dynamicText;
        if(mail){
            dynamicText = '<div>Vi sender en mail til <span class="sendmail">'+mail+'</span> når vi har en håndfuld tilbud i Aarhus N. Vi skynder os alt hvad vi kan</div>';
        }
        else {
            dynamicText = 
            '<div class="">Klik på knappen, og så sender vi en mail når vi har en håndfuld tilbud i Aarhus N</div>'+
            '<button class="votefordeal">Stem på område</button>';
        }
        var html = 
            '<div class="nodeals">' +
            '<h1 class="title">Der er desværre ingen tilbud omkring dig lige nu</h1>' +
            '<div class="badsmiley"><embed src="resources/images/sad.svg" type="image/svg+xml"/></div>' +
            dynamicText +
            '</div>';
        this.setHtml(html);
        if(!this.handlerIsAdded){
            this.handlerIsAdded = true;
            this.addHandler();
        }
    },
    addHandler:function(){
        $('.votefordeal').click(function(){
            if(!this.hasVoted){
                var html = 
                    '<div class="thanks">'+
                        '<div class="facebooklike"></div>'+
                    '</div>';
                alert('tak for din stemme');
            }
        });
    }
});

