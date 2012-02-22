<?php 
class MyImages extends Images {
	private $imagedata = array();
	
	function __construct($options){
		global $imageSizes;
		$this->sizes = $imageSizes;
		$this->errors = array();
		
		if(isset($options['index'])){
			$index = $options['index'];
			$image =  Shopowner::get('images',$index);
			if($image['success'] == 'true')
				$this->imagedata = (array)$image['data'];
			else {
				$this->errors[] = $image['error'];
				return;
			}
			$this->originalimage = $this->getDir('original');
			$this->previewimage = $this->getDir('preview');
			
		} elseif (isset($options['imagedata'])) {
			
			$this->imagedata = (array) $options['imagedata'];
			$this->originalimage = $this->getDir('original');
			$this->previewimage = $this->getDir('preview');
		} elseif (isset($options['filename'])){
			$filename = $options['filename'];
			$this->imagedata = array('n'=>$filename,'r'=>0,'rev'=>1);
			$this->originalimage = $this->getDir('original');
			$this->previewimage = $this->getDir('preview');
			$this->generatePreviewImage();
			$this->generateThumbs();
			//$res = Shopowner::save('images', $this->imagedata);
			//if($res->success == 'true'){ $this->imagedata['id'] = $res->data->id;}
			//else $this->errors[] =  array('success'=>'false','error'=>'error_sending_to_db', 'data'=>$res, 'image'=>$this->imagedata);
		} else $this->errors[] = array('success'=>'false','error'=>'filename_or_indexname_must_be_set');
		
	}
	public function getDir($name='',$withFile=true){
		$file = ($withFile) ? $this->imagedata['n'] : '';
		if($name) return IMAGES_DIR.$name.DS.$file;
		else return IMAGES_DIR;
	}
	public function getErrors() {
		if (isset($this->errors) && !empty($this->errors)) return $this->errors;
		else return 0;
	}
	public function getImgData() {
		return $this->imagedata;
	}
	private function generatePreviewImage($rotated=false){
		$input = $rotated ? (($this->imagedata['r'] == 0) ? $this->originalimage : $this->previewimage) : $this->originalimage;
		$delete = $rotated ? (($this->imagedata['r'] == 0) ? false : true) : false;
		$image = $this->smartResizeImage(
			$input,
			$this->sizes['preview']['w'],
			$this->sizes['preview']['h'],
			true,
			$this->previewimage,
			$delete
		);
		if(!$image['success']){ $this->errors[] = $image; return false;}
		$previewinfo = $this->getInfoFromFile($this->getDir('preview',1));
		if(!$previewinfo) return false;
		list($previewwidth,$previewheight) = $previewinfo;
		$this->imagedata['w'] = $previewwidth;
		$this->imagedata['h'] = $previewheight;
		$this->imagedata['t'] = $this->calculateAutoThumbnailFromFile($this->previewimage);
		return true;
	}
	public function generateThumbs(){
		foreach($this->sizes['thumbs'] as $path => $options){
			$target = $this->getDir($path);
			$image = $this->setThumbnail($this->previewimage,$target,$options);
			if(!$image['success'] || $image['success']==='false') $this->errors[] = $image;
		}
	}
	private function calculateAutoThumbnailFromFile($file){
		$info = $this->getInfoFromFile($file);
		list($width,$height) = $info;
		$crop_width = $crop_height = ($height >= $width) ? $width : $height;
		$start_x = (int)(($width - $crop_width)/2);
		$start_y = (int)(($height - $crop_height)/2);
		return array('x'=>$start_x,'y'=>$start_y,'w'=>$crop_width,'h'=>$crop_height);
	}
	//Taking clockwise angle - convert to anticlockwise rotation and rotate
	public function rotateTo($angle) {
		//Use modulo for number in range
		$angle = (360 + ($angle % 360)) % 360;
		$acAngle = (360 - $angle) % 360;
		//Check for allowed angles
		$angles = array(0, 90, 180, 270);
		if (!in_array($acAngle, $angles)) {
			$this->errors[] = array('success'=>false, 'error'=>'wrong_parameter_given', 'angle'=>$angle);
			return;
		}
		if ($acAngle!=0) $this->rotateImage($this->originalimage,$acAngle,$this->previewimage);
		$this->imagedata['r'] = $angle;
		
		$this->generatePreviewImage(true);
		$this->generateThumbs();

	}
	public function rotate($rotation){
		if(!isset($this->imagedata['r'])) $this->imagedata['r'] = 0;		// return array('success'=>'false','error'=>'imagedata_rotation_not_found');
		 if ($rotation=="left") $newRotation = $this->imagedata['r'] + 270;
		 else if ($rotation=="right") $newRotation = $this->imagedata['r'] + 90;
		if ($newRotation) {
			$this->rotateTo($newRotation);
			$res = Shopowner::setImage($this->imagedata);
			return array('success'=>'true','data'=>$this->imagedata);
		} else $this->errors[] = array('success'=>false, 'error'=>'wrong_parameters_given');
	}
	private function setThumbnail($srcimage,$dstimage,$thumbnail){
		$image = isset($this->imagedata['t']) ? $this->imagedata['t'] : '';
		if(!$image) return array('success'=>false,'error'=>'thumbnail_info_is_not_properly_set: '.$dstimage);
		$original_image_gd = $this->getImage($srcimage);
		if(!$original_image_gd) return array('success'=>false,'error'=>'error_getting_image: '.$dstimage);
		if(!isset($image['x'],$image['y'],$image['w'],$image['h'])) return array('success'=>false,'error'=>'thumbnail_info_is_not_properly_set: '.$dstimage);
		if(!isset($thumbnail['w'],$thumbnail['h'])) return array('success'=>false,'error'=>'thumbnail_size_is_not_properly_set: '.$dstimage);
		$cropped_image_gd = imagecreatetruecolor($thumbnail['w'], $thumbnail['h']);
		$isCopied = imagecopyresampled($cropped_image_gd ,$original_image_gd ,0,0,$image['x'],$image['y'], $thumbnail['w'], $thumbnail['h'], $image['w'] , $image['h']);
		if(!$isCopied) return array('success'=>false,'error'=>'error_copying_image: ' .$dstimage);
		$info = $this->getInfoFromFile($srcimage);
		$isOutputted = $this->outputImage($dstimage,$cropped_image_gd,$info[2]);
		if(!$isOutputted) return array('success'=>false,'error'=>'error_outputting_image: ' . $dstimage);
		return array('success'=>true);
	}
	
	public function editThumbnail($x, $y, $width, $height) {
		$this->imagedata['t'] = array('x'=>$x, 'y'=>$y, 'w'=>$width, 'h'=>$height);
		$this->generateThumbs();
	}
}
?>