<?php
date_default_timezone_set('Europe/Copenhagen');
$root = $_SERVER['HTTP_HOST'];
switch($root){
	case 'test.quickd.dk':
	case 'localhost':
		$dbLink = 'quickd:testanders@77.66.53.58';
		if(strpos($_SERVER['REQUEST_URI'], 'dealer/')) $string = 'dealer/';
		
		else if(strpos($_SERVER['REQUEST_URI'], 'brugerinfo/')) $string = 'brugerinfo/';
		else if(strpos($_SERVER['REQUEST_URI'], 'dealer-mobile/')) $string = 'dealer-mobile/';
		else if(strpos($_SERVER['REQUEST_URI'], 'mobile/')) $string = 'mobile/';
		else if(strpos($_SERVER['REQUEST_URI'], 'admin/')) $string = 'admin/';
		else $string = 'dealer/';
		$arr = explode($string,$_SERVER['REQUEST_URI']);
		$end = $arr[0].$string;
		$cdnUrl = $root . $arr[0] . 'cdn/';
		$historyObj = json_encode(array('pushState'=>false,'root'=>$end));
	break;
	default:
		$dbLink = 'quickd:ka2jae2n@localhost';
		$end = '/';
		$cdnUrl = $_SERVER['SERVER_ADDR'].'/';
		$historyObj = json_encode(array('pushState'=>false,'root'=>'/'));
	break; 
}
define('MIN_DISCOUNT',25);
define('DEALS_PR_PAGE',10);
define('DEAL_MAX_DIST',25000);
define('MAX_DIST',25000);
define('STD_IMAGE','hej');
define("DS",DIRECTORY_SEPARATOR);
define('ROOT_URL','http://'.$root.$end);
define("HOME_DIR",dirname(__FILE__).DS);
define("API_DIR",HOME_DIR.'api'.DS);
define("CDN_DIR",HOME_DIR.'cdn'.DS);
define("IMAGES_DIR",CDN_DIR.'images'.DS);
define("CDN_URL", 'http://'.$cdnUrl);
define("IMAGES_URL",CDN_URL.'images/');
define("LIBS_URL",CDN_URL.'libs/');
define("CLASSES_DIR",HOME_DIR.'includes'.DS.'classes'.DS);
define("BETA_MODE",1);
$imageSizes = array(
	'thumbs'=> array(
		/*'backendthumb'=>array(
			'w'=>75,
			'h'=>75
		),*/
		'thumbnail'=>array(
			'w'=>150,
			'h'=>150
		)
	), 
	'preview'=>array(
		'w'=>500,
		'h'=>500
	)
);
$categories = array(
	'shopping',
	'fooddrink',
	'experience'
);
require_once(HOME_DIR.'includes/includes.php');
$db = new couchClient('http://'.$dbLink.':5984','quickd');
$db_subscribers = new couchClient('http://quickd:testanders@77.66.53.58:5984', 'quickd_subscribers');
$db_subscribers_business = new couchClient('http://quickd:testanders@77.66.53.58:5984', 'quickd_subscribers_business');
$uagent = new uagent_info();
$session = new Session();
$facebook = new Facebook(array(
  'appId'  => '286675801401479',
  'secret' => 'a7878832e840ac3a4cdb52c373db19e1',
));
//$session->logout();
$dealer = $session->logged_dealer();
$admin = $session->logged_admin();
?>