Ext.define('QuickD.controller.AnimationController', {
    extend: 'Ext.app.Controller',
    name: 'AnimationController',
    requires: [],
    config: { },
    init: function(){
        this.defaultInSpeed = 300;
        this.defaultOutSpeed = 250;
    },
    dealsListIn: function($deals) {
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
    dealsListOut: function($deals, duration) {
        var dfr     = new $.Deferred(),
            h       = $(window).height(),
            self    = this;

        self.duration = duration || this.defaultOutSpeed;

        $deals.each(function(i) {
            log('begin animation - Duration: ' + self.duration);
            $(this)
                .delay((i + 1) * 300)
                .animate(
                    { 
                        'opacity': 0 
                    },
                    self.duration,
                    function() {
                        log('Animation complete for  ' + i);
                    }
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