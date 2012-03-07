/* Author:
	Anders Hoeedholt
*/

$(function() {
    $('ul.nav a').bind('click',function(event){
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
        FB.api('/me', function(response) {
            console.log("Facebook login");
            console.log(response);
          //X.get(WEB_ROOT +"/ajax/subscribe.php?action=do_fb_subscribe&email=" + response.email + "&real_name=" + response.name + "&gender=" + response.gender + "&username=" + response.username + "&id=" + response.id);
        });
      } else {

      }
    }, {scope: 'email'});
}














