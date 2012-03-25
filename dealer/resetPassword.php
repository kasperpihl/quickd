<?php require_once('../config.php'); 
$resetPasswordBool = true;
if(isset($_GET['id'])){
	$id = $_GET['id'];
	try{
		$resetPass = $db->key($id)->getView('dealer','getResetPass');
		$resetPass = $resetPass->rows;
		if(!empty($resetPass)){
			$doc_id = $resetPass[0]->value[0];
			$user = $resetPass[0]->value[1];
			$endtime = $user->newPass->endtime;
			if($endtime > time()) $resetPasswordBool = true;			
		}
	}
	catch(Exception $e){
			
	}
}
?>
<!DOCTYPE html>
<html class="no-js" lang="da_DK">
	<head>
		<meta charset="UTF-8"/> 
		<meta name="viewport" content="width=device-width,initial-scale=.9">
		<title>QuickD</title>
		<link href="http://fonts.googleapis.com/css?family=PT+Sans:400,700,400italic&subset=latin,latin-ext" rel="stylesheet"/>
        <script src="<?= LIBS_URL ?>jquery/jquery-min.js"></script>
		<link href="<?= ROOT_URL ?>styles/stylesheets/resetPassword.css" media="all" rel="stylesheet"/>
		<script src="<?= ROOT_URL ?>js/function.js"></script>
		<script src="<?= LIBS_URL ?>jquery/jquery.validate.js"></script>
		<script>
			$(document).ready(function() {
				var form = $('form#new-pass-form');

				form.formValidate({
					rules: {
						newPass: {
							 required:true,
							 minlength:6
						}
				  },
				  submitKey: '#btn:submit_pass'
				});
				$('button#btn_submit_pass').on('click', function() {
					if (form && form.valid()) {
						//do ajax here!!
					} else form.submit();
					return false;
				});
			});
		</script>
	</head>
	<body>
		<div style="position: absolute; width: 100%; height: 100%">
		<div class="wrapper">
			<div>
				<div id="logo"></div>
				<form id="new-pass-form">
					<div id="enterNewPassword">
						<?php if($resetPasswordBool){ ?>
						<label for="password">Ny adgangskode<small>Min. 6 tegn</small></label>
						<div class="field">
							<div>
								<input type="password" name="newPass" value=""/><button id="btn_submit_pass" name="submit">Fortsæt</button>
							</div>
						</div>
						<?php } else{ ?>
							<p>Linket er brugt, forældet eller findes ikke.</p>
							<a class="gotoDealer" href="<?= ROOT_URL ?>">Gå til forhandlerlogin</a>
						<?php } ?>
					</div>
				</form>
			</div>
		</div>
		</div>
	</body>
</html>