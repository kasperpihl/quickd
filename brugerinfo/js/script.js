/* Author:
  Anders Hoeedholt
*/

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
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
    $('a').bind('click',function(event){
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





//Facebook like
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

    //Register button click
    $('#btn_fb_signup').click(function() { doFBSubscribe();  });
}(document, 'script', 'facebook-jssdk'));

//Facebook signup
/*(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);    
}(document));*/

 function doFBSubscribe() {
    var spinner = $('<img />').attr('src','img/loader.png').addClass('spinning-loader');
    FB.login(function(response) {
      if (response.authResponse) {
        $('#btn_fb_signup').html(spinner);
        $('#start_text').fadeOut('slow');
        
        $.post("api/fbconnect", {}, function(data) {
            data = JSON.parse(data);
            //console.log(data);
            if (data.success == 'true') {
                //Successfully logged in!!
                $('#start_text').fadeOut('fast');
                $('#response_text').fadeIn('fast');
                $('#btn_fb_signup').hide();
                $('#btn_fb_like').show();
                FB.XFBML.parse(); 
            }
        }, 'json');
            
        
      } else {

      }
    }, {scope: 'email'});
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







