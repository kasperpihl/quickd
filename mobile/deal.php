<?php require('lib/head.php'); ?>

<div id="container">
	
	<header data-role="header" class="ui-bar-a quickd-bar" data-position="fixed" role="banner">
		<h1>Spar <?= rand(25, 75); ?>%</h1>
		<a href="/mobile/" data-rel="back" title="Tilbage" class="ui-btn-a" data-role="button" data-inline="true" data-icon="arrow-l">Tilbage</a>
		<a href="share-deal.php" title="Sorter oversigt" class="ui-btn-right" data-role="button" data-inline="true" data-rel="dialog" data-transition="slidedown" data-prefetch="true" data-icon="forward">Del</a>
	</header>
	
	<div id="main" role="main">
		<article class="deal-fullscreen">
			<header>
				<img src="http://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=14&size=600x300&maptype=roadmap
&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
&markers=color:red%7Ccolor:red%7Clabel:C%7C40.718217,-73.998284&sensor=false" width="100%" height="170"
			</header>
			
			<section class="deal-info padded">
				<section class="deal-graphics clearfix">
					<img src="img/cirkler.png" alt="cirkler" width="403" height="134" />
					<!-- <div class="circle">
						<span class="amount"><?= rand(35, 500); ?>,-</span>
						<p>Før</p>
					</div>
					
					<div class="circle">
						<span class="amount"><?= rand(25, 250); ?>,-</span>
						<p>Nu</p>
					</div>
					
					<div class="circle">
						<span class="amount"><?= rand(25, 75); ?>%</span>
						<p>Spar</p>
					</div> -->
				</section>
				
				<section class="deal-description clearfix">
					<h2>Lækker café sandwich</h2>
					<img src="http://lorempixum.com/100/100/food/<?= rand(1, 5); ?>" alt="deal type img title" width="100" height="100" class="left" />
					<p>Tilbudsbeskrivelse lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.</p>
				</section>
			
				<section class="dealer-contact">
					<h2>Cross Café</h2>
					<div data-role="controlgroup">
						<a href="index.html" data-role="button" data-icon="home">Ring(+45 8619 1870)</a>
						<a href="http://www.crosscafe.dk" target="_blank" rel="external" data-role="button" data-icon="forward">Se Facebook Side</a>
						<a href="http://www.crosscafe.dk" target="_blank" rel="external" data-role="button" data-icon="forward">http://www.crosscafe.dk</a>
						<a href="index.html" data-role="button" data-icon="star">Tilføj som favorit</a>
					</div>
				</section>
				
				<section class="share-deal">
					<h2>Meta data</h2>
						<p><strong>Lav lir med Facebook API her:</strong> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						<a href="#" data-role="button" data-theme="b">Check ind via Facebook</a>
				</section>
			</section>
		</section>
	</div>
	
<?php require('lib/footer.php'); ?>