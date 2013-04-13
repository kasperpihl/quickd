Ext.define('QuickD.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.GeoLocation',
        'QuickD.controller.AnimationController',
        'Ext.MessageBox'
    ],
    config: {
        refs: {
            main: 'mainview',
            dealListToolbar: 'deallist > toolbar',
            buttons: 'button',
            dealList: 'mainview > deallist',
            dealShow: 'mainview > dealshow',
            splash: 'mainview > splash',
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
                activeitemchange: 'setNewDeal'
            }
        }
    },
    launch:function(){
        this.$container = $('#quickd-deals .x-scroll-container');
        this.$dealsWrap = $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner');
        
        // Add deals bg
        this.$container.append($('<div id="deal-bg"></div>'));
        this.$dealsBg = this.$container.find('#deal-bg').hide();
        
        Ext.getStore('Deals').on({ 
            'refresh': this.updatedStore, 
            scope: this,
            'updaterecord': this.addRemoveRecords,
            'addrecords':this.addRemoveRecords
        });
        
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
    addRemoveRecords:function(store,p2,p3,p4){
        if(this.lockRefresh) return;
        this.lockRefresh = true;
        var self = this;
        setTimeout(function(){
            self.lockRefresh = false;
            self.updatedStore(store);
        },150);
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
            case 'dealsort':
                main.animateActiveItem(this.getDealSort(), 'flip');
            break;
            case 'dealshow':
                var dealsOut    = this.animationController.dealsListOut($deals),
                    bgIn        = this.showSingleBackground(300);

                this.getDealShow().down('#quickd-deal-slider').setActiveItem(options.index);
                
                $.when(dealsOut, bgIn).done(function() {
                    self.getMain().setActiveItem(self.getDealShow());
                    self.getDealShow().updateScroll();
                });
            break;
            case 'deallist':
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
        this.getDealShow().loadDeal(newItem);
    },
    constructor:function(){
        this.callParent(arguments);
    },
    updatedStore:function(instance,data,options){

        var html,count = instance.getCount();
        if(count < 1){
            this.getDealList().showNoDeals();
        }
        else{
            html =
                '';
            this.getDealList().setHtml(html);
        }
        var string = (count > 0 ? count : 'Ingen') + ' tilbud lige nu';
        this.getDealList().getDockedComponent('quickd-list-topbar').setTitle(string);
        var view = this.getDealShow();
        view.setSlider(instance.getData().items);
    },
    onLocationUpdate:function(){
        var lat1 = this.location.getLatitude();
        var long1 = this.location.getLongitude();
        this.getAddress(lat1,long1);
        if(distance(lat1,long1,56.16294,10.20392) > 10000){
            return this.noLocation();
        }
        localStorage.setItem('lat',lat1);
        localStorage.setItem('long',long1);
        Ext.getStore('Deals').load({
            params: {
                lat: lat1,
                long: long1
            },
            scope: this
        });
    },
    getAddress:function(lat,long){
        var city,self = this;
        if(google){
            var geocoder = new google.maps.Geocoder(),
                latlng = new google.maps.LatLng(parseFloat(lat),parseFloat(long));

            geocoder.geocode({'latLng': latlng}, function(results, status) {
                var found = false; 
                if (status == google.maps.GeocoderStatus.OK) {        
                    if (results[0]) {          
                        var res = results[0].address_components;
                        for (var i in res){
                            if(res[i].types[0] == 'sublocality')
                                city = res[i].short_name;
                        }
                        if(!city) city = 'Aarhus C';
                    } else {          
                        city = 'Aarhus C';     
                    }  
                } else {        
                    city = 'Aarhus C';   
                }
                self.getDealList().setCity(city);
            });  
        } else{
            self.getDealList().setCity('Aarhus C');
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