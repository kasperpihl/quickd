<?php 
require_once('../../config.php');
if(!isset($_POST['betakey'])) echo die(json_encode(array('success'=>false,'error'=>'no_key_provided')));
$betakey = $_POST['betakey'];
$res = validateBetaKey($betakey);
echo $res ? 'true' : 'false';
?>