<?php require('lib/head.php'); ?>
<div id="container" data-role="page">
	
	<header data-role="header" class="ui-bar-a quickd-bar" data-position="fixed" role="banner">
		<h1 class="ir" id="logo">QuickD</h1>
		<a href="sorter-deals.php" title="Sorter oversigt" class="ui-btn-right" data-role="button" data-inline="true" data-rel="dialog" data-transition="flip" data-prefetch>Sorter</a>
	</header>
	
	<div id="main" role="main">
		<section>
			
			<ul data-role="listview" id="deallistview">
					
			</ul>
		</section>
	</div> <!-- eo #main -->
	
<?php require('lib/footer.php'); ?>