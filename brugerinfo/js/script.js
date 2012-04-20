/* Author:
  Anders Hoeedholt
*/

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
/*var isScrolledIn = false;
$(window).scroll(function(e){
  var scrollTop = $(this).scrollTop();
  if(scrollTop > 50 && isScrolledIn == false){
    isScrolledIn = true;
    $("#scroll-up-btn").fadeIn(500);
    $("#read-more-btn").fadeOut(500);
  }
  else if (scrollTop < 50 && isScrolledIn == true){ 
    $("#scroll-up-btn").fadeOut(500);
    $("#read-more-btn").fadeIn(500);
    isScrolledIn = false;
  }

//  if ($(this).scrollTop() < -5) {
//    $('#bgImage-hand').css('background-position-y', '+=5px');
//  }
});*/

var keys = [37, 38, 39, 40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disable_scroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}

var hijackScroll = function(e) {
  log(e);
  e.preventDefault();
};

$(function() {
    $('a.scroll').bind('click',function(event){
        var $anchor = $(this);
        
        disable_scroll();

        $('html, body').stop(true, true).animate({
          scrollTop: $($anchor.attr('href')).offset().top
        }, 1500,'easeInOutExpo', function() {
          enable_scroll();
        });
        

        event.preventDefault();
    });
});




/**
 * Signup
 * Author: Jeppe Stougaard
 */
//Button clicks
$(function() {
  //Register fb button click
  $('#btn_fb_signup').click(function() { doFBSubscribe();  });

  //Show email
  $('#btn_show_email').click(function() {
    $(this).hide();
    var field = $('#email_fields');
    if (field.is(':visible')) field.slideUp(100);
    else field.slideDown(100, function() { $(this).find('input').focus(); });
  });
  $('#btn_email_signup').click(doEmailSignup);
  $('#email').keypress(function(e) {
    if(e.keyCode === 13) doEmailSignup();
  });
});

//Signup with email
function doEmailSignup() {
  var email = $('#email').val();
  $('#email_fields').find('.error').remove();
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if(email=='') {
  } else if (!emailReg.test(email)) {
    $("#email").after('<span class="error">Indtast venligst en gyldig email.</span>');
  } else {
    $.post(ROOT_URL+"api/subscribe", {email: email}, function(data) {
        //log(data);
        if (data.success == 'true'||(data.success=='false'&& data.error == 'user_exists') ) {
            //Successfully logged in!!
            showResponse();
        } else {
          $("#email").after('<span class="error">Der opstod en fejl. Prøv venligst igen senere.</span>');
        }
    }, 'json');
  }

}

//FB Initialize
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/da_DK/all.js";
  fjs.parentNode.insertBefore(js, fjs);

  window.fbAsyncInit = function() {
      FB.init({
        appId      : '286675801401479',
        status     : true, 
        cookie     : true,
        xfbml      : true,
        oauth      : true
      });
    };
}(document, 'script', 'facebook-jssdk'));

//Signup with Facebook
function doFBSubscribe() {
    var spinner = $('<img />').attr('src',ROOT_URL+'img/loader.png').addClass('spinning-loader');
    FB.login(function(response) {
      if (response.authResponse) {
        $('#btn_fb_signup').width($('#btn_fb_signup').outerWidth());
        $('#btn_fb_signup').html(spinner);
        $('#start_text').fadeOut('slow');
        var f = $('#btn_fb_like').find('iframe');
        if (f) f.attr('src', f.attr('src'));
        
        $.post(ROOT_URL+"api/fbconnect", {}, function(data) {
            //console.log(data);
            if (data.success == 'true') {
                //Successfully logged in!!
                showResponse();
            }
        }, 'json');
        
      } else {

      }
    }, {scope: 'email'});
}

function showResponse() {
  if ($('#start_text').is(':visible')) $('#start_text').hide();
  $('#response_text').fadeIn('slow');
  $('#btn_show_email').hide();
  $('#btn_fb_like').width($('#btn_fb_signup').width());
  $('#btn_fb_signup').hide();
  $('#btn_fb_like').show();
  $('#email_signup_area').slideUp();
}

/**
 * Background scaler plugin
 * Author: Jens Ahrengot Boddum
 */

// Cross-browser polyfill for Object.create
if (typeof Object.create !== 'function') {
  Object.create = function(obj) {
    function F() {}
    F.prototype = obj;
    return F();
  };
}

(function($, window, document, undefined) {
  var ScalingBackground = {
    init:function(options, el) {
      var self = this;
      self.$el = $(el);
      self.url = (typeof options === 'string') ? options : options.imgURL;
      self.options = $.extend({}, $.fn.scalingbackground.options, options);

      this.addBackground();
    },
    addBackground: function() {
      console.log('adding background');
      $('body').prepend('<div><img class="scalingbackground" src="' + this.options.imgURL + '" /></div>');
    },
    handleResize: function(e) {

    }
  };

  $.fn.scalingbackground = function(options) {
    return this.each(function() {
      var bg = Object.create(ScalingBackground);
      bg.init(options, this);
    });
  };

  $.fn.scalingbackground.options = {
    imgURL: 'no image found'
  };

})(jQuery, window, document);

// $(document.body).scalingbackground('http://lorempixum.com/1280/800/nature/1');







