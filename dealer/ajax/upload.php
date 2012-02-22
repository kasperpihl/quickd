<? require_once('../../config.php');
/*if(isset($dealer,$_POST['filename'],$_POST['file']) && $dealer){
	$context = stream_context_create(array('http' => array('header'=>'Connection: close')));
	$content = file_get_contents($_POST['file'], false, $context);
	$fileName = $_POST['filename'];
	$ext = substr($fileName, strrpos($fileName, '.'));
	
	$filename = $dealer . '_' . time() .'_'.rand(0,1000) . $ext;
	$original_image = IMAGES_DIR.'original'.DS.$filename;
	echo die(json_encode(array('success'=>false, 'data'=>array('filename'=>$_POST['file'], 'image'=>$original_image))));
	if(!file_put_contents($original_image, $content, 0, $context)) echo die(json_encode(array('success'=>'false','error'=>'error_putting_content_to: '.$original_image)));		
	$res = Shopowner::save('images', json_encode(array('new'=>true, 'filename'=>$filename)));
	echo die(json_encode($res));
	//$image = new MyImages(array('filename'=>$filename));
	//if (!empty($image->getErrors())) 
	//echo die(json_encode(array('success'=>'false', 'errors'=>$image->getErrors())));
	//echo die(json_encode(array('success'=>'true','data'=>$image->getImgData())));
}*/
/*if($dealer && isset($_GET['upload']) && $_GET['upload'] === 'true'){
    $headers = getallheaders();
    if(
        // basic checks
        isset(
            $headers['Content-Type'],
            $headers['Content-Length'],
            $headers['X-File-Size'],
            $headers['X-File-Name']
        ) &&
        $headers['Content-Type'] === 'multipart/form-data' &&
        $headers['Content-Length'] === $headers['X-File-Size']
    ){
        // create the object and assign property
        $file = new stdClass;
        $file->name = basename($headers['X-File-Name']);
        $file->size = $headers['X-File-Size'];
        $file->content = file_get_contents("php://input");
        
        // if everything is ok, save the file somewhere
        $ext = substr($file->name, strrpos($file->name, '.'));
	
		$filename = $dealer . '_' . time() .'_'.rand(0,1000) . $ext;
		$original_image = IMAGES_DIR.'original'.DS.$filename;

		if(!file_put_contents($original_image, $file->content)) 
			echo die(json_encode(array('success'=>'false','error'=>'error_putting_content_to: '.$original_image)));		
		$res = Shopowner::save('images', json_encode(array('new'=>true, 'filename'=>$filename)));
		echo die(json_encode($res));
        //echo die(json_encode(array('success'=>'true','data'=>'Seemed it worked? Cool!')));
    }
    
    // if there is an error this will be the output instead of "OK"
   echo die(json_encode(array('success'=>'false','data'=>$_GET['upload'])));
}*/
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