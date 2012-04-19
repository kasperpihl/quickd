<?
require_once(dirname(__FILE__).'/config.php');
//print_r(Log::get());
/*for ($i = 0 ; $i < 10 ; $i++ ){
	Log::add($i);
	sleep(1);
}*/
Log::printLog();
echo "<br><br>";

for ($i=0;$i<=5;$i++) {
	Mail::create('randomMail', 'jstougaard+1@gmail.com');
	Mail::create('randomMail', 'jstougaard@gmail.com',array('name'=>'Mr. Nice Guy', 'number'=>$i));
}
Mail::dequeueMails();
echo "<br><br>Done!";
?>