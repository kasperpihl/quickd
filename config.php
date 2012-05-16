<?php
define("DS",DIRECTORY_SEPARATOR);
define("HOME_DIR",dirname(__FILE__).DS);
define("API_DIR",HOME_DIR.'api'.DS);
define("CDN_DIR",HOME_DIR.'cdn'.DS);
define("FILE_DIR",HOME_DIR.'files'.DS);
define("LOG_FILE",FILE_DIR.'log.txt');
define("IMAGES_DIR",CDN_DIR.'images'.DS);
define("CLASSES_DIR",HOME_DIR.'includes'.DS.'classes'.DS);
define('VERSION','v0.2');
define('MIN_DISCOUNT',25);
define('DEALS_PR_PAGE',10);
define('MAX_DIST',25000);
define('STD_IMAGE','hej');
define("BETA_MODE",1);
require_once(HOME_DIR.'includes/includes.php');
$uagent = new uagent_info();
session_start();
date_default_timezone_set('Europe/Copenhagen');
$root = $_SERVER['HTTP_HOST'];
$live = false;
$ending = '';
$version = $_SESSION['version'] = (isset($_SESSION['version'])) ? $_SESSION['version'] : ($uagent->DetectTierIphone() ? 'mobile' : 'desktop');
switch($root){
	case 'test.quickd.com':
	case '10.185.209.87':
	case '192.168.1.4':
	case 'localhost':
		$dbLink = 'quickd:testanders@77.66.53.58';
		if(strpos($_SERVER['REQUEST_URI'], 'retailer/')){
		 	$string = 'retailer/';
		 	$ending = $version. '/';
		}
		else if(strpos($_SERVER['REQUEST_URI'], 'brugerinfo/')) $string = 'brugerinfo/';
		else if(strpos($_SERVER['REQUEST_URI'], 'mobile/')) $string = 'mobile/';
		else if(strpos($_SERVER['REQUEST_URI'], 'admin/')) $string = 'admin/';
		else if(strpos($_SERVER['REQUEST_URI'], 'api/')) $string = 'api/';
		else $string = '/';
		$arr = explode($string,$_SERVER['REQUEST_URI']);
		$histRoot = $arr[0].$string;
		$end = $arr[0].$string.$ending;
		if(isset($arr[1])) $restUrl = $arr[1];
		$cdnUrl = $root . $arr[0] . 'cdn/';
		define("API_URL","http://".$root.$arr[0].'api/1/');
		
	break;
	default:
		if(strpos($root, 'retailer') !== false) $ending = $version . '/';
		$live = true;
		$dbLink = 'quickd:ka2jae2n@localhost';
		$arr = explode('/',$_SERVER['REQUEST_URI']);
		if(isset($arr[1])){
			unset($arr[0]);
			$restUrl = implode('/', $arr);
		}
		$end = '/'.$ending;
		$histRoot = '/';
		$cdnUrl = $_SERVER['SERVER_ADDR'].'/';
		define('API_URL','http://api.quickd.com/1/');
	break; 
}
$historyObj = json_encode(array('pushState'=>true,'root'=>$histRoot));
define('ROOT_URL','http://'.$root.$end);
define('REAL_URL','http://'.$root.$histRoot);
define('DEALER_RESET_URL',REAL_URL.'reset/');
define("CDN_URL", 'http://'.$cdnUrl);
define("IMAGES_URL",CDN_URL.'images/');
define("LIBS_URL",CDN_URL.'libs/');


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
	),
	'shop_img'=>array(
		'w'=>640,
		'h'=>320
	)
);
$categories = array(
	'fooddrink'=>'Mad & drikke',
	'shopping'=>'Shopping',
	'experience'=>'Oplevelser',
	'nightlife'=>'Natteliv'
);


$db = new couchClient('http://'.$dbLink.':5984','quickd');
$session = new Session();

$facebook = new Facebook(array(
  'appId'  => '286675801401479',
  'secret' => 'a7878832e840ac3a4cdb52c373db19e1',
));
//$session->logout();
$dealer = $session->logged_dealer();
$admin = $session->logged_admin();

?>