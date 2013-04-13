<!DOCTYPE HTML>
<html>
	<head>
		<title>QuickD</title>
		<script src="http://code.jquery.com/jquery-latest.js"></script>
		<script>
		  $(function() {
		    $(".button").click(function() {
		      $.post("register.php", { email: $('#email').val() });
		    });
		  });
		</script>
		
	</head>
	<body>
		<form method="POST" action="/" id="subscribeForm">
			<input type="text" name="email" id="email">
			<input type="submit" class="button">
		</form>
		<div id="response"></div>
	</body>
</html>