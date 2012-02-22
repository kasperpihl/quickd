/*
 * Hæhæhæhæ 
 * - Jens
 *
 */
(function($) {
	$.fn.analogueClock = function(options) {
		var defaultOptions = {
			radius: 50,
			strokeW: 3,
			color: 'black'
		}	
			
		var options = $.extend(defaultOptions, options);
		
		var elementID = this.attr('id');
		//console.log('Building new clock in element: ' + elementID);
		
		var size 	= (options.radius * 2) + (options.strokeW * 2),
			paper 	= new Raphael(elementID, size, size),
			circle 	= paper.circle(options.radius + (options.strokeW >> 1), options.radius + (options.strokeW >> 1), options.radius),
			hour	= paper.path("M" + (options.radius + (options.strokeW >> 1)) + "," + (options.radius + (options.strokeW >> 1)) + "V" + (options.strokeW + 2)),
			minute	= paper.path("M" + (options.radius + (options.strokeW >> 1)) + "," + (options.radius + (options.strokeW >> 1)) + "V" + (options.strokeW + 1)),
			atts	= {'stroke-width': options.strokeW, 'stroke': options.color};
		
		circle.attr(atts);
		hour.attr({'stroke-width': 2, 'stroke': options.color});
		minute.attr({'stroke-width': 2, 'stroke': options.color});
		
		var getTime = function() {
			var now = new Date();
			return { hour: now.getHours(), minute: now.getMinutes() };
		}
		
		function updateClock() {
			var time = getTime();
			if (time.hours > 12) time.hours -= 12;
			
			var hourRotation = 360 / 12 * time.hour;
			var minRotation = 360 / 60 * time.minute;
			
			hour.rotate(hourRotation, options.radius + (options.strokeW >> 1), options.radius + (options.strokeW >> 1));
			minute.rotate(minRotation, options.radius + (options.strokeW >> 1), options.radius + (options.strokeW >> 1));
			
			setTimeout(updateClock, 60000);
		}
		
		updateClock();
	}
})(jQuery);