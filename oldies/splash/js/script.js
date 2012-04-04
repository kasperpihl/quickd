/* Author: Jens Ahrengot Boddum – QuickD */

//	Enables the use of console logging (through log('whatever') without breaking IE
window.log = function() {
  log.history = log.history || [];
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

$(function() {
	init();
});
function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
} 
function init() {
	outputTime();
	// Non-visual logic that we can do before the page animates in...
	$('#email').val("");
	$(".betasignup").click(function(e) {
	  if(validateEmail($('#email').val())){
      	e.preventDefault();
	      	$.post("register.php", { email: $('#email').val() }, function(data) {
	  			if (data.success == true) {
	      			$('#betasignup').fadeOut(200);
	      			$('#email').val(" ").addClass('loader');
	  				setTimeout(function() {
	  					$('#email').removeClass('loader').val("Tak! Din registrering er modtaget.").attr('disabled','disabled').blur();
	  				}, 1000);
	  			}
			});
		}
    });
    
    
    
	pageTransitionIn(function() {
		var $consumerEmailInput = $('#consumer-signup input[type=email]'),
			$leftLine 		= readMoreView.elements.$leftLine,
			$rightLine 		= readMoreView.elements.$rightLine,
			$dealerSlider 	= $('#dealer-slider');
		
			// Get default element width and position
			$leftLine.data({
				startW: $leftLine.width(),
				startX: $leftLine.css('left'),
				endX: 0,
				endW: parseInt($leftLine.css('left').replace('px', '')) + $leftLine.width()
			});
			
			$rightLine.data({
				startW: $rightLine.width(),
				startX: $rightLine.css('left'),
				endX: $rightLine.css('left'),
				endW: 550 - parseInt($rightLine.css('left').replace('px', ''))
			});
			
			readMoreView.elements.$btn.click(function() {
				if(readMoreView.isOpen) readMoreView.close(550);
				else readMoreView.open(950);
			});
			
			readMoreView.elements.$btn.hover(function() {
				readMoreView.peakOpen(400);
			}, function() {
				readMoreView.peakClose(600);
			});
			
			// This needs to be called at the bottom AFTER default el width/pos has been recorded.
			readMoreView.close(0);
	});
}

function outputTime() {
	var d = new Date();

	var curr_hour = d.getHours();
	var curr_min = d.getMinutes();

	if (curr_hour.toString().length < 2) {
		curr_hour = "0" + curr_hour.toString();
	}
	
	if (curr_min.toString().length < 2) {
		curr_min = "0" + curr_min.toString();
	}
	
	$('#clock').html(curr_hour + "<span class='time-divider'>:</span>" + curr_min);
	
	setTimeout(outputTime, 1000);
}

function pageTransitionIn(callback) {
	$('#container').animate({opacity: 1}, 500, function() {
		setTimeout(function() {
			$('#left-phone').animate({ left: '-53px', opacity: 1.0 }, 700, 'easeOutSine');
		  	$('#right-phone').delay(150).animate({ right: '-45px', opacity: 1.0 }, 900, 'easeOutSine');
			$('#top-phone').delay(450).animate({ top: -40, opacity: 1.0 }, 1100, 'easeOutExpo');
			$('#tagline').delay(1100).animate({ opacity: 0.8 }, 500);
			$('#logo').delay(700).animate({ opacity: 0.8 }, 500);
		}, 200);
	});
	
	//$('#top-phone-background').animate({opacity: 0.0 }, 100);
	
	$('.screenshots').delay(5000).animate({ opacity: 1.0 }, 200);
    $('.screenshots').cycle({
		fx: 'scrollLeft',
		easing: 'easeOutQuart' // choose your transition type, ex: fade, scrollUp, shuffle, etc...
	});
	
	// add code later
	callback();
}

/*
 * READ MORE VIEW
 * Handles animation for the read more section
 */
var readMoreView = {
	elements: {
		$leftLine: $('#read-more-btn .left-line'),
		$rightLine: $('#read-more-btn .right-line'),
		$btn: $('#read-more-btn .btn')
	},
	$readMoreSection: $('#read-more'),
	isOpen: true,
	open: function(duration) {
		readMoreView.isOpen = true;
	
		// Animate buttons
		this.elements.$leftLine.animate({
			left: this.elements.$leftLine.data('endX'),
			width: this.elements.$leftLine.data('endW')
		}, duration, 'easeInOutSine');
		
		this.elements.$rightLine.animate({
			left: this.elements.$rightLine.data('endX'),
			width: this.elements.$rightLine.data('endW')
		}, duration, 'easeInOutSine');
		
		//	Animate read more view
		this.$readMoreSection.fadeIn(duration, 'easeInOutSine').addClass('active');
		
		// Scroll browser window
		if(!Modernizr.touch) $.scrollTo('#read-more-btn', {duration: duration});
	},
	close: function(duration) {
		// Animate buttons
		this.elements.$leftLine.animate({
			left: this.elements.$leftLine.data('startX'),
			width: this.elements.$leftLine.data('startW')
		}, duration, 'easeInOutSine');
		
		this.elements.$rightLine.animate({
			left: this.elements.$rightLine.data('startX'),
			width: this.elements.$rightLine.data('startW')
		}, duration, 'easeInOutSine');
		
		// Animate read more view
		this.$readMoreSection.slideUp(duration, 'easeInOutSine', function() {
			readMoreView.isOpen = false;
		}).removeClass('active');
	},
	peakOpen: function (duration) {	
		if (!this.isOpen) {
		
			this.elements.$leftLine.animate({
				left: parseInt(this.elements.$leftLine.data('startX').replace('px', '')) - 30,
				width: this.elements.$leftLine.data('startW') + 30
			}, duration, 'easeInOutSine');
			
			this.elements.$rightLine.animate({
				left: this.elements.$rightLine.data('startX'),
				width: this.elements.$rightLine.data('startW') + 30
			}, duration, 'easeInOutSine');
		}	
	},
	peakClose: function(duration) {
		if (!this.isOpen) {
			this.elements.$leftLine.animate({
				left: this.elements.$leftLine.data('startX'),
				width: this.elements.$leftLine.data('startW')
			}, duration, 'easeOutElastic');
			
			this.elements.$rightLine.animate({
				left: this.elements.$rightLine.data('startX'),
				width: this.elements.$rightLine.data('startW')
			}, duration, 'easeOutElastic');
		}
	}
}


