<?php
require_once('../config.php'); 
require_admin();
$users = $db->getView('admin','getStatistics');
$users = $users->rows;
$users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
function cmp($a, $b)
{
    if ($a->key == $b->key) {
        return 0;
    }
    return ($a->key < $b->key) ? 1 : -1;
}


usort($users, "cmp");

$facebookUsers = array_filter($users,function($user){ return isset($user->value->fb_info); });
echo 'Registrerede brugere: '.sizeof($users).'<br/>';
echo 'Registreret med facebook: '.sizeOf($facebookUsers).'<br/><br/>';
if(!empty($users)){
	echo '<table><thead><th>Email</th><th>Facebook</th><th>Oprettet</th></thead><tbody>';
	foreach($users as $user){
		$fb = (isset($user->value->fb_info)) ? 'X' :'';
		echo '<tr><td>'.$user->value->email . '</td><td>'.$fb.'</td><td>'.date('j/n H:i',$user->key).'</td></tr>';
	}
	echo '</tbody></table>';
}
?>