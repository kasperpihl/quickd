Ext.define('QuickD.controller.AnimationController', {
    extend: 'Ext.app.Controller',
    name: 'AnimationController',
    requires: [],
    config: { },
    init: function(){
        
    },
    dealsListIn: function(deals, onComplete) {
        var dfr = new jQuery.deferred();
        
        // animate out
        $('#quickd-deals .x-list-container div.x-list-item').each(function(){
            $(this).toggleClass('animateUp',(options.index >= i));
            $(this).toggleClass('animateDown',(options.index < i));
            i++;
            dfr.resolve();
        });

        return dfr.promise();
    },
    dealsListOut: function(deals, duration, onComplete) {
        var dfr = new $.Deferred();

        setTimeout(function() {
            dfr.resolve();
        }, duration||1000);

        return dfr.promise();
    },
    singleDealIn: function(deal, duration, onComplete) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    singleDealOut: function(deal, duration, onComplete) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    singleDealSwitch: function(deal1, deal2, duration, onComplete) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    killAll: function(forceComplete) {

    }
});
