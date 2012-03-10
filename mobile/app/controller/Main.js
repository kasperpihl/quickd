Ext.define('QuickD.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.util.GeoLocation'
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
        Ext.getStore('Deals').addListener('refresh',this.updatedStore,this);
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
        /*.each(function(item){
            log(item)
        });*/
       //log('refresh',instance,data,options);
       // log('updater',instance,data,options);
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
                //log(this.getApplication().getHistory());
                var test = this.getDealListToolbar().query('#sortButton')[0];
                test.hide();
                /* This class should have z-index 5. Making the deals lay over the fading in background*/
                $('#quickd-deals .x-scroll-view .x-scroll-container .x-scroll-scroller.x-list-inner').css('zIndex',5);
                /* Quickd N'dirty solution. Appending div  */
                $('#quickd-deals .x-scroll-container').append('<div id="testing" style="z-index:3; background:black; position: absolute; top: 0; left:0;min-width:100%; min-height:100%; display:none;"></div>');
                var i = 0;
                $('#quickd-deals .x-list-container div.x-list-item').each(function(){
                    $(this).toggleClass('animateUp',(options.index >= i));
                    $(this).toggleClass('animateDown',(options.index < i));
                    i++;
                });
                this.getDealShow().loadDeal(options.record,options.list);
                var thisClass = this;
                $('#testing').fadeIn(function(){
                    thisClass.getMain().setActiveItem(thisClass.getDealShow());
                    $('#testing').remove();
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