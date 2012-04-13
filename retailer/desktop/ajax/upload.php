<? require_once('../../../config.php');
if ($dealer && (isset($_GET['qqfile']) || isset($_FILES['qqfile']))) {
	// list of valid extensions, ex. array("jpeg", "xml", "bmp")
	$allowedExtensions = array("jpg", "jpeg", "png", "gif");
	// max file size in bytes
	$sizeLimit = 8 * 1024 * 1024;
	$imgDir = IMAGES_DIR.'original'.DS;
	$filename = $dealer . '_' . time() .'_'.rand(0,1000);
	
	$uploader = new qqFileUploader($allowedExtensions, $sizeLimit);
	$result = $uploader->handleUpload($imgDir, $filename);
	if ($result && isset($result['success']) && $result['success'] && !isset($result['error']))
		$result = Shopowner::save('images', json_encode(array('new'=>true, 'filename'=>$result['filename'])));
	else if (isset($result['error'])) $result = array('success'=>false, 'error'=>$result['error']);
	// to pass data through iframe you will need to encode all html tags
	echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);	
}
else echo die(json_encode(array('success'=>'false','data'=>array('dealer'=>$dealer))));
?>