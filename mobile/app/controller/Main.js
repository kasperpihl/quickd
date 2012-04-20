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
            dealShowSlider: 'mainview > dealshow > carousel',
            mapShow: 'mainview > mapshow'
        },
        control: {
            useKeyButton:{
                tap:'useBetaKey'
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
    prompt:function(pass,canceled){
        var res;
        if(!pass){ 
            if(canceled){
                var message;
                switch(canceled){
                    case 1:
                        message = 'Du skal altså bruge kode, smut ind på quickd.com og skriv dig op :-)';
                    break;
                    case 2: 
                        message = 'Skriv dig nu bare op';
                    break;
                    case 3:
                        message = 'Vi kan blive ved sådan her hele dagen!';
                    break;
                    case 4:
                        message = 'Du tør ikke trykke på "OK"';
                    break;
                    case 5:
                        message = 'Jeg vidste det..... jeg er ved at lære dig at kende';
                    break;
                    case 6:
                        message = "Okay er du glad nu, lad være med at trykke på Annuller";
                    break;
                    case 7:
                        message = 'Hvornår tror du selv der sker noget andet?';
                    break;
                    case 8:
                        message = 'Haha jeg har en plan';
                    break;
                    case 9:
                        message = 'Ja, det er genialt, hvorfor tænkte jeg ikke på det før. Tryk Annuller en gang til og du vil fortryde det';
                    break;
                    default:
                        alert('HAH, prøv at trykke Annuller nu.');
                        window.location.href="http://www.quickd.dk";
                    break;
                }
                res = prompt(message,'');
            }
            else res = prompt('Indtast din betanøgle, eller skriv dig op på quickd.com','');
        } else{
            res = prompt('Forkert nøgle, prøv igen',pass);
        }
        if(!res){
            canceled = canceled ? canceled+1 : 1;
            var self = this;
            setTimeout(function(){
                self.prompt(false,canceled);
            },2000);
        }
        else this.useBetaKey(res);
    },
    useBetaKey:function(key){
        var self = this;
        Ext.Ajax.request({
            url: ROOT_URL+'ajax/betakey.php',
            params:{
                betakey:key
            },
            method:'POST',
            success:function(data){
                if(data.responseText == 'true'){
                    self.start();
                }else{
                    self.prompt(key);
                }
            },
            error:function(data){
                log('error beta',data);
            }
        });
    },
    start: function() {
        this.$container = $('#quickd-deals .x-scroll-container');
        this.$dealsWrap = $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner');
        // Add deals bg
        this.$container.append($('<div id="deal-bg"></div>'));
        this.$dealsBg = this.$container.find('#deal-bg').hide();
        Ext.getStore('Deals').on({ 'refresh': this.updatedStore, scope: this,'updaterecord': this.addRemoveRecords,'addrecords':this.addRemoveRecords});
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
    launch:function(notInstalled){

        if(isIphone == 1 && !window.navigator.standalone){
            this.getMain().setActiveItem(this.getBetaView());
            return;
        }
        if(!userbeta){    
            this.prompt();
        }
        else {
            this.start();
        }
        //this.sortController = this.getApplication().getController('SortController');
        
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
        var lat = this.location.getLatitude();
        var long = this.location.getLongitude();
        this.getAddress(lat,long);
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
    },
    getAddress:function(lat,long){
        var city,
            self = this,
            geocoder = new google.maps.Geocoder(),
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