<?php 
require_once('../../config.php');
/*if(!isset($_GET['lat'],$_GET['long'])) echo die(json_encode(array('success'=>'false','error'=>'lat_long_not_specified')));
$lat = (float)$_GET['lat'];
$long = (float)$_GET['long'];*/
$lat=0;$long=0;
$results = $db->startkey(time())->getView('quickd','getDeals');
$results = $results->rows;
$deals = array();
$now_day = (intval(date('N')) -1);
$now = time();
$midnight = mktime(0,0,0);
foreach($results as $res){
	$deal = array();
	$deal['start'] = (int)$res->value->start;
	$deal['end'] = (int)$res->value->end;
	$deal['deal_type'] = $res->value->deal_type ? $res->value->deal_type : 'instant';
	if ($deal['deal_type']=='regular') {
		$deal['times'] = objectToArray($res->value->times);
		if ($deal['times'] && (isset($deal['times'][$now_day]) && $today=$deal['times'][$now_day] || isset($deal['times'][($now_day-1)%7]) && $next=$deal['times'][($now_day-1)%7])) {
				if ($today && $now >= intval($today['start'])+$midnight && $now <= $today['end']+$midnight ) {
					$deal['start'] = $midnight + $today['start'];
					$deal['end'] = $midnight + $today['end'];
				} else if ($prev && $now <= $prev['end']-24*60*60+$midnight) {
					$deal['start'] = $midnight - 24*60*60 + $prev['start'];
					$deal['end'] = $midnight - 24*60*60 + $prev['end'];
				} else continue;
		} else continue;
	}	else if($deal['start'] > time()) continue;
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
	$deals[] = $deal;
}
echo json_encode($deals);
?>