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
    setCity:function(city){
        this.city = city;
        if(this.showNoDeal) $('#cityName').html(city);
    },
    showNoDeals:function(mail){
        this.showNoDeal = true;
        var html = 
        '<div class="x-list-item">' +
            '<article id="deal_no_deals" style="z-index: 5;" class="clearfix">' +
                '<section class="no-deal-content">' +
                    '<h1>&Oslash;v!..</h1>' +
                    '<p>&hellip; Der er desværre ingen tilbud i nærheden af din placering lige nu, hvilket selvfølgelig er irriterende, når du gerne vil igang med at bruge vores service. </p>' +
                    '<p>Vi har møder med nye forhandlere stort set hver dag og lover at sende en mail til <strong>'+userbeta+'</strong> så snart der er en håndfuld tilbud i dit nærområde.</p>' +
                    '<p>Vi har samtidig registreret <strong id="cityName">'+this.city+'</strong> som din bydel. På den måde kan vi holde øje med hvilke områder, der har den største efterspørgsel.</p>' +
                    '<p>I mellemtiden kan du følge med på vores Facebook-side, hvor vi løbende offentliggør nyheder mv.</p>' +
                    '<p>Vi glæder os til at give dig nogle gode oplevelser og fede tilbud via QuickD.</p>' +
                    '<p><a class="facebook" href="http://www.facebook.com/pages/QuickD/203907689684007" target="_blank" rel="bookmark">Følg QuickD på Facebook</a></p>' +
                '</section>' +
            '</article>' +
        '</div>';
        this.setHtml(html);
        if(!this.handlerIsAdded){
            this.handlerIsAdded = true;
            this.addHandler();
        }
    },
    voteForPlace:function(){
        if(!this.hasVoted){
            var self = this;
            Ext.Ajax.request({
                url: ROOT_URL+'ajax/sendmail.php',
                success:function(data){
                    alert(data);
                },
                error:function(data){
                    alert('error beta',data);
                }
            });
            var html = 
                '<div class="thanks">'+
                    '<div class="facebooklike"></div>'+
                '</div>';
            alert('tak for din stemme');
        }
    },
    addHandler:function(){
        var self = this;
        $('.votefordeal').click(function(){
            self.voteForPlace();
        });
    }
});

