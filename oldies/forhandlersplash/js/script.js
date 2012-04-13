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

function init() {
	$('#email').val("");
	
	$(".dealersignup").click(function(e) {
    	e.preventDefault();
      	$.post("register.php", { email: $('#email').val() }, function(data) {
      		signUpView.transitionOut();
		});
    });
	
	$('#container').animate({opacity: 1}, function() {
		setTimeout(function() {
			$('#dealer-slider .desktop').animate({left: 0}, 700);
			$('#dealer-slider .splash').animate({opacity: 0}, 400);
		}, 2000);
	});
}

var signUpController = {

}

var signUpView = {
	$emailInput: $('#email'),
	transitionOut: function () {
		$('#dealersignup').fadeOut(200);
  		this.$emailInput.val(" ").addClass('loader');
		setTimeout(function() {
			$('#email').removeClass('loader').val("Tak! Din registrering er modtaget.").attr('disabled','disabled').blur();
		}, 1000);
	}
}