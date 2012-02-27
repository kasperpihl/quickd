
App.views.ControlPanel = Backbone.View.extend({
	el: '#appContent',
	time: 18000,
	initialize:function(){
		this.router = this.options.router;
		this.timeEl = $('#time time');
		this.sliderEl = $('#hours-slider');
		this.dealSliderEl = $('#deal-slider');
		this.dealSlides = $('.royalSlide',this.dealSliderEl);
		_.bindAll(this,'clickedButton','handleChange','render','afterSlideChange');
		this.router.bind('dealsLoaded',this.render);
	},
	render:function(){
		log('rendered');
		this.sliderEl.attr('value', 20).slider('refresh');	
		this.dealSlider = this.dealSliderEl.royalSlider({
    		directionNavEnabled: false,
    		slideTransitionSpeed: 800,
    		slideTransitionEasing: 'easeInOutExpo',
    		controlNavEnabled: true,
    		autoScaleSlider: true,
    		autoScaleSliderWidth: 320,
    		autoScaleSliderHeight: 110,
    		dragUsingMouse: false,
    		disableTranslate3d: false,
    		beforeSlideChange:this.clickedButton,
    		afterSlideChange: this.afterSlideChange,
    		allComplete: function() {
    			//slider.updateSliderSize();
    		}
    	}).data('royalSlider');
	},
	events: {
		'click #startButton': 'clickedButton',
		'change #hours-slider': 'handleChange'
	},
	handleChange:function(e,ui){
		var sliderVal 	= e.currentTarget.value,
			hour		= Math.floor(sliderVal / 4),
			min			= (sliderVal % 4) * 15,
			hourText	= (hour > 1)? 'timer' : 'time',
			minText		= (min > 0)? ' og ' + min + ' minutter ' : '';
		
		if (min < 10) min = '0' + min;
		this.time = (hour*60*60) + (min*60);
		this.timeEl[0].innerHTML = hour + ':' + min + ' ' + hourText;
	},
	beforeSlideChange:function(){

	},
	afterSlideChange:function(){
		var currSlideNum	= this.dealSlider.currentSlideId,
			slideSelector	= '.royalSlide:nth-child(' + (currSlideNum + 1) + ')';
			$currSlide		= $(slideSelector, this.dealSliderEl);
			$deal = $(slideSelector + ' .deal');
		var templateId = $deal.attr('templateid');
		this.dealSlides.each(function() {
			$(this).toggleClass('current', ($(this)[0] == $currSlide[0]));
		});
		var started = $deal.attr('started');
		/*if (started == 'true'){
			var end = $deal.attr('endtime');
			dealController.toggleCountdown(true,templateId,end);
		}
		
		else dealController.toggleCountdown(false,templateId);*/
	},
	clickedButton:function(){
		log('test');
	}
});