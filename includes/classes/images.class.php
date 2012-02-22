<?php 
class Images {
	protected $image;
	protected function getInfoFromFile($file){
		return getimagesize($file);
	}
	protected function getImage($file,$info=''){
		if(!$info) $info = getimagesize($file);
		# Loading image to memory according to type
		switch ( $info[2] ) {
	      case IMAGETYPE_GIF:   $bool = imagecreatefromgif($file);   break;
	      case IMAGETYPE_JPEG:  $bool = imagecreatefromjpeg($file);  break;
	      case IMAGETYPE_PNG:   $bool = imagecreatefrompng($file);   break;
	      default: return false;
	    }
	    return $bool;
	}
	protected function outputImage($output,$image,$type){
		# Writing image according to type to the output destination
	    switch ( $type ) {
	      case IMAGETYPE_GIF:   $bool = imagegif($image, $output);    break;
	      case IMAGETYPE_JPEG:  $bool = imagejpeg($image, $output);   break;
	      case IMAGETYPE_PNG:   $bool = imagepng($image, $output);    break;
	      default: return false;
	    }
	    return $bool;
	}
	protected function rotateImage($file,$rotateDegrees,$output){
		$rotateDegrees = (float)$rotateDegrees;
		$info = $this->getInfoFromFile($file);
		$image = $this->getImage($file,$info);
		if(!$image) return array('success'=>false,'error'=>'could_not_get_image: '.$output);
		
		$image = imagerotate($image,$rotateDegrees, -1);
		imagealphablending($image, true); 
		imagesavealpha($image, true); 
		$outputted = $this->outputImage($output,$image,$info[2]);
		if($outputted) return array('success'=>true,'data'=>array('w'=>$info[0],'h'=>$info[1]));
		else return array('success'=>false,'error'=>'error_outputting_image: '.$output);
	}
	protected function smartResizeImage(
		$file,
		$width              = 0, 
		$height             = 0, 
		$proportional       = true, 
		$output             = '', 
		$delete_original = false
		) {

		if ( $height <= 0 && $width <= 0 ) return array('success'=>false,'error'=>'both_height_and_width_cant_be_0: '.$output);
		# Setting defaults and meta
		$info                         = getimagesize($file);
		$image                        = '';
		$final_width                  = 0;
		$final_height                 = 0;
		list($width_old, $height_old) = $info;

		# Calculating proportionality
		if ($proportional) {
			if($width  == 0) $factor = $height/$height_old;
			elseif($height == 0) $factor = $width/$width_old;
			else $factor = min( $width / $width_old, $height / $height_old );
			
			$final_width  = round( $width_old * $factor );
			$final_height = round( $height_old * $factor );
		}
		else {
			$final_width  = $width;
			$final_height = $height;
		}

		# Loading image to memory according to type
		$image = $this->getImage($file,$info);
		if(!$image) return array('success'=>false,'error'=>'could_not_get_image: '.$output);
		
		# This is the resizing/resampling/transparency-preserving magic
		$image_resized = imagecreatetruecolor( $final_width, $final_height );
		if ( ($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG) ) {
			$transparency = imagecolortransparent($image);
			
			if ($transparency >= 0) {
				$transparent_color  = imagecolorsforindex($image, $trnprt_indx);
				$transparency       = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
				imagefill($image_resized, 0, 0, $transparency);
				imagecolortransparent($image_resized, $transparency);
			}
			elseif ($info[2] == IMAGETYPE_PNG) {
				imagealphablending($image_resized, false);
				$color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
				imagefill($image_resized, 0, 0, $color);
				imagesavealpha($image_resized, true);
			}
		}
		imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
		# Taking care of original, if needed
		if ( $delete_original ) @unlink($file);

		if(!$output) $output = $file;
		$outputted = $this->outputImage($output,$image_resized,$info[2]);
		
		if($outputted) return array('success'=>true,'data'=>array('w'=>$final_width,'h'=>$final_height));
		else return array('success'=>false,'error'=>'error_outputting_image: '.$output);
	}
}
?>