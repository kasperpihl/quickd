<?php
/*require_once('../config.php');
echo phpinfo(); die();
$result = array();
$array = array('Denis','Anders','Kasper','Kristjan');
for ($i = 0; $i < 10000 ; $i++){
	$different = false;
	while($different == false){
		$index1 = $array[rand(0,sizeof($array)-1)];
		$index2 = $array[rand(0,sizeof($array)-1)];
		if($index1 != $index2) $different = true;
	}
	$mem1 = array($index1,$index2);
	sort($mem1);
	$index = implode('.', $mem1);
	if(isset($result[$index])){
		$result[$index] = $result[$index] + 1;
	}
	else $result[$index] = 1;
}
$winner = false;
$max = 0;
foreach($result as $index => $value){
	if($value > $max ){
		$max = $value;
		$winner = $index;
	} 
}
print_r($result);
print_r($winner . ': '.$max);
*/
echo mail("andershoedholt@gmail.com","andershoedholt@gmail.com","andershoedholt@gmail.com"); 
echo mail('jstougaard@gmail.com','jstougaard@gmail.com','jstougaard@gmail.com');
echo mail("anders@hoedholt.com","anders@hoedholt.com","anders@hoedholt.com");
echo mail("anders@hoedholt.me","anders@hoedholt.me","anders@hoedholt.me");
echo mail("hoedholt@me.com","hoedholt@me.com","hoedholt@me.com");
echo mail('kasperpihl@me.com','kasperpihl@me.com','kasperpihl@me.com');
echo mail('kasper@tornoe.org','kasper@tornoe.org','kasper@tornoe.org');
/*
//echo mail('jstougaard@gmail.com','jstougaard@gmail.com','jstougaard@gmail.com');
//$update = 'testUpdate';
/**/
/*$template = array('title'=>'Test 123','description'=>'test 456 ja tak','orig_price'=>100,'deal_price'=>75);
$image = array('image'=>array('n'=>'jatak','h'=>200,'w'=>200,'t'=>array('x'=>1,'y'=>2,'w'=>100,'h'=>200)));
$user = array('email'=>'kasper@tornoe.org','betacode'=>'kaspertest','password'=>'spadelam');
$cindex = 6;
//$test = $db->startkey(array($dealer,66))->endkey(array($dealer,'a'))->getView('dealer','getHistory');
//print_r($test);
$res = Shopowner::setImage($this->imagedata);
print_r($db->updateDocFullAPI('dealer','addEditImage',array('doc_id'=>$dealer,'params'=>array('json'=>json_encode($image)))));

echo (360 + (0 % 360)) % 360;


?>
<?php
$to      = 'kasper@tornoe.org';
$subject = 'the subject';
$message = 'hello';
$headers = 'From: kasper@quickd.dk' . "\r\n" .
    'Reply-To: kasper@quickd.dk' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$test = array('anders@hoedholt.com','anders@hoedholt.me','andershoedholt@gmail.com','hoedholt@me.com','kasper@tornoe.org');
foreach($test as $to){
mail($to, $to, $message, $headers);
}*/
?>

