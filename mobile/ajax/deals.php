<?php require_once('../../config.php');
if(isset($_GET['lat']) && isset($_GET['long'])){
	$myLat = $_GET['lat'];
	$myLong = $_GET['long'];
	$maxArray = calcMax($myLat,$myLong);
	try{
		//$index = ((int)$_GET['p']*10)-10;
		$deals = $db->getView('quickd','getDeals');
		$deals = $deals->rows;
		$i = 0;
		$return = array();
		foreach($deals as $key => $deal){
			$dealLat = $deal->value->lat;
			$dealLong = $deal->value->long;
			$deal->value->distance = distance($myLat,$myLong,$dealLat,$dealLong);
			if($deal->value->distance){
				$i++;
				$deal->value->id = $deal->value->_id;
				unset($deal->value->_id);
				$return[] = $deal->value;
			}
			if($i == 10) break;
		
		}
		echo json_encode(array('success'=>true,'data'=>$return));
	}
	catch(Exception $e){
		echo json_encode(array('success'=>false,'error_message'=>'error_database'));
	}
}
?>