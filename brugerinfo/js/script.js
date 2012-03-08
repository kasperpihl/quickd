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


//Part for Facebook signup
(function(d){
    var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    d.getElementsByTagName('head')[0].appendChild(js);


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
}(document));

 function doFBSubscribe() {
    FB.login(function(response) {
      if (response.authResponse) {
        $('#btn_fb_signup img').fadeOut('fast');
        
        $.post("api/fbconnect", {}, function(data) {
            data = JSON.parse(data);
            console.log(data);
            if (data.success == 'true') {
                //Successfully logged in!!
                $('#btn_fb_signup').hide();
                $('#registration_response').show();
            }
        }, 'json');
            
        
      } else {

      }
    }, {scope: 'email'});
}














