<?php
require_once('../config.php'); 
require_admin();
$users = $db->getView('dealer','getUsersByMail');
$users = $users->rows;

$users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
$facebookUsers = array_filter($users,function($user){ return isset($user->value->fb_info); });

echo 'Registrerede brugere: '.sizeof($users).'<br/>';
echo 'Registreret med facebook: '.sizeOf($facebookUsers).'<br/><br/>';
if(!empty($users)){
	echo '<table><thead><th>Email</th><th>Facebook</th></thead><tbody>';
	foreach($users as $user){
		$fb = (isset($user->value->fb_info)) ? 'X' :'';
		echo '<tr><td>'.$user->key . '</td><td>'.$fb.'</td></tr>';
	}
	echo '</tbody></table>';
}
?>