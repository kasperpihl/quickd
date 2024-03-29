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
<!doctype html>
<html>
    <head>
       	<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-capable" content="yes">
       	<title>QuickD Mini</title>
       	<link rel="stylesheet" href="<?= ROOT_URL ?>css/quickd.min.css" />
       	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile.structure-1.0.min.css" />
       	<link rel="stylesheet" href="<?= ROOT_URL ?>themes/css/quickd.css">
       	<link rel="stylesheet" href="<?= ROOT_URL ?>css/royalslider.css">
       	<link rel="stylesheet" href="<?= ROOT_URL ?>css/royalslider-skins/iskin/iskin.css">
		
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/114x114.png">
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="img/57x57.png">
		<link rel="apple-touch-startup-image" href="img/start-up-image.png" />
		
       	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>
			var ROOT_URL = "<?= ROOT_URL ?>";
			var REAL_URL = "<?= REAL_URL ?>";
			window.jQuery || document.write('<script src="<?= LIBS_URL ?>jquery/jquery-min.js"><\/script>')</script>
		<?php if(isset($dealer) && $dealer) { $return = Shopowner::getStuffForMobile(); ?>
			<script> 
	        	var shopowner; 
				var IMG_URL = "<?= IMAGES_URL ?>";
				var API_URL = "<?= API_URL ?>";
				var LIBS_URL = "<?= LIBS_URL ?>";
				var historyObj = JSON.parse('<?= $historyObj ?>');
				shopowner = <?= $return; ?>;
			</script>
			<script src="<?= LIBS_URL ?>jquery/jquery.easing.1.3.min.js"></script>
			<script src="<?= LIBS_URL ?>jquery/royal-slider-8.1.min.js"></script>
			<script>
				var App = {
					collections: {},
					models: {},
					routers: {},
					utilities: {},
					views: {}
				};
			</script>
			<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
	        <script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
	        <script src="<?= COMMON_URL ?>js/collections/collections.js"></script>
	        <script src="<?= COMMON_URL ?>js/models/models.js"></script>
	        <script src="<?= ROOT_URL ?>js/routers/controller.js"></script>
	        <script src="<?= ROOT_URL ?>js/utilities/countdown.js"></script>
	        <script src="<?= ROOT_URL ?>js/views/deals.js"></script>
	        <script src="<?= ROOT_URL ?>js/views/controlpanel.js"></script>
	        
			<script src="<?= ROOT_URL ?>js/app.js"></script>
		<? } else { ?>
			<script src="<?= ROOT_URL ?>src/script.js"></script>
  		<? } ?>
  		<script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js" ></script>
    </head>
    <body>
    	<?php if (!$session->logged_dealer()): ?>
    		
    		<div id="login-wrap" data-role="page" data-theme="a">
        		<div id="login" class="current">	
	    			<div id="logo" class="text-center">
	                    <h1 class="ir">QuickD</h1>
	                </div>
	                <div class="scroll">
						<form id="login" action="#" method="post" data-ajax="false">
							<input type="hidden" name="action" value="login"/>
							<input type="text" placeholder="Brugernavn" id="user" name="email"/>
							<input type="password" placeholder="Adgangskode" id="password" name="password" />
							<input type="submit" class="button" value="Log ind" />
						</form>	                
	                </div>
	                
	                <footer class="text-center">
	                	<a href="mailto:mail@quickd.com">mail@quickd.com</a>
	                </footer>
                </div>
           	</div>
                
    	<?php else: ?>
    		<div id="deals" data-role="page" data-theme="a">
        	<div id="deal" class="current" >
            	<div data-role="header" data-position="fixed">
                    <h1>QuickD Mini</h1>
                    <a class="button" id="logout" href="<?= REAL_URL ?>?logout" data-ajax="false" data-theme="b">Log ud</a>
                </div>
                <div class="scroll" style="opacity:0;">
                	
                	<article data-role="content" id="appContent">
            			
            			<section class="deals">
            				<nav id="deal-slider">
            				</nav>
            			</section>
            			<section id="controlpanel">
	            			<section id="time" class="time text-center">
	            				<div id="timewrap">
		            				<time id="countdownTimer"></time>
		            				<form>
									   <input type="range" name="hours-slider" id="hours-slider" value="12" min="4" max="40" data-theme="a"  />
									</form>
								</div>
	            			</section>
	            			
	            			<a href="#" data-role="button" class="start-stop-deal" id="startButton" data-theme="a">Start deal!</a>
	            		</section>
            		</article>
            		
                </div>
            </div>
         </div>
         <?php endif; ?>
    </body>
</html>