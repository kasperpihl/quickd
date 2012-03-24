<?php 
require_once('../../config.php');
if(!isset($_GET['lat'],$_GET['long'])) echo die(json_encode(array('success'=>'false','error'=>'lat_long_not_specified')));
$lat = (float)$_GET['lat'];
$long = (float)$_GET['long'];
$results = $db->startkey(time())->getView('quickd','getDeals');
$results = $results->rows;
$deals = array();

foreach($results as $res){
	$deal = array();
	$deal['lat'] = $dealLat = $res->value->shop->lat;
	$deal['long'] = $dealLong = $res->value->shop->long;
	$deal['id'] = $res->id;
	$deal['distance'] = distance($lat,$long,$dealLat,$dealLong);
	//if($deal['distance'] > DEAL_MAX_DIST) continue;
	$deal['title'] = $res->value->template->title;
	$deal['deal_price'] = $res->value->template->deal_price;
	$deal['orig_price'] = $res->value->template->orig_price;
	$deal['description'] = $res->value->template->description; 
	$deal['name'] = $res->value->shop->name;
	$deal['category'] = isset($res->value->template->category)?$res->value->template->category:'';
	$deal['discount'] = discount($deal['orig_price'],$deal['deal_price']);
	$deal['image'] = isset($res->value->template->image) ? $res->value->template->image : STD_IMAGE;
	$deals[] = $deal;
}
echo json_encode($deals);
?>