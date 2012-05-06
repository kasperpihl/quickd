
function makeOpeningHours(object){
    var daysLang = {
        0:{ min:'Man', max:'Mandag'},
        1:{ min: 'Tir',max: 'Tirsdag'},
        2:{ min: 'Ons',max: 'Onsdag'},
        3:{ min: 'Tor',max: 'Torsdag'},
        4:{ min: 'Fre',max: 'Fredag'},
        5:{ min: 'Lør',max: 'Lørdag'},
        6:{ min: 'Søn',max: 'Søndag'},
        closed: 'Lukket'
    };

    var times,closed,html='',min=0;
    for(var i = 0 ; i <= 7 ; i++ ){
        var close,open;
        if(i < 7){ 
            var temp = object[i];
            open = (temp.hasOwnProperty('open') && (temp.open||temp.open===0)) ? temp.open : false;
            close = (temp.hasOwnProperty('close') && (temp.close||temp.close===0)) ? temp.close : false;
        }
        if(i === 0) times = {open:open,close:close};
        else{
            if(i < 7 && open == times.open && close == times.close) continue;
            var last = i-1;
            var days,time;
            if(last == min) days = daysLang[last].max;
            else days = daysLang[min].min + '-' + daysLang[last].max;
            if(times.open===false || times.close===false) time = daysLang.closed;
            else time = times.open + ' &ndash; ' + times.close;
            html += '<li><span class="day">'+days+'</span><span class="leader"></span><time>'+time+'</time></li>';
            if(i < 7){
                times.open = open;
                times.close = close;
                min = i;
            }


        }
        
    }
    return html;
}
var showDealTemplate = new Ext.XTemplate(
    '<section class="deal-wrap">',
    '<article id="deal-{id}-info" class="{category}">',
        '<header><h1>{title}</h1></header>',
        '<section class="desc">{description}</section>',
        '<section class="venue">',
            '<h2>{name}</h2>',
            '<img class="venue-thumb" src="http://lorempixum.com/640/320/nightlife/" width="100%" />',
            '<tpl if="info"><p><strong>Om stedet: </strong>{info}</p></tpl>',
        '</section>',
        '<footer class="venue-meta">',
            '<tpl if="open_hours">',
                '<section class="hours">',
                    '<ul>',
                        '{open_hours:this.makeOpeningHours}',
                    '</ul>',
                '</section>',
            '</tpl>',
            '<section class="location">',
                '<p>{address}</p>',
            '</section>',
            '<section class="feedback">',
                '<p>9 anmeldelser</p>',
            '</section>',
        '</footer>',
    '</article>',
    '</section>',
    {
        priceIt: priceIt,
        humanReadableDistance: humanReadableDistance,
        makeOpeningHours: makeOpeningHours
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
        'Ext.Carousel',
        'Ext.Toolbar',
        'Ext.Button',
        'Ext.Panel'
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
                
            }
        }]
    },
    setSlider:function(records){
        var array   = [],
            slider  = this.down('#quickd-deal-slider');
        slider.removeAll(true,true);
        for(var key in records){ 
            var test = slider.add({modelId:records[key].getId()}).setData(records[key].data);
        }

    },
    loadDeal:function(record,index){
        var model;
        if(record.modelId) model = Ext.getStore('Deals').getById(record.modelId);
        else model = record;
        //var $deal = $('#deal-' + record.internalId + '-info');
        this.down('#quickd-show-topbar').setTitle('test');
        this.down('#quickd-deal-content').setData(model.getData());
        var now = parseInt(new Date().getTime()/1000,10);
        var time_left = parseInt(model.get('end'),10)-parseInt(now,10);
        javascript_countdown.start(time_left);
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
        }
    }
});
