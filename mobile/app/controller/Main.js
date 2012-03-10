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
                this.changeToView('dealsort');
            break;
            case 'backFromSortButton':
                this.changeToView('deallist');
            break;
            case 'backFromShowButton':
                this.changeToView('deallist');
            break;
        }
    },
    test:function(container,newItem,oldItem){
        //log(this.getMain().setShowAnimation('flip'));
        //this.getDealShow().loadDeal(newItem);
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
        this.$container = $('#quickd-deals .x-scroll-container');
        this.$dealsWrap = $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner');
      
        // Add deals bg
        this.$container.append($('<div id="deals-bg"></div>'));
        this.$dealsBg = this.$container.find('#deals-bg');
    },
    filterChange:function(instance,data,options){
        if(data && data.hasOwnProperty('data')){
            var id = data.data.value;
            if(id != this.filter){
                this.filter = id;
                var store = Ext.getStore('Deals');
                switch(id){
                    case 'shopping':
                    case 'fooddrink':
                    case 'experience':
                        store.clearFilter();
                        store.filter('category',id);
                    break;
                    case 'all':
                        store.clearFilter();
                    break;
                }
            }
        }

    },
    updatedStore:function(instance,data,options){
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
    handleBack:function(){
        this.getBackButton().hide();
        this.getMapButton().hide();
        this.getFilterButton().show();
        this.getDealList().deselectAll();
        this.getMain().setActiveItem(1);
    },
    changeToView:function(view,options){
        var main = this.getMain();
        switch(view){
            case 'dealsort':
                main.animateActiveItem(this.getDealSort(),'flip');
            break;
            case 'dealshow':
                var $deals      = $('#quickd-deals .x-list-container div.x-list-item'),
                    self        = this,
                    dealsOut    = this.animationController.dealsListOut($deals),
                    bgIn        = this.showSingleBackground();
                
                // Fetch data for selected deal.
                this.getDealShow().loadDeal(options.record,options.list); // ingen server load, så dataen er der med det samme.
                
                $.when(dealsOut, bgIn).done(function() {
                    self.getMain().setActiveItem(self.getDealShow());
                });
            break;
            case 'deallist':
                main.animateActiveItem(this.getDealList(),'flip');
            break;
            case 'mapshow':
                this.getMain().setActiveItem(this.getMapShow());
            break;
        }
    },
    showSingleBackground: function(duration) {
        var drf = new $.Deferred();
        this.$dealsBg.fadeIn(duration || 250, drf.resolve);
        return drf.promise();
    }, 
    hideSingleBackground: function(duration) {
        var drf = new $.Deferred();
        this.$dealsBg.fadeOut(duration || 150, drf.resolve);
        return drf.promise();
    },
    onLocationError:function(error,test1,permDenied,test3,test4){
        this.getMain().getAt(1).setHtml('error location');
    },
    onDealSelect:function(list, index, node, record){
        this.changeToView('dealshow',{record:record,list:list,index: index});
        return false;
        // Bind the record onto the show contact view
       // this.showDeal.setRecord(record);
    }
});