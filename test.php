<?
require_once(dirname(__FILE__).'/config.php');
//print_r(Log::get());
/*for ($i = 0 ; $i < 10 ; $i++ ){
	Log::add($i);
	sleep(1);
}*/


for ($i=0;$i<=5;$i++) {
	Mail::createMail('randomMail', 'jstougaard+1@gmail.com');
	Mail::createMail('randomMail', 'jstougaard@gmail.com',array('name'=>'Mr. Nice Guy', 'number'=>$i));
}
Mail::dequeueMails();
echo "<br><br>Done!";
?>