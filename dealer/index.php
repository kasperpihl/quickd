<?php require_once('../config.php');
if(isset($_GET['logout'])){
	$session->logout();
	redirect(ROOT_URL);
}
?>
<!DOCTYPE html>
<html class="no-js" lang="da_DK">
	<head>
		<meta charset="UTF-8"/> 
		<meta name="viewport" content="width=device-width,initial-scale=.9">
		<title>QuickD</title>
		<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic&subset=latin,latin-ext" rel="stylesheet"/>
		
        <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.theme.css" media="all" rel="stylesheet" type="text/css"/>
        <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.selectmenu.css" media="all" rel="stylesheet"/>
        <link href="<?= LIBS_URL ?>jquery/css/jquery.ui.datepicker.css" media="all" rel="stylesheet"/>
        
		<link href="<?= ROOT_URL ?>styles/stylesheets/screen.css" media="all" rel="stylesheet"/>
		<link href="<?= ROOT_URL ?>styles/stylesheets/kasperstyle.css" media="all" rel="stylesheet"/>
		<link href="<?= ROOT_URL ?>styles/stylesheets/tempstyle.css" media="all" rel="stylesheet"/>
		<link href="<?= ROOT_URL ?>styles/stylesheets/bubbles.css" media="all" rel="stylesheet"/>
		
        
        <script src="<?= LIBS_URL ?>jquery/jquery-min.js"></script>
		<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
        <script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
        <script src="<?= ROOT_URL ?>js/function.js"></script>
        <script> var shopowner; var debug = false;	
       		var ROOT_URL = "<?= ROOT_URL ?>";
			var IMG_URL = "<?= IMAGES_URL ?>";
			var LIBS_URL = "<?= LIBS_URL ?>";
			var historyObj = JSON.parse('<?= $historyObj ?>');
			<?php if(isset($dealer) && $dealer) { $return = getShopowner();?>
				shopowner = <?= $return; ?>;
			<? } ?>
			
		</script>
	</head>
	
	
	<body onLoad="resizeBg()">
        <div id="content"><!--bg-test.jpg-->
            <img id="bgImage" class="bgImage" style="display:none" src="<?= ROOT_URL ?>styles/stylesheets/i/bg-test.jpg" />
			<div id="dashboard">
			</div>
		
			<!-- Main javascript files to get it all to work -->
			
			<script src="<?= LIBS_URL ?>modernizr/modernizr-2.0.6.custom.js"></script>
			<script src="<?= LIBS_URL ?>jquery/jquery-ui.js"></script>
			<!-- <script src="https://maps.googleapis.com/maps/api/js?v=3.5&sensor=false&region=DK"></script>-->
	       
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
			<!--<script src="animate.js"></script>-->
			
			<script src="<?= LIBS_URL ?>require/require.js" data-main="<?= ROOT_URL ?>js/main"></script>
		</div>

	</body>
</html>