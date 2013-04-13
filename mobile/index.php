<? require_once('../config.php');
//$live = true;
//die(unsetBetakey());
$isDesktop = (isset($_SESSION['desktop'])) ? $_SESSION['desktop'] : !$uagent->DetectTierIphone();
$isIphone = (isset($_SESSION['iphone'])) ? $_SESSION['iphone'] : $uagent->DetectIphone();
if(!isset($_SESSION['iphone'])) $_SESSION['iphone'] = $isIphone;
$betakey = false;
if(!isset($_SESSION['userbeta_email'])){
	if(isset($_COOKIE['betakey'])) $betakey = $_COOKIE['betakey'];
	else if(isset($_GET['betakey'])) $betakey = $_GET['betakey'];

	$user = validateBetakey($betakey);
	if(isset($_GET['betakey']) && !$isIphone) redirect();
}
else $user = $_SESSION['userbeta_email'];
$sendmail = (isset($_SESSION['sendmail']) && $_SESSION['sendmail']);
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<title>QuickD</title>
	
	<!--Sencha Touch -->
	<meta property="og:title" content="QuickD" />
	<meta property="og:description" content="En ny måde at handle på - snart i din by."/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://beta.quickd.com" />
	<meta property="og:image" content="<?=ROOT_URL?>resources/images/logo_medium.jpg" />
	<meta property="og:site_name" content="QuickD" />
	<meta property="fb:admins" content="508608046" />

	<!-- Styling -->
	<link rel="stylesheet" href="<?= ROOT_URL ?>touch/resources/css/sencha-touch.css" type="text/css" /> 
	<link rel="stylesheet" href="<?= ROOT_URL ?>resources/css/example.css" type="text/css" />
</head>
<body>
	
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script>window.jQuery || document.write('<script src="<?= LIBS_URL ?>jquery/jquery-1.7.min.js"><\/script>')</script>
	<script src="<?= LIBS_URL ?>jquery/jquery.color.js"></script>
	<script> 
		var isDesktop = "<?= $isDesktop ?>";
		var isIphone = "<?= $isIphone ?>";
		var ROOT_URL = "<?= ROOT_URL ?>";
		var IMG_URL = "<?= IMAGES_URL ?>";
		var userbeta = "<?= $user ?>";
		var sendmail = "<?= $sendmail ?>";
	</script>
	
	<!-- Application -->
	<script src="<?= ROOT_URL ?>app/function.js"></script> 
	<script src="<?= ROOT_URL ?>app/libs/countdown.js"></script>
	<script src="<?= ROOT_URL ?>app/libs/scroller-min.js"></script>
	<script src="<?= ROOT_URL ?>app/libs/EasyScroller.js"></script>
	<?php if($live): ?>
	<script src="<?= ROOT_URL ?>touch/sencha-touch.js"></script>
	<script src="<?= ROOT_URL ?>app-all.js"></script>
	<? else: ?>
	<script src="<?= ROOT_URL ?>touch/sencha-touch-debug.js"></script>
	<script src="<?= ROOT_URL ?>app.js"></script>
	<? endif; ?>
	
	<script src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>

	<script>
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-31044041-1']);
		_gaq.push(['_setDomainName', 'quickd.com']);
		_gaq.push(['_trackPageview']);

		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	</script>
</body>
</html>