Ext.define('QuickD.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.GeoLocation',
        'QuickD.controller.AnimationController'
    ],
    config: {
        refs: {
            main: 'mainview',
            dealListToolbar: 'deallist > toolbar',
            buttons: 'toolbar > button',
            dealList: 'mainview > deallist',
            dealShow: 'mainview > dealshow',
            dealSort: 'mainview > dealsort',
            dealShowSlider: 'mainview > dealshow > carousel',
            mapShow: 'mainview > mapshow'
        },
        control: {
            buttons:{
                tap: 'buttonHandler'
            },
            deallist: {
                itemtap: 'onDealSelect'
            },
            dealShowSlider:{
                activeitemchange: 'test'
            }
        }
    },
    buttonHandler:function(t,t2,t3){
        var id = t.getId();
        switch (id){
            case 'sortButton':
                this.sortController.setState();
                this.changeToView('dealsort');
            break;
            case 'mapButton':
                this.changeToView('mapshow');
            break;
            case 'backFromMapButton':
                this.getMain().animateActiveItem(this.getDealShow(), 'flip');
            break;
            case 'backFromSortButton':
                var controller = this.getApplication().getController('SortController');
                controller.filterChange();
                this.getMain().animateActiveItem(this.getDealList(), 'flip');
                //this.changeToView('dealshow');
            break;
            case 'backFromShowButton':
                this.changeToView('deallist');
            break;
        }
    },
    test:function(container,newItem,oldItem){
        //log(this.getMain().setShowAnimation('flip'));
        this.getDealShow().loadDeal(newItem);
    },
    init: function() {
        Ext.getStore('Deals').addListener('refresh', this.updatedStore, this);

        this.animationController = this.getApplication().getController('AnimationController');
        
        this.location = Ext.create('Ext.util.GeoLocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: 'onLocationUpdate',
                locationerror:'onLocationError',
                scope: this
            }
        });
        this.location.updateLocation();

    },
    launch:function(){
        this.sortController = this.getApplication().getController('SortController');
        var test = this.getDealShow().query('#quickd-deal-content')[0].element;
        log(test);
        test.on('horizontalswipe',function(){ log('test'); });
        this.$container = $('#quickd-deals .x-scroll-container');
        this.$dealsWrap = $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner');
      
        // Add deals bg
        this.$container.append($('<div id="deal-bg"></div>'));
        this.$dealsBg = this.$container.find('#deal-bg').hide();
    },
    
    updatedStore:function(instance,data,options){
        log('updatedStore');
        this.getDealShow().setSlider(instance.getData().items);
    },
    onLocationUpdate:function(){
        this.getMain().getAt(0).show();
        this.getMain().setActiveItem(this.getDealList());
        localStorage.setItem('lat',this.location.getLatitude());
        localStorage.setItem('long',this.location.getLongitude());
        Ext.getStore('Deals').load({
            params: {
                lat: this.location.getLatitude(),
                long: this.location.getLongitude()
            },
            scope: this
        });
    },
    handleMap: function(){
        this.changeToView('mapshow');
    },
    changeToView:function(view,options){
        var main    = this.getMain(),
            $deals  = $('#quickd-deals .x-list-container div.x-list-item'),
            self    = this;

        switch(view){
            case 'dealsort':
                main.animateActiveItem(this.getDealSort(), 'flip');
            break;
            case 'dealshow':
                var dealsOut    = this.animationController.dealsListOut($deals),
                    bgIn        = this.showSingleBackground(300);
                var button = Ext.ComponentQuery.query('toolbar #sortButton');
                button[0].hide();
                // Fetch data for selected deal.
                this.getDealShow().loadDeal(options.record,options.index); // ingen server load, så dataen er der med det samme.
                
                $.when(dealsOut, bgIn).done(function() {
                    self.getMain().setActiveItem(self.getDealShow());
                });
            break;
            case 'deallist':
                var button = Ext.ComponentQuery.query('toolbar #sortButton');
                button[0].show();
                main.setActiveItem(this.getDealList());
                
                setTimeout(function() {
                    log('hideSingleBackground begin');
                    self.hideSingleBackground().done(function() {
                        log('hideSingleBackground done');
                        self.animationController.dealsListIn($deals);
                    });
                }, 100);
            break;
            case 'mapshow':
                this.getMapShow().setRecord(this.activeDeal);
                this.getMain().animateActiveItem(this.getMapShow(), 'flip');
                //this.getMain().setActiveItem();
            break;
        }
    },
    showSingleBackground: function(delay, duration) {
        var drf = new $.Deferred();
        this.$dealsBg.delay(delay).fadeIn(duration || 250, drf.resolve);
        return drf.promise();
    }, 
    hideSingleBackground: function(delay, duration) {
        var drf = new $.Deferred();
        this.$dealsBg.delay(delay).fadeOut(duration || 200, drf.resolve);
        return drf.promise();
    },
    onLocationError:function(error,test1,permDenied,test3,test4){
        this.getMain().getAt(1).setHtml('error location');
    },
    onDealSelect:function(list, index, node, record){
        this.activeDeal = record;
        this.changeToView('dealshow',{record:record,list:list,index: index});
        return false;
        // Bind the record onto the show contact view
       // this.showDeal.setRecord(record);
    }
});