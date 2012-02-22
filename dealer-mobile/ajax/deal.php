<? 
require_once('../../config.php');
if(isset($_POST['action'],$_POST['model']) ){
	$model = $_POST['model'];
	$action = $_POST['action'];
	if($action == 'start' && isset($model['template_id'],$model['seconds'])){
		$model['start'] = time();
		$model['end'] = time() + (int)$model['seconds'];
		$model['shop_id'] = 1;
		$_POST['model'] = json_encode($model);
		
		require_once(API_DIR.'post.php');
	}
	
}
?>