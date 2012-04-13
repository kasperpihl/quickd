var javascript_countdown = function () {
	var time_left = 10; //number of seconds for countdown
	var output_element_id = 'countdownTimer';
	var keep_counting = 0;
	var no_time_left_message = 'No time left for JavaScript countdown!';
 	var stop_showing = 0;
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
			countdown();
			if(!stop_showing) show_time_left();
		},
		timer: function () {
			javascript_countdown.count(); 			
			if(keep_counting) {
				setTimeout("javascript_countdown.timer();", 1000);
			}
		},
		setTimeLeft: function (t) {
			time_left = t;
		},
		stop: function(){
			stop_showing = 1;
		},
		start:function(t){
			time_left = t;
			stop_showing = 0;
			show_time_left();
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