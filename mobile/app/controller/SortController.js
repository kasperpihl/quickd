Ext.define('QuickD.controller.SortController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'mainview',
            dealSort: 'dealsort checkboxfield',
            updateButton: 'dealsort #backFromSortButton'
        },
        control: {
            dealSort: {
                check: 'checkboxHandler',
                uncheck: 'checkboxHandler'
            },
            updateButton:{
                tap: 'buttonHandler'
            }
        }
    },
    checkboxHandler:function(f,t2,t3,e){
        var event = e.info.eventName;
        var field = f.getName();
        log('checkboxHandler',field,event);
    },
    init: function() {
        
        this.changedSorting = false;
        log('init SortController');
    },
    launch:function(){
        var test = this.getDealSort();
        log('testing',test);
    }
});