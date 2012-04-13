<? require_once('../config.php'); ?>
<? //if($uagent->DetectTierIphone()) header('Location: http://m.quickd.dk'); ?>
<!doctype html>
<?php
	// Just basic page info like title, description and URL
	$page_title = 'QuickD – Instant Deals Around You';
	$page_description = 'QuickD – Instant Deals Around You';
	
	$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === FALSE ? 'http' : 'https';
	$host     = $_SERVER['HTTP_HOST'];
	$script   = $_SERVER['SCRIPT_NAME'];
	$params   = $_SERVER['QUERY_STRING'];
	 
	$page_url = $protocol . '://' . $host;
?>

<html class="no-js" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=550">
	
	<title><?= $page_title; ?></title>
	<meta name="description" content="<?= $page_description; ?>">
	
	<!-- Required -->
	<meta property="og:title" content="<?= $page_title; ?>"/>
	<meta property="og:description" content="<?= $page_description; ?>"/>
	<meta property="og:type" content="website"/>
	<meta property="og:url" content="<?= $page_url; ?>"/>
	<meta property="og:image" content="<?= $page_url . '/img/quickd-logo.jpg' ?>"/>
	
	<!-- Optional -->
	<meta property="og:site_name" content="<?= $page_title; ?>"/>
	<meta property="og:description" content="<?= $page_description; ?>"/>

	<meta name="viewport" content="width=device-width,initial-scale=1">
	<link rel="stylesheet" href="css/style.css">

	<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>
<body>
<div id="vignette"></div>

<div id="container">
	<header>
		<div id="left-phone"><img id="left-phone2" src="img/phone-left.png" alt="QuickD - Instant Deals Around You" /></div>
		<div id="right-phone"><img id="left-phone2" src="img/phone-right.png" alt="QuickD - Instant Deals Around You" /></div>
		<div id="top-phone">
			<div id="top-phone-background">
				<div id="logo"><img src="img/logo.png" style="width: 125px;" /></div>
				<div id="tagline"><img src="img/tagline.png" style="width: 160px;" /></div>
			</div>
			<div id="topbar">
				<p id="clock"></p>
			</div>
			<div class="screenshots">
				<img src="img/screen3.png" />
				<img src="img/screen1.png" />
				<img src="img/screen4.png" />
				<img src="img/screen3.png" />
				<img src="img/screen1.png" />
				<img src="img/screen5.png" />				
			</div>
			<div style="position: absolute; width: inherit; height: inherit; background-image: url('img/big-phone.png'); z-index: 1;"></div>
		</div>
	</header>
	<div id="main" role="main" class="clearfix">
			<form id="consumer-signup" class="signup clearfix" action="/">
				<input type="email" placeholder="ditnavn@domæne.dk" id="email" required  />
				<input type="submit" class="betasignup" id="betasignup" value="Notificér mig" />
			</form>
		
		<div id="read-more-btn">
			<h3 class="btn textcenter">Lær mere om QuickD</h3>
			<div class="left-line"></div>
			<div class="right-line"></div>
		</div>
		
		<? /* <section id="read-more" class="clearfix">
			<ul>
				<li class="selling-point">
					<img class="left" src="img/box1-img.png" width="125" />
					<h4>Udforsk tilbud i nærheden</h4>
					<p>QuickD giver dig mulighed for at udforske gode deals i nærheden af hvor du er netop nu. Uanset hvor du befinder dig, vil du kunne åbne app’en og omgående få et overblik over de tilbud, der er tilgængelige. Du sparer penge, og du opdager nye produkter og services du ellers aldrig ville have vidst eksisterede.</p>
				</li>
				
				<li class="selling-point">
					<img class="right" src="img/box2-img.png" width="135" />
					<h4>Find lige hvad du har brug for</h4>
					<p>Begrænsninger kender vi ikke, i hvert fald ikke hvad omfanget af deals angår. Deals kan være alt lige fra en brunch i restauranten til en klipning ved din favoritfrisør. Eller hvad med  en øl på den lokale bar? Mulighederne er mange. Vi sætter dog grænser. F.eks. distribuerer vi ikke deals, som vi ikke mener du vil synes om. Derfor er et krav blandt andet, at alle deals er sat ned med minimum 30% fra originalprisen.</p>
				</li>
				
				<li class="selling-point">
					<img class="left" src="img/box3-img.png" width="135" style="padding-bottom: 10px; margin-top: 25px;" />
					<h4>Abonnér på dine favoritter</h4>
					<p>Forestil dig en verden, hvor du aldrig misser et godt tilbud mens det er der. Denne mulighed får du nu med QuickD. Du kan vælge at abonnere på de typer af deals, som du er interesseret i. Hvis du er ude på en shoppingtur, kan du f.eks. modtage informationer om shoppingrelaterede deals i det sekund de bliver tilgængelige. Du kan også abonnere på dine favoritbutikker, hvadenten det er stamcaféen eller den lokale tankstation.</p>
				</li>
			</ul>
		</section>*/ ?>
		
	</div>
	<footer class="textcenter">
		<nav>
			<ul>
				<li class="footer-link"><a href="http://forhandler.quickd.dk/" title="Læs om QuickD for forhandlere">Forhandler</a></li>
				<li class="footer-link"><a href="http://www.facebook.com/pages/QuickD-Instant-deals-around-you/203907689684007" title="">Find os på Facebook</a></li>
				<li class="footer-link"><a href="#" title="Kommer snart">Twitter</a></li>
			</ul>
		</nav>
		
		<div id="fb-root"></div>
		<div class="fb-like" data-href="http://www.facebook.com/pages/QuickD-Instant-deals-around-you/203907689684007" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true" data-action="like"></div>
	</footer>
</div> <!--! end of #container -->

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="js/libs/jquery-1.6.2.min.js"><\/script>')</script>

<script src="js/libs/jquery.easing.1.3.js"></script>
<script src="js/libs/jquery.scrollTo-1.4.2-min.js"></script>
<script src="js/libs/cycle.js"></script>
<script src="js/script.js"></script>

<script>
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=204528172925343";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
</script>
<!-- end scripts-->

<script>
	var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']]; // Change UA-XXXXX-X to be your site's ID
	(function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
	g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g,s)}(document,'script'));
</script>

<!--[if lt IE 7 ]>
	<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
	<script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
<![endif]-->

</body>
</html>