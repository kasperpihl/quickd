<? require_once('../../config.php');
if(!isset($_POST['email'],$_POST['password'])) echo die(json_encode(array('success'=>'false','error'=>'email_and_password_required')));
echo json_encode(Shopowner::login($_POST,false,true));
?>