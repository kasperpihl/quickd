<? require_once('../config.php');
$betakey = false;
if(!isset($_SESSION['userbeta'])){
    if(isset($_COOKIE['betakey'])) $betakey = $_COOKIE['betakey'];
    else if(isset($_GET['betakey'])) $betakey = $_GET['betakey'];
    $user = validateBetakey($betakey);
    if(isset($_GET['betakey'])) redirect();
}
else $user = $_SESSION['userbeta'];
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

        <title>QuickD</title>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3&sensor=true"></script>
         <!-- Sencha Touch -->
        

        <!-- Styling -->
        <link rel="stylesheet" href="<?= ROOT_URL ?>touch/resources/css/sencha-touch.css" type="text/css" /> 
      	<link rel="stylesheet" href="<?= ROOT_URL ?>resources/css/example.css" type="text/css" />
        <link rel="stylesheet" href="<?= ROOT_URL ?>resources/css/kasper.css" type="text/css" />
        
        <script type="text/javascript" src="<?= ROOT_URL ?>touch/builds/sencha-touch-all-compat.js"></script>
        <!--<script type="text/javascript" src="<?= ROOT_URL ?>touch/sencha-touch-all.js"></script>-->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="<?= LIBS_URL ?>jquery/jquery-1.7.min.js"><\/script>')</script>
        <script src="<?= LIBS_URL ?>jquery/jquery.color.js"></script>
        <script> 
            var IMG_URL = "<?= IMAGES_URL ?>";
            var userbeta = "<?= $user ?>";
        </script>
        
        <!-- Application -->
        <script type="text/javascript" src="<?= ROOT_URL ?>app.js"></script>
        <script type="text/javascript" src="<?= ROOT_URL ?>app/function.js"></script>
        <script type="text/javascript" src="<?= ROOT_URL ?>app/libs/countdown.js"></script>

        <script src="<?= ROOT_URL ?>app/libs/Raf.js"></script>
        <script src="<?= ROOT_URL ?>app/libs/Animate.js"></script>
        <script src="<?= ROOT_URL ?>app/libs/Scroller.js"></script>
        <script src="<?= ROOT_URL ?>app/libs/EasyScroller.js"></script>

        <!-- Live Reload -->
        <!--<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
        -->
    </head>

    <body></body>
</html>