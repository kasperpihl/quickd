<?php
require_once('../../config.php');
//$doc = $db->key('kasper')->limit(1)->getView('dealer','getPassById');
//print_r($doc);
die();
if(isset($_GET['v'])){
	$expire=time()+60*60*24*30;
	$bool = setcookie('normal',$_GET['v'],$expire,'/');
	print_r($bool . ' cookie normal - time: '.time().' expire: '.$expire . ' URL: ' . COOKIE_URL . ' value: '.$_GET['v']);
}
else if(isset($_GET['a'])){
	$expire=time()+60*60*24*30;
	$bool = setcookie('ajax',$_GET['a'],$expire,'/',COOKIE_URL);
	print_r($bool . ' cookie ajax - expire: '.$expire . ' URL: ' . COOKIE_URL . ' value: '.$_GET['v']);
}
else echo print_r($_COOKIE);

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

