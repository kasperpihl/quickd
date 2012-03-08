/* Author:
	Anders Hoeedholt
*/

$(function() {
    $('a').bind('click',function(event){
        var $anchor = $(this);
 
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500,'easeInOutExpo');
        /*
        if you don't want to use the easing effects:
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000);
        */
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
        oauth      : true,
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
            //data = JSON.parse(data);
            console.log(data);
            /*if (data.success == 'true') {
                //Successfully logged in!!
                $('#start_text').fadeOut('fast');
                $('#response_text').fadeIn('fast');
                $('#btn_fb_signup').hide();
                $('#btn_fb_like').css('visibility', 'visible');
            }*/
        }, 'html');
            
        
      } else {

      }
    }, {scope: 'email'});
}














