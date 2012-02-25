
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
$(document).bind('mobileinit', function() {
	$.mobile.ajaxEnabled = false;
});
$(document).bind('pageinit', function() {
    log('init');
    $('#user,#password').keydown(function(){
        if($('#user').hasClass('animated shake fail')) $('#user').removeClass('animated shake fail');
        if($('#password').hasClass('animated shake fail')) $('#password').removeClass('animated shake fail');
    });
    $('#login').submit(function(){
        $.post('ajax/login.php',{email:$('#user').val(),password:$('#password').val()},function(data){          
            if(data.success == 'true') document.location = './';
            else {
                if(data.error == 'username_not_exist'){
                    $('#user').addClass('animated shake fail');
                    $('#user').val('');
                } 
                else if(data.error == 'wrong_pass'){
                    $('#password').addClass('animated shake fail');
                    $('#password').val('');
                } 
            }
        },'json');
        return false;
    });
    
});
