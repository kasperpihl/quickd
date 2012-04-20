<?php
require_once('../config.php'); 
require_admin();

if (isset($_GET['action']) && $_GET['action']=='inviteUsers') {
	$users = $db->getView('admin','getPendingUsers');
	$users = $users->rows;
	//$users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
	if (!empty($users)) {
		foreach($users as $user) {
			$qUser = new User($user->value->email);
			$qUser->printUser();
			//print_r($qUser->inviteUser());
		}
	}
	//redirect('statistics.php');
}

$users = $db->getView('admin','getStatistics');
$users = $users->rows;
//$users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
function cmp($a, $b)
{
    $aInvited = (isset($a->value->invited) && $a->value->invited==true);
    $bInvited = (isset($b->value->invited) && $b->value->invited==true);
    if ($a->key == $b->key && $aInvited==$bInvited) {
        return 0;
    }
    return ($aInvited!=$bInvited&&$aInvited || $a->key < $b->key) ? 1 : -1;
}


usort($users, "cmp");

$facebookUsers = array_filter($users,function($user){ return isset($user->value->fb_info); });
echo 'Registrerede brugere: '.sizeof($users).'<br/>';
echo 'Registreret med facebook: '.sizeOf($facebookUsers).'<br/><br/>';

echo "<a href='statistics.php?action=inviteUsers'>Inviter nye brugere!</a><br/><br/>";

if(!empty($users)){
	echo '<table><thead><th>Type</th><th>Email</th><th>Facebook</th><th>Oprettet</th><th>Inviteret</th></thead><tbody>';
	foreach($users as $user){
		$fb = (isset($user->value->fb_info)) ? 'X' :'';
		echo '<tr>';
		echo '<td>';
		echo '<td>'.$user->value->email . '</td><td>'.$fb.'</td><td>'.date('j/n H:i',$user->key).'</td>';
		echo '<td>'.((isset($user->value->invited) && $user->value->invited) ? 'Ja' : 'Nej').'</td>';
		echo '</tr>';
	}
	echo '</tbody></table>';
}
?>