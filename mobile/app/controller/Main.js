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
            betaView: 'mainview > betaview',
            useKeyButton: 'mainview > betaview button',
            dealShow: 'mainview > dealshow',
            splash: 'mainview > splash',
            noDeals: 'mainview > nodeals',
            dealShowSlider: 'mainview > dealshow > carousel',
            mapShow: 'mainview > mapshow'
        },
        control: {
            useKeyButton:{
                tap:'useBetaKey'
            },
            adressButton: {
                tap: 'test'
            },
            buttons:{
                tap: 'buttonHandler'
            },
            deallist: {
                itemtap: 'onDealSelect'
            },
            dealShowSlider:{
                activeitemchange: 'setNewDeal'
            }
        }
    },
    test:function(){
        alert('hej');
    },
    init:function(){
        
    },
    useBetaKey:function(){
        Ext.Ajax.request({
            url: ROOT_URL+'ajax/betakey.php',
            params:{
                betakey:'test'
            },
            method:'POST',
            success:function(response){
                log(response);
            }
        });
    },
    start: function() {
        Ext.getStore('Deals').on({ 'refresh': this.updatedStore, scope: this,'updaterecord': this.addRemoveRecords,'addrecords':this.addRemoveRecords});
        //Ext.getStore('Deals').addListener('updaterecord', this.test, this);
        this.getMain().getAt(0).show();
        this.getMain().setActiveItem(this.getDealList());
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

        //this.sortController = this.getApplication().getController('SortController');
        var test = this.getDealShow().query('#quickd-deal-content')[0].element;
        test.on('horizontalswipe',function(){ log('test'); });
        this.$container = $('#quickd-deals .x-scroll-container');
        this.$dealsWrap = $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner');
        // Add deals bg
        this.$container.append($('<div id="deal-bg"></div>'));
        this.$dealsBg = this.$container.find('#deal-bg').hide();
        this.start();
    },
    addRemoveRecords:function(store,p2,p3,p4){
        if(this.lockRefresh) return;
        this.lockRefresh = true;
        var self = this;
        setTimeout(function(){
            self.lockRefresh = false;
            self.updatedStore(store);
        },150);
        //log('params',p1,p2,p3,p4);*/
    },
    buttonHandler:function(t,t2,t3){
        var id = t.getId();
        var main = this.getMain();
        switch (id){
            case 'sortButton':
                this.sortController.setState();
                this.changeToView('dealsort');
            break;
            case 'mapButton':
                this.changeToView('mapshow');
            break;
            case 'backFromMapButton':
                main.animateActiveItem(this.getDealShow(), {type:'reveal',direction:'down'});
            break;
            case 'backFromSortButton':
                var controller = this.getApplication().getController('SortController');
                controller.filterChange();
                main.animateActiveItem(this.getDealList(), {type:'reveal',direction:'down'});
            break;
            case 'backFromShowButton':
                this.changeToView('deallist');
            break;
        }
    },
    changeToView:function(view,options){
        var main    = this.getMain(),
            $deals  = $('#quickd-deals .x-list-container div.x-list-item'),
            button  = Ext.ComponentQuery.query('toolbar #sortButton'),
            self    = this;
        switch(view){
            case 'betaview':
                main.setActiveItem(this.getBetaView());
            break;
            case 'dealsort':
                main.animateActiveItem(this.getDealSort(), 'flip');
            break;
            case 'dealshow':
                var dealsOut    = this.animationController.dealsListOut($deals),
                    bgIn        = this.showSingleBackground(300);

                //button[0].hide();
                // Fetch data for selected deal.
                this.getDealShow().down('#quickd-deal-slider').setActiveItem(options.index);
                
                $.when(dealsOut, bgIn).done(function() {
                    self.getMain().setActiveItem(self.getDealShow());
                    self.getDealShow().updateScroll();
                });
            break;
            case 'deallist':
                //button[0].show();
                main.setActiveItem(this.getDealList());
                
                // TODO: Why do we need a timeout here...?
                setTimeout(function() {
                    self.hideSingleBackground().done(function() {
                        self.animationController.dealsListIn($deals);
                    });
                }, 100);
            break;
            case 'mapshow':
                this.getMapShow().setRecord(this.activeDeal);
                main.animateActiveItem(this.getMapShow(), {type:'cover',direction:'up'});
                main.setShowAnimation(null);
            break;
        }
    },
    setNewDeal:function(container,newItem,oldItem){
        log('setnewdeal',container,newItem,oldItem);
        //log(this.getMain().setShowAnimation('flip'));
        this.getDealShow().loadDeal(newItem);
    },
    constructor:function(){
        this.callParent(arguments);
    },
    updatedStore:function(instance,data,options){
        var count = instance.getCount();
        var string = count + (count == 1 ? ' deal' : ' deals');
        this.getDealList().getDockedComponent('quickd-list-topbar').setTitle(string);
        var view = this.getDealShow();
        view.setSlider(instance.getData().items);
    },
    onLocationUpdate:function(){
        var lat = this.location.getLatitude();
        var long = this.location.getLongitude();
        if(distance(lat,long,56.16294,10.20392) > 10000){
            return this.noLocation();
        }
        localStorage.setItem('lat',lat);
        localStorage.setItem('long',long);
        Ext.getStore('Deals').load({
            params: {
                lat: lat,
                long: long
            },
            scope: this
        });
        var self = this;
        if(!userbeta){
            setTimeout(function(){
                self.getBetaView().show();
            },500);
        }
    },
    handleMap: function(){
        this.changeToView('mapshow');
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
    noLocation:function(){
        this.location.setLatitude(56.16294);
        this.location.setLongitude(10.20392);
        alert('Vores beta kører kun i Aarhus, så vi placerer dig midt i Aarhus');
        this.onLocationUpdate();
    },
    onLocationError:function(error, test1, permDenied, test3, test4){
        this.noLocation();
        //this.getMain().getAt(0).getAt(0).setHtml('error location');
    },
    onDealSelect:function(list, index, node, record){
        this.activeDeal = record;
        this.changeToView('dealshow',{record:record,list:list,index: index});
        return false;
    }
});