<?php require_once('../config.php'); ?>
<!DOCTYPE html>
<html class="no-js" lang="da_DK">
	<head>
		<meta charset="UTF-8"/> 
		<meta name="viewport" content="width=device-width,initial-scale=.9">
		<title>QuickD</title>
		<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic&subset=latin,latin-ext" rel="stylesheet"/>
        
		<link href="<?= ROOT_URL ?>styles/stylesheets/resetPassword.css" media="all" rel="stylesheet"/>
     
        <script src="<?= LIBS_URL ?>jquery/jquery-min.js"></script>
		<script src="<?= LIBS_URL ?>underscore/underscore-min.js"></script>
        <script src="<?= LIBS_URL ?>backbone/backbone-min.js"></script>
        <script src="<?= ROOT_URL ?>js/function.js"></script>
	</head>

	<body>
		<div style="position: absolute; width: 100%; height: 100%">
		<div class="wrapper">
			<div>
				<div id="logo"></div>
				<div id="enterNewPassword">
					<label for="password">Ny adgangskode<small>Min. 6 tegn</small></label>
					<div class="field">
						<div>
							<input type="password" name="newPass" value=""/><button name="submit">Fortsæt</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
	</body>
</html>