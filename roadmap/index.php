<?php 
	$title = "QuickD feature roadmap";
	$desc = "QuickD Roadmap – Stem på dine ynglingsfeatures";
?>

<!-- Consider adding an manifest.appcache: h5bp.com/d/Offline -->
<!doctype html>
<html class="no-js" lang="en-US">
<head>
  	<meta charset="utf-8">
  	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<meta name="description" content="<?= $desc; ?>">
	
	<!-- Mobile viewport optimized: j.mp/bplateviewport -->
  	<meta name="viewport" content="width=device-width,initial-scale=1">
	
	<title><?= $title; ?></title>
  
  	<link rel="stylesheet" href="styles/css/combined.css">
  	
  	<!-- For optimal performance, use a custom Modernizr build: www.modernizr.com/download/ -->
  	<script src="js/libs/modernizr-2.0.6.min.js"></script>
</head>

<body>

	<div id="container">
		<header class="jumbotron masthead">
			<h1><?= $title; ?></h1>
			<p>Her kan du stemme på de QuickD-features som er vigtigst for lige netop din forretning. Vi modtager også meget gerne forslag til nye tiltag.</p>
			<p>Den farvede bar markerer hvor langt vi er med at implementere de forskellige ting.</p>
		</header>
		<div id="main" role="main">
			<form method="post">
				<p><input type="text" placeholder="Kom med et forslag"></p>
			</form>

			<ul class="idea-list">
				<?php for($i = 0; $i < 5; $i++): ?>
				<li class="idea">
					<article class="hentry clearfix">
						<a href="#" class="like ir">Stem på denne feature</a>
						<section class="content">
							<div class="progress" style="width: <?= rand(0, 100); ?>%;"></div>
							<h2 class="title">Faste tilbud</h2>
						</section>
						<footer>Afventer godkendelse &hellip;</footer>
					</article>
				</li>
				<?php endfor; ?>
			</ul>
		</div>
		<footer>
			<ul>
				<li>QuickD road map system</li>
				<li>Kontakt os <a href="mailto:info@quickd.com" title="Kontakt os">her</a></li>
				<li>Forhandler version. Gå til <a href="#" target="_self">forbrugerversionen</a></li>
			</ul>
		</footer>
	</div> <!-- eo #container -->


  	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js"></script>
  	<script>window.jQuery || document.write("<script src='js/libs/jquery-1.7.1.min.js'>\x3C/script>")</script>
  	<script type="text/javascript" src="js/script-ck.js"></script>
</body>
</html>