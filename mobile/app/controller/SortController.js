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
                uncheck: 'checkboxHandler'
            }
        }
    },
    checkboxHandler:function(f,t2,t3,e){
        //var event = e.info.eventName;
        var field = f.getName();
        var checked = f.getChecked();
        log('checkboxHandler',field,event,checked);
    },
    init: function() {
        this.unchangedStateObj = {};
        this.changedStateObj = {};
        this.changedSorting = false;
        log('init SortController');
    },
    launch:function(){
        var checkBoxes = Ext.ComponentQuery.query('dealsort checkboxfield');
        for(var i = 0 ; i < checkBoxes.length ; i++){
            var checked = checkBoxes[i].getChecked();
            var name = checkBoxes[i].getName();
            this.changedStateObj[name] = this.unchangedStateObj[name] = checked;

            //log(checkBoxes[i].getName(),checkBoxes[i].getChecked());
        }
        log(this.unchangedStateObj,this.changedStateObj);
    }
});