<? 
$thisfolder = end(explode('/',dirname(__FILE__)));
if(strpos($_SERVER['REQUEST_URI'], $thisfolder )){
	$newURI = str_replace($thisfolder.'/', '',$_SERVER['REQUEST_URI']);
	session_start();
	$_SESSION['version'] = $thisfolder;
	header('Location: http://'.$_SERVER['SERVER_NAME'].$newURI);
	exit;
}
?>
<!DOCTYPE html>
<html class="no-js" lang="da_DK">
	<head>
		<meta charset="UTF-8"/> 
		<meta name="viewport" content="width=device-width,initial-scale=.9">
		<title>QuickD</title>
		
	    <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.theme.css" media="all" rel="stylesheet" type="text/css"/>
	    <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.selectmenu.css" media="all" rel="stylesheet"/>
	    <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.datepicker.css" media="all" rel="stylesheet"/>
	        
		<link href="<?= ROOT_URL ?>styles/stylesheets/screen.css" media="all" rel="stylesheet"/>
	    <!--[if lt IE 9]>
			  <link href="<?= ROOT_URL ?>styles/stylesheets/ie.css" media="all" rel="stylesheet"/>
	    <![endif]-->
	     
	    <script> var shopowner; var debug = false;	
			var ROOT_URL = "<?= ROOT_URL ?>";
			var API_URL = "<?= API_URL ?>";
			var COMMON_URL = "<?= COMMON_URL ?>";
			var REAL_URL = "<?= REAL_URL ?>";
			var version = "<?= VERSION ?>";
			var IMG_URL = "<?= IMAGES_URL ?>";
			var LIBS_URL = "<?= LIBS_URL ?>";
			var historyObj = JSON.parse('<?= $historyObj ?>');
			var CATEGORIES = JSON.parse('<?=json_encode($categories) ?>');
				<?php if(isset($dealer) && $dealer) { $return = getShopowner();?>
					shopowner = <?= $return; ?>;
				<? } ?>
		</script>
		
		<script src="<?= LIBS_URL ?>modernizr/modernizr-2.0.6.custom.js"></script>
	</head>
	
	
	<body onLoad="resizeBg()">
    <div id="content">
      <img id="bgImage" class="bgImage" style="display:none;" src="<?= ROOT_URL ?>styles/stylesheets/i/bg-test.jpg" />
      <div id="dashboard"></div>
	</div>
		    
	    <script src="<?= LIBS_URL ?>jquery/jquery-min.js"></script>
		<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
	    <script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
	    <script src="<?= ROOT_URL ?>js/function.js"></script>
	    <script src="<?= ROOT_URL ?>js/lang.js"></script>
		
		<!-- Main javascript files to get it all to work -->
		
		<!--[if lt IE 9]>
		<script type="text/javascript">
				$(function() {
					var showModal = function() {
						var msg = "Looks like you're using an outdated browser. \nOld browsers are insecure, slow and make websites behave wonky. \n \nLuckily it's free and easy to upgrade – Just swing by http://browsehappy.com/ Click ok to go there now. \n";
						if (confirm(msg)) window.location.href = "http://browsehappy.com/";
					}
					
					setTimeout(showModal, 1500);
				});
			</script>
		<![endif]-->

		<script src="<?= LIBS_URL ?>jquery/jquery-ui.js"></script>
    	<script src="<?= LIBS_URL ?>jquery/jquery.ui.selectmenu.js"></script>
    	<script src="<?= LIBS_URL ?>jquery/jcarousellite.min.js"></script>
    	<script src="<?= LIBS_URL ?>jquery/jquery.slides.min.js"></script>        
    	<script src="<?= LIBS_URL ?>jquery/jquery.mousewheel.min.js" ></script>
    	<script src="<?= LIBS_URL ?>jquery/jquery.rotate.min.js" ></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.meow.js" ></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.easing.js"></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.tools.min.js"></script>

		<script src="<?= LIBS_URL ?>jquery/browserDetect.js"></script>
		<script src="<?= LIBS_URL ?>jquery/date.js"></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.validate.js"></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.tools.min.js"></script>
		
		<script src="<?= LIBS_URL ?>require/require.js" data-main="<?= ROOT_URL ?>js/main"></script>
	</body>
</html>