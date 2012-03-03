Ext.define('QuickD.controller.Main', {
    extend: 'Ext.app.Controller',
	requires: [
		'Ext.util.GeoLocation'
	],
    config: {
        refs: {
            main: 'mainview',
            filterButton: '#filterButton',
            mapButton: '#mapButton', 
            refresher: 'deallist > pullrefresh',
            dealList: 'deallist',
            mapShow: 'mapshow'
        },
        control: {
        	filterButton: {
        		change: 'filterChange',
        		scope:this
        	},
            main: {
                push: 'onMainPush',
                pop: 'onMainPop',
                back: 'onMainBack'
            },
            mapButton: {
            	tap: 'mapbutton',
            	scope: this
            },
            deallist: {
                itemtap: 'onDealSelect'
            }
        }
    },
    init: function() {
		/*Ext.getStore('Deals').on({
			updaterecord: this.test,
			load: this.test,
			addrecords:this.test,
			
			removerecords: this.test
		});*/
		//Ext.doComponentLayout();
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
    	log('res',instance,data,options);
    },
    onLocationUpdate:function(test){
    	log(this.location.getAccuracy());
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
    onLocationError:function(error,test1,permDenied,test3,test4){
    	log('error',error,test1,test2,test3,test4);
    },
    onMainPush: function(view, item) {
    	log('main push',item.xtype);
		
        if (item.xtype == "dealshow") {
           // this.getContacts().deselectAll();
			var filterButton = this.getFilterButton();
			var mapButton = this.getMapButton();
            this.hideButton(filterButton,mapButton);
            
        }
        if(item.xtype == 'mapshow'){
        	var mapButton = this.getMapButton();
        	this.hideButton(mapButton);
        }
    },

    onMainPop: function(view, item) {
    	log('main pop',item.xtype);
		
      	if (item.xtype == "dealshow") {
            //this.showSortButton();
        }
    },

    onMainBack: function(view) {
    	
        var item = view.getActiveItem();
        log('main back',item.xtype)
        if (item.xtype == "deallist") 
        {
        	this.activeRecord = false;
        	item.deselectAll();
        	this.lockDealList = false;
        	var filterButton = this.getFilterButton();
        	var mapButton = this.getMapButton();
            this.showButton(filterButton,mapButton);
        }
        if(item.xtype == 'dealshow'){
        	var mapButton = this.getMapButton();
            this.showButton(mapButton);
        }
    },
    mapbutton:function(test){
    	if(this.activeRecord){
    		 this.showMap = Ext.create('QuickD.view.MapShow');
	    	 this.showMap.setRecord(this.activeRecord);
	    	 this.getMain().push(this.showMap);
    	}
    },
    onDealSelect:function(list, index, node, record){
    	log('deal select');
    	if(this.lockDealList) return false;
    	this.lockDealList = true;

        this.showDeal = Ext.create('QuickD.view.DealShow');
		this.activeRecord = record;
        // Bind the record onto the show contact view
        this.showDeal.setRecord(record);
        // Push the show contact view into the navigation view
        this.getMain().push(this.showDeal);
    },
    showButton: function(button,hideButton) {
        

        if (!button.isHidden()) {
            return;
        }
        if(hideButton && !hideButton.isHidden()) hideButton.hide();
        //show the edit button and then fade it in
        button.show();
        Ext.Animator.run({
            element: button.element,
            from: {
                opacity: 0
            },
            to: {
                opacity: 1
            }
        });
    },
    hideButton: function(button,showButton) {
        

        if (button.isHidden()) {
            return;
        }
		if(showButton && showButton.isHidden()){
			var end = function(){
				button.hide();
				showButton.show();
			}
		}
		else {
			var end = function(){
				button.hide();
			}
		}
        //fade the edit button out then hdie it
        Ext.Animator.run({
            element: button.element,
            from: {
                opacity: 1
            },
            to: {
                opacity: 0
            },
            onEnd: end
        });
    }
});