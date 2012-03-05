Ext.define('QuickD.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.GeoLocation'
    ],
    config: {
        refs: {
            main: 'mainview',
            toolbar: 'toolbar',
            filterButton: '#filterButton',
            mapButton: '#mapButton',
            backButton: '#backButton',
            dealList: 'deallist',
            dealShow: 'mainview > dealshow'
        },
        control: {
            filterButton: {
                change: 'filterChange',
                scope:this
            },
            deallist: {
                itemtap: 'onDealSelect',
                refresh: 'test'
            },
            backButton: {
                tap: 'handleBack'    
            }
        }
    },
    init: function() {
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
    test:function(instance,data,options){
       log('refresh');
       // log('updater',instance,data,options);
    },
    onLocationUpdate:function(test){
        this.getMain().getAt(0).show();
        this.getMain().setActiveItem(1);
        localStorage.setItem('lat',this.location.getLatitude());
        localStorage.setItem('long',this.location.getLongitude());
        Ext.getStore('Deals').load({
            params: {
                lat: this.location.getLatitude(),
                long: this.location.getLongitude()
            },
            callback: function(records) {
                log('records',records);
            },
            scope: this
        });
    },
    handleBack:function(){
        log('back');
        this.getBackButton().hide();
        this.getMapButton().hide();
        this.getFilterButton().show();
        this.getDealList().deselectAll();
        this.getMain().setActiveItem(1);
    },
    changeToView:function(view,options){
        switch(view){
            case 'dealshow':
                this.getDealShow().loadDeal(options.record);
                //this.getMain().getAt(2).setRecord(record);
                this.getBackButton().show();
                this.getFilterButton().hide();
                this.getMapButton().show();
                this.getMain().setActiveItem(2);
            break;
        }
    },
    onLocationError:function(error,test1,permDenied,test3,test4){
        this.getMain().getAt(1).setHtml('error location');
    },
    onDealSelect:function(list, index, node, record){
        this.changeToView('dealshow',{record:record});
        
        // Bind the record onto the show contact view
       // this.showDeal.setRecord(record);
    }
});