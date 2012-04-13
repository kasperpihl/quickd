<?php
require_once('../config.php');
define('COMMON_URL',REAL_URL.'common/');
if(isset($_GET['logout'])){
	$session->logout();
	redirect(REAL_URL);
}
if($version == 'mobile')  require_once('mobile/index.php');
else require_once('desktop/index.php');
?>