<?php
require_once('../../config.php');
$model = array('img_type'=>'shop_img', 'new'=>true, 'filename'=>'jeppe_1336603091_952.jpg');
			if (isset($_GET['id'])) {
				$shop = Shopowner::get('shops', $_GET['id']);
				if ($shop&&isset($shop['success'])&&$shop['success']=='true') {
					$model['id'] = $shop['data']->id;
					if (isset($shop['data']->shop_img)) {
						$image = new MyImages(array('imagedata'=>array('n'=>$shop['data']->shop_img)));
						$image->delete(array('shop_img'));
					}
				}
			}
			$result = Shopowner::save('shops', json_encode($model));
			echo json_encode($result);
//echo json_encode(Shopowner::save('shops', json_encode(array('img_type'=>'shop_img', 'new'=>true, 'filename'=>'jeppe_1336590943_699.jpg'))));

/*print_r($test);
print_r(Mail::sendAdminMail('newTemplate','Anders'));
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

