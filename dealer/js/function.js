var loadedTemplates = {};
function timeAgo(time) {
    var date = new Date(time),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 ) {
            return;
    }

    return day_diff == 0 && (
		diff < 120 && "Lige nu" ||
		diff < 3600 && Math.floor( diff / 60 ) + " minutter siden" ||
		diff < 7200 && "1 time siden" ||
		diff < 86400 && Math.floor( diff / 3600 ) + " timer siden") ||
		day_diff == 1 && "Igår" ||
		day_diff < 7 && day_diff + " dage siden" ||
		day_diff < 10 && "Omkring en uge siden" ||
		day_diff < 17 && "Omkring to uger siden" ||
		day_diff < 28 && Math.ceil( day_diff / 7 ) + " uger siden" ||
		day_diff > 28 && "Over 1 måned siden" ;
}
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
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
	{console.log();return window.console;}catch(err){return window.console={};}})());
	
function hasOwnProperty(obj, prop){
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}
function calcDiscount(orig, deal, target_id) {
	if (target_id) var target = $(target_id);
	var target_input = $(target_id+"-input");
	if (!orig || !deal || isNaN(orig) || isNaN(deal)) {
		if (target) {
			target.html("-");
			if (target_input) target_input.val(0);
			target.addClass('badValue');
		} else return "-";
	} else {
		var value = Math.floor((orig-deal)/orig * 100);
		if (!target) return value;

		target.html(value+"%");
		if (target_input) target_input.val(value);
		if (value <= 0) { target.html("-"); target.addClass('badValue'); }
		else if (value < 25 || value > 100) target.addClass('badValue');
		else target.removeClass('badValue');
	}
}

function getAddress(request, response,count) {
	if (!count) count=3;
	var term = request.term + ' , Denmark';
      	
	geocoder.geocode( {'address': term }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) { 
		}
			var i = 0;           		
		  response($.map(results, function(item) {
			i++;
			if(i>count) return;
			return {
			  label: item.formatted_address,
			  value: item.formatted_address,
			  postal_code: item.postal_code,
			  latitude: item.geometry.location.lat(),
			  longitude: item.geometry.location.lng()
			}
		  }));
		
	});
}

function GMapInitialize(){
//MAP
  
  
  //GEOCODER
  geocoder = new google.maps.Geocoder();

  $("#shop_address").autocomplete({
      minLength: 4,
	  appendTo: "#welcome_add_shop",
	  //This bit uses the geocoder to fetch address values
      source: function(request, response) {getAddress(request, response)},
      //This bit is executed upon selection of an address
     select: function(event, ui) {
        $("#shop_lat").val(ui.item.latitude);
        $("#shop_long").val(ui.item.longitude);
        $('#shop_form_address').val(ui.item.label);
        
      }
    });
  
  
				
}
function stampToTime(stamp){
	var date = new Date(stamp*1000);
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = date.getMinutes();
	// seconds part from the timestamp
	var seconds = date.getSeconds();

	// will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes + ':' + seconds;
	return formattedTime;
}
function padNumber(i) {
	if (i<10)
	{
	  i="0" + i;
	}
	return i;
}

function getTimeString(timestamp, alt, roundTo) {
	if (timestamp) var date=new Date(timestamp);
	else var date = new Date();
	var day=date.getDate();
	var month=(date.getMonth()+1);
	var year=date.getFullYear();
	
		
	if (roundTo) {
		var plusMin = (Math.ceil(date.getMinutes()/roundTo) * roundTo)
		var m = padNumber(plusMin % 60);
		var h=padNumber((date.getHours()+Math.floor(plusMin/60))%24);
	} else {
		var m = padNumber(date.getMinutes());
		var h = padNumber(date.getHours());
	}
	
	//var s=padNumber(date.getSeconds());
	if (alt && alt=='simple') {
		if (date.toDateString() == Date.today().toDateString()) var r = "I dag";
		else if (date.toDateString() == Date.parse('yesterday').toDateString()) var r = "I går";
		else var r = day+"/"+month+" "+year;
		
		r = r + ", kl. "+h+":"+m;
		return r;
		
	} else if (alt) {
		month = padNumber(month);
		day = padNumber(day);
		return day+'-'+month+'-'+year+' '+h+':'+m;
	} else return month+'-'+day+'-'+year+' '+h+':'+m;
}

function dateToAmr(dateString, format) {
	if (!format) var format = ['dd-MM-yyyy HH:mm','dd-MM-yyyy '];
	if (dateString) return Date.parseExact(dateString, format);
}

function convertNumber(number, toString) {
	if (toString) {
		number = parseFloat(number);
		number = ""+number.toFixed(2);
		return number.replace('.', ',');
	} else {
		return parseFloat(number.replace(',','.').replace(' ',''))
	}
}

function resizeBg(stopRecursion) {
	var img = $('#bgImage');
	var content = $('#content');
	var width = content.width();
	var height = content.height();
	var imgW = img.width();
	var imgH = img.height();
	if (imgW/width < imgH/height) height = width * imgH/imgW;
	else width = height * imgW/imgH;

	img.css({width: width+'px', height:height+'px'});
	if (!stopRecursion) {
		img.fadeIn(500);
		$(window).resize(function(){
			resizeBg(true);
		});
	}
}


X = {};
X.input = {};
X.input.iblur = function () {
    var v = jQuery(this).attr('value');
    var t = jQuery(this).attr('xtip');
    if (v == t || !v) {
        jQuery(this).attr('value', t);
        jQuery(this).css('color', '#999')
    }
};
X.input.iclick = function () {
    var v = jQuery(this).attr('value');
    var t = jQuery(this).attr('xtip');
    if (v == t) {
        jQuery(this).attr('value', '')
    }
    jQuery(this).css('color', '#333')
};
X.input.hideLabel = function() {
	var i = $(this);
	var v = i.val();
	
	var label = i.prev('.label');
	
	if (v||v!="") label.hide(100);
	else label.show(100);
};
X.input.optionalLabel = function() {
	var i = $(this);
	var v = i.val();
	var label = i.prev('.label');
	
	if (v||v!="") {
		i.removeClass('optional');
		label.removeClass('optional');
	} else {
		i.addClass('optional');
		label.addClass('optional');
	}
};

String.prototype.trunc = function(n,useWordBoundary){
	 var toLong = this.length>n, s_ = toLong ? this.substr(0,n-1) : this;
	 s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	 return  toLong ? s_ +'…' : s_;
};
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


//Extending jQuery
$(function() {
	$.fn.centerBox = function(){
		var me = $(this);
		
		var loginWidth =me.width();
		var loginHeight = me.height();
		var documentWidth = $(document).width();
		var documentHeight = $(document).height();
		var loginX = (documentWidth/2)-(loginWidth/2);
		var loginY = (documentHeight/2)-(loginHeight/2);
		me.css({position:'absolute',left:loginX,top:loginY});
	}
	$.fn.shakeBox = function(){
		var me = $(this);
		var x = me.position().left;
		var dur = 50;
		var distance = 30;
		for (i=5;i>=1;i--){
			var max = x-(i*2);
			var min = x+(i*2);
			me.animate({left:max},dur).animate({left:min},dur);
			
		}
		//me.effect("shake", { times:3 }, 500);
		me.find('input').filter(':last').val('').focus();
	}
	$.fn.verticalAlign = function(noResize, options) {
		var me = $(this);
		var parent = me.parent();
		if (options && options.meHeight) var meHeight = options.meHeight;
		else var meHeight = me.outerHeight();
		var parentHeight = parent.outerHeight();
		var newY = (parentHeight/2)-(meHeight/2);
		if (options && options.offset) newY += options.offset;
		//log(me);
		//log(parent);
		//log('parent: '+parentHeight+' me: '+meHeight+' newY: '+newY);
		if (options && options.animate) me.css({position:'absolute', top:me.position().top}).animate({ top: newY }, {duration:1000, easing:'easeOutExpo',queue:false});
		else me.css({position:'absolute',top:newY});
		if (!noResize) {
			$(window).resize(function(){
				if (me.is(':visible')) me.verticalAlign(true);
			});
		}
		return me;
	}
	$.fn.formValidate = function(option) {
		//console.log("Validating");
		var me = $(this)
		me.addClass('validating');
		if (!option) var option = {};
		
		me.find('textarea, input').each(function() {
			var el = $(this);
			//if (el.attr('type')!='button') 
				//el.click(function(e) { e.stopPropagation(); });
			
			if (option.submitKey && el.is('input') && el.attr('type')!='button' ) {
				el.keypress(function(e) {
					if(e.keyCode == 13) {
						el.blur();
						me.find(option.submitKey).click();
					}
				});
			}
			
			if (el.attr('hideLabel')) {
				el.wrap('<div class="input-wrapper" />');
				el.before("<div class='label hider'>"+el.attr('hideLabel')+"</div>");
				el.addClass('wrapped');
				el.focus(function() {
					el.parent('.input-wrapper').addClass('focus');
				});
				el.blur(function() {
					//if (!el.val() || el.val()=="") 
					el.parent('.input-wrapper').removeClass('focus');
				});
				el.keyup(X.input.hideLabel);
			
			}
			
			if(el.attr('title')) {
				if (option.tooltipOffset) var offsetLeft = option.tooltipOffset;
				else var offsetLeft = el.position().left+15;
				if (option.tooltipPosition) var position = option.tooltipPosition;
				else var position = "center left";
				//console.log("Position: "+el.position().left+" Offset: "+offsetLeft);
				
				el.tooltip({
					position: position,
					offset: [0, -offsetLeft],
					effect: "fade",
					opacity: 0.7		
				});
			}
			
		});
		
		if (!option.errorClass) option.errorClass='errorTip';
		if (!option.errorElement) option.errorElement='div';
		if (!option.errorPlacement) {
			option.errorPlacement= function(error, element) {
				 var parent = element.parents('.field');
				 if (parent) error.appendTo(parent);
				 else error.insertAfter(element);
			}
			
		}
		if (me.is('form')) me.validate(option);
		else me.find('form').each(function() {
			$(this).validate(option);
		});
	}
	$.fn.formSetState = function(state, animate) {
		var me = $(this);
		var button = me.find('.edit-save-button').filter(':first');
		if (state=='readonly' && animate) {
			button.wrap('<div class="loader-small" />');
			setTimeout(
			  function() 
			  {
				button.unwrap();
				button.val('Rediger');
				
				me.find('input[type=text], input[type=password], textarea, .category').each(function(){
					$(this).attr('readonly',1).addClass('readonly');
				});
				
			  }, 500);
		} else if(state=='readonly') {
			me.find('input[type=text], input[type=password], textarea, .category').each(function(){
				$(this).attr('readonly',1).addClass('readonly');
			});
			button.val('Rediger');
		} else if(state=='edit') {
			me.find('input[type=text], input[type=password], textarea, .category').each(function(){
				$(this).removeAttr('readonly').removeClass('readonly');
			});
			//me.find('input[type=text]:first').focus();
			button.val('Gem');
		}
	}
	$.fn.createMask = function(onClick, classes) {
		var me = $(this);
		if (!classes) var classes = "";
		else classes = " "+classes;
		//log("mask", me);
		if (me.attr('id')) var id = me.attr('id')+"-mask";
		else var id = me.get(0).tagName+"-mask";
		if (me.css('position')=='static') me.css('position', 'relative');
		
		if (me.is('body')) {
			var mask = $('<div class="body-mask'+classes+'" id="'+id+'"></div>').hide().appendTo('body');
			mask.css({position:'absolute', width:$(document).width(), height:$(document).height()});
		} else if(me.hasClass('window-container')) {
			var mask = $('<div class="window-mask'+classes+'" id="'+id+'"></div>').hide();
			me.css({position:'relative'}).addClass('inactive').append(mask);
			mask.css({position:'absolute', top:-5, left:-5, bottom:-5,right:-5});
		} else {
			var mask = $('<div class="body-mask'+classes+'" id="'+id+'"></div>').hide().css({position:'absolute', top:0, bottom:0, left:0,right:0});
			me.append(mask);
		}
		if (onClick) mask.fadeIn(400, function() {
						   $(this).click(function() {
								onClick();
						   });
					  });
		else mask.fadeIn(400);
	}
	
	$.fn.removeMask = function() {
		var me = $(this);
		if (me.attr('id')) var id = me.attr('id')+"-mask";
		else var id = me.get(0).tagName+"-mask";
		me.find('#'+id).remove();
		if (!me.is('body')) me.removeClass('inactive');
	}
	$.validator.addMethod('saving', function() {
	   var orig = convertNumber($('#orig_price').val());
	   var deal = convertNumber($('#deal_price').val());
	   if (orig && deal) var discount = calcDiscount(orig, deal);
	   var r = ((orig && deal) && (isNaN(discount) || discount < 25));
	   //console.log("Return? "+r);
	   return !r;
	}, "Den valgte besparelse er ikke tilstrækkelig stor");
	
	$.validator.addMethod('danishNumber', function(val, el) {
	   var number = convertNumber(val, false);
	   return !isNaN(number) && number>0;
	}, "Det indtastede er ikke et korrekt tal");
	
	//console.log(loadedTemplates);
	$.extend($.validator.messages, {
		required: "Du mangler at udfylde dette felt",
		email: "Du skal indtaste en e-mail her",
		digits: "Du kan kun indtaste tal",
		number: "Du skal indtaste et tal her",
		url: "Du skal indtaste en gyldig hjemmeside",
		minlength: jQuery.format("Du skal indtaste mindst {0} tegn!"),
		equalTo: "Indtast venligst det samme i begge felter"
	});
	$.fn.outerHTML = function(s) {
		return s
			? this.before(s).remove()
			: $("<p>").append(this.eq(0).clone()).html();
	};
});