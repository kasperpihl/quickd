<?php
require_once('../config.php');
$model = file_get_contents("php://input");
print_r($model);
die();
$result = array('success'=>'false','error'=>'no_action_match');
//die(print(json_encode(array('success'=>'false', 'error'=>'testing', 'data'=>array('POST'=>$_POST, 'GET'=>$_GET, 'method'=>$_SERVER['REQUEST_METHOD'], 'PUT'=>file_get_contents("php://input"))))));
switch($_SERVER['REQUEST_METHOD']){
	case 'GET':
		require_once(API_DIR.'get.php');
	break;
	case 'POST':
		if(!isset($_POST['_method']) && !isset($_GET['_method'])) require_once(API_DIR.'post.php');
		else if( 
			(isset($_GET['_method']) && $_GET['_method'] == 'PUT') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'PUT')) require_once(API_DIR.'put.php');
		else if(
			(isset($_GET['_method']) && $_GET['_method'] == 'DELETE') || 
			(isset($_POST['_method']) && $_POST['_method'] == 'DELETE')) require_once(API_DIR.'delete.php');
	break;
	case 'PUT':
		require_once(API_DIR.'put.php');
	break;
	case 'DELETE':
		require_once(API_DIR.'delete.php');
	break;
}
//print_r($test);
/*echo "Email valid?";
$email = 'jstougaard%40gmail.com';
echo filter_var($email, FILTER_VALIDATE_EMAIL);
/*$result = array();
$array = array('Denis','Anders','Kasper','Kristjan');
for ($i = 0; $i < 10000 ; $i++){
	$different = false;
	while($different == false){
		$index1 = $array[rand(0,sizeof($array)-1)];
		$index2 = $array[rand(0,sizeof($array)-1)];
		if($index1 != $index2) $different = true;
	}
	$mem1 = array($index1,$index2);
	sort($mem1);
	$index = implode('.', $mem1);
	if(isset($result[$index])){
		$result[$index] = $result[$index] + 1;
	}
	else $result[$index] = 1;
}
$winner = false;
$max = 0;
foreach($result as $index => $value){
	if($value > $max ){
		$max = $value;
		$winner = $index;
	} 
}
print_r($result);
print_r($winner . ': '.$max);
*/
//$update = 'testUpdate';

/*$template = array('title'=>'Test 123','description'=>'test 456 ja tak','orig_price'=>100,'deal_price'=>75);
$image = array('image'=>array('n'=>'jatak','h'=>200,'w'=>200,'t'=>array('x'=>1,'y'=>2,'w'=>100,'h'=>200)));
$user = array('email'=>'kasper@tornoe.org','betacode'=>'kaspertest','password'=>'spadelam');
$cindex = 6;
//$test = $db->startkey(array($dealer,66))->endkey(array($dealer,'a'))->getView('dealer','getHistory');
//print_r($test);
$res = Shopowner::setImage($this->imagedata);
print_r($db->updateDocFullAPI('dealer','addEditImage',array('doc_id'=>$dealer,'params'=>array('json'=>json_encode($image)))));

echo (360 + (0 % 360)) % 360;

*/
?>

