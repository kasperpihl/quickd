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
<!doctype html>
<html class="no-js" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/114x114.png">
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/72x72.png">
	<link rel="apple-touch-icon-precomposed" sizes="57x57" href="img/57x57.png">
	<link rel="apple-touch-startup-image" href="img/start-up-image.png" />
	
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
	
	<!-- Debug: <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.css"> -->
	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css"/>
	
	<script src="js/libs/modernizr-2.0.6.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
	<script src="js/script.js"></script>
	<script src="js/position.js"></script>
	<script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"></script>
	
	<link rel="stylesheet" href="css/style.css">
</head>
<body>