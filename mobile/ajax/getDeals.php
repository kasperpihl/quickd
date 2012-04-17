<?php 
require_once('../../config.php');
if(!isset($_SESSION['giveme'])) $_SESSION['giveme'] = 1;
$giveme = $_SESSION['giveme']++;
$giveme = ($giveme % 2 == 0);
if(!isset($_GET['lat'],$_GET['long'])) echo die(json_encode(array('success'=>'false','error'=>'lat_long_not_specified')));
$lat = (float)$_GET['lat'];
$long = (float)$_GET['long'];
$results = $db->startkey(time())->getView('quickd','getDeals');
$results = $results->rows;
$deals = array();
$i = 0;
foreach($results as $res){
	$i++;
	$deal = array();
	$deal['start'] = (int)$res->value->start;
	$deal['end'] = (int)$res->value->end;
	if($deal['start'] > time()) continue;
	$deal['lat'] = $dealLat = $res->value->shop->lat;
	$deal['long'] = $dealLong = $res->value->shop->long;
	$deal['id'] = $res->id;
	$deal['distance'] = distance($lat,$long,$dealLat,$dealLong);
	//if($deal['distance'] > MAX_DIST) continue;
	$deal['title'] = $res->value->template->title;
	$deal['deal_price'] = $res->value->template->deal_price;
	$deal['orig_price'] = $res->value->template->orig_price;
	$deal['description'] = nl2br($res->value->template->description); 
	$deal['address'] = $res->value->shop->address;
	if(isset($res->value->shop->open_hours)) $deal['open_hours'] = $res->value->shop->open_hours;
	if(isset($res->value->shop->other)) $deal['info'] = nl2br($res->value->shop->other);
	
	$deal['name'] = $res->value->shop->name;
	$deal['category'] = isset($res->value->template->category)?$res->value->template->category:'';
	$deal['discount'] = discount($deal['orig_price'],$deal['deal_price']);
	$deal['image'] = isset($res->value->template->image) ? $res->value->template->image : STD_IMAGE;
	if($giveme && $i == sizeof($results)) continue;
	$deals[] = $deal;
}
echo json_encode($deals);
?>