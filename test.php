<html>
	<head>
		<title></title>
		<style>
		.emphasis {color: green; }
		</style>
	</head>
	<body>
		<ul class="emphasis">
			<li>hello</li>
			<li>hello2</li>
			<li>hello3</li>
		</ul>
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.js"></script>
		<script type="text/javascript">
			$('ul.emphasis').children().first().addClass('emphasis');
			//$('li:first-child').addClass('emphasis');
			//$('ul li').addClass('emphasis');
		</script>
	</body>
</html>