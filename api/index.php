<?php require(dirname(__FILE__).'/../config.php'); ?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8"/> 
		<meta name="viewport" content="width=device-width,initial-scale=.9">
		<!-- Including of stylesheets -->
		<link href="styles/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
		<link href="styles/stylesheets/print.css" media="print" rel="stylesheet" type="text/css" />
		<!--[if IE]>
			<link href="/stylesheets/ie.css" media="screen, projection" rel="stylesheet" type="text/css" />
		<![endif]-->

		<script src="<?= LIBS_URL ?>jquery/jquery-min.js"></script>
		<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
		<script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
		<script src="app/function.js"></script>
		<script src="app/app.js"></script>
		<script>
			var ROOT_URL = "<?= ROOT_URL ?>";
			var API_URL = "<?= API_URL ?>";
		</script>
	</head>
	<body>
		<div class="content">
			<header></header>
			<h1>QuickD API</h1>
			<div id="apiTestSuite">
				<input type="text" placeholder="Indtast url" id="apiRequestTxt">
				<div>
					<textarea id="apiDataString"></textarea>
				</div>
				<select id="method">
					<option value="GET">GET</option>
					<option value="POST">POST</option>
					<option value="PUT">PUT</option>
					<option value="DELETE">DELETE</option>
				</select>
				<button id="apiTestBtn" class="btn">Kald</button>
				<div id="response">
				</div>
	        </div>
			
			<footer>
				
			</footer>
		</div>
	</body>
</html>