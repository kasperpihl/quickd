Ext.define('QuickD.controller.SortController', {
    extend: 'Ext.app.Controller',
    test:false,
    config: {
        refs: {
            main: 'mainview',
            dealSortChecks: 'dealsort checkboxfield',
            updateButton: 'dealsort #backFromSortButton'
        },
        control: {
            dealSortChecks: {
                check: 'checkboxHandler',
                uncheck: 'checkboxHandler',
                scope:this
            }
        }
    },
    checkboxHandler:function(f){
        var name = f.getName();
        var checked = f.getChecked();
        this.changedStateObj[name] = checked;
        for (var name in this.changedStateObj) {
            if(this.changedStateObj[name] != this.unchangedStateObj[name]){
                if(!this.changedSorting){ 
                    this.getUpdateButton().setText('Opdater');
                    this.changedSorting = true;
                }
                return;
            }
        }
        if(this.changedSorting){
            this.changedSorting = false;
            this.getUpdateButton().setText('Tilbage');
        }
    },
    filterChange:function(){
        var store = Ext.getStore('Deals');
        var filter = [];
        
        if(this.changedSorting){
            store.clearFilter();
            var self = this;
            var filter = this.changedStateObj;
            store.filter({
                filterFn: function(item) { 
                    return ( filter[item.get("category")] == true ); 
                }
            });
        }
    },
    init: function() {
        this.unchangedStateObj = {};
        this.changedStateObj = {};
        this.changedSorting = false;
    },
    setState:function(){
        var checkBoxes = Ext.ComponentQuery.query('dealsort checkboxfield');
        for(var i = 0 ; i < checkBoxes.length ; i++){
            var checked = checkBoxes[i].getChecked();
            var name = checkBoxes[i].getName();
            this.changedStateObj[name] = this.unchangedStateObj[name] = checked;
        }
        this.getUpdateButton().setText('Tilbage');
        this.changedSorting = false;
    },
    launch:function(){
        this.setState();
    }
});