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
		else if (value < 20 || value > 100) target.addClass('badValue');
		else target.removeClass('badValue');
	}
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
	if (!i) i=0;
	if (i<10)
	{
	  i="0" + i;
	}
	return i;
}

function getTimeString(timestamp, alt, roundTo) {
	if (timestamp) var date=new Date(timestamp);
	else var date = new Date();
	var day=date.getDate(),
			month=(date.getMonth()+1),
			year=date.getFullYear();
	
		
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

function roundToMinutes(date, roundTo) {
	if (!roundTo) var roundTo = 15;
	if (!date) var date = new Date();
	var h = date.getHours(),
			m = date.getMinutes(),
			m2 = m ? Math.ceil(m/roundTo)*roundTo : m,
			h2 = Math.floor(m2/60);
	if (h2) date.setHours(h+h2);
	date.setMinutes(m2%60);
	return date
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
function convertToTimestring(number, returnSeparate) {
	var numbers = number.split(/[\s\.,:]+/),
			h = parseInt(numbers[0], 10),
			m = parseInt(numbers[1], 10);
	if (h>99) {
		h=h%10000;
		m = h%100;
		h = Math.floor(h/100);
	}
	if (!m) m=0;
	if (!h) h=0;
	if (returnSeparate) return {h: h, m: m};
	else return padNumber(h)+':'+padNumber(m);
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
		return me;
	}
	$.fn.shakeBox = function(emptyField){
		var me = $(this),
			dur = 50,
			distance = 30,
			position = me.css('position');
		me.css('position','relative');
		for (i=5;i>=1;i--){
			var max = -(i*2);
			var min = (i == 1) ? 0 : (i*2);
			me.animate({left:max},{duration:dur}).animate({left:min},{duration:dur});
		}
		me.css('position', position);
		if(emptyField) me.find('input').filter(':last').val('').focus();
		else me.find('input').filter(':nth-child(2)').focus().select();
		return me;
	}

	$.fn.hiddenHeight = function() {
		var me = $(this),
				height = 0;

		if (!me.is(':visible')) {
			var position = me.css('position'),
					display = me.css('display');
			me.css({'position':'absolute','visibility':'hidden','display':'block'});
			height = me.height();
			me.css({'visibility':'visible', 'position':position, 'display':display});
		} else {
			height = me.outerHeight();
		}
		return height;
	}

	$.fn.verticalAlign = function(noResize, options) {
		var me = $(this);
		var parent = me.parent();
		if (options && options.meHeight) var meHeight = options.meHeight;
		else var meHeight = me.outerHeight();
		var parentHeight = parent.outerHeight();
		var newY = Math.round((parentHeight/2)-(meHeight/2));
		if (options && options.offset) newY += options.offset;
		//log(me);
		//log(parent);
		//if (me.attr('id') =='start_deal') log('parent: '+parentHeight+' me: '+meHeight+' newY: '+newY);
		//if (options && options.animate) log("animating!");
		if (options && options.animate && me.is(':visible')) me.css({position:'absolute', top:me.position().top}).animate({ top: newY }, {duration:1000, easing:'easeOutExpo',queue:false});
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
						me.find(option.submitKey).click();
						el.blur();
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
					predelay:100,
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
		return me;
	}
	$.fn.formSetState = function(state, animate) {
		var me = $(this),
				editBtn = me.find('.edit-btn'),
				cancelBtn = me.find('.cancel-btn');
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
			if (editBtn) editBtn.html("Rediger").removeClass("blue");
			if (cancelBtn) cancelBtn.hide();
		} else if(state=='edit') {
			me.find('input[type=text], input[type=password], textarea, .category').each(function(){
				$(this).removeAttr('readonly').removeClass('readonly');
			});
			if (editBtn) editBtn.html("Gem").addClass("blue");
			if (cancelBtn) cancelBtn.show();
		}
		return me;
	}
	$.fn.createMask = function(onClick, classes, level) {
		var me = $(this);
		if (!classes) var classes = "";
		else classes = " "+classes;
		if (!level&&level!==0) var level = 1;
		//log("mask", me);
		if (me.attr('id')) var id = me.attr('id')+"-mask";
		else var id = me.get(0).tagName+"-mask";
		id = id+'_'+level;
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
		mask.css({display:'block', opacity:0, zIndex:(50-1+level*2)})
		mask.animate({opacity: 0.7}, 400, function() {
		   	if (onClick) {
			   	$(this).click(onClick);
			 	}
	  });
		return me;
	}
	
	$.fn.removeMask = function(duration, callback, level) {
		var me = $(this),
				mask;
		if(!level&&level!==0) var level = 1;
		if (me.attr('id')) var id = me.attr('id')+"-mask";
		else var id = me.get(0).tagName+"-mask";
		id = id+'_'+level;
		mask = me.find('#'+id);
		if(duration) {
			mask.fadeOut(duration, function() {
				mask.remove();
				if (callback) callback();
			});
		} else mask.remove();
		if (!me.is('body')) me.removeClass('inactive');
		return me;
	}
	$.validator.addMethod('saving', function() {
	   var orig = convertNumber($('#orig_price').val());
	   var deal = convertNumber($('#deal_price').val());
	   if (orig && deal) var discount = calcDiscount(orig, deal);
	   var r = ((orig && deal) && (isNaN(discount) || discount < 20));
	   //console.log("Return? "+r);
	   return !r;
	}, "Den valgte besparelse er ikke tilstrækkelig stor");
	
	$.validator.addMethod('danishNumber', function(val, el) {
	   var number = convertNumber(val, false);
	   return !isNaN(number) && number>0;
	}, "Det indtastede er ikke et korrekt tal");

	$.validator.addMethod('timeFormat', function(val, el) {
	   var time = convertToTimestring(val, true);
	   return time && time.h >= 0 && time.h < 24 && time.m >= 0 && time.m<60;
	}, "Indtast venligst korrekt klokkeslæt");
	
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

	$.fn.getHiddenDimensions = function(includeMargin) {
    var $item = this,
        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
        dim = { width:0, height:0, innerWidth: 0, innerHeight: 0,outerWidth: 0,outerHeight: 0 },
        $hiddenParents = $item.is(':visible')?$([]):$item.parents().andSelf().not(':visible'),
        includeMargin = (includeMargin == null)? false : includeMargin;
 
    var oldProps = [];
    $hiddenParents.each(function() {
        var old = {};
 
        for ( var name in props ) {
            old[ name ] = this.style[ name ];
            this.style[ name ] = props[ name ];
        }
 
        oldProps.push(old);
    });
 
    dim.width = $item.width();
    dim.outerWidth = $item.outerWidth(includeMargin);
    dim.innerWidth = $item.innerWidth();
    dim.height = $item.height();
    dim.innerHeight = $item.innerHeight();
    dim.outerHeight = $item.outerHeight(includeMargin);
 
    $hiddenParents.each(function(i) {
        var old = oldProps[i];
        for ( var name in props ) {
            this.style[ name ] = old[ name ];
        }
    });
 
    return dim;
	};
});