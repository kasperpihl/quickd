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
		<img id="dealer-area-img" src="img/quickd-dealer-area.png" alt="<?= $page_description; ?>" width="650" height="549" style="opacity:0.8;" />
		<section id="dealer-slider">
			<img class="splash" src="img/dealer-area-splash.jpg" width="595" height="372" />
			<img class="desktop" src="img/dealer-area.png" width="595" height="372" />
		</section>
	</header>
	<div id="main" role="main" class="clearfix">
		<form id="dealer-signup" class="signup clearfix" action="/">
			<label for="email-input">Bliv notificeret når QuickD bliver tilgængeligt for forhandlere</label>
			<input type="email" name="email-input" placeholder="ditnavn@domæne.dk" id="email" required  />
			<input type="submit" class="dealersignup" id="dealersignup" value="Notificér mig" />
		</form>
		
		<article id="dealer-info" class="clearfix">
			<section class="selling-point">
				<h4>Kort om QuickD</h4>
				<p>Vores QuickD service er en ny markedsføringskanal, som giver din forretning mulighed for, at starte tilbud når du har brug for det.</p> 
				<p>Har du ledige pladser — I caféen, restauranten, frisørstolen, tandlægestolen, neglesalonen? QuickD forbinder dig direkte med potentielle kunder, der befinder sig i nærheden af dig … lige nu!</p>
			</section>
			<section class="selling-point">
				<h4>Fordele for dig</h4>
				<p>QuickD er først og fremmest udviklet til dig som forretningsejer. Vi ved at vores succes afhænger af de tilbud du sender ud. QuickD er meget let at bruge, og du kan sende tilbud ud med ét klik.</p>
				<p>Med QuickD henvender du dig kun til relevante potentielle kunder der netop nu er i nærheden af din forretning. På den måde vil dine tilbud blive betragtet som en service, ikke som spam.</p>
			</section>
			<section class="selling-point">
				<h4>Sådan virker det</h4>
				<ol>
					<li>Du sender et tilbud ud via QuickD</li>
					<li>Kunder i nærheden ser dit tilbud</li>
					<li>Kunderne kommer til dig og du tjener penge</li>
				</ol>
			</section>
		</article>		
	</div>
	<footer class="textcenter">
		<nav>
			<ul>
				<li class="footer-link"><a href="http://quickd.dk/" title="Læs om QuickD for forbrugere">Forbruger</a></li>
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
	function validateEmail(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	} 

	$(function() {
	
		$('#email').val("");
	
	
		$(".dealersignup").click(function(e) {
	    	e.preventDefault();
	    	if(validateEmail($('#email').val())){
		      	$.post("register.php", { email: $('#email').val() }, function(data) {
		      		$('#dealersignup').fadeOut(200);
		      		$('#email').val(" ").addClass('loader');
		  			setTimeout(function() {
		  				$('#email').removeClass('loader').val("Tak! Din registrering er modtaget.").attr('disabled','disabled').blur();
		  			}, 1000);
				});
			}
	    });
		
		$('#container').animate({opacity: 1}, function() {
			setTimeout(function() {
				$('#dealer-slider .desktop').animate({left: 0}, 700);
				$('#dealer-slider .splash').animate({opacity: 0}, 400);
			}, 2000);
		});
		
	});

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