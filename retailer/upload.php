<? require_once(dirname(__FILE__).'/../config.php');
if(!$session->logged_dealer()) echo die(json_encode(array('success'=>'false','error'=>'not_logged_in')));
if (isset($_GET['type']) &&  ($_GET['type'] == 'template_img' || $_GET['type']=='shop_img') && (isset($_GET['qqfile']) || isset($_FILES['qqfile']))) {
	$type = $_GET['type'];
	// list of valid extensions, ex. array("jpeg", "xml", "bmp")
	$allowedExtensions = array("jpg", "jpeg", "png", "gif");
	// max file size in bytes
	$sizeLimit = 8 * 1024 * 1024;
	$imgDir = IMAGES_DIR.'original'.DS;
	$filename = $dealer . '_' . time() .'_'.rand(0,1000);
	
	$uploader = new qqFileUploader($allowedExtensions, $sizeLimit);
	$result = $uploader->handleUpload($imgDir, $filename);
	if ($result && isset($result['success']) && $result['success'] && !isset($result['error'])) {
		if ($type=='template_img') $result = Shopowner::save('images', json_encode(array('new'=>true, 'filename'=>$result['filename'])));
		elseif ($type=='shop_img') {
			$model = array('img_type'=>'shop_img', 'new'=>true, 'filename'=>$result['filename']);
			if (isset($_GET['id'])) {
				$shop = Shopowner::get('shops', $_GET['id']);
				if ($shop&&isset($shop['success'])&&$shop['success']=='true') {
					$model['id'] = $shop['data']->id;
					$model['shop_img'] = $result['filename'];
 					if (isset($shop['data']->shop_img)) {
						$image = new MyImages(array('imagedata'=>array('n'=>$shop['data']->shop_img)));
						$image->delete(array('shop_img'));
					}
				}
			}
			$result = Shopowner::save('shops', json_encode($model));
		} else $result = array('success'=>'true', 'data'=>array('msg'=>'no_type', 'filename'=>$result['filename']));
	} else if (isset($result['error'])) $result = array('success'=>false, 'error'=>$result['error']);
	// to pass data through iframe you will need to encode all html tags
	echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);	
}
else echo die(json_encode(array('success'=>'false','data'=>array('dealer'=>$dealer, 'GET'=>$_GET, 'FILES'=>$_FILES))));
?>