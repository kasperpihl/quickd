<?php
function redirect($location = NULL){
	if($location != NULL){
		header("Location: {$location}");
		exit;
	}	
}
function getShopowner(){
	global $dealer,$db;
	if(!isset($dealer)) return array('success'=>'false','error_message'=>'not_logged_in');
	try{
		$doc = $db->getDoc($dealer);
		$doc = $doc->user;
		unset($doc->md5_password);
		$ownerStuff = Shopowner::get('all');
		$ownerStuff = ($ownerStuff['success'] == 'true') ? $ownerStuff['results'] : '';
		return json_encode(array('success'=>'true', 'dealer'=> $doc,'stuff'=>$ownerStuff));
	}
	catch(Exception $e){
		return json_encode(array('success'=>'false','error_message'=>'error_database'));

	}
}
function __autoload($class_name){
	$class_name = strtolower($class_name);
	$path = CLASSES_DIR."{$class_name}.class.php";
	if(file_exists($path)){
		require_once($path);
	}
	else{
		die("The file {$class_name}.php could not be found");
	}
}
function discount($orig_price,$deal_price){
	$org = (float)$orig_price;
	$deal = (float)$deal_price;
	$disc = ($org-$deal)/$org*100;
	return (int)$disc;
}
function require_shopowner(){
	global $session;
	if(!$shopowner = $session->logged_dealer()) redirect('login.php');
	else return $shopowner;
}
function require_admin(){
	global $session;
	if(!$admin = $session->logged_admin()) redirect('index.php');
	else return $admin;
}
function require_login(){
	if (!isset($_SESSION['user_id'])){
		$_SESSION['error_message'] = 'Du skal være logget ind for at se denne side';
		$_SESSION['uri'] = 'http://'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
		redirect('login.php');
	}
	return $_SESSION['user_id'];
}
function distance($lat1, $lng1, $lat2, $lng2)
{
	$lat1 = floatval($lat1);
	$lng1 = floatval($lng1);
	$lat2 = floatval($lat2);
	$lng2 = floatval($lng2);
	$pi80 = M_PI / 180;
	$lat1 *= $pi80;
	$lng1 *= $pi80;
	$lat2 *= $pi80;
	$lng2 *= $pi80;

	$r = 6372.797; // mean radius of Earth in km
	$dlat = $lat2 - $lat1;
	$dlng = $lng2 - $lng1;
	$a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlng / 2) * sin($dlng / 2);
	$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
	$m = (int)($r * $c * 1000);
	return ($m);
}
/*
	Function to calculate the max and min coordinates on both latitude and longitude
	Being used to make sure the randomized game parts is being created within these sets
	Returns an array containing both max/min lat and long and the lat/long of the game
*/
function calcMax($lat,$long){
	$lat = floatval($lat);
	$long = floatval($long);
	$dxE = MAX_DIST * cos(M_PI * (0/180));
	$dxW = MAX_DIST * cos(M_PI * (180/180));
	$dyN = MAX_DIST * sin(M_PI * (90/180));
	$dyS = MAX_DIST * sin(M_PI * (270/180));
	
	$dlE = $dxE / (111320*cos($long));
	$dlW = $dxW / (111320*cos($long));
	$dlN = $dyN / 110540;
	$dlS = $dyS / 110540;
	
	$longE = $long + $dlE;
	$longW = $long + $dlW;
	$latN = $lat + $dlN;
	$latS = $lat + $dlS;	
	return array('maxLong'=>$longE,'minLong'=>$longW,'maxLat'=>$latN,'minLat'=>$latS);
}

function isValidEmail($email){
	//return eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email);
	return filter_var($email, FILTER_VALIDATE_EMAIL);
}
?>