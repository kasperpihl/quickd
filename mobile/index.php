<? require_once('../config.php');?>
<? //if(!$uagent->DetectTierIphone()) header('Location: http://quickd.dk'); ?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

        <title>QuickD</title>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
        <!-- Sencha Touch -->
        <script type="text/javascript" src="touch/builds/sencha-touch-all-compat.js"></script>

        <!-- Styling -->
        <link rel="stylesheet" href="touch/resources/css/sencha-touch.css" type="text/css" /> 
      	<link rel="stylesheet" href="resources/css/example.css" type="text/css" />
        <link rel="stylesheet" href="resources/css/kasper.css" type="text/css" />
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="<?= LIBS_URL ?>jquery/jquery-1.7.min.js"><\/script>')</script>
        <script src="<?= LIBS_URL ?>jquery/jquery.color.js"></script>
        <script> var IMG_URL = "<?= IMAGES_URL ?>";</script>
        
        <!-- Application -->
        <script type="text/javascript" src="app.js"></script>
        <script type="text/javascript" src="app/function.js"></script>

        <!-- Live Reload -->
        <? /*<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script> */ ?>
    </head>

    <body></body>
</html>