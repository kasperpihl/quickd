<? require_once('../config.php'); 
if(isset($_GET['action']) && $_GET['action'] == 'logout'){ $session->logout(); header('Location: ./'); }

?>
<!doctype html>
<html>
    <head>
       	<meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-capable" content="yes">
       	<title>QuickD Mini</title>
       	<link rel="stylesheet" href="css/quickd.min.css" />
       	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile.structure-1.0.min.css" />
       	<link rel="stylesheet" href="themes/css/quickd.css">
       	<link rel="stylesheet" href="css/royalslider.css">
       	<link rel="stylesheet" href="css/royalslider-skins/iskin/iskin.css">
		
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/114x114.png">
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="img/57x57.png">
		<link rel="apple-touch-startup-image" href="img/start-up-image.png" />
		
       	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="<?= LIBS_URL ?>jquery/jquery-1.7.min.js"><\/script>')</script>
		<?php if(isset($dealer) && $dealer) { $return = Shopowner::getStuffForMobile(); ?>
			<script src="<?= LIBS_URL ?>jquery/jquery.easing.1.3.min.js"></script>
			<script src="<?= LIBS_URL ?>jquery/royal-slider-8.1.min.js"></script>
			<script src="src/countdown.js"></script>
			<script>
				var App = {
					collections: {},
					models: {},
					routers: {},
					views: {}
				};
			</script>
			<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
	        <script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
	        <script src="js/collections/collections.js"></script>
	        <script src="js/models/models.js"></script>
	        <script src="js/routers/controller.js"></script>
	        <script src="js/views/deals.js"></script>
	        <script src="js/views/controlpanel.js"></script>
	        <script> 
	        	var shopowner; 
	       		var ROOT_URL = "<?= ROOT_URL ?>";
				var IMG_URL = "<?= IMAGES_URL ?>";
				var LIBS_URL = "<?= LIBS_URL ?>";
				
				shopowner = <?= $return; ?>;
			</script>
			<script src="js/app.js"></script>
		<? } else { ?>
			<script src="src/script.js"></script>
  		<? } ?>
  		<script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js" ></script>
    </head>
    <body>
    	<?php if (!$session->logged_dealer()):?>
    		
    		<div id="login-wrap" data-role="page" data-theme="a">
        		<div id="login" class="current">	
	    			<div id="logo" class="text-center">
	                    <h1 class="ir">QuickD</h1>
	                </div>
	                <div class="scroll">
						<form id="login" method="post" data-ajax="false">
							<input type="hidden" name="action" value="login"/>
							<input type="text" placeholder="Brugernavn" id="user" name="email"/>
							<input type="password" placeholder="Adgangskode" id="password" name="password" />
							<input type="submit" class="button" value="Log ind" />
						</form>	                
	                </div>
	                
	                <footer class="text-center">
	                	<a href="mailto:mail@quickd.dk">mail@quickd.dk</a>
	                </footer>
                </div>
           	</div>
                
    	<?php else: ?>
    		<div id="deals" data-role="page" data-theme="a">
        	<div id="deal" class="current">
            	<div data-role="header" data-position="fixed">
                    <h1>QuickD Mini</h1>
                    <a class="button" id="logout" href="./index.php?action=logout" data-theme="b">Log ud</a>
                </div>
                <div class="scroll">
                	
                	<article data-role="content" id="appContent">
            			
            			<section class="deals">
            				<nav id="deal-slider" class="royalSlider iskin">
            					<ul class="royalSlidesContainer" id="rSS">
 									<?php /* if(!empty($deals)){ foreach ($deals as $id => $deal): ?>
 									<li class="royalSlide">
            							<article class="deal" id="template-<?= $id ?>" templateId="<?= $id ?>" started="true" endtime="<?= $deal->end ?>">
							            	<img class="imageItem left" src="<?= IMAGES_URL ?>thumbnail/<?= $deal->image ?>" height="100%" />
							                <div class="slideTextBlock">
							                    <h4><?= $deal->title ?></h4>
							                    <p>Før: <span class="amount"><?= $deal->orig_price ?>,-</span> / Nu: <span class="amount"><?= $deal->deal_price ?>,-</span></p>
							                </div>
							            </article>
            						</li>
 									<?php endforeach; }?>
            						<?php foreach ($templates as $id => $temp): ?>
            						<li class="royalSlide">
            							<article class="deal" id="template-<?= $id ?>" templateId="<?= $id ?>" started="false">
							            	<img class="imageItem left" src="<?= IMAGES_URL ?>thumbnail/<?= $temp->image ?>" height="100%" />
							                <div class="slideTextBlock">
							                    <h4><?= $temp->title ?></h4>
							                    <p>Før: <span class="amount"><?= $temp->orig_price ?>,-</span> / Nu: <span class="amount"><?= $temp->deal_price ?>,-</span></p>
							                </div>
							            </article>
            						</li>
            						<?php endforeach;*/ ?>
            					</ul>
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