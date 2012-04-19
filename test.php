<?
require_once(dirname(__FILE__).'/config.php');
//print_r(Log::get());
/*for ($i = 0 ; $i < 10 ; $i++ ){
	Log::add($i);
	sleep(1);
}*/
Log::printLog();
echo "<br><br>";

for ($i=0;$i<=200;$i++) {
	Mail::create('randomMail', 'kasper@tornoe.org',array('name'=>'Mr. Nice Guy', 'number'=>$i));
	echo "Created ".$i."<br />";
}
Mail::dequeueMails();
echo "<br><br>Done!";
?>