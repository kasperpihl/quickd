//time to countdown in seconds, and element ID
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
$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false;
});
$(document).bind('pageinit', function() {
	 $('#user,#password').keydown(function(){
    	if($('#user').hasClass('animated shake fail')) $('#user').removeClass('animated shake fail');
    	if($('#password').hasClass('animated shake fail')) $('#password').removeClass('animated shake fail');
    });
	$('#login').submit(function(){
		$.post('ajax/login.php',{email:$('#user').val(),password:$('#password').val()},function(data){			
			if(data.success == 'true') document.location = './';
			else {
				if(data.error == 'username_not_exist'){
					$('#user').addClass('animated shake fail');
					$('#user').val('');
				} 
				else if(data.error == 'wrong_pass'){
					$('#password').addClass('animated shake fail');
					$('#password').val('');
				} 
			}
		},'json');
		return false;
	});
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
var javascript_countdown = function () {
	var time_left = 10; //number of seconds for countdown
	var output_element_id = 'countdownTimer';
	var keep_counting = 0;
	var no_time_left_message = 'No time left for JavaScript countdown!';
 
	function countdown() {
		if(time_left < 2) {
			keep_counting = 0;
		}
 
		time_left = time_left - 1;
	}
 
	function add_leading_zero(n) {
		if(n.toString().length < 2) {
			return '0' + n;
		} else {
			return n;
		}
	}
 
	function format_output() {
		var hours, minutes, seconds;
		seconds = time_left % 60;
		minutes = Math.floor(time_left / 60) % 60;
		hours = Math.floor(time_left / 3600);
 
		seconds = add_leading_zero( seconds );
		minutes = add_leading_zero( minutes );
		hours = add_leading_zero( hours );
 
		return hours + ':' + minutes + ':' + seconds;
	}
 
	function show_time_left() {		
		$('#'+output_element_id).html(format_output());
	}
 
	function no_time_left() {
		log('finished');
	}
 
	return {
		count: function () {
			if(keep_counting){
				countdown();
				show_time_left();
			}
		},
		timer: function () {
			javascript_countdown.count(); 			
			if(keep_counting) {
				setTimeout("javascript_countdown.timer();", 1000);
			} else {
				no_time_left();
			}
		},
		setTimeLeft: function (t) {
			time_left = t;
			if(keep_counting == 0) {
				javascript_countdown.timer();
			}
		},
		stop: function(){
			keep_counting = 0;
		},
		start:function(t){
			time_left = t;
			if(keep_counting == 0){
				keep_counting = 1;
				javascript_countdown.timer();
			}
		},
		init: function (t,element_id) {	
			//time_left = t;
			output_element_id = element_id;
			//javascript_countdown.timer();
		}
	};
}();