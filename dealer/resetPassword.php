<?php require_once('../config.php'); 
$resetPassword = false;
if(isset($_GET['id'])){
	$id = $_GET['id'];
	try{
		$resetPass = $db->key($id)->getView('dealer','getResetPass');
		$resetPass = $resetPass->rows;

		if(!empty($resetPass)){
			$doc_id = $resetPass[0]->value[0];
			$user = $resetPass[0]->value[1];
			$endtime = $user->newPass->endtime;
			$id = $user->newPass->url;
			if($endtime > time()) $resetPassword = $id;			
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
		<?php if($resetPassword){ ?>
		<script>
			var ROOT_URL = "<?= ROOT_URL ?>";
			$(document).ready(function() {
				var form = $('form#new-pass-form');

				form.formValidate({
					rules: {
						newPass: {
							 required:true,
							 minlength:6
						}
				  },
				  errorPlacement: function(error, element) {
						  var parent = element.parents('.field');
						  if (parent) error.appendTo(parent);
						  else error.insertAfter(element);
							var input = parent.find('input').first();
						  var top = input.position().top + (input.outerHeight()-error.outerHeight())/2 + 1;
						  var left = -(error.outerWidth()+35);
						  error.css({
						 		top: top+'px',
						 		left: left+'px'
						 	});
					},
				  submitKey: '#btn_submit_pass'
				});
				$('button#btn_submit_pass').on('click', function() {
					if (form && form.valid()) {
						$.post("<?= ROOT_URL ?>api/reset",{model:{doc_id: "<?= $doc_id ?>",password:$('#newpass-input').val(),id:"<?= $id ?>"}},function(data){
							if(data.success == 'true'){
								window.location = ROOT_URL;
							}
							//log('response from reset',data);
						},'json');
					} else form.submit();
					return false;
				});
				setTimeout(function() { $('input#newpass-input').focus(); }, 100);
			});
			
		</script>
		<?php }?>
	</head>
	<body>
		<div style="position: absolute; width: 100%; height: 100%">
		<div class="wrapper">
			<div>
				<div id="logo"></div>
				<form id="new-pass-form">
					<div id="enterNewPassword">
						<?php if($resetPassword){ ?>
						<label for="password">Ny adgangskode<small>Min. 6 tegn</small></label>
						<div class="field">
							<input type="password" name="newPass" id="newpass-input" value=""/><button id="btn_submit_pass" name="submit">Fortsæt</button>
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