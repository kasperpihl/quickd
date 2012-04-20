<?php
require_once('../config.php'); 
require_admin();

if (isset($_GET['action']) && ($_GET['action']=='inviteUsers'||$_GET['action']=='inviteAll')) {
	$users = $db->getView('admin','getPendingUsers');
	$users = $users->rows;
	if ($_GET['action']=='inviteUsers') $users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
	if (!empty($users)) {
		foreach($users as $user) {
			$qUser = new User($user->value->email);
			//$qUser->printUser();
			$qUser->inviteUser();
		}
	}
	redirect('statistics.php');
} else if (isset($_GET['action'], $_GET['email']) && $_GET['action'] == 'inviteUser') {
	$qUser = new User($_GET['email']);
	//$qUser->printUser();
	$qUser->inviteUser();
	redirect('statistics.php');
}

$users = $db->getView('admin','getStatistics');
$users = $users->rows;

if (isset($_GET['button'])) {
	$newUsers = array_filter($users,function($user){ return (!isset($user->value->invited)||!$user->value->invited); });
	$count = sizeof($newUsers);
	?>
		<style>
			.megabutton {
				font-size:154px;
				display:block;
				text-align:center;
				font-weight:bold;
				width:60%;
				padding:50px 50px;margin:100px auto 30px;
				background: #5e961b; /* Old browsers */
				background: -moz-linear-gradient(top, #5e961b 1%, #3a6b09 100%); /* FF3.6+ */
				background: -webkit-gradient(linear, left top, left bottom, color-stop(1%,#5e961b), color-stop(100%,#3a6b09)); /* Chrome,Safari4+ */
				background: -webkit-linear-gradient(top, #5e961b 1%,#3a6b09 100%); /* Chrome10+,Safari5.1+ */
				background: -o-linear-gradient(top, #5e961b 1%,#3a6b09 100%); /* Opera 11.10+ */
				background: -ms-linear-gradient(top, #5e961b 1%,#3a6b09 100%); /* IE10+ */
				background: linear-gradient(top, #5e961b 1%,#3a6b09 100%); /* W3C */
				border-radius: 20px;
				box-shadow:inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 2px #757575;
				color:white;
				text-decoration:none;
				border:3px solid #4E7A00;
				text-shadow: 0.5px 0 2px #286C0B;
			}
			.megabutton:hover {
				background: #5e961b; /* Old browsers */
				background: -moz-linear-gradient(top, #5e961b 1%, #437511 100%); /* FF3.6+ */
				background: -webkit-gradient(linear, left top, left bottom, color-stop(1%,#5e961b), color-stop(100%,#437511)); /* Chrome,Safari4+ */
				background: -webkit-linear-gradient(top, #5e961b 1%,#437511 100%); /* Chrome10+,Safari5.1+ */
				background: -o-linear-gradient(top, #5e961b 1%,#437511 100%); /* Opera 11.10+ */
				background: -ms-linear-gradient(top, #5e961b 1%,#437511 100%); /* IE10+ */
				background: linear-gradient(top, #5e961b 1%,#437511 100%); /* W3C */
				box-shadow: 0 0 10px white, inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 2px #757575;
			}
			.megabutton:active {
				background: #3A6B09;
				box-shadow: inset 0px 1px 3px #363535;
			}
			p {text-align:center;font-size:24px;}
		</style>
		<a class="megabutton" href='statistics.php?action=inviteUsers' onclick="if (!confirm('Dette vil sende en invitations-mail til alle nye brugere')) return false;" >Start beta!</a>
		<p>Nye brugere: <?=$count?></p>
	<?
} else {
	//$users = array_filter($users,function($user){ return ($user->value->privileges == 1); });
	function cmp($a, $b)
	{
	    $aInvited = (isset($a->value->invited) && $a->value->invited);
	    $bInvited = (isset($b->value->invited) && $b->value->invited);
	    if ($a->key == $b->key && $aInvited==$bInvited) {
	        return 0;
	    } else if ($aInvited!=$bInvited) return $aInvited ? 1 : -1;
	    else return ($a->key < $b->key) ? 1 : -1;
	}


	usort($users, "cmp");

	$facebookUsers = array_filter($users,function($user){ return isset($user->value->fb_info); });
	echo 'Registrerede brugere: '.sizeof($users).'<br/>';
	echo 'Registreret med facebook: '.sizeOf($facebookUsers).'<br/><br/>';


	echo "<a href='statistics.php?action=inviteUsers' onclick=\"if (!confirm('Dette vil sende en invitations-mail til alle nye brugere')) return false;\" style='font-size:24px;background:#62AB1F;border:1px solid #34620B;padding:10px;color:white;text-decoration:none;'>Inviter nye brugere</a><br/><br/>";
	echo "<a href='statistics.php?action=inviteAll' onclick=\"if (!confirm('Dette vil sende en invitations-mail til alle ny-registrede')) return false;\" >Inviter alle nye!</a><br/><br/>";

	if(!empty($users)){
		echo '<table style="text-align:left;"><thead><th width="100px">Type</th><th width="200px">Email</th><th width="100px">Facebook</th><th width="100px">Oprettet</th><th width="100px">Inviteret</th></thead><tbody>';
		foreach($users as $user){
			$val = $user->value;
			$fb = (isset($val->fb_info)) ? 'X' :'';
			echo '<tr>';
			echo '<td>';
				if ($val->privileges==1) echo 'Bruger';
				else if ($val->privileges==3) echo 'Forhandler';
				else if ($val->privileges==5) echo 'Admin';
				else echo $val->privileges;
			echo '</td>';
			echo '<td>'.$val->email . '</td><td>'.$fb.'</td><td>'.date('d/m H:i',$user->key).'</td>';
			echo '<td>';
				if(isset($val->invited) && $val->invited) echo 'Ja';
				else echo '<a href="statistics.php?action=inviteUser&email='.$val->email.'">Inviter</a>';
			echo '</td>';
			echo '</tr>';
		}
		echo '</tbody></table>';
	}
}
?>