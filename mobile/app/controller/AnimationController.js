Ext.define('QuickD.controller.AnimationController', {
    extend: 'Ext.app.Controller',
    name: 'AnimationController',
    requires: [],
    config: { },
    init: function(){
        this.defaultInSpeed = 200;
        this.defaultOutSpeed = 150;
    },
    dealsListIn: function($deals, duration) {
        var dfr     = new $.Deferred(),
            h       = $(window).height(),
            self    = this;
        
        $deals.each(function(i) {
            $(this)
                .stop(true, true)
                .delay((i + 1) * 75)
                .animate(
                    { 
                        'opacity': 1
                    },
                    duration || self.defaultInSpeed
                );
                
        }).promise().done(dfr.resolve);

        return dfr.promise();
    },
    dealsListOut: function($deals, duration) {
        var dfr     = new $.Deferred(),
            h       = $(window).height(),
            self    = this;

        $deals.each(function(i) {
            $(this)
                .stop(true, true)
                .delay((i + 1) * 75)
                .animate(
                    { 
                        'opacity': 0
                    },
                    duration || self.defaultOutSpeed
                );
                
        }).promise().done(dfr.resolve);

        return dfr.promise();
    },
    singleDealIn: function(deal, duration) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    singleDealOut: function(deal, duration) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    singleDealSwitch: function(deal1, deal2, duration) {
        var dfr = new $.Deferred();

        return dfr.promise();
    },
    killAll: function(forceComplete) {

    }
});