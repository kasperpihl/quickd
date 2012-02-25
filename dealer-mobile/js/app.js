// Enable logging without breaking dumb browsers. Use log('whatever'), not console.log('whatever').
window.log=function(){
	log.history=log.history || [];
	log.history.push(arguments);
	if(this.console){
		arguments.callee=arguments.callee.caller;
		var a=[].slice.call(arguments);
		(typeof console.log==="object" ? log.apply.call(console.log,console,a) : console.log.apply(console,a))
	}
};
$(document).bind('pageinit', function() {
	App.routers.controller = new App.routers.Controller(shopowner);
	$('.start-stop-deal').click(function(){
		var stopped = ($(this).hasClass('stop')) ? true : false;
		dealController.pressedButton(stopped);
	});
	var DurationSlider = function() {
    	var $slider = $( "#hours-slider" ),
    		$time	= $('#time time'),
    		time    = 5*60*60;
    	$time[0].innerHTML = '5:00 timer';
    	$slider.bind( "change", handleChange);
		// Reset slider value
		$slider.attr('value', 20).slider('refresh');		
		function handleChange(e, ui) {
			var sliderVal 	= e.currentTarget.value,
				hour		= Math.floor(sliderVal / 4),
				min			= (sliderVal % 4) * 15,
				hourText	= (hour > 1)? 'timer' : 'time',
				minText		= (min > 0)? ' og ' + min + ' minutter ' : '';
			
			if (min < 10) min = '0' + min;
			time = (hour*60*60) + (min*60);
			$time[0].innerHTML = hour + ':' + min + ' ' + hourText;
		}
		this.getTime = function(){
			return time;
		}
		this.destroy = function() {
			$slider.unbind('change', handleChange)
			$time = null;
			$slider = null;
			console.log('DurationSlider destroyed');
		}
    };
	var DealController = function() {
    	var $wrap 			= $('#time'),
    		$slider 		= $('form', $wrap),
    		$time			= $('time', $wrap),
    		$btn			= $('.start-stop-deal'),
    		$btnText 		= $('.ui-btn-text', $btn),
    		activeTemplate,
    		locked			= false,
    		controller		= this,
    		sliderControl,
    		countdown;
    	this.toggleCountdown = function(toggle,id,end) {
			$deal = $('article[templateId='+id+']');
    		activeTemplate = id;
    		this.unlock();
    		(toggle)? showCountdown(end) : showSlider();
    		$wrap.toggleClass('running', toggle);
    		$btn.toggleClass('stop', toggle);
    	}
    	this.unlock = function(){
    		locked = false;
    		$wrap.css('opacity', 1);
    		$btn.css('opacity', 1);
    	}
    	this.lock = function(){
    		javascript_countdown.stop();
    		$wrap.css('opacity', 0.3);
    		$btn.css('opacity', 0.3);
    		locked = true;
    	}
    	this.pressedButton = function(stopped){
    		if(locked) return false;
    		if(!stopped) startDeal();
    		else stopDeal();
    	}
    	function startDeal(){
    		var seconds = sliderControl.getTime();
    		//log('starting',controller.toggleCountdown);
    		$.post('ajax/deal.php?type=deals',{action:'start',model:{template_id:activeTemplate,seconds: seconds}},function(data){
    			log(JSON.stringify(data));
    			if(data.success == 'true'){
    				var end = data.data.end;
    				$deal.attr('started','true');
    				$deal.attr('endtime',end);
    				controller.toggleCountdown(true,activeTemplate,end);
    			}
    		},'json');
    	}
    	function stopDeal(){
    	}
    	function showSlider() {
    		$btnText[0].innerHTML = 'Start deal';
    		sliderControl = new DurationSlider();
    	}
    	function showCountdown(end) { 
    		var timestamp = parseInt(new Date().getTime()/1000);
    		countdown = end-timestamp;
    		$btnText[0].innerHTML = 'Udsolgt';
    		javascript_countdown.start(countdown);
    	}
    }
	
	// Slider nav for deals
    var DealsSlider = function() {
    	if($container <= 0) return false;
    	var $container 		= $('#deal-slider'),
    		$slides			= $('.royalSlide', $container);
    		dealController 	= new DealController();  	
    	var slider = $container.royalSlider({
    		directionNavEnabled: false,
    		slideTransitionSpeed: 800,
    		slideTransitionEasing: 'easeInOutExpo',
    		controlNavEnabled: true,
    		autoScaleSlider: true,
    		autoScaleSliderWidth: 320,
    		autoScaleSliderHeight: 110,
    		dragUsingMouse: false,
    		disableTranslate3d: false,
    		beforeSlideChange:function(){
    			dealController.lock();
    		},
    		afterSlideChange: function() {
    			var currSlideNum	= slider.currentSlideId,
    				slideSelector	= '.royalSlide:nth-child(' + (currSlideNum + 1) + ')';
    				$currSlide		= $(slideSelector, $container);
    				$deal = $(slideSelector + ' .deal');
    			var templateId = $deal.attr('templateid');
    			$slides.each(function() {
    				$(this).toggleClass('current', ($(this)[0] == $currSlide[0]));
    			});
    			var started = $deal.attr('started');
    			if (started == 'true'){
    				var end = $deal.attr('endtime');
    				dealController.toggleCountdown(true,templateId,end);
    			}
    			
    			else dealController.toggleCountdown(false,templateId);
    		},
    		allComplete: function() {
    			slider.updateSliderSize();
    		}
    	}).data('royalSlider');
    };
    //javascript_countdown.start(1000,'countdownTimer');
    $(function(){
    	var dealsSlider = new DealsSlider();
    });
});