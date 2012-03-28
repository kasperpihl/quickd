var showDealTemplate = new Ext.XTemplate(
    '<section class="deal-wrap">',
    '<article id="deal-{id}-info" class="{category}">',
        '<header><h1>{title}</h1></header>',
        '<section class="desc">{description}</section>',
        '<section class="venue">',
            '<h2>{name}</h2>',
            '<img class="venue-thumb" src="http://lorempixum.com/640/320/nightlife/" width="100%" />',
            '<p><strong>Om stedet:</strong> Som gæst i Templet, vil du føle dig fortryllet af den ophøjede stemning, der tager dig ud af den rutineprægede hverdag og ind i en verden af magi og mystik.',
            ' På disse sider kan du læse mere om hvad der foregår Tantra Templet, se billeder der giver en idé om atmosfæren og læse hvad andre gæster har oplevet her.</p>',
        '</section>',
        '<footer class="venue-meta">',
            '<section class="hours">',
                '<ul>',
                    '<li><span class="day">Man-Torsdag</span><span class="leader"></span><time>09.00 &ndash; 17.30</time></li>',
                    '<li><span class="day">Fredag</span><span class="leader"></span><time>09.00 &ndash; 20.00</time></li>',
                    '<li><span class="day">Lørdag</span><span class="leader"></span><time>11.00 &ndash; 17.30</time></li>',
                    '<li><span class="day">Søndag</span><span class="leader"></span><time>Lukket</time></li>',
                '</ul>',
            '</section>',
            '<section class="location">',
                '<p>Frederiksgade 42, 8000 Aarhus C.</p>',
            '</section>',
            '<section class="feedback">',
                '<p>9 anmeldelser</p>',
            '</section>',
        '</footer>',
    '</article>',
    '</section>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
var showDealSliderObj = new Ext.XTemplate(
    '<div class="dealBackground">',
        '<div class="leftPanel left">',
            '<img src="' + IMG_URL +'thumbnail/{image}" width="185" height="185" />',
            //'<img src="http://lorempixum.com/185/185/food/" width="185" height="185" />',
        '</div>',
        '<div class="rightPanel left">',
            '<div class="infoBox">',
                '<div class="title">Pris</div>',
                '<div class="information"> <span class="linethrough">{orig_price},-</span> {deal_price},-</div>',
            '</div>',
            '<div class="infoBox">',
                '<div class="title">Du sparer</div>',
                '<div class="information">{discount}%</div>',
            '</div>',
            '<div class="infoBox">',
                '<div class="title">Afstand</div>',
                '<div class="information">{distance:this.humanReadableDistance}</div>',
            '</div>',
        '</div>',
    '</div>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance
    }
);
Ext.define('QuickD.view.DealShow', {
    extend: 'Ext.Panel',
    xtype: 'dealshow',
    
    requires:[
        'Ext.Carousel'
    ],
    config: {
        fullscreen:true,
        layout: 'fit',
        id: 'quickd-single',
        items: [
        {
            ui:'sencha',
            id: 'quickd-show-topbar',
            hidden: false,
            xtype : 'toolbar',
            docked: 'top',
            items:[
            {
                xtype:'button',
                id: 'backFromShowButton',
                text:'Deals'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype:'button',
                id:'mapButton',
                text:'Kort'
            }]
        },
        {
            xtype: 'carousel',
            id: 'quickd-deal-slider',
            config:{
                height:'170px'
            },
            indicator: false,
            defaults:{
                
                cls: 'quickd-deal-background',
                tpl: showDealSliderObj,
                record:null
            },
            items:[

            ]
        },
        {
            xtype: 'panel',
            id: 'quickd-deal-content',
            tpl: showDealTemplate,
            config: {
                draggable:{
                    direction: 'horizontal',
                    listeners:{
                        dragstart: function(l1,l2,l3){
                            log(l1,l2,l3);
                        }
                    }
                }
            }
        }]
    },
    setSlider:function(records){
        var array   = [],
            slider  = this.down('#quickd-deal-slider');
        
        slider.removeAll(true,true);
        for(var key in records) slider.add({modelId:records[key].getId()}).setData(records[key].data);
    },
    loadDeal:function(record,index){
        var model;
        log('test');
        if(record.modelId) model = Ext.getStore('Deals').getById(record.modelId);
        else model = record;
        var $deal = $('#deal-' + record.internalId + '-info');
        //this.down('#quickd-show-topbar').setTitle('Test');
        this.down('#quickd-deal-content').setData(model.getData());
        var now = parseInt(new Date().getTime()/1000);
        //log('rec',record.get('end'));
        //log('record',parseInt(now)-parseInt(record.data.end));
        if ($('#quickd-deal-content article[id*=deal-]').length > 0) this.addCustomScroll();
    },
    initialize: function() {
        this.callParent(arguments);
    },
    addCustomScroll: function() {
        var $el             = $('#quickd-deal-content article[id*=deal-]'),
            $wrap           = $el.parent(),
            carouselHeight  = $('#quickd-deal-slider').height(),
            self            = this;

        if (this.easyScroll) this.easyScroll = null; // TODO: Find a better way to kill the old instance (Couldn't find a destroy() method).

        this.easyScroll = new EasyScroller($el[0], {
            scrollingX: false,
            scrollingY: true,
            zooming: false
        });

        // TODO: Could we optimize this to prevent memory leaks? A resize-controller maybe.
        // resizeController.addChild($wrap) // resizeController.removeChild($wrap);
        $(window).on('resize', function(e) {
            $wrap.height((window.innerHeight - carouselHeight));
        }).resize();

        $el.find('img').load(function() { self.updateScroll(); } );
    },
    updateScroll: function() {
        if (this.easyScroll) {
            this.easyScroll.reflow();
            log('EasyScroller updated.');
        }
    }
});
